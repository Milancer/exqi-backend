import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAll(currentUser: any) {
    // Admins can see all users
    if (currentUser.role === UserRole.ADMIN) {
      return this.usersRepository.find();
    }
    // Others can only see users in their own client
    return this.usersRepository.find({
      where: { clientId: currentUser.clientId },
    });
  }

  async findOne(id: number, currentUser: any) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    // Admins can see anyone
    if (currentUser.role === UserRole.ADMIN) return user;

    // Users can only see users in their own client
    if (user.clientId !== currentUser.clientId) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email: ILike(email) },
      relations: ['client'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneBy({ id });
  }

  /** Find a user by ID without client gating (for own-profile use) */
  async findOneById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Update only safe profile fields (self-service) */
  async updateProfile(
    id: number,
    data: {
      name?: string;
      surname?: string;
      email?: string;
      phoneNumber?: string;
      idNumber?: string;
      signature?: string;
    },
  ) {
    const user = await this.findOneById(id);
    if (data.name !== undefined) user.name = data.name;
    if (data.surname !== undefined) user.surname = data.surname;
    if (data.email !== undefined) user.email = data.email;
    if (data.phoneNumber !== undefined) user.phoneNumber = data.phoneNumber;
    if (data.idNumber !== undefined) user.idNumber = data.idNumber;
    if (data.signature !== undefined) user.signature = data.signature;
    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  // Update reset token and expiry
  async updateResetToken(userId: number, token: string, expiry: Date) {
    return this.usersRepository.update(userId, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });
  }

  // Find user by reset token
  async findByResetToken(token: string) {
    return this.usersRepository.findOne({
      where: { resetToken: token },
    });
  }

  // Update password
  async updatePassword(userId: number, hashedPassword: string) {
    return this.usersRepository.update(userId, {
      password: hashedPassword,
    });
  }

  // Clear reset token after use
  async clearResetToken(userId: number) {
    return this.usersRepository.update(userId, {
      resetToken: null as any,
      resetTokenExpiry: null as any,
    });
  }
}
