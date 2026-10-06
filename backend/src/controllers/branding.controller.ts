import { Response } from 'express';
import prisma from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const LOGO_KEY = 'platform.logo';
const MAX_DATA_URI_LENGTH = 2_800_000;

export async function getPlatformBranding(_req: AuthenticatedRequest, res: Response) {
  try {
    const settings = await prisma.$queryRaw<Array<{ value: string }>>`SELECT "value" FROM "PlatformSetting" WHERE "key" = ${LOGO_KEY} LIMIT 1`;
    return res.json({ success: true, logo: settings[0]?.value || null });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatePlatformLogo(req: AuthenticatedRequest, res: Response) {
  const logo = typeof req.body.logo === 'string' ? req.body.logo : '';
  if (!logo || logo.length > MAX_DATA_URI_LENGTH || !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(logo)) {
    return res.status(400).json({ success: false, message: 'Upload a PNG, JPEG, or WebP image up to 2 MB.' });
  }
  try {
    await prisma.$executeRaw`INSERT INTO "PlatformSetting" ("key", "value", "updatedAt") VALUES (${LOGO_KEY}, ${logo}, CURRENT_TIMESTAMP) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = CURRENT_TIMESTAMP`;
    await prisma.auditLog.create({ data: { userId: req.user?.userId, action: 'UPDATE_PLATFORM_LOGO', entity: 'PlatformSetting', detailsJson: { key: LOGO_KEY } } });
    return res.json({ success: true, logo });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
