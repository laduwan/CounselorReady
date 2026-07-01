/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
"// Save as: src/scripts/fullCourseAudit.js
// Run: node src/scripts/fullCourseAudit.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function audit() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  console.log('\n=== COURSES COLLECTION ===');
  const courses = await db.collection('courses').find({}).toArray();
  console.log(`Total: ${courses.length}\n`);
  
  courses.sort((a,b) => (b.ceHours || 0) - (a.ceHours || 0));
  courses.forEach((c, i) => {
    const mods = (c.modules || []).length;
    let words = 0;
    (c.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        if (l.content) words += l.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(w=>w).length;
      });
    });
    const status = c.isPublished ? 'PUB' : 'DRAFT';
    const hrs = c.ceHours || c.ceuHours || 0;
    console.log(`${(i+1).toString().padStart(2)}. [${status}] ${hrs}CE | ${mods} mods | ${words.toLocaleString()} words | ${(c.title||'Untitled').substring(0,60)}`);
  });
  
  console.log('\n=== INTERACTIVE COURSES ===');
  const interactive = await db.collection('interactivecourses').find({}).toArray();
  console.log(`Total: ${interactive.length}\n`);
  
  interactive.forEach((c, i) => {
    const secs = (c.sections || []).length;
    let blocks = 0;
    (c.sections || []).forEach(s => { blocks += (s.contentBlocks || []).length; });
    const status = c.isPublished ? 'PUB' : 'DRAFT';
    const hrs = c.ceHours || c.ceuHours || 0;
    console.log(`${(i+1).toString().padStart(2)}. [${status}] ${hrs}CE | ${secs} secs | ${blocks} blocks | ${(c.title||'Untitled').substring(0,60)}`);
  });
  
  console.log('\n=== SUMMARY ===');
  console.log(`Regular courses: ${courses.length}`);
  console.log(`Interactive courses: ${interactive.length}`);
  console.log(`Total DB entries: ${courses.length + interactive.length}`);
  
  const pubCourses = courses.filter(c => c.isPublished).length;
  const pubInteractive = interactive.filter(c => c.isPublished).length;
  console.log(`Published: ${pubCourses + pubInteractive}`);
  console.log(`Drafts: ${courses.length + interactive.length - pubCourses - pubInteractive}`);
  
  const totalCE = [...courses, ...interactive].reduce((s,c) => s + (c.ceHours || c.ceuHours || 0), 0);
  console.log(`Total CE hours (all): ${totalCE}`);
  
  await mongoose.disconnect();
}

audit().catch(console.error);"	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
