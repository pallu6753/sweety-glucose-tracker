import crypto from 'crypto';

export const generateSecret = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

if (process.argv[1] && process.argv[1].endsWith('generateSecret.js')) {
  const secret = generateSecret(32);
  console.log('Generated Cryptographically Secure JWT Secret:');
  console.log(secret);
}
