import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ImportService } from './import.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importService = app.get(ImportService);

  // Parse command line arguments
  const args = process.argv.slice(2);
  let clientId: number | undefined;
  let clearExisting = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--client' || args[i] === '-c') {
      clientId = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--clear') {
      clearExisting = true;
    }
  }

  console.log('\n🚀 EXQi Data Import Tool\n');
  console.log(`📊 Database Connection:`);
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}\n`);
  console.log(`Client ID: ${clientId || 'ALL'}`);
  console.log(`Clear existing: ${clearExisting ? 'Yes' : 'No'}\n`);

  try {
    await importService.importAllData(clientId, clearExisting);
    console.log('\n✅ Import completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }

  await app.close();
}

bootstrap();
