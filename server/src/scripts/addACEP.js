/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Quick script to add ACEP template
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const credentialTemplateSchema = new mongoose.Schema({
  type: String,
  code: String,
  name: String,
  state: String,
  issuingBody: String,
  renewalCycle: Number,
  totalCEUsRequired: Number,
  requirements: [{
    category: String,
    hoursRequired: Number
  }],
  notes: String,
  lastVerified: Date,
  isActive: Boolean
}, { timestamps: true });

const CredentialTemplate = mongoose.model('CredentialTemplate', credentialTemplateSchema);

async function addACEP() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');
  
  const existing = await CredentialTemplate.findOne({ code: 'ACEP', type: 'specialty_cert' });
  
  if (existing) {
    console.log('ACEP already exists, updating...');
    existing.name = 'Approved Continuing Education Provider';
    existing.issuingBody = 'NBCC';
    existing.renewalCycle = 60;
    existing.totalCEUsRequired = 0;
    existing.requirements = [];
    existing.notes = 'Provider designation for offering NBCC-approved CE courses. Requires annual reports and fee payments.';
    existing.lastVerified = new Date();
    existing.isActive = true;
    await existing.save();
    console.log('Updated ACEP');
  } else {
    await CredentialTemplate.create({
      type: 'specialty_cert',
      code: 'ACEP',
      name: 'Approved Continuing Education Provider',
      state: null,
      issuingBody: 'NBCC',
      renewalCycle: 60,
      totalCEUsRequired: 0,
      requirements: [],
      notes: 'Provider designation for offering NBCC-approved CE courses. Requires annual reports and fee payments.',
      lastVerified: new Date(),
      isActive: true
    });
    console.log('Created ACEP');
  }
  
  process.exit(0);
}

addACEP();
