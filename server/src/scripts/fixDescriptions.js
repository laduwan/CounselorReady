/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
console.log('Connected\n');

const fixes = [
  {
    match: /Suicide Risk Assessment/,
    desc: 'Suicide is the 10th leading cause of death in the United States, claiming over 48,000 lives annually. Mental health professionals are on the front lines of prevention, yet many report feeling inadequately prepared to assess and manage suicide risk. This comprehensive 4-hour course equips clinicians with evidence-based frameworks for suicide risk assessment, safety planning, and clinical decision-making. Through clinical vignettes, validated screening tools, and practical protocols, participants will develop confidence in conducting thorough risk assessments and implementing effective interventions across diverse clinical settings.'
  },
  {
    match: /Crisis Intervention and Suicide Prevention/,
    desc: 'When clients present in acute crisis, clinicians must respond with confidence, competence, and compassion. This 4-hour course provides a comprehensive guide to crisis intervention and suicide prevention, covering evidence-based assessment models, de-escalation techniques, safety planning protocols, and postvention strategies. Participants will learn to differentiate crisis types, apply the Columbia Suicide Severity Rating Scale, implement Stanley-Brown Safety Planning, and navigate ethical and legal complexities of working with clients at risk for self-harm.'
  },
  {
    match: /Ethics and Professional Boundaries/,
    desc: 'Ethical practice is the foundation of effective counseling, yet boundary dilemmas arise daily in clinical work. This 3-hour course examines professional boundaries, dual relationships, informed consent, confidentiality, and ethical decision-making frameworks. Through real-world case studies and the ACA Code of Ethics, participants will develop skills for navigating complex ethical situations including social media boundaries, rural practice challenges, cultural considerations, and managing boundary crossings versus violations.'
  },
  {
    match: /28 Days Later/,
    desc: 'The title references both the common duration of residential treatment programs and the transformative journey that begins when clients commit to recovery. This 3-hour course examines addiction from neurobiological, psychological, and social perspectives. Participants will learn evidence-based assessment and intervention strategies including motivational interviewing, relapse prevention, and integrated treatment for co-occurring disorders. Through continuing case studies, clinicians will develop practical skills for engaging, treating, and supporting clients across the stages of change.'
  },
  {
    match: /Motivational Interviewing: From Ambivalence/,
    desc: 'Ambivalence is not resistance—it is a natural part of the change process. This 3-hour course provides clinicians with a thorough understanding of Motivational Interviewing (MI), the evidence-based approach that helps clients resolve ambivalence and move toward meaningful change. From the spirit of MI to advanced techniques like developing discrepancy and rolling with resistance, participants will learn practical skills for evoking client motivation across clinical settings.'
  }
];

for (const fix of fixes) {
  const result = await db.collection('courses').updateOne(
    { title: fix.match },
    { $set: { description: fix.desc } }
  );
  const label = fix.match.toString().slice(1, 40);
  console.log(result.modifiedCount ? '✅' : '⚠️', label);
}

await mongoose.disconnect();
console.log('\nDone!');
