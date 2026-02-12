import nodemailer from "nodemailer";
import prisma from "./prisma";

// Create reusable transporter
export async function createTransporter() {
  try {
    // Get email settings from system settings
    const settings = await prisma.systemSettings.findFirst();

    if (!settings?.emailHost || !settings?.emailUser || !settings?.emailPassword) {
      throw new Error("Missing email settings in DB");
    }

    return nodemailer.createTransport({
      host: settings.emailHost,
      port: settings.emailPort || 587,
      secure: false,
      auth: {
        user: settings.emailUser,
        pass: settings.emailPassword,
      },
    });
  } catch (error) {
    console.warn("Using environment variables for email fallback:", error);
    // Fallback to environment variables
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  try {
    const transporter = await createTransporter();
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@school.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Student Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// Send welcome email
export async function sendWelcomeEmail(
  email: string,
  name: string,
  username: string,
  temporaryPassword: string,
  role: string
) {
  try {
    const transporter = await createTransporter();
    const loginUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login`;

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@school.com",
      to: email,
      subject: "Welcome to Student Management System",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .credentials { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome!</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Your account has been created successfully. Here are your login credentials:</p>
              <div class="credentials">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
                <p><strong>Role:</strong> ${role}</p>
              </div>
              <p><strong>Important:</strong> Please change your password after your first login for security reasons.</p>
              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login Now</a>
              </div>
            </div>
            <div class="footer">
              <p>&copy; 2024 Student Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// Send general notification email
export async function sendNotificationEmail(
  email: string,
  subject: string,
  message: string
) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@school.com",
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${subject}</h1>
            </div>
            <div class="content">
              ${message}
            </div>
            <div class="footer">
              <p>&copy; 2024 Student Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

