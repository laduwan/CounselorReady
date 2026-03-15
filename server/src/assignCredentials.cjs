// assignCredentials.cjs
// Assigns correct credential type based on actual TalentLMS license data
// Run: node src/assignCredentials.cjs

const mongoose = require("mongoose");
require("dotenv").config();

// Template IDs from credentialtemplates collection (GA state)
const TEMPLATES = {
  LPC:  "694d3d2b6ef160f2435a470b",  // Licensed Professional Counselor | GA | 35 CE
  LAPC: "6975f5420aaea844fec39f0f",  // Licensed Associate Professional Counselor | GA | 35 CE
  LCSW: "697b7b6c62efb26bb5db12a4",  // Licensed Clinical Social Worker | GA | 35 CE
  LMSW: "697b7b6d62efb26bb5db12f6",  // Licensed Master Social Worker | GA | 35 CE
  LMFT: "697b7b6d62efb26bb5db1348",  // Licensed Marriage and Family Therapist | GA | 35 CE
};

// Users with confirmed license prefixes from TalentLMS export
const LICENSE_DATA = [
  // === LPC (22) ===
  {email: "cheryldwalker@comcast.net", lic: "LPC013140", type: "LPC"},
  {email: "jessica.wiant@white.k12.ga.us", lic: "LPC014115", type: "LPC"},
  {email: "christina.marra99@gmail.com", lic: "LPC012562", type: "LPC"},
  {email: "jcarmack24@gmail.com", lic: "LPC013236", type: "LPC"},
  {email: "klish76@gmail.com", lic: "LPC013895", type: "LPC"},
  {email: "sara@sarakmorganlpc.com", lic: "LPC009840", type: "LPC"},
  {email: "bballard41327@gmail.com", lic: "LPC004666", type: "LPC"},
  {email: "jgregwhite12@aol.com", lic: "LPC006559", type: "LPC"},
  {email: "metamorphosis.changeme@gmail.com", lic: "LPC019067", type: "LPC"},
  {email: "marylgodard22@gmail.com", lic: "LPC013762", type: "LPC"},
  {email: "Cdixon@istrategiescorp.com", lic: "LPC008476", type: "LPC"},
  {email: "ciarahowardfamu@yahoo.com", lic: "LPC012803", type: "LPC"},
  {email: "mariel2550@yahoo.com", lic: "LPC013819", type: "LPC"},
  {email: "sipariaborn@gmail.com", lic: "LPC012057", type: "LPC"},
  {email: "vhogan@gmail.com", lic: "LPC013796", type: "LPC"},
  {email: "sarangela12@gmail.com", lic: "LPC016202", type: "LPC"},
  {email: "wp7vx@auraprivatemail.com", lic: "LPC015709", type: "LPC"},
  {email: "Dscounselingllc@gmail.com", lic: "LPC015122", type: "LPC"},
  {email: "lawtonedwards@yahoo.com", lic: "LPC004673", type: "LPC"},
  {email: "michelle.n.thompson@gmail.com", lic: "LPC014923", type: "LPC"},
  {email: "mhaynes@ourhealingspace.org", lic: "LPC015981", type: "LPC"},
  {email: "jaylinjross@gmail.com", lic: "LPC016033", type: "LPC"},
  // === APC (11) ===
  {email: "Hayleybarden4@gmail.com", lic: "APC009372", type: "LAPC"},
  {email: "jillianmccarter17@gmail.com", lic: "APC010101", type: "LAPC"},
  {email: "whitneycaroln35@gmail.com", lic: "APC009803", type: "LAPC"},
  {email: "blakewingo1@gmail.com", lic: "APC010261", type: "LAPC"},
  {email: "jennymeaden@gmail.com", lic: "APC009993", type: "LAPC"},
  {email: "Denabean624@gmail.com", lic: "APC010328", type: "LAPC"},
  {email: "rolle.counseling@gmail.com", lic: "APC010297", type: "LAPC"},
  {email: "lindswickard@yahoo.com", lic: "APC010647", type: "LAPC"},
  {email: "jchahboune@gmail.com", lic: "APC010728", type: "LAPC"},
  {email: "Kennedyhcounselor@gmail.com", lic: "APC010736", type: "LAPC"},
  {email: "pathwaystopromise365@gmail.com", lic: "APC008986", type: "LAPC"},
  // === CSW/LCSW (3) ===
  {email: "blewison.lcsw@gmail.com", lic: "CSW005910", type: "LCSW"},
  {email: "wendymarieturney@gmail.com", lic: "CSW007314", type: "LCSW"},
  {email: "soverton@skylandtrail.org", lic: "CSW008242", type: "LCSW"},
  // === MSW (2) ===
  {email: "marissa.dogan@gmail.com", lic: "MSW012726", type: "LMSW"},
  {email: "nourishwithfelicia@gmail.com", lic: "MSW011283", type: "LMSW"},
  // === MFT (1) ===
  {email: "greenhammockcounseling@gmail.com", lic: "MFT001834", type: "LMFT"},
];

