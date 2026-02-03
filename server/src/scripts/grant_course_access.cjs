const mongoose = require('mongoose');
require('dotenv').config();

// Course IDs from CounselorReady
const courseMap = {
  'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia': '69822fc9ec355eab3d4f224e',
  'Ethical Practices in Mental Health Counseling': '69822fc9ec355eab3d4f224f',
  'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care': '69822fc9ec355eab3d4f2250',
  'Cultural Sensitivity in Uncertain Political Climates': '69822fc9ec355eab3d4f2251'
};

// 28 incomplete enrollments from TalentLMS
const enrollments = [
  {email: 'brandybolan@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'essencefiddemonpp@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'danagamble16@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'marylgodard22@gmail.com', course: 'Cultural Sensitivity in Uncertain Political Climates'},
  {email: 'mhaynes@ourhealingspace.org', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'kennedyhcounselor@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'alexking1229@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'blewison.lcsw@gmail.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care'},
  {email: 'blewison.lcsw@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'blewison.lcsw@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'dscounselingllc@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'jillianmccarter17@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'jennymeaden@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'sara@sarakmorganlpc.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care'},
  {email: 'sara@sarakmorganlpc.com', course: 'Cultural Sensitivity in Uncertain Political Climates'},
  {email: 'sara@sarakmorganlpc.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'natkimross@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'ruizm73@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'scott.brandelyn@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'scott.brandelyn@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'aswails.rol@gmail.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care'},
  {email: 'sipariaborn@gmail.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'cvaughnc@lagrange.edu', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'cvaughnc@lagrange.edu', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'smwarr3136@ung.edu', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'},
  {email: 'jgregwhite12@aol.com', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'jessica.wiant@white.k12.ga.us', course: 'Ethical Practices in Mental Health Counseling'},
  {email: 'jessica.wiant@white.k12.ga.us', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia'}
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  
  // Get all users
  const users = await db.collection('users').find({}).toArray();
  const emailToUser = {};
  users.forEach(u => { 
    if(u.email) emailToUser[u.email.toLowerCase()] = u; 
  });
  
  let granted = 0, skipped = 0, notFound = 0;
  
  for (const e of enrollments) {
    const user = emailToUser[e.email.toLowerCase()];
    const courseId = courseMap[e.course];
    
    if (!user) {
      console.log('No user:', e.email);
      notFound++;
      continue;
    }
    
    if (!courseId) {
      console.log('No course:', e.course);
      skipped++;
      continue;
    }
    
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    
    // Check if already has access
    const existingAccess = user.purchasedCourses?.some(
      pc => pc.toString() === courseId
    );
    
    if (existingAccess) {
      console.log('Already has access:', e.email, '-', e.course.substring(0, 30));
      skipped++;
      continue;
    }
    
    // Grant access by adding to purchasedCourses
    await db.collection('users').updateOne(
      { _id: user._id },
      { 
        $addToSet: { purchasedCourses: courseObjectId },
        $set: { updatedAt: new Date() }
      }
    );
    
    console.log('Granted:', e.email, '-', e.course.substring(0, 40));
    granted++;
  }
  
  console.log('\n=== Summary ===');
  console.log('Access granted:', granted);
  console.log('Skipped (already has access):', skipped);
  console.log('User not found:', notFound);
  
  process.exit(0);
});
