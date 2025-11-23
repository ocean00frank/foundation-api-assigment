import nodemailer from "nodemailer";

// Create Ethereal test account transporter
// In production, use real SMTP credentials
export async function createTransporter() {
  // For development/testing with Ethereal
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendVerificationEmail(email: string, verificationToken: string) {
  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"Event App" <noreply@eventapp.com>',
      to: email,
      subject: "Welcome to Event App - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome to Event App!</h1>
          <p>Thank you for signing up for our event management platform.</p>
          <p>Please verify your email address by clicking the link below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This is a mock email using Ethereal. In production, this would contain a real verification link.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message. Please do not reply.
          </p>
        </div>
      `,
      text: `Welcome to Event App! This is a mock email using Ethereal. Verification token: ${verificationToken}`,
    });

    console.log("Email sent (Ethereal):", nodemailer.getTestMessageUrl(info));
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}