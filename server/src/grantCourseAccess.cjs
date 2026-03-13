// grantCourseAccess.cjs
// Adds CR course IDs to purchasedCourses[] for all TalentLMS enrollees
// Run: node src/grantCourseAccess.cjs

const mongoose = require("mongoose");
require("dotenv").config();

// TalentLMS course → CR slug mapping
const COURSE_SLUGS = {
  "Mastering TeleMental Health": "mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo",
  "Ethical Practices in Mental Health Counseling": "ethics-and-professional-boundaries-in-counseling-practice",
  "The Neurobiology of Trauma": "neurobiology-of-trauma",
  "Cultural Sensitivity in Uncertain Political Climates": null, // CR-602 not seeded yet
};

// All 78 enrollments from TalentLMS export (Users - Courses sheet)
const ENROLLMENTS = [
  // TMH enrollments (46)
  {email: "essencefiddemonpp@gmail.com", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "isabelcardenastherapy@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "cheryldwalker@comcast.net", course: "Mastering TeleMental Health", status: "completed"},
  {email: "gabbieperezcounseling@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "eberry83.eb@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "malhiggs@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "marshall.talkfromtheheart@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "BethMarie5280@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "greenhammockcounseling@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "shanephillips3@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "michellepintado@opendoortalk.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "Hayleybarden4@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "baileyeverett55@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "jcarmack24@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "e.kingadams@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "klish76@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "christina.marra99@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "jsmithcaringmindswr@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "rolle.counseling@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "ruizm73@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "metamorphosis.changeme@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "mrsamymac@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "ciarahowardfamu@yahoo.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "clozano@lesley.edu", course: "Mastering TeleMental Health", status: "completed"},
  {email: "Cdixon@istrategiescorp.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "hopperalyson@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "marissa.dogan@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "jchahboune@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "Kennedyhcounselor@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "wp7vx@auraprivatemail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "ssisson3084@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "nourishwithfelicia@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "guest.lisa@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "snider.ryanc@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "pathwaystopromise365@gmail.com", course: "Mastering TeleMental Health", status: "completed"},
  {email: "soverton@skylandtrail.org", course: "Mastering TeleMental Health", status: "completed"},
  {email: "blewison.lcsw@gmail.com", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "sara@sarakmorganlpc.com", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "jillianmccarter17@gmail.com", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "jessica.wiant@white.k12.ga.us", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "cvaughnc@lagrange.edu", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "danagamble16@gmail.com", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "scott.brandelyn@gmail.com", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "natkimross@gmail.com", course: "Mastering TeleMental Health", status: "not_attempted"},
  {email: "smwarr3136@ung.edu", course: "Mastering TeleMental Health", status: "not_attempted"},
  // Ethics enrollments (21)
  {email: "meghan.skiba@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "malhiggs@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "danagamble16@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "Hayleybarden4@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "saraepbolton@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "whitneycaroln35@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "sarangela12@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "lizlauren1013@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "michelle.n.thompson@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "completed"},
  {email: "scott.brandelyn@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  {email: "cvaughnc@lagrange.edu", course: "Ethical Practices in Mental Health Counseling", status: "incomplete"},
  {email: "jessica.wiant@white.k12.ga.us", course: "Ethical Practices in Mental Health Counseling", status: "incomplete"},
  {email: "blewison.lcsw@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  {email: "jgregwhite12@aol.com", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  {email: "ruizm73@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  {email: "jennymeaden@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  {email: "alexking1229@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "incomplete"},
  {email: "sipariaborn@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "incomplete"},
  {email: "Kennedyhcounselor@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "incomplete"},
  {email: "Dscounselingllc@gmail.com", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  {email: "mhaynes@ourhealingspace.org", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  {email: "BRANDYBOLAN@GMAIL.COM", course: "Ethical Practices in Mental Health Counseling", status: "not_attempted"},
  // Neurobiology of Trauma enrollments (7)
  {email: "natkimross@gmail.com", course: "The Neurobiology of Trauma", status: "completed"},
  {email: "mrsamymac@gmail.com", course: "The Neurobiology of Trauma", status: "completed"},
  {email: "ciarahowardfamu@yahoo.com", course: "The Neurobiology of Trauma", status: "completed"},
  {email: "lawtonedwards@yahoo.com", course: "The Neurobiology of Trauma", status: "completed"},
  {email: "blewison.lcsw@gmail.com", course: "The Neurobiology of Trauma", status: "not_attempted"},
  {email: "sara@sarakmorganlpc.com", course: "The Neurobiology of Trauma", status: "not_attempted"},
  {email: "aswails.rol@gmail.com", course: "The Neurobiology of Trauma", status: "not_attempted"},
  // Cultural Sensitivity enrollments (4)
  {email: "lizlauren1013@gmail.com", course: "Cultural Sensitivity in Uncertain Political Climates", status: "completed"},
  {email: "BRANDYBOLAN@GMAIL.COM", course: "Cultural Sensitivity in Uncertain Political Climates", status: "completed"},
  {email: "sara@sarakmorganlpc.com", course: "Cultural Sensitivity in Uncertain Political Climates", status: "not_attempted"},
  {email: "marylgodard22@gmail.com", course: "Cultural Sensitivity in Uncertain Political Climates", status: "not_attempted"},
];

const BATCH_ID = "MIG-20260312-001";

// Email aliases: TalentLMS email → CR database email
const EMAIL_ALIASES = {
  "e.kingadams@gmail.com": "e.kingadams@icloud.com",
  "malhiggs@gmail.com": "mallery@miprivatesesssions.com",
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;

  // Resolve course slugs to ObjectIds
  const courseIds = {};
  for (const [name, slug] of Object.entries(COURSE_SLUGS)) {
    if (slug) {
      const course = await db.collection("interactivecourses").findOne({slug: slug});
      if (course) {
        courseIds[name] = course._id;
        console.log("Mapped: " + name + " -> " + course._id);
      } else {
        console.log("WARNING: slug not found - " + slug);
      }
    } else {
      console.log("SKIP: no CR course yet - " + name);
    }
  }

  let granted = 0;
  let alreadyHad = 0;
  let userNotFound = 0;
  let courseNotFound = 0;

  for (const enrollment of ENROLLMENTS) {
    // Find user by email (case-insensitive), check alias first
    const lookupEmail = EMAIL_ALIASES[enrollment.email.toLowerCase()] || EMAIL_ALIASES[enrollment.email] || enrollment.email;
    const user = await db.collection("users").findOne({
      email: {$regex: new RegExp("^" + lookupEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i")}
    });

    if (user === null) {
      userNotFound++;
      continue;
    }

    const courseId = courseIds[enrollment.course];
    if (courseId === undefined) {
      courseNotFound++;
      continue;
    }

    // Check if already in purchasedCourses
    const existing = (user.purchasedCourses || []).some(function(id) {
      return id.toString() === courseId.toString();
    });

    if (existing) {
      alreadyHad++;
      continue;
    }

    // Add to purchasedCourses
    await db.collection("users").updateOne(
      {_id: user._id},
      {$addToSet: {purchasedCourses: courseId}}
    );
    granted++;
  }

  console.log("\n=== COURSE ACCESS RESULTS ===");
  console.log("Access granted: " + granted);
  console.log("Already had access: " + alreadyHad);
  console.log("User not found: " + userNotFound);
  console.log("Course not in CR yet: " + courseNotFound);

  // Spot check
  const barbara = await db.collection("users").findOne({email: /blewison/i});
  if (barbara) {
    console.log("\n--- Barbara Lewison (paid for 3 courses, completed 0) ---");
    console.log("purchasedCourses: " + (barbara.purchasedCourses || []).length);
  }

  process.exit();
});
