import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CbiService } from './cbi/cbi.service';
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cbiService = app.get(CbiService);

  console.log('--- STARTING TEMPLATE FIX ---');

  const templates = await cbiService.findAllTemplates({
    role: UserRole.ADMIN,
  } as any);
  console.log(`Found ${templates.length} templates.`);

  for (const t of templates) {
    console.log(
      `Processing Template "${t.template_name}" (ID: ${t.cbi_template_id})...`,
    );
    console.log(`  Current Questions: ${JSON.stringify(t.questions)}`);
    console.log(`  Competencies: ${JSON.stringify(t.competencies)}`);

    try {
      const updated = await cbiService.generateQuestionsFromTemplate(
        t.cbi_template_id,
        {
          role: UserRole.ADMIN,
          clientId: 1,
        },
      );
      console.log(
        `  -> UPDATED Questions: ${JSON.stringify(updated.questions)}`,
      );
    } catch (e) {
      console.error(`  -> ERROR: ${e.message}`);
    }
  }

  console.log('--- FINISHED TEMPLATE FIX ---');
  await app.close();
}

bootstrap();
