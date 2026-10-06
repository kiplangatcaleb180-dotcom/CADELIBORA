import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService.js';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character] as string));

export async function submitContactInquiry(req: Request, res: Response) {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const subject = String(req.body?.subject || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, subject, and message are required.' });
  }
  if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 10000) {
    return res.status(400).json({ success: false, message: 'One or more fields exceed the allowed length.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  }

  try {
    const recipient = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
    if (!recipient) throw new Error('Contact email recipient is not configured.');
    await sendEmail(
      recipient,
      `CADELIBORA inquiry: ${subject}`,
      `<h2>${escapeHtml(subject)}</h2><p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    );
    return res.status(202).json({ success: true, message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact inquiry delivery failed:', error);
    return res.status(503).json({ success: false, message: 'Unable to send your message right now. Please try again later.' });
  }
}
