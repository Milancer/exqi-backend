import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './entities/user.entity';
import { EmailService } from '../email/email.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    const { user, resetToken } = await this.usersService.create(createUserDto);

    // Send welcome email if user needs to set password
    if (resetToken) {
      await this.emailService.sendWelcomeEmail(
        user.email,
        user.name,
        resetToken,
      );
    }

    return user;
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  getMyProfile(@Request() req) {
    return this.usersService.findOneById(req.user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({ status: 200, description: 'Updated user profile' })
  updateMyProfile(
    @Request() req,
    @Body()
    data: {
      name?: string;
      surname?: string;
      email?: string;
      phoneNumber?: string;
      idNumber?: string;
      signature?: string;
    },
  ) {
    return this.usersService.updateProfile(req.user.userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all visible users' })
  findAll(@Request() req) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(+id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Update a user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post(':id/resend-invite')
  @Roles(UserRole.ADMIN, UserRole.OFFICE_MANAGER)
  @ApiOperation({ summary: 'Resend invite email to a user' })
  @ApiResponse({ status: 200, description: 'Invite email resent successfully' })
  async resendInvite(@Param('id') id: string) {
    const { user, resetToken } =
      await this.usersService.generateInviteToken(+id);
    await this.emailService.sendWelcomeEmail(user.email, user.name, resetToken);
    return { message: 'Invite resent successfully' };
  }
}
