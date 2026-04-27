/**
 * creditTalentLMSPaidUsers.cjs
 * Credits purchasedCourses for users who paid in TalentLMS.
 * Only credits courses that exist in interactivecourses.
 * Run: node src/scripts/creditTalentLMSPaidUsers.cjs
 */
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Current interactivecourses IDs
const COURSES = {
  TMH: { id: '699766ce2b436278fb309c8b', slug: 'mastering-telemental-health-compliant-virtual-practice-in-georgia', title: 'Mastering TeleMental Health' },
  TRAUMA: { id: '698da2f32b436278fb309c82', slug: 'the-neurobiology-of-trauma', title: 'The Neurobiology of Trauma' }
  // "Ethical Practices" and "Cultural Sensitivity" do not exist in interactivecourses — skip
};

// Paid users extracted from TalentLMS activity log
// Format: [email, courseKey]
const PAID = [
  ['aswails.rol@gmail.com',            'TRAUMA'],
  ['brandybolan@gmail.com',             null],      // Cultural Sensitivity — no equivalent
  ['soverton@skylandtrail.org',         'TMH'],
  ['jaylinjross@gmail.com',             'TMH'],
  ['lawtonedwards@yahoo.com',           'TRAUMA'],
  ['ssisson3084@gmail.com',             'TMH'],
  ['nourishwithfelicia@gmail.com',      'TMH'],
  ['wp7vx@auraprivatemail.com',         'TMH'],
  ['lizlauren1013@gmail.com',           null],      // Cultural Sensitivity — no equivalent
  ['snider.ryanc@gmail.com',            'TMH'],
  ['pathwaystopromise365@gmail.com',    'TMH'],
  ['guest.lisa@gmail.com',              'TMH'],
  ['kennedyhcounselor@gmail.com',       'TMH'],
  ['smwarr3136@ung.edu',                'TMH'],
  ['jchahboune@gmail.com',              'TMH'],
  ['marissa.dogan@gmail.com',           'TMH'],
  ['hopperalyson@gmail.com',            'TMH'],
  ['rolle.counseling@gmail.com',        'TMH'],
  ['mrsamymac@gmail.com',               'TMH'],
  ['mrsamymac@gmail.com',               'TRAUMA'],
  ['ciarahowardfamu@yahoo.com',         'TMH'],
  ['ciarahowardfamu@yahoo.com',         'TRAUMA'],
  ['clozano@lesley.edu',                'TMH'],
  ['cdixon@istrategiescorp.com',        'TMH'],
  ['natkimross@gmail.com',              'TRAUMA'],
  ['metamorphosis.changeme@gmail.com',  'TMH'],
  ['ruizm73@gmail.com',                 'TMH'],
  ['marylgodard22@gmail.com',           null],      // Cultural Sensitivity — no equivalent
  ['sara@sarakmorganlpc.com',           null],      // Cultural Sensitivity — no equivalent
  ['hayleybarden4@gmail.com',           'TMH'],
  ['jsmithcaringmindswr@gmail.com',     'TMH'],
  ['klish76@gmail.com',                 'TMH'],
  ['e.kingadams@gmail.com',             'TMH'],
  ['jcarmack24@gmail.com',              'TMH'],
  ['christina.marra99@gmail.com',       'TMH'],
  ['baileyeverett55@gmail.com',         'TMH'],
  ['shanephillips3@gmail.com',          'TMH'],
  ['greenhammockcounseling@gmail.com',  'TMH'],
  ['bethmarie5280@gmail.com',           'TMH'],
  ['cheryldwalker@comcast.net',         'TMH'],
  ['gabbieperezcounseling@gmail.com',   'TMH'],
  ['eberry83.eb@gmail.com',             'TMH'],
  ['isabelcardenastherapy@gmail.com',   'TMH'],
  ['essencefiddemonpp@gmail.com',       'TMH'],
  ['michellepintado@opendoortalk.com',  'TMH'],
];

async function run() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  const users = db.collection('users');

  let credited = 0, skipped = 0, notFound = 0, noEquiv = 0;

  for (const [email, courseKey] of PAID) {
    if (!courseKey) {
      console.log(`SKIP (no equivalent course): ${email}`);
      noEquiv++;
      continue;
    }

    const course = COURSES[courseKey];
    const user = await users.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!user) {
      console.log(`NOT FOUND: ${email}`);
      notFound++;
      continue;
    }

    const alreadyCredited = (user.purchasedCourses || []).some(
      pc => pc.courseId?.toString() === course.id
    );

    if (alreadyCredited) {
      console.log(`ALREADY CREDITED: ${email} — ${course.title}`);
      skipped++;
      continue;
    }

    await users.updateOne(
      { _id: user._id },
      {
        $addToSet: {
          purchasedCourses: {
            courseId: new ObjectId(course.id),
            slug: course.slug,
            purchasedAt: new Date('2024-09-01'),
            amount: 0,
            stripeSessionId: 'talentlms-migration'
          }
        }
      }
    );

    console.log(`CREDITED: ${email} — ${course.title}`);
    credited++;
  }

  console.log(`\n✓ Done. Credited: ${credited} | Already had: ${skipped} | Not found: ${notFound} | No equivalent: ${noEquiv}`);
  await client.close();
  process.exit();
}

run().catch(err => { console.error(err); process.exit(1); });
