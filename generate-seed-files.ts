import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const outputDir = 'C:\\Data';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateSeedFiles() {
  console.log('Connecting to database...');
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully.');

    const tablesToExport = [
      { name: 'job_profiles', entityName: 'JobProfile' },
      { name: 'jp_competency_types', entityName: 'JpCompetencyType' },
      { name: 'jp_competency_clusters', entityName: 'JpCompetencyCluster' },
      { name: 'jp_competencies', entityName: 'JpCompetency' },
      { name: 'job_profile_competencies', entityName: 'JobProfileCompetency' },
      { name: 'job_profile_deliverables', entityName: 'JobProfileDeliverable' },
      { name: 'job_profile_requirements', entityName: 'JobProfileRequirement' },
      { name: 'job_profile_skills', entityName: 'JobProfileSkill' },
    ];

    for (const table of tablesToExport) {
      console.log(`Exporting ${table.name}...`);

      // Use query builder to get raw data to avoid entity instance overhead
      const data = await AppDataSource.manager.query(
        `SELECT * FROM ${table.name}`,
      );

      const outputPath = path.join(outputDir, `${table.name}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
      console.log(`Saved ${data.length} rows to ${outputPath}`);
    }

    console.log('\n--- Seed Files Generated Successfully ---');
  } catch (error) {
    console.error('Error generating seed files:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed.');
    }
  }
}

generateSeedFiles();
