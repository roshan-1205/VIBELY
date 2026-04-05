const crypto = require('crypto');

console.log('🔐 Generating secure secrets for production deployment...\n');

console.log('JWT_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('');

console.log('SESSION_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('');

console.log('Copy these values to your Render environment variables!');
console.log('Make sure to keep them secure and never commit them to version control.');