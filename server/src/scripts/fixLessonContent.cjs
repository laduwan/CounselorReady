// fixLessonContent.cjs
// Updates lessons with headers and engagement elements using native MongoDB
// Run: node src/scripts/fixLessonContent.cjs

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const R2_BASE = 'https://pub-43240822204b488d9038a7250ae71473.r2.dev/course-headers/headers';

// Lesson content updates - simplified for reliability
const lessonUpdates = {
  "Georgia Rule 135 Overview": {
    header: `${R2_BASE}/rule135-header.png`,
    funFact: "Georgia was among the first states to create specific telehealth rules for counselors, with Rule 135-11-.01 establishing comprehensive standards that many other states have since used as a model.",
    keyTakeaway: "Rule 135 requires informed consent, emergency protocols, and verification of client identity and location before each telehealth session."
  },
  "Clinical Appropriateness Screening for Telehealth": {
    header: `${R2_BASE}/appropriateness-header.png`,
    funFact: "Research shows that 70-80% of clients who initially seem inappropriate for telehealth can be successfully treated virtually with proper accommodations and enhanced protocols.",
    keyTakeaway: "Screen across three domains: technology access, clinical presentation, and environmental safety."
  },
  "Ethical Decision Making in Telehealth": {
    header: `${R2_BASE}/ethics-header.png`,
    funFact: "The ACA Code of Ethics was updated in 2014 specifically to address technology-assisted services, making it one of the first professional codes to formally recognize telehealth practice.",
    keyTakeaway: "Apply the same ethical principles to telehealth as in-person care, with additional attention to technology-specific considerations."
  },
  "Platform Comparison and Setup": {
    header: `${R2_BASE}/platform-header.png`,
    funFact: "A signed Business Associate Agreement (BAA) is the single most important document for HIPAA compliance - without it, even a 'HIPAA-compliant' platform leaves you legally exposed.",
    keyTakeaway: "Choose platforms based on BAA availability, encryption standards, and reliability - not just features or price."
  },
  "Crisis Protocols for Telehealth Practice": {
    header: `${R2_BASE}/crisis-header.png`,
    funFact: "Studies show that telehealth crisis interventions can be just as effective as in-person interventions when proper protocols are in place, with some clients feeling more comfortable disclosing suicidal thoughts remotely.",
    keyTakeaway: "Always verify client location, have emergency contacts ready, and never end a session during an active crisis."
  },
  "Culturally Responsive Telehealth Practice": {
    header: `${R2_BASE}/cultural-header.png`,
    funFact: "Telehealth has increased access to culturally-matched therapists by 300% in rural areas, as clients can now connect with providers who share their background regardless of geography.",
    keyTakeaway: "Consider how technology access, privacy norms, and communication styles vary across cultures."
  },
  "Building a Sustainable Telehealth Practice": {
    header: `${R2_BASE}/sustainable-header.png`,
    funFact: "Therapists who implement structured boundaries around telehealth report 40% less burnout than those who allow unlimited flexibility, proving that sustainability requires intentional limits.",
    keyTakeaway: "Build sustainability through clear boundaries, ergonomic setup, and regular self-assessment."
  },
  "The Billing Cycle and Revenue Management": {
    header: `${R2_BASE}/billing-cycle-header.png`,
    funFact: "The average mental health claim is touched 3-5 times before payment due to errors and resubmissions. Clean claim practices can reduce this to a single touch.",
    keyTakeaway: "Master the 7-step billing cycle: verify eligibility, provide service, document, code, submit, post payment, follow up."
  },
  "Provider Credentialing Process": {
    header: `${R2_BASE}/credentialing-header.png`,
    funFact: "CAQH ProView stores your credentialing information and shares it with over 1.4 million providers and 900+ health plans, making it the single most important credentialing tool to maintain.",
    keyTakeaway: "Start credentialing 6 months before seeing insured clients; re-attest CAQH every 120 days."
  },
  "ICD-10 Diagnostic Coding": {
    header: `${R2_BASE}/icd10-header.png`,
    funFact: "ICD-10 contains over 70,000 diagnosis codes compared to ICD-9's 14,000. Mental health uses about 300 regularly, but specificity matters for reimbursement.",
    keyTakeaway: "Use the most specific code possible - avoid .9 (unspecified) codes when a more specific diagnosis is documented."
  },
  "Clearinghouse Operations and Workflows": {
    header: `${R2_BASE}/clearinghouse-header.png`,
    funFact: "Claims submitted through clearinghouses have a 30% higher first-pass acceptance rate than direct submissions due to pre-submission scrubbing and validation.",
    keyTakeaway: "Clearinghouses validate claims before submission, translate formats, and provide tracking - worth the small per-claim fee."
  },
  "Audit Preparation and Response": {
    header: `${R2_BASE}/audit-header.png`,
    funFact: "Over 90% of audit findings are related to documentation deficiencies rather than actual fraud. Good documentation is your best defense.",
    keyTakeaway: "Document in real-time, never alter records retroactively, and conduct quarterly self-audits."
  },
  "Managing Copays, Deductibles, and Self-Pay": {
    header: `${R2_BASE}/copays-header.png`,
    funFact: "Practices that collect copays at time of service have 95% collection rates, while those that bill later collect only 60-70%.",
    keyTakeaway: "Verify benefits before first session, collect copays at time of service, and use sliding scales thoughtfully."
  },
  "Case Study: Complete Existential Session": {
    header: `${R2_BASE}/existential-header.png`,
    funFact: "Irvin Yalom, the father of existential psychotherapy, conducted therapy into his 90s, demonstrating that confronting mortality can be life-affirming rather than depressing.",
    keyTakeaway: "Existential therapy addresses four ultimate concerns: death, freedom, isolation, and meaninglessness."
  }
};

