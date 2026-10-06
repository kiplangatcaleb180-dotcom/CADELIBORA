import jwt from 'jsonwebtoken';
import { ENV } from './src/config/env.ts';

const token = process.argv[2];

if (!token) {
  console.error('Usage: npx tsx check-jwt.ts YOUR_TOKEN');
  process.exit(1);
}

try {
  const decoded = jwt.verify(token, ENV.JWT_SECRET);

  console.log('JWT SIGNATURE: VALID');
  console.log('PAYLOAD:', decoded);
} catch (error: any) {
  console.log('JWT SIGNATURE: INVALID');
  console.log('ERROR:', error.message);
}
