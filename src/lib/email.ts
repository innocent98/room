import nodemailer from "nodemailer";

type EmailData = {
  email: string;
  name: string;
  token: string;
};

export const sendVerificationEmail = async ({
  email,
  name,
  token,
}: EmailData) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/api/verify?token=${token}`;

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: process.env.NODE_ENV === "production" || true,
  });

  // Email content
  const mailOptions = {
    from: `ROOM <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify your email address",
    text: `Hello ${name},\n\nPlease verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThe link will expire in 24 hours.\n\nIf you did not request this email, please ignore it.\n\nRegards,\nThe ROOM Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with ROOM. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this email, please ignore it.</p>
        <p>Regards,<br>The ROOM Team</p>
      </div>
    `,
  };

  // Send email
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("sent");
        resolve(info);
      }
    });
  });
  // return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async ({
  email,
  name,
  token,
}: EmailData) => {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: process.env.NODE_ENV === "production",
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    text: `Hello ${name},\n\nYou requested to reset your password. Please click the link below to reset it:\n\n${resetUrl}\n\nThe link will expire in 24 hours.\n\nIf you did not request this email, please ignore it.\n\nRegards,\nThe ROOM Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Please click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this email, please ignore it.</p>
        <p>Regards,<br>The ROOM Team</p>
      </div>
    `,
  };

  // Send email
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("sent");
        resolve(info);
      }
    });
  });
  // return transporter.sendMail(mailOptions);
};