const BATCH_ID = "MIG-20260312-001";

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;

  // Step 1: Delete previously assumed GA LPC credentials
  const deleted = await db.collection("usercredentials").deleteMany({"migration.batchId": BATCH_ID});
  console.log("Deleted " + deleted.deletedCount + " previously assumed credentials");

  // Step 2: Load all templates
  const templates = {};
  for (const [key, id] of Object.entries(TEMPLATES)) {
    const t = await db.collection("credentialtemplates").findOne({_id: new mongoose.Types.ObjectId(id)});
    if (t) {
      templates[key] = t;
      console.log("Loaded template: " + key + " -> " + t.name + " (" + t.state + ", " + t.totalCEUsRequired + " CE)");
    }
  }

  // Step 3: Create credentials + update user license info
  let credCreated = 0;
  let usersUpdated = 0;
  const summary = {LPC: 0, LAPC: 0, LCSW: 0, LMSW: 0, LMFT: 0, skipped: 0};

  for (const entry of LICENSE_DATA) {
    const user = await db.collection("users").findOne({email: {$regex: new RegExp("^" + entry.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i")}});
    if (user === null) {
      console.log("SKIP: user not found - " + entry.email);
      summary.skipped++;
      continue;
    }

    const template = templates[entry.type];
    if (template === undefined) {
      console.log("SKIP: no template for " + entry.type);
      summary.skipped++;
      continue;
    }

    // Update user record with license info
    await db.collection("users").updateOne({_id: user._id}, {$set: {
      licenseNumber: entry.lic,
      licenseState: "GA",
      licenseType: entry.type === "LAPC" ? "APC" : entry.type
    }});
    usersUpdated++;

    // Check for existing credential
    const existing = await db.collection("usercredentials").findOne({
      userId: user._id,
      templateId: template._id
    });
    if (existing) {
      summary.skipped++;
      continue;
    }

    // Get user's migration certificates
    const certs = await db.collection("certificates").find({
      $or: [{user: user._id}, {userId: user._id}],
      batchId: BATCH_ID
    }).toArray();

    const ceuLogs = certs.map(function(c) {
      return {
        certificateId: c._id,
        hours: c.ceHours || 0,
        category: c.ceuCategory || "Core",
        completionDate: c.completionDate,
        courseTitle: c.courseTitle || "CE Course",
        addedAt: new Date()
      };
    });

    const totalHours = ceuLogs.reduce(function(s, l) { return s + l.hours; }, 0);

    // Build requirements from template
    const reqs = (template.requirements || []).map(function(r) {
      const h = ceuLogs
        .filter(function(l) { return (l.category || "").toLowerCase() === (r.category || "").toLowerCase(); })
        .reduce(function(s, l) { return s + l.hours; }, 0);
      return {
        category: r.category,
        hoursRequired: r.hoursRequired || 0,
        hoursCompleted: Math.min(h, r.hoursRequired || 999),
        synchronousRequired: r.synchronousRequired || false
      };
    });

    await db.collection("usercredentials").insertOne({
      userId: user._id,
      templateId: template._id,
      name: template.name,
      shortName: entry.type === "LAPC" ? "GA APC" : "GA " + entry.type,
      state: "Georgia",
      licenseNumber: entry.lic,
      issuingBody: template.issuingBody || "Georgia Composite Board",
      expirationDate: null,
      renewalCycle: template.renewalCycle || 24,
      totalCEUsRequired: template.totalCEUsRequired || 35,
      totalCEUsCompleted: totalHours,
      requirements: reqs,
      ceuLogs: ceuLogs,
      isActive: true,
      migration: {source: "talentlms", batchId: BATCH_ID, importedAt: new Date()},
      createdAt: new Date(),
      updatedAt: new Date()
    });

    credCreated++;
    summary[entry.type]++;
  }

  console.log("\n=== RESULTS ===");
  console.log("Users updated with license info: " + usersUpdated);
  console.log("Credentials created: " + credCreated);
  console.log("  LPC:  " + summary.LPC);
  console.log("  APC:  " + summary.LAPC);
  console.log("  LCSW: " + summary.LCSW);
  console.log("  LMSW: " + summary.LMSW);
  console.log("  LMFT: " + summary.LMFT);
  console.log("  Skipped: " + summary.skipped);

  // Verify samples
  const samples = [
    {email: "snider.ryanc@gmail.com", expect: "none (0000)"},
    {email: "jaylinjross@gmail.com", expect: "LPC"},
    {email: "blewison.lcsw@gmail.com", expect: "LCSW"},
    {email: "Hayleybarden4@gmail.com", expect: "APC"},
    {email: "greenhammockcounseling@gmail.com", expect: "MFT"},
  ];
  console.log("\n--- Spot checks ---");
  for (const s of samples) {
    const u = await db.collection("users").findOne({email: {$regex: new RegExp("^" + s.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i")}});
    if (u) {
      const cred = await db.collection("usercredentials").findOne({userId: u._id});
      if (cred) {
        console.log(s.email + " | " + cred.shortName + " " + cred.licenseNumber + " | " + cred.totalCEUsCompleted + "/" + cred.totalCEUsRequired + " CE | expected: " + s.expect);
      } else {
        console.log(s.email + " | no credential | expected: " + s.expect);
      }
    }
  }

  process.exit();
});
