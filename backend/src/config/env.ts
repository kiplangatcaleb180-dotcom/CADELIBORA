import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('FATAL: JWT_SECRET environment variable is missing.');
}

export const ENV = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: nodeEnv,
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: jwtSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
