/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Services
 */
import { registerUser } from '@/services/v1/auth/register';

/**
 * Config
 */
import config from '@/config';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData;

  try {
    const result = await registerUser({
      email,
      password,
      role,
    });

    res.status(201).json(result);
  } catch (err: any) {
    if (err.code === 'AuthorizationError') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: err.message,
      });
      return;
    }

    logger.error('Error during user registration', err);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });
  }
};

export default register;
