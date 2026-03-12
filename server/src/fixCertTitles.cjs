const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const certs = await db.collection("certificates").find({batchId: "MIG-20260312-001"}).toArray();
  let updated = 0;
  for (const cert of certs) {
    let title = null;
    if (cert.course) {
      const ic = await db.collection("interactivecourses").findOne({_id: cert.course});
      if (ic) title = ic.title;
    }
    if (title === null && cert.ceLog) {
      const celog = await db.collection("celogs").findOne({_id: cert.ceLog});
      if (celog) title = celog.title;
    }
    if (title) {
      await db.collection("certificates").updateOne({_id: cert._id}, {$set: {courseTitle: title}});
      updated++;
    }
  }
  console.log("Updated " + updated + " certs with courseTitle");
  process.exit();
});
