import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    this.logger.log(`🔧 Initializing email transporter...`);
    this.logger.log(`   SMTP_HOST: ${smtpHost || '❌ NOT SET'}`);
    this.logger.log(`   SMTP_PORT: ${smtpPort || '❌ NOT SET'}`);
    this.logger.log(`   SMTP_USER: ${smtpUser ? '✅ SET' : '❌ NOT SET'}`);
    this.logger.log(`   SMTP_PASS: ${smtpPass ? '✅ SET' : '❌ NOT SET'}`);

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      this.logger.warn(
        '⚠️  SMTP credentials not fully configured. Email sending will be simulated.',
      );
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      } as any);
      return;
    }

    // Configure nodemailer with proper SMTP transport
    const transportConfig: any = {
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: false, // Use STARTTLS for port 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // For Ethereal and test SMTP servers
      },
      // Connection options - increased for Railway
      connectionTimeout: 30000,
      greetingTimeout: 10000,
      socketTimeout: 60000,
    };

    this.transporter = nodemailer.createTransport(transportConfig);

    this.logger.log(
      `✅ Email transporter configured with ${smtpHost}:${smtpPort}`,
    );
    this.logger.log(
      `💡 For Ethereal (demo): Generate new creds at https://ethereal.email/create`,
    );
  }

  async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
    const fromEmail = process.env.SMTP_FROM || 'noreply@nettoyageplus.com';

    try {
      const info = await this.transporter.sendMail({
        from: fromEmail,
        to: email,
        subject: 'Réinitialisation de votre mot de passe - NettoyagePlus',
        text: `Bonjour,\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur le lien suivant pour réinitialiser votre mot de passe :\n${resetUrl}\n\nCe lien expirera dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nL'équipe NettoyagePlus`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
              .button { display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>NettoyagePlus</h1>
              </div>
              <div class="content">
                <h2>Réinitialisation de votre mot de passe</h2>
                <p>Bonjour,</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                <p>Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe :</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                <p>Ou copiez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
                <p><strong>Ce lien expirera dans 1 heure.</strong></p>
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
              </div>
              <div class="footer">
                <p>© 2026 NettoyagePlus. Tous droits réservés.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      this.logger.log(
        `Password reset email sent to ${email}. Message ID: ${info.messageId}`,
      );

      // For Ethereal, log the preview URL
      if (process.env.SMTP_HOST?.includes('ethereal.email')) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          this.logger.log(`Preview URL: ${previewUrl}`);
        }
      }
    } catch (error) {
      this.logger.error(
        `❌ Failed to send password reset email to ${email}`,
        error.message,
      );
      
      // Log detailed error info for debugging
      if (error.message?.includes('Authentication failed')) {
        this.logger.error(
          `🔑 Auth Error: Check SMTP_USER and SMTP_PASS in .env`,
        );
        this.logger.error(
          `💡 For Ethereal: Generate new credentials at https://ethereal.email/create`,
        );
      }
      
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
}
