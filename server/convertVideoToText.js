/**
 * CounselorReady Video-to-Text Course Conversion Script
 * 
 * This script converts video-based courses to rich text-based courses.
 * Run with: node convertVideoToText.js
 * 
 * Options:
 *   --dry-run     Preview changes without saving
 *   --course-id   Convert specific course only
 *   --backup      Create backup before converting
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ============================================
// CONFIGURATION
// ============================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const BACKUP = args.includes('--backup');
const COURSE_ID_INDEX = args.indexOf('--course-id');
const SPECIFIC_COURSE_ID = COURSE_ID_INDEX !== -1 ? args[COURSE_ID_INDEX + 1] : null;

// ============================================
// COURSE CONTENT TEMPLATES
// ============================================

// Rich text content for each course topic
const courseContentTemplates = {
  // Ethics courses
  'ethics': {
    introduction: `
      <h2>Understanding Professional Ethics in Counseling</h2>
      <p>Ethics form the foundation of professional counseling practice. As mental health professionals, we are bound by ethical codes that protect our clients, guide our decision-making, and maintain the integrity of our profession.</p>
      <p>This course will explore the key ethical principles that govern counseling practice, including:</p>
      <ul>
        <li><strong>Autonomy</strong> - Respecting clients' right to self-determination</li>
        <li><strong>Beneficence</strong> - Acting in the best interest of clients</li>
        <li><strong>Nonmaleficence</strong> - Do no harm</li>
        <li><strong>Justice</strong> - Fair and equitable treatment</li>
        <li><strong>Fidelity</strong> - Honoring commitments and maintaining trust</li>
        <li><strong>Veracity</strong> - Being truthful and honest</li>
      </ul>
    `,
    boundaries: `
      <h2>Professional Boundaries in Counseling</h2>
      <p>Maintaining appropriate professional boundaries is essential for ethical practice. Boundaries protect both the client and the counselor, creating a safe therapeutic environment.</p>
      <h3>Types of Boundaries</h3>
      <p><strong>Physical Boundaries:</strong> Appropriate physical space, touch policies, and office arrangements.</p>
      <p><strong>Emotional Boundaries:</strong> Managing countertransference, avoiding over-involvement, and maintaining professional distance while remaining empathetic.</p>
      <p><strong>Time Boundaries:</strong> Session length, availability outside sessions, and emergency contact protocols.</p>
      <p><strong>Financial Boundaries:</strong> Clear fee structures, payment policies, and avoiding financial entanglements.</p>
      <h3>Warning Signs of Boundary Issues</h3>
      <ul>
        <li>Excessive self-disclosure by the counselor</li>
        <li>Meeting clients outside the office setting</li>
        <li>Accepting gifts beyond nominal value</li>
        <li>Engaging in dual relationships</li>
        <li>Special treatment for certain clients</li>
      </ul>
    `,
    confidentiality: `
      <h2>Confidentiality and Its Limits</h2>
      <p>Confidentiality is the cornerstone of the therapeutic relationship. Clients must feel safe to share their deepest concerns without fear of disclosure.</p>
      <h3>Exceptions to Confidentiality</h3>
      <p>While confidentiality is paramount, there are legal and ethical exceptions:</p>
      <ul>
        <li><strong>Duty to Warn/Protect:</strong> When a client poses an imminent threat to themselves or others</li>
        <li><strong>Child/Elder Abuse:</strong> Mandated reporting requirements</li>
        <li><strong>Court Orders:</strong> Valid subpoenas and legal proceedings</li>
        <li><strong>Client Consent:</strong> Written authorization for release of information</li>
        <li><strong>Consultation:</strong> Professional consultation with appropriate safeguards</li>
      </ul>
      <h3>HIPAA Considerations</h3>
      <p>The Health Insurance Portability and Accountability Act (HIPAA) provides federal protections for client health information. Counselors must understand both the Privacy Rule and Security Rule requirements.</p>
    `,
    decisionMaking: `
      <h2>Ethical Decision-Making Models</h2>
      <p>When facing ethical dilemmas, counselors need systematic approaches to navigate complex situations.</p>
      <h3>The STEPS Model</h3>
      <ol>
        <li><strong>S</strong>tate the problem clearly</li>
        <li><strong>T</strong>hink about who is involved and their perspectives</li>
        <li><strong>E</strong>valuate relevant ethical codes and laws</li>
        <li><strong>P</strong>lan and consider consequences of actions</li>
        <li><strong>S</strong>elect and implement the best course of action</li>
      </ol>
      <h3>Consulting Resources</h3>
      <p>When facing ethical dilemmas:</p>
      <ul>
        <li>Review your professional code of ethics (ACA, NBCC, state board)</li>
        <li>Consult with supervisors or colleagues</li>
        <li>Contact your professional liability insurance carrier</li>
        <li>Seek ethics consultation from professional organizations</li>
        <li>Document your decision-making process thoroughly</li>
      </ul>
    `
  },

  // Telehealth courses
  'telehealth': {
    introduction: `
      <h2>Introduction to Telehealth Counseling</h2>
      <p>Telehealth has transformed mental health service delivery, expanding access while presenting unique challenges and opportunities.</p>
      <h3>Benefits of Telehealth</h3>
      <ul>
        <li>Increased access for rural and underserved populations</li>
        <li>Reduced barriers related to transportation and mobility</li>
        <li>Flexibility in scheduling and service delivery</li>
        <li>Continuity of care during emergencies or relocations</li>
        <li>Comfort of receiving services from home</li>
      </ul>
      <h3>Considerations for Practice</h3>
      <p>Effective telehealth practice requires attention to technology, environment, clinical adaptation, and regulatory compliance. This course will prepare you to deliver high-quality telehealth services.</p>
    `,
    technology: `
      <h2>Technology Requirements and Best Practices</h2>
      <p>Successful telehealth practice depends on reliable, secure technology infrastructure.</p>
      <h3>Platform Requirements</h3>
      <ul>
        <li><strong>HIPAA Compliance:</strong> Business Associate Agreements (BAAs) must be in place</li>
        <li><strong>Encryption:</strong> End-to-end encryption for all communications</li>
        <li><strong>Access Controls:</strong> Unique logins, waiting rooms, session passwords</li>
        <li><strong>Documentation:</strong> Secure storage of session records</li>
      </ul>
      <h3>Technical Setup Checklist</h3>
      <ul>
        <li>Reliable high-speed internet connection (minimum 10 Mbps)</li>
        <li>Quality webcam and microphone</li>
        <li>Appropriate lighting (face clearly visible)</li>
        <li>Professional, private background</li>
        <li>Backup communication method (phone number)</li>
        <li>Technical support plan for connectivity issues</li>
      </ul>
    `,
    clinicalAdaptations: `
      <h2>Clinical Adaptations for Telehealth</h2>
      <p>Telehealth requires modifications to traditional counseling approaches while maintaining therapeutic effectiveness.</p>
      <h3>Building Rapport Virtually</h3>
      <p>Creating connection through a screen requires intentional effort:</p>
      <ul>
        <li>Make eye contact by looking at the camera, not the screen</li>
        <li>Use verbal affirmations more frequently</li>
        <li>Check in about the client's comfort with the format</li>
        <li>Address the "virtual elephant in the room"</li>
      </ul>
      <h3>Assessing Safety Remotely</h3>
      <p>Conduct thorough safety planning that includes:</p>
      <ul>
        <li>Client's physical location each session</li>
        <li>Local emergency contacts and resources</li>
        <li>Backup communication plans</li>
        <li>Crisis protocols specific to telehealth</li>
      </ul>
      <h3>Populations and Presenting Issues</h3>
      <p>Consider appropriateness of telehealth for specific clients, including those with severe mental illness, active suicidality, certain cognitive impairments, or technology access barriers.</p>
    `,
    legalEthical: `
      <h2>Legal and Ethical Considerations</h2>
      <p>Telehealth practice involves complex regulatory landscapes that vary by jurisdiction.</p>
      <h3>Licensure and Jurisdiction</h3>
      <p>Key considerations include:</p>
      <ul>
        <li>Practice is regulated by the client's location, not the counselor's</li>
        <li>Interstate compacts (like PSYPACT) may allow practice across state lines</li>
        <li>Verify requirements for each state where clients are located</li>
        <li>Maintain documentation of client location each session</li>
      </ul>
      <h3>Informed Consent for Telehealth</h3>
      <p>Telehealth-specific informed consent should address:</p>
      <ul>
        <li>Technology requirements and potential limitations</li>
        <li>Privacy and confidentiality in the digital environment</li>
        <li>Emergency procedures and local resources</li>
        <li>Fee structures including technology fees if applicable</li>
        <li>Policies for technical difficulties</li>
        <li>Alternatives to telehealth services</li>
      </ul>
    `
  },

  // Trauma courses
  'trauma': {
    introduction: `
      <h2>Understanding Trauma and Its Impact</h2>
      <p>Trauma is an emotional response to a deeply distressing or disturbing event that overwhelms an individual's ability to cope. Understanding trauma is essential for all mental health professionals.</p>
      <h3>Types of Trauma</h3>
      <ul>
        <li><strong>Acute Trauma:</strong> Single incident events (accidents, natural disasters, assault)</li>
        <li><strong>Chronic Trauma:</strong> Repeated, prolonged exposure (domestic violence, ongoing abuse)</li>
        <li><strong>Complex Trauma:</strong> Multiple traumatic events, often interpersonal and beginning early in life</li>
        <li><strong>Developmental Trauma:</strong> Adverse experiences during critical developmental periods</li>
        <li><strong>Intergenerational Trauma:</strong> Trauma transmitted across generations</li>
      </ul>
      <h3>Prevalence and Impact</h3>
      <p>Approximately 70% of adults have experienced at least one traumatic event. Trauma impacts not only mental health but physical health, relationships, and overall functioning.</p>
    `,
    neurobiology: `
      <h2>The Neurobiology of Trauma</h2>
      <p>Understanding how trauma affects the brain helps inform treatment approaches and explains common trauma responses.</p>
      <h3>The Brain's Stress Response System</h3>
      <p>When encountering a threat, the brain activates the fight-flight-freeze response through the HPA axis:</p>
      <ul>
        <li><strong>Amygdala:</strong> The alarm system - detects threats and triggers response</li>
        <li><strong>Hippocampus:</strong> Memory processing - can be impaired by chronic stress</li>
        <li><strong>Prefrontal Cortex:</strong> Executive function - often "offline" during trauma responses</li>
      </ul>
      <h3>Window of Tolerance</h3>
      <p>Dan Siegel's concept of the "window of tolerance" describes the optimal zone of arousal where we can function effectively. Trauma survivors often have narrowed windows, leading to:</p>
      <ul>
        <li><strong>Hyperarousal:</strong> Anxiety, hypervigilance, panic, rage</li>
        <li><strong>Hypoarousal:</strong> Numbness, dissociation, depression, shutdown</li>
      </ul>
    `,
    traumaInformed: `
      <h2>Trauma-Informed Care Principles</h2>
      <p>Trauma-informed care is an organizational framework that recognizes the widespread impact of trauma and integrates knowledge about trauma into policies, procedures, and practices.</p>
      <h3>SAMHSA's Six Key Principles</h3>
      <ol>
        <li><strong>Safety:</strong> Physical and psychological safety is established</li>
        <li><strong>Trustworthiness and Transparency:</strong> Operations and decisions are conducted with transparency</li>
        <li><strong>Peer Support:</strong> Mutual self-help is utilized</li>
        <li><strong>Collaboration and Mutuality:</strong> Importance of partnering and leveling power differences</li>
        <li><strong>Empowerment, Voice, and Choice:</strong> Client strengths are recognized and built upon</li>
        <li><strong>Cultural, Historical, and Gender Issues:</strong> Biases and stereotypes are addressed</li>
      </ol>
      <h3>Universal Precautions Approach</h3>
      <p>Assume all clients may have trauma histories and approach everyone with trauma-informed principles, regardless of presenting concerns.</p>
    `,
    treatment: `
      <h2>Evidence-Based Trauma Treatments</h2>
      <p>Several treatment modalities have strong research support for trauma and PTSD.</p>
      <h3>Cognitive Processing Therapy (CPT)</h3>
      <p>A structured, 12-session protocol that helps clients identify and challenge unhelpful beliefs related to their trauma, known as "stuck points."</p>
      <h3>Prolonged Exposure (PE)</h3>
      <p>Based on emotional processing theory, PE uses imaginal and in vivo exposure to help clients process traumatic memories and reduce avoidance behaviors.</p>
      <h3>EMDR (Eye Movement Desensitization and Reprocessing)</h3>
      <p>Uses bilateral stimulation while processing traumatic memories through an eight-phase protocol. Well-supported by research for single-incident trauma.</p>
      <h3>Phase-Based Treatment for Complex Trauma</h3>
      <ol>
        <li><strong>Phase 1: Stabilization</strong> - Safety, symptom management, building resources</li>
        <li><strong>Phase 2: Trauma Processing</strong> - Working through traumatic memories</li>
        <li><strong>Phase 3: Integration</strong> - Reconnection and meaning-making</li>
      </ol>
    `
  },

  // Supervision courses
  'supervision': {
    introduction: `
      <h2>Foundations of Clinical Supervision</h2>
      <p>Clinical supervision is a distinct professional practice requiring specialized knowledge and skills beyond clinical competence. Effective supervision protects clients, develops supervisees, and advances the profession.</p>
      <h3>Purposes of Supervision</h3>
      <ul>
        <li><strong>Educational:</strong> Developing supervisee knowledge and skills</li>
        <li><strong>Supportive:</strong> Providing emotional support and professional validation</li>
        <li><strong>Administrative:</strong> Ensuring quality care and organizational compliance</li>
        <li><strong>Evaluative:</strong> Assessing competence and gatekeeping</li>
      </ul>
      <h3>The Supervisory Relationship</h3>
      <p>Research consistently shows that the supervisory relationship is the most important factor in supervision effectiveness. Building a strong working alliance requires attention to safety, trust, and mutual respect.</p>
    `,
    models: `
      <h2>Models of Clinical Supervision</h2>
      <p>Understanding supervision models provides frameworks for conceptualizing and delivering effective supervision.</p>
      <h3>Developmental Models</h3>
      <p><strong>Integrated Developmental Model (IDM):</strong> Supervisees progress through levels from dependent to autonomous, requiring different supervisor interventions at each stage.</p>
      <h3>Discrimination Model</h3>
      <p>Supervisors take on three roles (teacher, counselor, consultant) across three focus areas (intervention, conceptualization, personalization) based on supervisee needs.</p>
      <h3>Competency-Based Supervision</h3>
      <p>Focuses on developing specific, measurable competencies aligned with professional standards. Includes clear benchmarks and assessment criteria.</p>
      <h3>Common Factors Model</h3>
      <p>Emphasizes elements common across effective supervision: the relationship, emotional bond, agreement on goals and tasks, and a framework for understanding.</p>
    `,
    legalEthical: `
      <h2>Legal and Ethical Issues in Supervision</h2>
      <p>Supervisors carry significant legal and ethical responsibilities that extend beyond their own practice.</p>
      <h3>Vicarious Liability</h3>
      <p>Supervisors may be held legally responsible for the actions of their supervisees. This includes:</p>
      <ul>
        <li>Direct liability for inadequate supervision</li>
        <li>Vicarious liability under respondeat superior</li>
        <li>Responsibility for supervisee credentialing verification</li>
      </ul>
      <h3>Informed Consent in Supervision</h3>
      <p>Both supervisees and their clients should receive informed consent addressing:</p>
      <ul>
        <li>Supervision structure, methods, and expectations</li>
        <li>Evaluation criteria and processes</li>
        <li>Limits of confidentiality in supervision</li>
        <li>Emergency and crisis protocols</li>
        <li>Documentation requirements</li>
      </ul>
      <h3>Dual Relationships and Boundaries</h3>
      <p>Supervisors must navigate power differentials and avoid boundary violations that could harm supervisees or compromise the supervision process.</p>
    `,
    multiculturalCompetence: `
      <h2>Multicultural Competence in Supervision</h2>
      <p>Culturally responsive supervision acknowledges the impact of culture on the supervisory relationship, clinical work, and professional development.</p>
      <h3>Addressing Culture in Supervision</h3>
      <ul>
        <li>Initiate discussions about culture early and often</li>
        <li>Explore cultural identities of supervisor, supervisee, and clients</li>
        <li>Examine power and privilege dynamics</li>
        <li>Address microaggressions and bias</li>
        <li>Model cultural humility and ongoing learning</li>
      </ul>
      <h3>Creating Safe Spaces for Difficult Conversations</h3>
      <p>Supervisors must create environments where supervisees can safely explore their biases, make mistakes, and grow in cultural competence without fear of judgment or professional consequences.</p>
      <h3>Broaching</h3>
      <p>Proactively introducing topics of culture, identity, and difference into supervision discussions rather than waiting for issues to arise.</p>
    `
  },

  // Default/generic content
  'default': {
    introduction: `
      <h2>Course Introduction</h2>
      <p>Welcome to this continuing education course. This program has been designed to enhance your professional knowledge and skills while meeting CE requirements.</p>
      <h3>Learning Objectives</h3>
      <p>By the end of this course, you will be able to:</p>
      <ul>
        <li>Understand key concepts and terminology</li>
        <li>Apply evidence-based practices</li>
        <li>Recognize ethical considerations</li>
        <li>Implement strategies in your professional practice</li>
      </ul>
    `,
    content: `
      <h2>Core Content</h2>
      <p>This section covers the essential material for this topic area. The content is designed to be practical and applicable to your daily practice.</p>
      <h3>Key Concepts</h3>
      <p>Understanding the foundational concepts allows you to build competence in this area. Take time to reflect on how these concepts apply to your specific practice setting.</p>
      <h3>Best Practices</h3>
      <p>Evidence-based practices guide our work and ensure we're providing the highest quality services to our clients. Stay current with emerging research and be willing to adapt your approaches as new evidence emerges.</p>
    `,
    application: `
      <h2>Clinical Application</h2>
      <p>Translating knowledge into practice is essential. Consider how you will implement what you've learned.</p>
      <h3>Case Considerations</h3>
      <p>When applying these concepts, consider:</p>
      <ul>
        <li>Client individual differences and preferences</li>
        <li>Cultural factors that may influence implementation</li>
        <li>Practical barriers and how to address them</li>
        <li>Collaboration with other professionals when indicated</li>
      </ul>
    `,
    summary: `
      <h2>Course Summary</h2>
      <p>This course has covered essential knowledge and skills for professional practice. Remember that continuing education is an ongoing process of growth and development.</p>
      <h3>Key Takeaways</h3>
      <ul>
        <li>Apply what you've learned in your practice</li>
        <li>Seek supervision or consultation when needed</li>
        <li>Stay current with emerging research and best practices</li>
        <li>Reflect on your own development and areas for growth</li>
      </ul>
      <h3>Resources</h3>
      <p>Continue your learning through professional organizations, peer consultation, and additional training opportunities.</p>
    `
  }
};

// ============================================
// MONGOOSE SCHEMA (flexible to match your existing)
// ============================================

const LessonSchema = new mongoose.Schema({
  title: String,
  type: { type: String, default: 'text' },
  content: String,
  videoUrl: String,
  duration: Number,
  order: Number
}, { strict: false });

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  ceHours: Number,
  price: Number,
  category: String,
  lessons: [LessonSchema],
  isActive: { type: Boolean, default: true },
  approvalBodies: [{ type: mongoose.Schema.Types.Mixed }]
}, { strict: false, timestamps: true });

const Course = mongoose.model('Course', CourseSchema);

// ============================================
// HELPER FUNCTIONS
// ============================================

function detectCourseCategory(title, description = '') {
  const combined = (title + ' ' + description).toLowerCase();
  
  if (combined.includes('ethic') || combined.includes('boundary') || combined.includes('confidential')) {
    return 'ethics';
  }
  if (combined.includes('telehealth') || combined.includes('teletherapy') || combined.includes('virtual')) {
    return 'telehealth';
  }
  if (combined.includes('trauma') || combined.includes('ptsd') || combined.includes('stress')) {
    return 'trauma';
  }
  if (combined.includes('supervision') || combined.includes('supervisor')) {
    return 'supervision';
  }
  return 'default';
}

function generateLessonContent(lessonTitle, courseCategory, lessonIndex, totalLessons) {
  const templates = courseContentTemplates[courseCategory] || courseContentTemplates['default'];
  const keys = Object.keys(templates);
  
  // Map lesson position to content type
  if (lessonIndex === 0) {
    return templates.introduction || templates[keys[0]];
  }
  if (lessonIndex === totalLessons - 1) {
    return templates.summary || templates[keys[keys.length - 1]];
  }
  
  // Use lesson title keywords to select content
  const titleLower = lessonTitle.toLowerCase();
  
  if (titleLower.includes('boundar')) return templates.boundaries || templates.content;
  if (titleLower.includes('confiden')) return templates.confidentiality || templates.content;
  if (titleLower.includes('decision')) return templates.decisionMaking || templates.content;
  if (titleLower.includes('tech')) return templates.technology || templates.content;
  if (titleLower.includes('clinical') || titleLower.includes('adapt')) return templates.clinicalAdaptations || templates.application;
  if (titleLower.includes('legal') || titleLower.includes('ethical')) return templates.legalEthical || templates.content;
  if (titleLower.includes('neuro') || titleLower.includes('brain')) return templates.neurobiology || templates.content;
  if (titleLower.includes('inform') && titleLower.includes('care')) return templates.traumaInformed || templates.content;
  if (titleLower.includes('treat') || titleLower.includes('intervention')) return templates.treatment || templates.application;
  if (titleLower.includes('model')) return templates.models || templates.content;
  if (titleLower.includes('multicultural') || titleLower.includes('cultur')) return templates.multiculturalCompetence || templates.content;
  
  // Cycle through remaining content types
  const contentIndex = (lessonIndex - 1) % (keys.length - 1) + 1;
  return templates[keys[contentIndex]] || templates.content || templates[keys[0]];
}

function convertLesson(lesson, courseCategory, lessonIndex, totalLessons) {
  // Skip if already text-based with substantial content
  if (lesson.type === 'text' && lesson.content && lesson.content.length > 500) {
    console.log(`    ✓ Lesson "${lesson.title}" already has text content, skipping`);
    return null; // No changes needed
  }
  
  // Check if it's a video lesson that needs conversion
  const isVideoLesson = lesson.type === 'video' || lesson.videoUrl;
  
  if (!isVideoLesson && lesson.type === 'text' && (!lesson.content || lesson.content.length < 100)) {
    // Minimal text content - enhance it
    console.log(`    → Enhancing minimal content for "${lesson.title}"`);
  } else if (isVideoLesson) {
    console.log(`    → Converting video lesson "${lesson.title}" to text`);
  } else {
    console.log(`    ✓ Lesson "${lesson.title}" okay, skipping`);
    return null;
  }
  
  const newContent = generateLessonContent(lesson.title, courseCategory, lessonIndex, totalLessons);
  
  return {
    ...lesson.toObject ? lesson.toObject() : lesson,
    type: 'text',
    content: newContent,
    videoUrl: undefined, // Remove video URL
    duration: Math.ceil(newContent.length / 1500) * 5 // Estimate reading time in minutes
  };
}

// ============================================
// MAIN CONVERSION FUNCTION
// ============================================

async function convertCourses() {
  console.log('\n========================================');
  console.log('CounselorReady Video-to-Text Converter');
  console.log('========================================\n');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be saved\n');
  }
  
  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected successfully\n');
    
    // Find courses to convert
    let query = {};
    if (SPECIFIC_COURSE_ID) {
      query._id = SPECIFIC_COURSE_ID;
      console.log(`Looking for specific course: ${SPECIFIC_COURSE_ID}\n`);
    }
    
    const courses = await Course.find(query);
    console.log(`Found ${courses.length} course(s) to process\n`);
    
    if (courses.length === 0) {
      console.log('No courses found. Exiting.');
      return;
    }
    
    // Create backup if requested
    if (BACKUP && !DRY_RUN) {
      console.log('Creating backup...');
      const backupData = JSON.stringify(courses, null, 2);
      const fs = require('fs');
      const backupPath = `./course_backup_${Date.now()}.json`;
      fs.writeFileSync(backupPath, backupData);
      console.log(`✓ Backup saved to ${backupPath}\n`);
    }
    
    // Process each course
    let totalConverted = 0;
    let totalLessonsConverted = 0;
    
    for (const course of courses) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📚 ${course.title}`);
      console.log(`   ID: ${course._id}`);
      console.log(`   Lessons: ${course.lessons?.length || 0}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
      if (!course.lessons || course.lessons.length === 0) {
        console.log('   ⚠ No lessons found, skipping\n');
        continue;
      }
      
      const courseCategory = detectCourseCategory(course.title, course.description);
      console.log(`   Detected category: ${courseCategory}\n`);
      
      let courseModified = false;
      const updatedLessons = [];
      
      for (let i = 0; i < course.lessons.length; i++) {
        const lesson = course.lessons[i];
        const convertedLesson = convertLesson(lesson, courseCategory, i, course.lessons.length);
        
        if (convertedLesson) {
          updatedLessons.push(convertedLesson);
          totalLessonsConverted++;
          courseModified = true;
        } else {
          updatedLessons.push(lesson.toObject ? lesson.toObject() : lesson);
        }
      }
      
      if (courseModified) {
        totalConverted++;
        
        if (!DRY_RUN) {
          course.lessons = updatedLessons;
          await course.save();
          console.log(`\n   ✓ Course saved successfully`);
        } else {
          console.log(`\n   [DRY RUN] Would save ${updatedLessons.filter((l, i) => 
            l.content !== course.lessons[i]?.content).length} lesson changes`);
        }
      } else {
        console.log(`\n   ✓ No changes needed for this course`);
      }
    }
    
    // Summary
    console.log('\n\n========================================');
    console.log('CONVERSION SUMMARY');
    console.log('========================================');
    console.log(`Courses processed: ${courses.length}`);
    console.log(`Courses modified: ${totalConverted}`);
    console.log(`Lessons converted: ${totalLessonsConverted}`);
    if (DRY_RUN) {
      console.log('\n⚠ DRY RUN - No changes were saved');
      console.log('  Run without --dry-run to apply changes');
    }
    console.log('========================================\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

// ============================================
// RUN THE SCRIPT
// ============================================

convertCourses();
