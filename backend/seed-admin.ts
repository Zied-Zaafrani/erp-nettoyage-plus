/**
 * Seed script to create a demo admin user for testing
 * Run with: npx ts-node seed-admin.ts
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './src/modules/users/entities/user.entity';
import { UserRole } from './src/shared/types/user.types';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  console.log('🌱 Starting seed script...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  
  // Get User repository directly
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  // Demo admin credentials
  const demoAdmin = {
    email: 'admin@nettoyageplus.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'NettoyagePlus',
    role: UserRole.SUPER_ADMIN,
    phone: '+22245250855',
    isActive: true,
  };

  try {
    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: demoAdmin.email },
    });

    if (existingAdmin) {
      console.log('✅ Demo admin already exists:', demoAdmin.email);
      console.log('\n📋 Login credentials:');
      console.log(`   Email: ${demoAdmin.email}`);
      console.log(`   Password: ${demoAdmin.password}`);
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(demoAdmin.password, 10);

      // Create admin user
      const admin = userRepository.create({
        ...demoAdmin,
        password: hashedPassword,
      });

      await userRepository.save(admin);

      console.log('✅ Demo admin created successfully!');
      console.log('\n📋 Login credentials:');
      console.log(`   Email: ${demoAdmin.email}`);
      console.log(`   Password: ${demoAdmin.password}`);
    }

    // Create additional demo users
    const demoUsers = [
      {
        email: 'director@nettoyageplus.com',
        password: 'Director123!',
        firstName: 'Mohamed',
        lastName: 'Directeur',
        role: UserRole.DIRECTOR,
        phone: '+22231633163',
        isActive: true,
      },
      {
        email: 'sectorchief@nettoyageplus.com',
        password: 'Sector123!',
        firstName: 'Ahmed',
        lastName: 'ChefSecteur',
        role: UserRole.SECTOR_CHIEF,
        phone: '+22220000001',
        isActive: true,
      },
      {
        email: 'agent@nettoyageplus.com',
        password: 'Agent123!',
        firstName: 'Fatima',
        lastName: 'Agent',
        role: UserRole.AGENT,
        phone: '+22220000002',
        isActive: true,
      },
    ];

    console.log('\n📋 Other demo accounts:');
    for (const user of demoUsers) {
      const existing = await userRepository.findOne({
        where: { email: user.email },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await userRepository.save(userRepository.create({
          ...user,
          password: hashedPassword,
        }));
        console.log(`   ✅ Created: ${user.email} / ${user.password} (${user.role})`);
      } else {
        console.log(`   ⏭️  Exists: ${user.email} / ${user.password} (${user.role})`);
      }
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
    console.log('\n🌱 Seed script completed!');
  }
}

bootstrap();
