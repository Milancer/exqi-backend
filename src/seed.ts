import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Client } from './clients/entities/client.entity';
import { User, UserRole, UserStatus } from './users/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const clientRepo = dataSource.getRepository(Client);
  const userRepo = dataSource.getRepository(User);

  // 1. Create default client if none exists
  let client = await clientRepo.findOne({ where: { id: 1 } });
  if (!client) {
    client = clientRepo.create({
      name: 'EXQi',
      industry: 'Technology',
      division: 'Main',
      contactName: 'Jonty',
      contactSurname: 'Admin',
      position: 'Administrator',
      contactPhoneNumber: '0000000000',
      contactEmail: 'jonty989@gmail.com',
      hrContactName: 'Jonty',
      hrContactSurname: 'Admin',
      hrContactPhoneNumber: '0000000000',
      hrContactEmail: 'jonty989@gmail.com',
      modules: [],
    });
    client = await clientRepo.save(client);
    console.log('✅ Default client created (id:', client.id, ')');
  } else {
    console.log('ℹ️  Client already exists (id:', client.id, ')');
  }

  // 2. Create admin user
  const existingUser = await userRepo.findOne({
    where: { email: 'jonty989@gmail.com' },
  });

  if (!existingUser) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('Mrjones989', salt);

    const admin = userRepo.create({
      name: 'Jonty',
      surname: 'Admin',
      idNumber: '0000000000000',
      phoneNumber: '0000000000',
      email: 'jonty989@gmail.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      clientId: client.id,
    });

    await userRepo.save(admin);
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  await app.close();
  console.log('🌱 Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
