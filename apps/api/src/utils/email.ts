import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface ISendInviteEmail {
  toEmail: string;
  inviteUrl: string;
  tenantName: string;
}

export const sendInviteEmail = async ({ toEmail, inviteUrl, tenantName }: ISendInviteEmail): Promise<void> => {
  const mailOptions = {
    from: `${tenantName} <noreply@${tenantName}.com>`,
    to: toEmail,
    subject: "You've been invited to join the team!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
        <h2>Setup Your Account</h2>
        <p>An administrator has invited you to access ${tenantName} workspace platform.</p>
        <p>Click the secure link below to accept the invitation and finalize your password registration:</p>
        <p style="margin: 30px 0;">
          <a href="${inviteUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept & Join Workspace</a>
        </p>
        <p style="color: #666; font-size: 12px;">This invitation will automatically expire in 7 days.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};