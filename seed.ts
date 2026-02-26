import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ClientsService } from './src/clients/clients.service';
import { UsersService } from './src/users/users.service';
import { UserRole, UserStatus } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { CompetencyType } from './src/competencies/entities/competency-type.entity';
import { CompetencyCluster } from './src/competencies/entities/competency-cluster.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const clientsService = app.get(ClientsService);
  const usersService = app.get(UsersService);
  const dataSource = app.get(DataSource);

  console.log('Seeding System Client...');
  // 1. Create or Find System Client
  let sysClient;
  const mockSystemUser = { clientId: 1, role: UserRole.ADMIN };
  try {
    sysClient = await clientsService.findOne(1, mockSystemUser);
    console.log('System Client already exists.');
  } catch (e) {
    sysClient = await clientsService.create({
      name: 'System Client',
      industry: 'Internal',
      division: 'Admin',
      contactName: 'Sys',
      contactSurname: 'Admin',
      position: 'Root',
      contactPhoneNumber: '000',
      contactEmail: 'sys@admin.com',
      hrContactName: 'HR',
      hrContactSurname: 'Sys',
      hrContactPhoneNumber: '000',
      hrContactEmail: 'hr@sys.com',
    });
    console.log('System Client Created:', sysClient.id);
  }

  // 2. Create System Admin User
  const adminEmail = 'sysadmin@nexus.com';
  const existingUser = await usersService.findOneByEmail(adminEmail);

  if (existingUser) {
    console.log('System Admin already exists.');
  } else {
    await usersService.create({
      name: 'System',
      surname: 'Admin',
      idNumber: '0000000000000',
      phoneNumber: '0000000000',
      email: adminEmail,
      password: 'syspassword',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      clientId: sysClient.id,
      profilePicture: '',
    });
    console.log('System Admin Created: sysadmin@nexus.com / syspassword');
  }

  // 3. Seed CompetencyTypes
  console.log('\nSeeding Competency Types...');
  const competencyTypeRepo = dataSource.getRepository(CompetencyType);

  const competencyTypes = [
    { competency_type: 'Technical', status: 'Active' },
    { competency_type: 'Behavioral', status: 'Active' },
    { competency_type: 'Leadership', status: 'Active' },
  ];

  for (const type of competencyTypes) {
    const existing = await competencyTypeRepo.findOne({
      where: { competency_type: type.competency_type },
    });
    if (!existing) {
      await competencyTypeRepo.save(type);
      console.log(`  ✓ Created CompetencyType: ${type.competency_type}`);
    } else {
      console.log(`  - CompetencyType already exists: ${type.competency_type}`);
    }
  }

  // 4. Seed CompetencyClusters
  console.log('\nSeeding Competency Clusters...');
  const competencyClusterRepo = dataSource.getRepository(CompetencyCluster);

  const clusters = [
    {
      competency_type_id: 1,
      cluster_name: 'Problem Solving',
      description: 'Analytical and critical thinking skills',
      status: 'Active',
    },
    {
      competency_type_id: 1,
      cluster_name: 'Technical Expertise',
      description: 'Domain-specific technical knowledge',
      status: 'Active',
    },
    {
      competency_type_id: 2,
      cluster_name: 'Communication',
      description: 'Effective verbal and written communication',
      status: 'Active',
    },
    {
      competency_type_id: 3,
      cluster_name: 'Team Leadership',
      description: 'Leading and motivating teams',
      status: 'Active',
    },
  ];

  for (const cluster of clusters) {
    const existing = await competencyClusterRepo.findOne({
      where: { cluster_name: cluster.cluster_name },
    });
    if (!existing) {
      await competencyClusterRepo.save(cluster);
      console.log(`  ✓ Created CompetencyCluster: ${cluster.cluster_name}`);
    } else {
      console.log(
        `  - CompetencyCluster already exists: ${cluster.cluster_name}`,
      );
    }
  }

  console.log('\n✅ Seeding complete!\n');
  await app.close();
}
bootstrap();
