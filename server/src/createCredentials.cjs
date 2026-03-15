const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const tid = new mongoose.Types.ObjectId("694d3d2b6ef160f2435a470b");
  const t = await db.collection("credentialtemplates").findOne({_id: tid});
  console.log("Template:", t.name, t.state, t.totalCEUsRequired);

  const celogs = await db.collection("celogs").find({"migration.batchId": "MIG-20260312-001"}).toArray();
  const byUser = {};
  for (const l of celogs) {
    const u = l.user.toString();
    if (byUser[u] === undefined) byUser[u] = [];
    byUser[u].push(l);
  }

  let created = 0;
  for (const [uid, logs] of Object.entries(byUser)) {
    const oid = new mongoose.Types.ObjectId(uid);
    const ex = await db.collection("usercredentials").findOne({userId: oid, templateId: tid});
    if (ex) continue;

    const certs = await db.collection("certificates").find({user: oid, batchId: "MIG-20260312-001"}).toArray();
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

    const total = ceuLogs.reduce(function(s, l) { return s + l.hours; }, 0);

    const reqs = (t.requirements || []).map(function(r) {
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
      userId: oid,
      templateId: tid,
      name: t.name,
      shortName: "GA LPC",
      state: "Georgia",
      licenseNumber: "",
      issuingBody: t.issuingBody || "Georgia Composite Board",
      expirationDate: null,
      renewalCycle: t.renewalCycle || 24,
      totalCEUsRequired: t.totalCEUsRequired || 35,
      totalCEUsCompleted: total,
      requirements: reqs,
      ceuLogs: ceuLogs,
      isActive: true,
      migration: {source: "talentlms", batchId: "MIG-20260312-001", importedAt: new Date()},
      createdAt: new Date(),
      updatedAt: new Date()
    });
    created++;
  }

  console.log("Created " + created + " GA LPC credentials");

  // Verify Ryan
  const ryan = await db.collection("users").findOne({email: /snider/i});
  if (ryan) {
    const cred = await db.collection("usercredentials").findOne({userId: ryan._id, templateId: tid});
    if (cred) {
      console.log("Ryan: " + cred.totalCEUsCompleted + "/" + cred.totalCEUsRequired + " CE hours | " + cred.ceuLogs.length + " logs");
    }
  }

  process.exit();
});
