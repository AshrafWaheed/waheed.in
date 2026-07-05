import nodemailer from 'nodemailer';

// Reads from environment. If SMTP_HOST is absent, sendMail is a no-op so the
// site works before credentials are added. Set these in frontend/.env.local:
//
//   SMTP_HOST=mail.privateemail.com  (Hostinger / Namecheap private email)
//   SMTP_PORT=465
//   SMTP_SECURE=true                 (true = SSL on 465, false = STARTTLS on 587)
//   SMTP_USER=ashraf@waheed.in
//   SMTP_PASS=<your password>
//   SMTP_FROM="WAHEED <ashraf@waheed.in>"
//   ALERT_TO=ashraf@waheed.in          (where alert emails land)

function createTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  return nodemailer.createTransport({
    host,
    port:   Number(process.env.SMTP_PORT   ?? 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER ?? '',
      pass: process.env.SMTP_PASS ?? '',
    },
  });
}

export interface MailOptions {
  to:      string;
  subject: string;
  text:    string;
  html?:   string;
}

export async function sendMail(opts: MailOptions): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    // SMTP not configured yet — log and continue silently
    console.log('[mailer] SMTP_HOST not set, skipping email:', opts.subject);
    return;
  }

  await transport.sendMail({
    from:    process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to:      opts.to,
    subject: opts.subject,
    text:    opts.text,
    html:    opts.html,
  });
}
