import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { CompetencyQuestion } from './cbi/entities/competency-question.entity';
import { CbiTemplate } from './cbi/entities/cbi-template.entity';
import { Competency } from './competencies/entities/competency.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const competencyRepo = dataSource.getRepository(Competency);
  const questionRepo = dataSource.getRepository(CompetencyQuestion);
  const templateRepo = dataSource.getRepository(CbiTemplate);

  console.log('--- DIAGNOSTIC START ---');

  // 1. Check Competencies
  const competencies = await competencyRepo.find();
  console.log(`\nFound ${competencies.length} Competencies:`);
  competencies.forEach((c) =>
    console.log(`- ID: ${c.competency_id}, Name: ${c.competency}`),
  );

  // 2. Check Questions
  const questions = await questionRepo.find();
  console.log(`\nFound ${questions.length} Questions:`);
  questions.forEach((q) =>
    console.log(
      `- ID: ${q.competency_question_id}, CompID: ${q.competency_id}, Level: ${q.level}, Text: ${q.question.substring(0, 30)}...`,
    ),
  );

  // 3. Check Templates
  const templates = await templateRepo.find();
  console.log(`\nFound ${templates.length} Templates:`);
  for (const t of templates) {
    console.log(
      `- Template ID: ${t.cbi_template_id}, Name: ${t.template_name}`,
    );
    console.log(`  Questions Array: ${JSON.stringify(t.questions)}`);
    console.log(`  Competencies: ${JSON.stringify(t.competencies)}`);

    // Check for potential matches
    if (t.competencies && t.competencies.length > 0) {
      for (const comp of t.competencies) {
        const matches = await questionRepo.find({
          where: {
            competency_id: comp.competency_id,
            level: comp.level,
          },
        });
        console.log(
          `  -> Seeking questions for CompID ${comp.competency_id} @ Level ${comp.level}: Found ${matches.length}`,
        );
      }
    }
  }

  console.log('\n--- DIAGNOSTIC END ---');
  await app.close();
}

bootstrap();
