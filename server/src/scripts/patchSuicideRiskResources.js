import { MongoClient } from 'mongodb';

const client = await MongoClient.connect(process.env.MONGODB_URI);
const db = client.db();
const col = db.collection('interactivecourses');

const suicideRiskResources = [
  {
    title: 'Special Populations — Suicide Risk Reference',
    type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003508/special_populations_jjjabo.svg',
    description: 'Clinical reference for suicide risk across special populations'
  },
  {
    title: 'Columbia Suicide Severity Rating Scale (C-SSRS)',
    type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003505/cssrs_scale_zohehi.svg',
    description: 'Evidence-based suicide severity rating scale'
  },
  {
    title: 'Suicide Epidemiology Overview',
    type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003508/suicide_epidemiology_ex88fx.svg',
    description: 'Key epidemiological data on suicide rates and risk factors'
  },
  {
    title: 'Safety Plan Steps',
    type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003507/safety_plan_steps_vqxcno.svg',
    description: 'Step-by-step safety planning framework'
  }
];

const tmhResources = [
  {
    title: 'Safety Plan Steps',
    type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1771003507/safety_plan_steps_vqxcno.svg',
    description: 'Safety planning framework for telehealth sessions'
  },
  {
    title: 'Therapeutic Presence in TeleMental Health',
    type: 'image',
    url: 'https://res.cloudinary.com/dzfscjhdx/image/upload/v1773136659/TMH_Therapeutic_Presence_v2_yvns9p.png',
    description: 'Visual guide to maintaining therapeutic presence via telehealth'
  }
];

// Patch Suicide Risk Assessment course
const sr = await col.findOneAndUpdate(
  { title: { $regex: /suicide risk assessment/i } },
  { $set: { resources: suicideRiskResources } },
  { returnDocument: 'after' }
);
console.log('Suicide Risk:', sr?.title, '— resources:', sr?.resources?.length);

// Patch Mastering TeleMental Health
const tmh = await col.findOneAndUpdate(
  { title: { $regex: /telemental health/i } },
  { $set: { resources: tmhResources } },
  { returnDocument: 'after' }
);
console.log('TMH:', tmh?.title, '— resources:', tmh?.resources?.length);

// Clear DBT undefined resources
const dbt = await col.findOneAndUpdate(
  { title: { $regex: /dialectical behavior therapy/i } },
  { $set: { resources: [] } },
  { returnDocument: 'after' }
);
console.log('DBT undefined cleared:', dbt?.title);

await client.close();
console.log('Done.');
