
import { Resend } from 'resend';

export async function verifyEmailConnection(): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error('EMAIL_FROM is not configured.');
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error(
      'Email configuration is incomplete. Check RESEND_API_KEY and EMAIL_FROM.'
    );
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error('Resend email delivery error:', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });

    throw new Error('Unable to send verification email.');
  }

  if (!data?.id) {
    throw new Error('Email provider did not confirm the email request.');
  }

  console.log('Email accepted by Resend:', data.id);
}
