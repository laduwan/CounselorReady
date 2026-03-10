// reimportCompletions.js
// Deletes orphan TalentLMS CE logs and reimports from CSV
// Maps to actual interactivecourses + real user ObjectIds
// Run: node reimportCompletions.js

const mongoose = require('mongoose');

const CSV_DATA = `user_email,user_name,course_title,status,completion_date,score
Hayleybarden4@gmail.com,Hayley Barden,Ethical Practices in Mental Health Counseling,completed,,100
Hayleybarden4@gmail.com,Hayley Barden,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
greenhammockcounseling@gmail.com,Corinne Barnickel,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
eberry83.eb@gmail.com,Elizabeth Berry,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
saraepbolton@gmail.com,Sara Bolton,Ethical Practices in Mental Health Counseling,completed,,100
BRANDYBOLAN@GMAIL.COM,brandy brock,Cultural Sensitivity in Uncertain Political Climates,completed,,100
ssisson3084@gmail.com,Shekinah Burnette,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
isabelcardenastherapy@gmail.com,Isabel Cardenas,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
jcarmack24@gmail.com,jennifer carmack,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
jchahboune@gmail.com,Julie Chahboune,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
Cdixon@istrategiescorp.com,Carla Dixon,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
marissa.dogan@gmail.com,Marissa Dogan,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
sarangela12@gmail.com,Sarah Dundas,Ethical Practices in Mental Health Counseling,completed,,100
baileyeverett55@gmail.com,Bailey Everett,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
ciarahowardfamu@yahoo.com,Ciara Fernandez,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
ciarahowardfamu@yahoo.com,Ciara Fernandez,The Neurobiology of Trauma: A Foundation for Trauma-Informed Care,completed,,100
danagamble16@gmail.com,Dana Gamble,Ethical Practices in Mental Health Counseling,completed,,100
guest.lisa@gmail.com,Lisa Guest,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
malhiggs@gmail.com,Mallery Higgs,Ethical Practices in Mental Health Counseling,completed,,100
malhiggs@gmail.com,Mallery Higgs,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
Kennedyhcounselor@gmail.com,Kennedy Holmes,Ethical Practices in Mental Health Counseling,in_progress,,0
Kennedyhcounselor@gmail.com,Kennedy Holmes,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
hopperalyson@gmail.com,Alyson Hopper,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
pathwaystopromise365@gmail.com,Crystal Johnson,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
nourishwithfelicia@gmail.com,Felicia Kanu,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
lizlauren1013@gmail.com,Elizabeth Kendrick,Cultural Sensitivity in Uncertain Political Climates,completed,,100
lizlauren1013@gmail.com,Elizabeth Kendrick,Ethical Practices in Mental Health Counseling,completed,,100
alexking1229@gmail.com,Alexandra King,Ethical Practices in Mental Health Counseling,in_progress,,0
e.kingadams@gmail.com,Ebony King Adams,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
klish76@gmail.com,La Tonya Klish-Polk,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
lawtonedwards@yahoo.com,Valerie Lawton Edwards,The Neurobiology of Trauma: A Foundation for Trauma-Informed Care,completed,,100
clozano@lesley.edu,Courtney Lozano,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
christina.marra99@gmail.com,Christina Marra,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
marshall.talkfromtheheart@gmail.com,Yvette Marshall,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
mrsamymac@gmail.com,Amy McCullough,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
mrsamymac@gmail.com,Amy McCullough,The Neurobiology of Trauma: A Foundation for Trauma-Informed Care,completed,,100
BethMarie5280@gmail.com,Beth-Marie Miller,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
soverton@skylandtrail.org,Sarah Overton,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
wp7vx@auraprivatemail.com,Zoe Peralta-Page,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
gabbieperezcounseling@gmail.com,Gabbie Perez,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
shanephillips3@gmail.com,Shane Phillips,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
michellepintado@opendoortalk.com,Michelle Pintado,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
whitneycaroln35@gmail.com,Whitney Rodriguez,Ethical Practices in Mental Health Counseling,completed,,100
rolle.counseling@gmail.com,Candice Rolle,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
jaylinjross@gmail.com,Jaylin Ross,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
natkimross@gmail.com,Natalie Ross,The Neurobiology of Trauma: A Foundation for Trauma-Informed Care,completed,,100
ruizm73@gmail.com,Maria Ruiz,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
jsmithcaringmindswr@gmail.com,Jocelaine Smith,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
snider.ryanc@gmail.com,Ryan Snider,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
sipariaborn@gmail.com,Beverley Theodore,Ethical Practices in Mental Health Counseling,in_progress,,0
michelle.n.thompson@gmail.com,Michelle Thompson,Ethical Practices in Mental Health Counseling,completed,,100
cvaughnc@lagrange.edu,Christina Vaughn-Chesterman,Ethical Practices in Mental Health Counseling,in_progress,,0
cheryldwalker@comcast.net,Cheryl Walker,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
metamorphosis.changeme@gmail.com,Shameka Walker,Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia,completed,,100
jessica.wiant@white.k12.ga.us,Jessica Wiant,Ethical Practices in Mental Health Counseling,in_progress,,0`;

