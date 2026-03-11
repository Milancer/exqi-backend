import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Client, ClientModule } from './clients/entities/client.entity';
import { User, UserRole, UserStatus } from './users/entities/user.entity';
import { EmailService } from './email/email.service';

interface UserSeedData {
  name: string;
  surname: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  role: UserRole;
}

async function seed() {
  console.log('Starting seed...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const emailService = app.get(EmailService);

  const clientRepo = dataSource.getRepository(Client);
  const userRepo = dataSource.getRepository(User);

  // ═══════════════════════════════════════════════════════════════
  // 1. Create EXQi Client (Experttech)
  // ═══════════════════════════════════════════════════════════════
  let client = await clientRepo.findOne({ where: { name: 'EXQi' } });

  if (!client) {
    client = clientRepo.create({
      name: 'EXQi',
      industry: 'Information Technology',
      division: 'Sales',
      contactName: 'Michael',
      contactSurname: 'Botha',
      position: 'Administrator',
      contactPhoneNumber: '0836017574',
      contactEmail: 'michael.botha@experttech.com',
      hrContactName: 'Michael',
      hrContactSurname: 'Botha',
      hrContactPhoneNumber: '0836017574',
      hrContactEmail: 'michael.botha@experttech.com',
      modules: [
        ClientModule.JOB_PROFILE,
        ClientModule.COMPETENCY_BASED_INTERVIEW,
      ],
    });
    client = await clientRepo.save(client);
    console.log('Client created: EXQi (id:', client.id, ')');
  } else {
    console.log('Client already exists: EXQi (id:', client.id, ')');
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. Create SITA Client
  // ═══════════════════════════════════════════════════════════════
  let sitaClient = await clientRepo.findOne({ where: { name: 'SITA' } });

  if (!sitaClient) {
    sitaClient = clientRepo.create({
      name: 'SITA',
      industry: 'Government',
      division: 'Procurement',
      contactName: 'Lerato',
      contactSurname: 'Sita',
      position: 'CEO',
      contactPhoneNumber: '27987722',
      contactEmail: 'ceo@sita.gov.za',
      hrContactName: 'Henry',
      hrContactSurname: 'Rollins',
      hrContactPhoneNumber: '921112131',
      hrContactEmail: 'hr@sita.gov.za',
      modules: [ClientModule.JOB_PROFILE],
    });
    sitaClient = await clientRepo.save(sitaClient);
    console.log('Client created: SITA (id:', sitaClient.id, ')');
  } else {
    console.log('Client already exists: SITA (id:', sitaClient.id, ')');
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. Create Admin Users
  // ═══════════════════════════════════════════════════════════════
  const usersToCreate: UserSeedData[] = [
    {
      name: 'Michael',
      surname: 'Botha',
      idNumber: '7211255098085',
      phoneNumber: '0836017574',
      email: 'michael.botha@experttech.com',
      role: UserRole.ADMIN,
    },
    {
      name: 'Jonty',
      surname: 'Ross',
      idNumber: '0000000000000',
      phoneNumber: '0735062285',
      email: 'jonty989@gmail.com',
      role: UserRole.ADMIN,
    },
  ];

  for (const userData of usersToCreate) {
    const existingUser = await userRepo.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      // Generate a random temporary password (user will reset via email)
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      // Generate reset token for password setup
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 24); // 24 hours

      const user = userRepo.create({
        name: userData.name,
        surname: userData.surname,
        idNumber: userData.idNumber,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        status: UserStatus.ACTIVE,
        clientId: client.id,
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      });

      await userRepo.save(user);
      console.log(`User created: ${userData.name} ${userData.surname} (${userData.email})`);

      // Send welcome email
      try {
        const sent = await emailService.sendWelcomeEmail(
          userData.email,
          userData.name,
          resetToken,
        );
        if (sent) {
          console.log(`  -> Welcome email sent to ${userData.email}`);
        } else {
          console.log(`  -> Failed to send welcome email to ${userData.email}`);
        }
      } catch (error) {
        console.log(`  -> Error sending welcome email: ${error.message}`);
      }
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }

  await app.close();
  console.log('\nSeed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
