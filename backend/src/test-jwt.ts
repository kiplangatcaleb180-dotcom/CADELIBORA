import { generateToken, verifyToken } from './auth/jwt.js';

const testPayload = {
  userId: 'jwt-test-user',
  email: 'jwt-test@example.com',
  role: 'ADMIN',
};

const token = generateToken(testPayload);

console.log('\n===== JWT TEST =====');
console.log('Token generated: YES');
console.log('Token parts:', token.split('.').length);

const verified = verifyToken(token);

console.log('Token verified:', verified ? 'YES' : 'NO');

if (verified) {
  console.log('Payload:', verified);
}

console.log('====================\n');
