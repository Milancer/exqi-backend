import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewSession } from './entities/interview-session.entity';
import { InterviewResponse } from './entities/interview-response.entity';
import { CompetencyQuestion } from '../cbi/entities/competency-question.entity';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterviewSession,
      InterviewResponse,
      CompetencyQuestion,
    ]),
    NotificationsModule,
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