function buildEnhancedContent(originalContent, updates) {
  const { header, funFact, keyTakeaway } = updates;
  
  // Header image
  const headerHTML = `<img src="${header}" alt="Lesson Header" style="width:100%; border-radius:12px; margin-bottom:25px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />`;
  
  // Fun fact box
  const funFactHTML = `
<div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B; border-radius: 8px; padding: 20px; margin: 25px 0;">
  <p style="margin: 0; font-weight: 600; color: #92400E;">💡 Did You Know?</p>
  <p style="margin: 10px 0 0 0; color: #78350F;">${funFact}</p>
</div>`;

  // Key takeaway box
  const takeawayHTML = `
<div style="background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border-left: 4px solid #10B981; border-radius: 8px; padding: 20px; margin: 25px 0;">
  <p style="margin: 0; font-weight: 600; color: #065F46;">🔑 Key Takeaway</p>
  <p style="margin: 10px 0 0 0; color: #047857;">${keyTakeaway}</p>
</div>`;

  // Build enhanced content
  return headerHTML + originalContent + funFactHTML + takeawayHTML;
}

async function updateLessons() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!\n');
  
  const db = mongoose.connection.db;
  const coursesCollection = db.collection('courses');
  
  const courses = await coursesCollection.find({}).toArray();
  let totalUpdated = 0;
  
  for (const course of courses) {
    console.log(`\n📚 ${course.title}`);
    let courseModified = false;
    
    if (!course.modules) continue;
    
    for (let m = 0; m < course.modules.length; m++) {
      const module = course.modules[m];
      if (!module.lessons) continue;
      
      for (let l = 0; l < module.lessons.length; l++) {
        const lesson = module.lessons[l];
        const updates = lessonUpdates[lesson.title];
        
        if (updates && lesson.content) {
          // Skip if already has header
          if (lesson.content.includes('r2.dev') || lesson.content.includes('Did You Know')) {
            console.log(`   ⏭️ Already updated: ${lesson.title}`);
            continue;
          }
          
          // Build new content
          const newContent = buildEnhancedContent(lesson.content, updates);
          
          // Update using native MongoDB
          const updatePath = `modules.${m}.lessons.${l}.content`;
          await coursesCollection.updateOne(
            { _id: course._id },
            { $set: { [updatePath]: newContent } }
          );
          
          totalUpdated++;
          courseModified = true;
          console.log(`   ✅ Updated: ${lesson.title}`);
        }
      }
    }
    
    if (courseModified) {
      console.log(`   💾 Saved changes to: ${course.title}`);
    }
  }
  
  console.log('\n========================================');
  console.log(`✅ Total lessons updated: ${totalUpdated}`);
  console.log('========================================\n');
  
  await mongoose.disconnect();
}

updateLessons()
  .then(() => {
    console.log('Complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
