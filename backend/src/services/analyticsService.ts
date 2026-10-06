import prisma from '../config/db.js';

export async function logAuditEvent(userId: string | null, action: string, entity: string, details: any = {}) {
  return await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      detailsJson: JSON.stringify(details),
    },
  });
}
