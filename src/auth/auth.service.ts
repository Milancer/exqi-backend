import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    // Deactivated users (soft-deleted) cannot sign in.
    if (!user || user.status !== 'ACTIVE') return null;
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      clientId: user.clientId,
      modules: user.client?.modules || [],
    };
    return {
      access_token: this.jwtService.sign(payload),
      userId: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
      modules: user.client?.modules || [],
      hasSignature: !!user.signature,
    };
  }

  // Generate a reset token for a user
  async generateResetToken(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // 24 hours for welcome emails

    await this.usersService.updateResetToken(userId, token, expiry);
    return token;
  }

  // Request password reset (forgot password flow)
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // 1 hour for forgot password

    await this.usersService.updateResetToken(user.id, token, expiry);
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.name,
      token,
    );

    return { message: 'If the email exists, a reset link has been sent.' };
  }

  // Verify reset token is valid
  async verifyResetToken(
    token: string,
  ): Promise<{ valid: boolean; email?: string }> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      return { valid: false };
    }

    if (new Date() > user.resetTokenExpiry) {
      return { valid: false };
    }

    return { valid: true, email: user.email };
  }

  // Reset password using token
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > user.resetTokenExpiry) {
      throw new BadRequestException('Reset token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.clearResetToken(user.id);

    return { message: 'Password has been reset successfully' };
  }

  // Send welcome email with password setup link
  async sendWelcomeEmail(userId: number): Promise<boolean> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.generateResetToken(userId);
    return this.emailService.sendWelcomeEmail(user.email, user.name, token);
  }
}
