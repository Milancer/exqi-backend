import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  async create(data: {
    user_id: number;
    type: NotificationType;
    title: string;
    message: string;
    reference_type?: string;
    reference_id?: number;
    client_id: number;
  }): Promise<Notification> {
    const notification = this.repo.create(data);
    return this.repo.save(notification);
  }

  async findAll(user: any): Promise<Notification[]> {
    const where: any = { user_id: user.userId };
    if (user.role !== UserRole.ADMIN) {
      where.client_id = user.clientId;
    }
    return this.repo.find({
      where,
      order: { created_at: 'DESC' },
      take: 50,
    });
  }

  async countUnread(user: any): Promise<number> {
    const where: any = { user_id: user.userId, is_read: false };
    if (user.role !== UserRole.ADMIN) {
      where.client_id = user.clientId;
    }
    return this.repo.count({ where });
  }

  async markAsRead(id: number, user: any): Promise<Notification | undefined> {
    const notification = await this.repo.findOne({
      where: { notification_id: id, user_id: user.userId },
    });
    if (!notification) return undefined;
    notification.is_read = true;
    return this.repo.save(notification);
  }

  async markAllAsRead(user: any): Promise<void> {
    await this.repo.update(
      { user_id: user.userId, is_read: false },
      { is_read: true },
    );
  }
}
