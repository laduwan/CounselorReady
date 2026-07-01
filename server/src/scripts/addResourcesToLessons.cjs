// addResourcesToLessons.cjs
// Run: node src/scripts/addResourcesToLessons.cjs

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model('Course', courseSchema);

const R2_BASE = 'https://pub-43240822204b488d9038a7250ae71473.r2.dev/resources';

function createResourceBox(resources) {
  let links = '';
  for (const r of resources) {
    links += '<li style="margin-bottom:10px;">';
    links += '<a href="' + R2_BASE + '/' + r.file + '" target="_blank" style="color:#2B6CB0; text-decoration:none; font-weight:500;">';
    links += '📄 ' + r.title + '</a>';
    links += '<span style="color:#718096; font-size:13px; display:block; margin-top:2px;">' + r.description + '</span>';
    links += '</li>';
  }

  return '<div style="background:linear-gradient(135deg, #EBF8FF 0%, #E6FFFA 100%); border:2px solid #319795; border-radius:12px; padding:25px; margin:35px 0;">' +
    '<h4 style="margin:0 0 15px 0; color:#234E52; font-size:16px;">📥 Downloadable Resources</h4>' +
    '<p style="color:#4A5568; font-size:14px; margin-bottom:15px;">Practical tools to implement what you have learned:</p>' +
    '<ul style="list-style:none; padding:0; margin:0;">' + links + '</ul></div>';
}

const lessonResources = {
  "Crisis Protocols for Telehealth Practice": [
    {
      title: "Crisis Quick Reference Card",
      file: "crisis-quick-reference-card.pdf",
      description: "Fill-in template with client info, emergency contacts, and risk level response guide"
    }
  ],
  
  "Georgia Rule 135 Overview": [
    {
      title: "Telehealth Setup Checklist",
      file: "telehealth-setup-checklist.pdf",
      description: "Complete compliance, technology, and environment preparation guide"
    }
  ],
  
  "Clinical Appropriateness Screening for Telehealth": [
    {
      title: "Clinical Appropriateness Screening Form",
      file: "telehealth-screening-form.pdf",
      description: "Three-domain assessment for telehealth suitability"
    }
  ],
  
  "Building a Sustainable Telehealth Practice": [
    {
      title: "Telehealth Setup Checklist",
      file: "telehealth-setup-checklist.pdf",
      description: "Complete compliance, technology, and environment preparation guide"
    },
    {
      title: "Crisis Quick Reference Card",
      file: "crisis-quick-reference-card.pdf",
      description: "Keep visible during all telehealth sessions"
    },
    {
      title: "Clinical Screening Form",
      file: "telehealth-screening-form.pdf",
      description: "Appropriateness assessment for intake"
    }
  ],
  
  "Provider Credentialing Process": [
    {
      title: "Credentialing Checklist",
      file: "credentialing-checklist.pdf",
      description: "Track prerequisites, CAQH setup, and payer applications"
    }
  ],
  
  "The Billing Cycle and Revenue Management": [
    {
      title: "Insurance Verification Form",
      file: "insurance-verification-form.pdf",
      description: "Complete benefit verification template"
    }
  ],
  
  "Audit Preparation and Response": [
    {
      title: "Audit Preparation Checklist",
      file: "audit-preparation-checklist.pdf",
      description: "Daily standards, quarterly audit guide, and response protocol"
    }
  ],
  
  "Managing Copays, Deductibles, and Self-Pay": [
    {
      title: "Insurance Verification Form",
      file: "insurance-verification-form.pdf",
      description: "Document benefits, cost-sharing, and client responsibility"
    }
  ],
  
  "Case Study: Complete Existential Session": [
    {
      title: "Four Ultimate Concerns Worksheet",
      file: "four-ultimate-concerns-worksheet.pdf",
      description: "Client reflection guide exploring death, freedom, isolation, and meaning"
    }
  ]
};

async function addResources() {
  console.log('Adding downloadable resources to lessons...\n');
  
  let updatedCount = 0;

  const courses = await Course.find({});
  
  for (const course of courses) {
    console.log('\nProcessing: ' + course.title);
    
    let courseModified = false;
    
    if (!course.modules) continue;
    
    for (let m = 0; m < course.modules.length; m++) {
      if (!course.modules[m].lessons) continue;
      
      for (let l = 0; l < course.modules[m].lessons.length; l++) {
        const lesson = course.modules[m].lessons[l];
        const resources = lessonResources[lesson.title];
        
        if (resources && lesson.content) {
          if (lesson.content.includes('Downloadable Resources')) {
            console.log('  Skipped (already has resources): ' + lesson.title);
            continue;
          }
          
          const resourceBox = createResourceBox(resources);
          course.modules[m].lessons[l].content = lesson.content + resourceBox;
          
          courseModified = true;
          updatedCount++;
          console.log('  Added resources: ' + lesson.title);
        }
      }
    }
    
    if (courseModified) {
      await course.save();
      console.log('  Saved: ' + course.title);
    }
  }

  console.log('\n========================================');
  console.log('RESOURCE UPDATE SUMMARY');
  console.log('Updated: ' + updatedCount + ' lessons');
  console.log('========================================\n');
}

addResources()
  .then(() => {
    console.log('Complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });
