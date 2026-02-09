const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
  {email:'alexking1229@gmail.com',firstName:'Alexandra',lastName:'King'},
  {email:'hopperalyson@gmail.com',firstName:'Alyson',lastName:'Hopper'},
  {email:'mrsamymac@gmail.com',firstName:'Amy',lastName:'McCullough'},
  {email:'aswails.rol@gmail.com',firstName:'Amy',lastName:'Swails'},
  {email:'baileyeverett55@gmail.com',firstName:'Bailey',lastName:'Everett'},
  {email:'blewison.lcsw@gmail.com',firstName:'Barbara',lastName:'Lewison'},
  {email:'bethmarie5280@gmail.com',firstName:'Beth-Marie',lastName:'Miller'},
  {email:'bballard41327@gmail.com',firstName:'Betty',lastName:'Ballard'},
  {email:'sipariaborn@gmail.com',firstName:'Beverley',lastName:'Theodore'},
  {email:'blakewingo1@gmail.com',firstName:'Blake',lastName:'Wingo'},
  {email:'brandybolan@gmail.com',firstName:'Brandy',lastName:'Brock'},
  {email:'rachael.w.clark@gmail.com',firstName:'Rachael',lastName:'Clark'},
  {email:'counselordebcollins@gmail.com',firstName:'Deb',lastName:'Collins'},
  {email:'katrina@cultivatinggoodness.org',firstName:'Katrina',lastName:'Cultivating'},
  {email:'drjanetdavis@gmail.com',firstName:'Janet',lastName:'Davis'},
  {email:'mariondouglas97@gmail.com',firstName:'Marion',lastName:'Douglas'},
  {email:'vfloyd@valdosta.edu',firstName:'V',lastName:'Floyd'},
  {email:'coachheidihall@gmail.com',firstName:'Heidi',lastName:'Hall'},
  {email:'thaywoodlpc@gmail.com',firstName:'T',lastName:'Haywood'},
  {email:'india@engagecounselingga.com',firstName:'India',lastName:'Engage'},
  {email:'janetareba@gmail.com',firstName:'Janet',lastName:'Areba'},
  {email:'info@gaintegratedperspectives.com',firstName:'Kejuiana',lastName:'Johnson'},
  {email:'kelajoh@gmail.com',firstName:'Kejuiana',lastName:'Johnson'},
  {email:'destinyb.may@gmail.com',firstName:'Destiny',lastName:'May'},
  {email:'mckenziephillips12@gmail.com',firstName:'McKenzie',lastName:'Phillips'},
  {email:'nikkimillerlpc@gmail.com',firstName:'Nikki',lastName:'Miller'},
  {email:'natalieknorrlpc@gmail.com',firstName:'Natalie',lastName:'Knorr'},
  {email:'anasewell@sewell-emotionalwellness.com',firstName:'Ana',lastName:'Sewell'},
  {email:'lspangler@fitzgerald.k12.ga.us',firstName:'L',lastName:'Spangler'},
  {email:'reikiwithtee@gmail.com',firstName:'Tee',lastName:'Reiki'},
  {email:'trishatigue@yahoo.com',firstName:'Trisha',lastName:'Tigue'},
  {email:'wellspringcounselingga@gmail.com',firstName:'Wellspring',lastName:'Counseling'},
  {email:'whitneynbass@gmail.com',firstName:'Whitney',lastName:'Bass'},
  {email:'tanyakwilliams2002@gmail.com',firstName:'Tanya',lastName:'Williams'},
  {email:'jywilson2015@gmail.com',firstName:'J',lastName:'Wilson'},
  {email:'kristazurcher@gmail.com',firstName:'Krista',lastName:'Zurcher'},
  {email:'greenhammockcounseling@gmail.com',firstName:'Corinne',lastName:'Barnickel'},
  {email:'eberry83.eb@gmail.com',firstName:'Elizabeth',lastName:'Berry'},
  {email:'saraepbolton@gmail.com',firstName:'Sara',lastName:'Bolton'},
  {email:'ssisson3084@gmail.com',firstName:'Shekinah',lastName:'Burnette'},
  {email:'isabelcardenastherapy@gmail.com',firstName:'Isabel',lastName:'Cardenas'},
  {email:'jcarmack24@gmail.com',firstName:'Jennifer',lastName:'Carmack'},
  {email:'jchahboune@gmail.com',firstName:'Julie',lastName:'Chahboune'},
  {email:'hayleybarden4@gmail.com',firstName:'Hayley',lastName:'Barden'}
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const existing = await db.collection('users').find({}, {projection: {email: 1}}).toArray();
  const existingEmails = new Set(existing.map(u => u.email?.toLowerCase()));
  
  let created = 0, skipped = 0;
  
  for (const u of users) {
    if (existingEmails.has(u.email.toLowerCase())) {
      skipped++;
      continue;
    }
    
    const tempPassword = 'TempPass' + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    await db.collection('users').insertOne({
      email: u.email.toLowerCase(),
      firstName: u.firstName,
      lastName: u.lastName,
      password: hashedPassword,
      isVerified: true,
      subscriptionTier: 'free',
      migration: {
        source: 'talentlms',
        importedAt: new Date(),
        batchId: 'TLMS-USERS-2026'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Created:', u.email);
    created++;
  }
  
  console.log('Done! Created:', created, 'Skipped (already exist):', skipped);
  process.exit(0);
});
