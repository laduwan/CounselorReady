// checkMyRole.js
// READ-ONLY. Makes no writes. Prints role/admin-relevant fields for a given email.
// Run: node checkMyRole.js "your@email.com"
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Usage: node checkMyRole.js "your@email.com"');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to:', mongoose.connection.name);

  const User = mongoose.connection.collection('users');
  const user = await User.findOne(
    { email: email.toLowerCase().trim() },
    { projection: {
        email: 1,
        role: 1,
        disabled: 1,
        disabledAt: 1,
        'subscription.status': 1,
        lastLoginAt: 1,
        createdAt: 1
    }}
  );

  if (!user) {
    console.log(`No user found for email: ${email}`);
  } else {
    console.log(JSON.stringify(user, null, 2));
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
