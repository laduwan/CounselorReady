/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Seed Credential Templates
 * Run with: node /opt/render/project/src/server/src/scripts/seedCredentialTemplates.js
 * 
 * This imports all state license templates from allStates.js into the database
 */

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedCredentialTemplates.js
import dotenv from 'dotenv';
import { stateLicenses } from '../data/allStates.js';

dotenv.config();

const credentialTemplateSchema = new mongoose.Schema({
  type: { type: String, enum: ['state_license', 'national_cert', 'specialty_cert'], required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  state: { type: String, uppercase: true },
  issuingBody: { type: String, required: true },
  renewalCycle: { type: Number, required: true },
  totalCEUsRequired: { type: Number, required: true },
  requirements: [{
    category: { type: String, required: true },
    hoursRequired: { type: Number, required: true },
    description: String,
    notes: String
  }],
  renewalFee: Number,
  renewalUrl: String,
  notes: String,
  firstRenewalNotes: String,
  lastVerified: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const CredentialTemplate = mongoose.model('CredentialTemplate', credentialTemplateSchema);

async function seedTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const templates = stateLicenses;
    
    if (!templates || templates.length === 0) {
      console.log('No templates found in allStates.js');
      process.exit(1);
    }
    
    console.log(`Found ${templates.length} templates to seed`);
    
    let created = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const template of templates) {
      try {
        // Check if template exists
        const existing = await CredentialTemplate.findOne({
          code: template.code,
          state: template.state?.toUpperCase() || null,
          type: template.type
        });
        
        if (existing) {
          // Update existing template with new requirements
          existing.name = template.name;
          existing.issuingBody = template.issuingBody;
          existing.renewalCycle = template.renewalCycle;
          existing.totalCEUsRequired = template.totalCEUsRequired;
          existing.requirements = template.requirements || [];
          existing.notes = template.notes || existing.notes;
          existing.lastVerified = new Date();
          await existing.save();
          updated++;
          console.log(`  Updated: ${template.code} (${template.state || 'National'})`);
        } else {
          // Create new template
          await CredentialTemplate.create({
            type: template.type,
            code: template.code,
            name: template.name,
            state: template.state?.toUpperCase(),
            issuingBody: template.issuingBody,
            renewalCycle: template.renewalCycle,
            totalCEUsRequired: template.totalCEUsRequired,
            requirements: template.requirements || [],
            notes: template.notes,
            lastVerified: new Date(),
            isActive: true
          });
          created++;
          console.log(`  Created: ${template.code} (${template.state || 'National'})`);
        }
      } catch (err) {
        console.error(`  Error with ${template.code} (${template.state}):`, err.message);
        skipped++;
      }
    }
    
    console.log('\n========== Summary ==========');
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Skipped (errors): ${skipped}`);
    console.log(`Total processed: ${created + updated + skipped}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedTemplates();
