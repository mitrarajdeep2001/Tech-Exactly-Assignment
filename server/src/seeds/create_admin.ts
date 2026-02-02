/**
 * Seed: Create random admin user
 */

import 'dotenv/config';

/**
 * Custom modules
 */
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { registerUser } from '@/services/v1/auth/register';
import { logger } from '@/lib/winston';

/**
 * Utils
 */
const randomEmail = () =>
  `admin_${Date.now()}_${Math.floor(Math.random() * 1000)}@admin.com`;

const randomPassword = () => `Admin@${Math.random().toString(36).slice(2, 10)}`;

const createAdmin = async () => {
  try {
    await connectToDatabase();

    const email = randomEmail();
    const password = randomPassword();

    await registerUser({
      email,
      password,
      role: 'admin',
    });

    logger.info('✅ Admin created successfully', {
      email,
      password, // ⚠️ show once so you can login
    });

    console.log('==============================');
    console.log('ADMIN CREATED');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('==============================');
  } catch (err: any) {
    if (err.code === 'AuthorizationError') {
      console.error('❌ Admin creation blocked:', err.message);
    } else {
      console.error('❌ Failed to create admin:', err);
    }
  } finally {
    await disconnectFromDatabase();
    process.exit(0);
  }
};

createAdmin();
