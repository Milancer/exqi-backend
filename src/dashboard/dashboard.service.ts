import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getStats(user: any) {
    const isAdmin = user.role === UserRole.ADMIN;
    const clientId = user.clientId;

    const [competencies, questions, templates, jobProfiles, interviews] =
      await Promise.all([
        this.countCompetencies(isAdmin, clientId),
        this.countQuestions(isAdmin, clientId),
        this.countTemplates(isAdmin, clientId),
        this.countJobProfiles(isAdmin, clientId),
        this.countInterviews(isAdmin, clientId),
      ]);

    return {
      competencies,
      questions,
      templates,
      jobProfiles,
      interviews,
    };
  }

  private async countCompetencies(
    isAdmin: boolean,
    clientId: number,
  ): Promise<number> {
    const query = isAdmin
      ? `SELECT COUNT(*) AS count FROM competencies WHERE status = 'Active'`
      : `SELECT COUNT(*) AS count FROM competencies WHERE status = 'Active' AND client_id = $1`;
    const params = isAdmin ? [] : [clientId];
    const result = await this.dataSource.query(query, params);
    return parseInt(result[0].count, 10);
  }

  private async countQuestions(
    isAdmin: boolean,
    clientId: number,
  ): Promise<number> {
    const query = isAdmin
      ? `SELECT COUNT(*) AS count FROM competency_questions`
      : `SELECT COUNT(*) AS count FROM competency_questions WHERE client_id = $1`;
    const params = isAdmin ? [] : [clientId];
    const result = await this.dataSource.query(query, params);
    return parseInt(result[0].count, 10);
  }

  private async countTemplates(
    isAdmin: boolean,
    clientId: number,
  ): Promise<number> {
    const query = isAdmin
      ? `SELECT COUNT(*) AS count FROM cbi_templates`
      : `SELECT COUNT(*) AS count FROM cbi_templates WHERE client_id = $1`;
    const params = isAdmin ? [] : [clientId];
    const result = await this.dataSource.query(query, params);
    return parseInt(result[0].count, 10);
  }

  private async countJobProfiles(
    isAdmin: boolean,
    clientId: number,
  ): Promise<number> {
    const query = isAdmin
      ? `SELECT COUNT(*) AS count FROM job_profiles WHERE status != 'Deleted'`
      : `SELECT COUNT(*) AS count FROM job_profiles WHERE status != 'Deleted' AND client_id = $1`;
    const params = isAdmin ? [] : [clientId];
    const result = await this.dataSource.query(query, params);
    return parseInt(result[0].count, 10);
  }

  private async countInterviews(
    isAdmin: boolean,
    clientId: number,
  ): Promise<number> {
    const query = isAdmin
      ? `SELECT COUNT(*) AS count FROM interview_sessions`
      : `SELECT COUNT(*) AS count FROM interview_sessions WHERE client_id = $1`;
    const params = isAdmin ? [] : [clientId];
    const result = await this.dataSource.query(query, params);
    return parseInt(result[0].count, 10);
  }
}
