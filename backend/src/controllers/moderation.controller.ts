import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

type ReportRow = {
  id: string; targetType: string; targetId: string; reason: string; description: string;
  status: string; resolutionNote: string; reporterId: string | null; handlerId?: string | null;
  createdAt: Date; updatedAt?: Date; resolvedAt: Date | null;
  reporter?: { id: string; fullName: string; role: string } | null;
  handler?: { id: string; fullName: string; role: string } | null;
};

export async function createModerationReport(req: AuthenticatedRequest, res: Response) {
  try {
    const { targetType, targetId, reason, description = '' } = req.body;
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
    if (!['POST', 'COMMENT', 'USER'].includes(targetType) || typeof targetId !== 'string' || !targetId.trim() || typeof reason !== 'string' || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Choose reportable content and provide a reason.' });
    }
    const exists = targetType === 'POST'
      ? await prisma.communityPost.findUnique({ where: { id: targetId }, select: { id: true } })
      : targetType === 'COMMENT'
        ? await prisma.comment.findUnique({ where: { id: targetId }, select: { id: true } })
        : await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
    if (!exists) return res.status(404).json({ success: false, message: 'The reported item could not be found.' });

    const [report] = await prisma.$queryRaw<ReportRow[]>`INSERT INTO "ModerationReport" ("targetType", "targetId", "reason", "description", "reporterId") VALUES (${targetType}, ${targetId}, ${reason.trim().slice(0, 120)}, ${String(description).trim().slice(0, 2000)}, ${req.user.userId}) RETURNING "id", "targetType", "targetId", "reason", "description", "status", "resolutionNote", "reporterId", "createdAt", "resolvedAt"`;
    report.reporter = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { id: true, fullName: true, role: true } });
    await prisma.auditLog.create({ data: { userId: req.user.userId, action: 'MODERATION_REPORT_CREATED', entity: 'ModerationReport', detailsJson: { reportId: report.id, targetType, targetId, reason: report.reason } } });

    const moderators = await prisma.user.findMany({ where: { role: 'MODERATOR', accountStatus: 'ACTIVE' }, select: { id: true } });
    if (moderators.length) {
      await prisma.notification.createMany({ data: moderators.map(({ id }) => ({ userId: id, title: 'New community report', message: `${targetType.toLowerCase()} reported: ${report.reason}`, type: 'moderation', link: '/dashboard/moderation' })) });
    }
    return res.status(201).json({ success: true, report, message: 'Report submitted to the moderation team.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getModerationDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const countReports = async (filter: 'open' | 'new' | 'resolved' | 'reviewing' | 'escalated' | 'users' | 'content') => {
      const rows = filter === 'open'
        ? await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModerationReport" WHERE "status" IN ('OPEN', 'REVIEWING', 'ESCALATED')`
        : filter === 'new'
          ? await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModerationReport" WHERE "createdAt" >= ${since}`
          : filter === 'resolved'
            ? await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModerationReport" WHERE "status" = 'RESOLVED'`
            : filter === 'reviewing'
              ? await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModerationReport" WHERE "status" = 'REVIEWING'`
              : filter === 'escalated'
                ? await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModerationReport" WHERE "status" = 'ESCALATED'`
                : filter === 'users'
                  ? await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModerationReport" WHERE "targetType" = 'USER' AND "status" IN ('OPEN', 'REVIEWING', 'ESCALATED')`
                  : await prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM "ModerationReport" WHERE "targetType" IN ('POST', 'COMMENT') AND "status" IN ('OPEN', 'REVIEWING', 'ESCALATED')`;
      return rows[0]?.count || 0;
    };

    const [openReports, newReports, resolvedReports, pendingReviews, escalatedCases, userReports, flaggedContent, recentPosts, recentComments, reports, recentActions] = await Promise.all([
      countReports('open'), countReports('new'), countReports('resolved'), countReports('reviewing'), countReports('escalated'), countReports('users'), countReports('content'),
      prisma.communityPost.count({ where: { createdAt: { gte: since } } }),
      prisma.comment.count({ where: { createdAt: { gte: since } } }),
      prisma.$queryRaw<ReportRow[]>`SELECT r."id", r."targetType", r."targetId", r."reason", r."description", r."status", r."resolutionNote", r."reporterId", r."handlerId", r."createdAt", r."updatedAt", r."resolvedAt", CASE WHEN reporter."id" IS NULL THEN NULL ELSE jsonb_build_object('id', reporter."id", 'fullName', reporter."fullName", 'role', reporter."role") END AS reporter, CASE WHEN handler."id" IS NULL THEN NULL ELSE jsonb_build_object('id', handler."id", 'fullName', handler."fullName", 'role', handler."role") END AS handler FROM "ModerationReport" r LEFT JOIN "User" reporter ON reporter."id" = r."reporterId" LEFT JOIN "User" handler ON handler."id" = r."handlerId" ORDER BY r."createdAt" DESC LIMIT 100`,
      prisma.auditLog.findMany({ where: { entity: 'ModerationReport' }, take: 12, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, fullName: true, role: true } } } }),
    ]);

    const detailedReports = await Promise.all(reports.map(async (report) => {
      let target: any = null;
      if (report.targetType === 'POST') target = await prisma.communityPost.findUnique({ where: { id: report.targetId }, select: { id: true, title: true, content: true, author: { select: { id: true, fullName: true, role: true } } } });
      else if (report.targetType === 'COMMENT') target = await prisma.comment.findUnique({ where: { id: report.targetId }, select: { id: true, content: true, author: { select: { id: true, fullName: true, role: true } }, post: { select: { id: true, title: true } } } });
      else if (report.targetType === 'USER') target = await prisma.user.findUnique({ where: { id: report.targetId }, select: { id: true, fullName: true, role: true, accountStatus: true } });
      return { ...report, target };
    }));

    return res.json({ success: true, stats: { openReports, newReports, flaggedContent, resolvedReports, pendingReviews, communityActivity: recentPosts + recentComments, escalatedCases, userReports }, reports: detailedReports, recentActions });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function actOnModerationReport(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const { reportId } = req.params;
    const { action, note = '' } = req.body;
    const [report] = await prisma.$queryRaw<ReportRow[]>`SELECT "id", "targetType", "targetId", "reason", "description", "status", "resolutionNote", "reporterId", "handlerId", "createdAt", "updatedAt", "resolvedAt" FROM "ModerationReport" WHERE "id" = ${reportId} LIMIT 1`;
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    if (!['REVIEW', 'RESOLVE', 'ESCALATE', 'REMOVE_CONTENT', 'SUSPEND_USER'].includes(action)) return res.status(400).json({ success: false, message: 'Unsupported moderation action.' });

    let status = report.status;
    let auditAction = '';
    let resolvedAt: Date | null = report.resolvedAt;
    if (action === 'REVIEW') { status = 'REVIEWING'; auditAction = 'MODERATION_REVIEW'; }
    if (action === 'RESOLVE') { status = 'RESOLVED'; resolvedAt = new Date(); auditAction = 'MODERATION_RESOLVE'; }
    if (action === 'ESCALATE') { status = 'ESCALATED'; auditAction = 'MODERATION_ESCALATE'; }
    if (action === 'REMOVE_CONTENT') {
      if (report.targetType === 'POST') await prisma.communityPost.delete({ where: { id: report.targetId } });
      else if (report.targetType === 'COMMENT') await prisma.comment.delete({ where: { id: report.targetId } });
      else return res.status(400).json({ success: false, message: 'Only a reported post or comment can be removed.' });
      status = 'RESOLVED'; resolvedAt = new Date(); auditAction = 'MODERATION_REMOVE_CONTENT';
    }
    if (action === 'SUSPEND_USER') {
      if (report.targetType !== 'USER') return res.status(400).json({ success: false, message: 'This action is only available for a user report.' });
      const reportedUser = await prisma.user.findUnique({ where: { id: report.targetId }, select: { id: true, role: true } });
      if (!reportedUser) return res.status(404).json({ success: false, message: 'Reported user no longer exists.' });
      if (['ADMIN', 'SUPER_ADMIN'].includes(reportedUser.role) && req.user.role !== 'SUPER_ADMIN') return res.status(403).json({ success: false, message: 'Only a SUPER_ADMIN can suspend an administrator account.' });
      if (reportedUser.id === req.user.userId) return res.status(400).json({ success: false, message: 'You cannot suspend your own account through a report.' });
      await prisma.user.update({ where: { id: report.targetId }, data: { accountStatus: 'SUSPENDED' } });
      status = 'RESOLVED'; resolvedAt = new Date(); auditAction = 'MODERATION_SUSPEND_USER';
    }

    const [updated] = await prisma.$queryRaw<ReportRow[]>`UPDATE "ModerationReport" SET "status" = ${status}, "handlerId" = ${req.user.userId}, "resolutionNote" = ${String(note).trim().slice(0, 2000)}, "resolvedAt" = ${resolvedAt}, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ${reportId} RETURNING "id", "targetType", "targetId", "reason", "description", "status", "resolutionNote", "reporterId", "handlerId", "createdAt", "updatedAt", "resolvedAt"`;
    await prisma.auditLog.create({ data: { userId: req.user.userId, action: auditAction, entity: 'ModerationReport', detailsJson: { reportId, targetType: report.targetType, targetId: report.targetId, note: String(note).trim().slice(0, 500) } } });
    if (report.reporterId && ['RESOLVE', 'ESCALATE', 'REMOVE_CONTENT', 'SUSPEND_USER'].includes(action)) {
      await prisma.notification.create({ data: { userId: report.reporterId, title: action === 'ESCALATE' ? 'Report escalated' : 'Report reviewed', message: `Your report has been ${action === 'ESCALATE' ? 'escalated for further review' : 'updated by the moderation team'}.`, type: 'moderation', link: '/dashboard/notifications' } });
    }
    return res.json({ success: true, report: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
