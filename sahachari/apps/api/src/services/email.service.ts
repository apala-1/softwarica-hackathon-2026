import { env } from '../config/env';
import { Organization } from '../types/document.types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: Number(env.EMAIL_PORT) === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  family: 4,
});

export interface SendNibedanEmailOptions {
  organization: Organization;
  victimName: string;
  victimPhone?: string;
  enhancedStory: string;
  pdfBase64: string;
}

export async function sendNibedanEmail(
  options: SendNibedanEmailOptions
): Promise<void> {
  const { organization, victimName, victimPhone, enhancedStory, pdfBase64 } = options;

  if (!organization.email) {
    console.warn(`No email for org: ${organization.organization_name} — skipping`);
    return;
  }

  const orgAddresses = organization.email
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  const toAddresses =
    env.NODE_ENV === 'development' && env.DEV_EMAIL_OVERRIDE
      ? [env.DEV_EMAIL_OVERRIDE]
      : orgAddresses;

  console.log(`📧 Sending to: ${toAddresses.join(', ')}`);

  const pdfBuffer = Buffer.from(pdfBase64, 'base64');

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: toAddresses,
    subject: `घरेलु हिंसा उजुरी — ${victimName}`,
    text: enhancedStory,
    html: `
      <div style="font-family: sans-serif; max-width: 700px; margin: auto;">
        <h2 style="color: #7c3aed;">सहचरी — घरेलु हिंसा उजुरी</h2>
        <p style="color: #555; font-size: 13px;">
          यो निवेदन <strong>सहचरी</strong> मार्फत पठाइएको हो।
          संलग्न PDF मा औपचारिक निवेदन छ।
        </p>
        <hr/>
        <pre style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
${enhancedStory}
        </pre>
        <hr/>
        <p style="font-size: 12px; color: #999;">
          सम्पर्क: ${victimPhone || 'उल्लेख गरिएको छैन'}
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `nibedan-${victimName.replace(/\s+/g, '-')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log(`✅ Email sent — Message ID: ${info.messageId}`);
}

export async function verifyEmailConnection(): Promise<void> {
  await transporter.verify();
  console.log('✅ Email transporter ready');
}