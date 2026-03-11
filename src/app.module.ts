import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompetenciesModule } from './competencies/competencies.module';
import { CbiModule } from './cbi/cbi.module';
import { JobProfilesModule } from './job-profiles/job-profiles.module';
import { CandidatesModule } from './candidates/candidates.module';
import { InterviewsModule } from './interviews/interviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BulkImportModule } from './bulk-import/bulk-import.module';
import { DepartmentsModule } from './departments/departments.module';
import { JobGradesModule } from './job-grades/job-grades.module';
import { WorkLevelsModule } from './work-levels/work-levels.module';
import { SkillsModule } from './skills/skills.module';
import { ImportModule } from './import/import.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    ClientsModule,
    UsersModule,
    AuthModule,
    CompetenciesModule,
    CbiModule,
    JobProfilesModule,
    CandidatesModule,
    InterviewsModule,
    NotificationsModule,
    BulkImportModule,
    DepartmentsModule,
    JobGradesModule,
    WorkLevelsModule,
    SkillsModule,
    ImportModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
