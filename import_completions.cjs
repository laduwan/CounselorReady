const mongoose = require('mongoose');
require('dotenv').config();

const courseMap = {
  'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia': '69822fc9ec355eab3d4f224e',
  'Ethical Practices in Mental Health Counseling': '69822fc9ec355eab3d4f224f',
  'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care': '69822fc9ec355eab3d4f2250',
  'Cultural Sensitivity in Uncertain Political Climates': '69822fc9ec355eab3d4f2251'
};

const completions = [
  {email: 'hayleybarden4@gmail.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'hayleybarden4@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'greenhammockcounseling@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'eberry83.eb@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'saraepbolton@gmail.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'brandybolan@gmail.com', course: 'Cultural Sensitivity in Uncertain Political Climates', hours: 1},
  {email: 'ssisson3084@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'isabelcardenastherapy@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'jcarmack24@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'jchahboune@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'rachael.w.clark@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'counselordebcollins@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'katrina@cultivatinggoodness.org', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'drjanetdavis@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'drjanetdavis@gmail.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'drjanetdavis@gmail.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care', hours: 2},
  {email: 'mariondouglas97@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'vfloyd@valdosta.edu', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'coachheidihall@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'thaywoodlpc@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'hopperalyson@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'india@engagecounselingga.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'janetareba@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'info@gaintegratedperspectives.com', course: 'Cultural Sensitivity in Uncertain Political Climates', hours: 1},
  {email: 'info@gaintegratedperspectives.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'info@gaintegratedperspectives.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'info@gaintegratedperspectives.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care', hours: 2},
  {email: 'kelajoh@gmail.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'kelajoh@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'destinyb.may@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'mrsamymac@gmail.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'mrsamymac@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'mckenziephillips12@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'nikkimillerlpc@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'natalieknorrlpc@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'anasewell@sewell-emotionalwellness.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'lspangler@fitzgerald.k12.ga.us', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'lspangler@fitzgerald.k12.ga.us', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'reikiwithtee@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'sipariaborn@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'trishatigue@yahoo.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'wellspringcounselingga@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'whitneynbass@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'tanyakwilliams2002@gmail.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'tanyakwilliams2002@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'tanyakwilliams2002@gmail.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care', hours: 2},
  {email: 'jywilson2015@gmail.com', course: 'Ethical Practices in Mental Health Counseling', hours: 3},
  {email: 'jywilson2015@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3},
  {email: 'jywilson2015@gmail.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care', hours: 2},
  {email: 'kristazurcher@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia', hours: 3}
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  const emailToId = {};
  users.forEach(u => { if(u.email) emailToId[u.email.toLowerCase()] = u._id; });
  
  let created = 0, skipped = 0;
  for (const c of completions) {
    const userId = emailToId[c.email.toLowerCase()];
    const courseId = courseMap[c.course];
    if (!userId) { console.log('No user:', c.email); skipped++; continue; }
    if (!courseId) { console.log('No course:', c.course); skipped++; continue; }
    
    await mongoose.connection.db.collection('celogs').insertOne({
      user: userId,
      course: new mongoose.Types.ObjectId(courseId),
      title: c.course,
      provider: 'GAITP LLC',
      hours: c.hours,
      completionDate: new Date('2025-12-01'),
      category: c.course.includes('Ethical') ? 'Ethics' : 'Core',
      status: 'completed',
      nbccApproved: true,
      acepNumber: '7760',
      migration: { source: 'talentlms', importedAt: new Date(), batchId: 'TLMS-IMPORT-2026' }
    });
    created++;
  }
  console.log('Created:', created, 'Skipped:', skipped);
  process.exit(0);
});