// Course title -> category + CE hours mapping
const COURSE_META = {
  'Ethical Practices in Mental Health Counseling': { category: 'Ethics', hours: 3 },
  'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia': { category: 'Telehealth', hours: 3 },
  'Cultural Sensitivity in Uncertain Political Climates': { category: 'Cultural Diversity', hours: 3 },
  'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care': { category: 'Core', hours: 3 }
};

// Search terms to find courses in interactivecourses (partial title match)
const COURSE_SEARCH = {
  'Ethical Practices in Mental Health Counseling': 'Ethical Practices',
  'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia': 'Mastering TeleMental',
  'Cultural Sensitivity in Uncertain Political Climates': 'Cultural Sensitivity',
  'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care': 'Neurobiology of Trauma'
};

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('='.repeat(70));
  console.log('TALENTLMS COMPLETION REIMPORT');
  console.log('='.repeat(70));

  // ── Step 1: Match course titles to interactivecourses ──
  console.log('\n--- STEP 1: Matching courses to interactivecourses ---');
  const courseMap = {}; // CSV title -> { _id, title, ceHours }

  for (const [csvTitle, searchTerm] of Object.entries(COURSE_SEARCH)) {
    const ic = await db.collection('interactivecourses').findOne({
      title: { $regex: searchTerm, $options: 'i' }
    });
    if (ic) {
      courseMap[csvTitle] = { _id: ic._id, title: ic.title, ceHours: ic.ceHours || COURSE_META[csvTitle].hours };
      console.log('  MATCHED:', csvTitle);
      console.log('       ->', ic._id.toString(), ic.title);
    } else {
      // Also check legacy courses collection
      const leg = await db.collection('courses').findOne({
        title: { $regex: searchTerm, $options: 'i' }
      });
      if (leg) {
        courseMap[csvTitle] = { _id: leg._id, title: leg.title, ceHours: leg.ceuHours || leg.ceHours || COURSE_META[csvTitle].hours };
        console.log('  MATCHED (legacy):', csvTitle);
        console.log('       ->', leg._id.toString(), leg.title);
      } else {
        courseMap[csvTitle] = null;
        console.log('  NOT FOUND:', csvTitle);
        console.log('       -> CE log will be created WITHOUT course reference');
      }
    }
  }

  // ── Step 2: Delete old orphan CE logs ──
  console.log('\n--- STEP 2: Removing old orphan TalentLMS CE logs ---');
  const deleteResult = await db.collection('celogs').deleteMany({ 'migration.source': 'talentlms' });
  console.log('  Deleted:', deleteResult.deletedCount, 'orphan CE logs');

  // ── Step 3: Parse CSV and reimport ──
  console.log('\n--- STEP 3: Reimporting from CSV ---');
  const lines = CSV_DATA.trim().split('\n').slice(1); // skip header
  let created = 0, skippedNoUser = 0, skippedInProgress = 0, errors = 0;

  for (const line of lines) {
    // Parse CSV (handle commas in names if needed)
    const parts = line.split(',');
    const email = parts[0].trim();
    const userName = parts[1].trim();
    const courseTitle = parts[2].trim();
    const status = parts[3].trim();
    const completionDate = parts[4].trim();
    const score = parseInt(parts[5].trim()) || 0;

    // Skip in_progress — only import completed courses
    if (status !== 'completed') {
      skippedInProgress++;
      continue;
    }

    // Find user by email (case-insensitive)
    const user = await db.collection('users').findOne({
      email: { $regex: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
    });

    if (!user) {
      console.log('  NO USER:', email, '(' + userName + ')');
      skippedNoUser++;
      continue;
    }

    // Get course reference
    const courseRef = courseMap[courseTitle];
    const meta = COURSE_META[courseTitle] || { category: 'Core', hours: 3 };

    // Build CE log document
    const ceLog = {
      user: user._id,
      title: courseTitle,
      provider: 'GAITP LLC',
      hours: courseRef ? courseRef.ceHours : meta.hours,
      completionDate: completionDate ? new Date(completionDate) : new Date('2025-12-01'),
      category: meta.category,
      status: 'completed',
      synchronous: false,
      deliveryMethod: 'online',
      nbccApproved: true,
      acepNumber: '7760',
      score: score,
      passingScore: 80,
      attempts: 1,
      migration: {
        source: 'talentlms',
        importedAt: new Date(),
        batchId: 'TLMS-REIMPORT-2026',
        originalData: {
          completionDate: completionDate ? new Date(completionDate) : new Date('2025-12-01'),
          score: score,
          status: status
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add course reference if matched
    if (courseRef) {
      ceLog.course = courseRef._id;
    }

    try {
      await db.collection('celogs').insertOne(ceLog);
      created++;
    } catch (err) {
      console.log('  ERROR:', email, courseTitle, err.message);
      errors++;
    }
  }

  // ── Summary ──
  console.log('\n' + '='.repeat(70));
  console.log('REIMPORT COMPLETE');
  console.log('='.repeat(70));
  console.log('  Created:', created, 'CE logs');
  console.log('  Skipped (no user account):', skippedNoUser);
  console.log('  Skipped (in_progress):', skippedInProgress);
  console.log('  Errors:', errors);

  // Verify
  const total = await db.collection('celogs').countDocuments({ 'migration.source': 'talentlms' });
  console.log('\n  Total TalentLMS CE logs now in DB:', total);

  process.exit(0);
})();
