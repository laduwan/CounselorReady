// migrationDashboardFix.cjs
// Populates ALL dashboard-visible data for TalentLMS migrated users
// Run: node src/migrationDashboardFix.cjs

const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const BATCH_ID = "MIG-20260312-001";

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  
  console.log("=== MIGRATION DASHBOARD FIX ===\n");

  // Load all migration CE logs
  const celogs = await db.collection("celogs").find({"migration.batchId": BATCH_ID}).toArray();
  console.log("Migration CE logs:", celogs.length);

  // Group by user
  const byUser = {};
  for (const log of celogs) {
    const uid = log.user.toString();
    if (!byUser[uid]) byUser[uid] = [];
    byUser[uid].push(log);
  }
  console.log("Unique users with completions:", Object.keys(byUser).length);

  // Load GA LPC credential template
  const gaLpcTemplate = await db.collection("credentialtemplates").findOne({
    $or: [
      {name: /GA.*LPC/i},
      {name: /Georgia.*LPC/i},
      {shortName: "GA LPC"}
    ]
  });
  if (gaLpcTemplate) {
    console.log("Found GA LPC template:", gaLpcTemplate.name, "| ID:", gaLpcTemplate._id);
  } else {
    console.log("WARNING: No GA LPC credential template found — skipping credential creation");
  }

  let certsFixed = 0;
  let progressCreated = 0;
  let credentialsCreated = 0;
  let ceuLogsAllocated = 0;

  for (const [userId, logs] of Object.entries(byUser)) {
    const userOid = new mongoose.Types.ObjectId(userId);
    const user = await db.collection("users").findOne({_id: userOid});
    if (!user) continue;

    // ─── 1. FIX CERTIFICATES (title + category) ───
    for (const log of logs) {
      const cert = await db.collection("certificates").findOne({ceLog: log._id, batchId: BATCH_ID});
      if (cert) {
        let title = null;
        let category = null;
        if (cert.course) {
          const ic = await db.collection("interactivecourses").findOne({_id: cert.course});
          if (ic) { title = ic.title; category = ic.ceCategory || ic.category; }
        }
        if (!title) title = log.title;
        if (!category) category = log.category;
        
        await db.collection("certificates").updateOne({_id: cert._id}, {$set: {
          courseTitle: title || "CE Course",
          ceuCategory: category || "Core",
          ceuHours: log.hours
        }});
        certsFixed++;
      }
    }

    // ─── 2. CREATE COURSE PROGRESS RECORDS ───
    // Group logs by course
    const courseIds = [...new Set(logs.filter(l => l.course).map(l => l.course.toString()))];
    for (const courseIdStr of courseIds) {
      const courseOid = new mongoose.Types.ObjectId(courseIdStr);
      const existing = await db.collection("usercourseprogresses").findOne({
        userId: userOid,
        courseId: courseOid
      });
      if (!existing) {
        const courseLogs = logs.filter(l => l.course && l.course.toString() === courseIdStr);
        const completionDate = courseLogs[0].completionDate;
        await db.collection("usercourseprogresses").insertOne({
          userId: userOid,
          courseId: courseOid,
          status: "completed",
          progressPercent: 100,
          completedAt: completionDate,
          assessmentPassed: true,
          evaluationSubmitted: true,
          attestationAgreed: true,
          migration: {source: "talentlms", batchId: BATCH_ID, importedAt: new Date()},
          createdAt: new Date(),
          updatedAt: new Date()
        });
        progressCreated++;
      }
    }

    // ─── 3. CREATE GA LPC CREDENTIAL (if template exists) ───
    if (gaLpcTemplate) {
      const existingCred = await db.collection("usercredentials").findOne({
        userId: userOid,
        $or: [
          {name: /GA.*LPC/i},
          {name: /Georgia.*LPC/i},
          {templateId: gaLpcTemplate._id}
        ]
      });

      if (!existingCred) {
        // Build ceuLogs from certificates
        const userCerts = await db.collection("certificates").find({
          user: userOid, batchId: BATCH_ID
        }).toArray();

        const ceuLogs = userCerts.map(function(cert) {
          return {
            certificateId: cert._id,
            hours: cert.ceHours || 0,
            category: cert.ceuCategory || "Core",
            completionDate: cert.completionDate,
            courseTitle: cert.courseTitle || "CE Course",
            addedAt: new Date()
          };
        });

        const totalHours = ceuLogs.reduce(function(sum, l) { return sum + l.hours; }, 0);

        // Build requirements from template
        const requirements = (gaLpcTemplate.requirements || []).map(function(req) {
          // Calculate hours completed for this category
          const matchingHours = ceuLogs
            .filter(function(l) {
              return l.category && l.category.toLowerCase() === (req.category || "").toLowerCase();
            })
            .reduce(function(sum, l) { return sum + l.hours; }, 0);
          return {
            category: req.category,
            hoursRequired: req.hoursRequired || 0,
            hoursCompleted: Math.min(matchingHours, req.hoursRequired || 999),
            synchronousRequired: req.synchronousRequired || false
          };
        });

        await db.collection("usercredentials").insertOne({
          userId: userOid,
          templateId: gaLpcTemplate._id,
          name: gaLpcTemplate.name || "GA LPC",
          shortName: gaLpcTemplate.shortName || "GA LPC",
          state: "Georgia",
          licenseNumber: "",
          issuingBody: gaLpcTemplate.issuingBody || "Georgia Composite Board",
          expirationDate: null,
          renewalCycle: gaLpcTemplate.renewalCycle || 24,
          totalCEUsRequired: gaLpcTemplate.totalCEUsRequired || 35,
          totalCEUsCompleted: totalHours,
          requirements: requirements,
          ceuLogs: ceuLogs,
          isActive: true,
          migration: {source: "talentlms", batchId: BATCH_ID, importedAt: new Date()},
          createdAt: new Date(),
          updatedAt: new Date()
        });
        credentialsCreated++;
        ceuLogsAllocated += ceuLogs.length;
      }
    }
  }

  console.log("\n=== RESULTS ===");
  console.log("Certificates fixed (title+category):", certsFixed);
  console.log("Course progress records created:", progressCreated);
  console.log("GA LPC credentials created:", credentialsCreated);
  console.log("CEU logs allocated to credentials:", ceuLogsAllocated);

  // Verify with Ryan
  const ryan = await db.collection("users").findOne({email: /snider/i});
  if (ryan) {
    console.log("\n--- Ryan Snider check ---");
    console.log("Certificates:", await db.collection("certificates").countDocuments({user: ryan._id}));
    console.log("Course progress:", await db.collection("usercourseprogresses").countDocuments({userId: ryan._id}));
    const cred = await db.collection("usercredentials").findOne({userId: ryan._id});
    if (cred) {
      console.log("Credential:", cred.name, "| Hours:", cred.totalCEUsCompleted + "/" + cred.totalCEUsRequired);
    }
  }

  process.exit();
});
