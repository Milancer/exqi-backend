import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SparkPost = require('sparkpost');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private client: any;
  private fromEmail: string;
  private frontendUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('SPARKPOST_API_KEY');
    this.fromEmail =
      this.configService.get<string>('EMAIL_FROM') || 'noreply@experttech.com';
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    if (apiKey) {
      this.client = new SparkPost(apiKey);
      this.logger.log('SparkPost email service initialized');
    } else {
      this.logger.warn(
        'SPARKPOST_API_KEY not set - emails will be logged only',
      );
    }
  }

  async sendWelcomeEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<boolean> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EXQi</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your account has been created on the EXQi platform.</p>
            <p>To get started, please set up your password by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Set Up Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3182ce;">${resetUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you did not expect this email, please ignore it.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EXQi - Experttech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      email,
      'Welcome to EXQi - Set Up Your Password',
      html,
    );
  }

  async sendReviewerAssignmentEmail(
    email: string,
    reviewerName: string,
    jobTitle: string,
    jobProfileId: number,
  ): Promise<boolean> {
    const reviewUrl = `${this.frontendUrl}/job-profiles/${jobProfileId}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { background: #e2e8f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Job Profile Review Required</h1>
          </div>
          <div class="content">
            <p>Hi ${reviewerName},</p>
            <p>You have been assigned to review a job profile that is awaiting your approval.</p>
            <div class="highlight">
              <strong>Job Profile:</strong> ${jobTitle}
            </div>
            <p>Please review the job profile and either approve or reject it.</p>
            <p style="text-align: center;">
              <a href="${reviewUrl}" class="button">Review Job Profile</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3182ce;">${reviewUrl}</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EXQi - Experttech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      email,
      `EXQi - Job Profile Review Required: ${jobTitle}`,
      html,
    );
  }

  async sendReviewerInviteEmail(
    email: string,
    jobTitle: string,
    jobProfileId: number,
    resetToken: string,
  ): Promise<boolean> {
    // Reset-password page accepts a `redirect` query param so that after the
    // user sets their password they land on the job profile they were invited to.
    const redirect = `/job-profiles/${jobProfileId}`;
    const setupUrl = `${this.frontendUrl}/reset-password?token=${resetToken}&redirect=${encodeURIComponent(redirect)}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { background: #e2e8f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're invited to review a Job Profile</h1>
          </div>
          <div class="content">
            <p>Hi,</p>
            <p>You've been invited to EXQi to review the following job profile:</p>
            <div class="highlight">
              <strong>Job Profile:</strong> ${jobTitle}
            </div>
            <p>To get started, set up your password using the secure link below. After setting your password you'll be taken straight to the job profile.</p>
            <p style="text-align: center;">
              <a href="${setupUrl}" class="button">Set Password & Review</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3182ce;">${setupUrl}</p>
            <p style="font-size: 12px; color: #888;">This link will expire in 72 hours.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EXQi - Experttech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      email,
      `EXQi - You're invited to review: ${jobTitle}`,
      html,
    );
  }

  async sendJobProfileChangedEmail(
    email: string,
    recipientName: string,
    jobTitle: string,
    jobProfileId: number,
    editorName: string,
    eventSummary: string,
    changes: Array<{ field: string; old: unknown; new: unknown }> | null,
  ): Promise<boolean> {
    const reviewUrl = `${this.frontendUrl}/job-profiles/${jobProfileId}`;

    const formatValue = (v: unknown) => {
      if (v === null || v === undefined || v === '') return '<em>(empty)</em>';
      if (typeof v === 'object') return `<code>${JSON.stringify(v)}</code>`;
      return String(v);
    };

    const changesHtml =
      changes && changes.length > 0
        ? `
        <p><strong>Changes:</strong></p>
        <ul>
          ${changes
            .map(
              (c) =>
                `<li><strong>${c.field}:</strong> ${formatValue(c.old)} &rarr; ${formatValue(c.new)}</li>`,
            )
            .join('')}
        </ul>`
        : `<p>${eventSummary}</p>`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .highlight { background: #e2e8f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
          ul { background: #fff; padding: 16px 24px; border-radius: 5px; }
          li { margin-bottom: 8px; }
          code { background: #eef; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Job Profile Updated</h1>
          </div>
          <div class="content">
            <p>Hi ${recipientName || 'there'},</p>
            <p><strong>${editorName}</strong> made changes to a job profile that was awaiting your action. The profile has been returned to <em>In Progress</em> and will need to be re-submitted for review.</p>
            <div class="highlight">
              <strong>Job Profile:</strong> ${jobTitle}
            </div>
            ${changesHtml}
            <p style="text-align: center;">
              <a href="${reviewUrl}" class="button">View Job Profile</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EXQi - Experttech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(
      email,
      `EXQi - Job Profile Updated: ${jobTitle}`,
      html,
    );
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<boolean> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { display: inline-block; background: #3182ce; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3182ce;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EXQi - Experttech. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, 'EXQi - Password Reset Request', html);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    if (!this.client) {
      this.logger.log(`[DEV] Email to ${to}: ${subject}`);
      this.logger.log(`[DEV] Would send email with content...`);
      return true;
    }

    try {
      await this.client.transmissions.send({
        content: {
          from: {
            email: this.fromEmail,
            name: 'EXQi',
          },
          subject,
          html,
        },
        recipients: [{ address: to }],
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }
}
