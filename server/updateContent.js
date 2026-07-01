require('dotenv').config();
const mongoose = require('mongoose');

async function updateContent() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const Course = (await import('./src/models/Course.js')).default;
  
  // Update Clinical Documentation
  await Course.updateOne(
    { slug: 'clinical-documentation' },
    { $set: {
      'modules.0.lessons.0.type': 'text',
      'modules.0.lessons.0.content': '<h2>Clinical Documentation Essentials</h2><p>Clinical documentation is critical for legal protection, continuity of care, insurance reimbursement, and quality care.</p><h3>Key Purposes</h3><ul><li><strong>Legal Protection:</strong> Your notes are legal documents</li><li><strong>Continuity:</strong> Enables seamless care transitions</li><li><strong>Reimbursement:</strong> Proves medical necessity</li><li><strong>Quality:</strong> Helps track patterns and progress</li></ul><h3>Common Mistakes</h3><ul><li>Too vague or too detailed</li><li>Missing key elements</li><li>Inconsistent formatting</li><li>Delayed documentation</li></ul><p>This course teaches you to write clear, concise notes that meet insurance requirements while protecting you legally.</p>'
    }}
  );
  console.log('✓ Updated Clinical Documentation');
  
  // Update Ethics - Lesson 1
  await Course.updateOne(
    { slug: 'ethics-in-telehealth' },
    { $set: {
      'modules.0.lessons.0.type': 'text',
      'modules.0.lessons.0.content': '<h2>Welcome to Ethics in Telehealth</h2><p>This 3-hour course covers essential ethical practices for online counseling.</p><h3>Course Modules</h3><h4>Module 1: Introduction</h4><ul><li>HIPAA compliance</li><li>Technology requirements</li><li>Platform selection</li></ul><h4>Module 2: Consent & Boundaries</h4><ul><li>Telehealth informed consent</li><li>Documentation requirements</li><li>Maintaining boundaries</li></ul><h4>Module 3: Emergency Protocols</h4><ul><li>Safety planning</li><li>Crisis assessment remotely</li><li>Emergency coordination</li></ul><h3>CE Credit</h3><p><strong>3 hours Ethics CE</strong> | NBCC Provider #7760 | Pass quiz at 80%</p>'
    }}
  );
  console.log('✓ Updated Ethics - Lesson 1');
  
  // Update Ethics - Lesson 2
  await Course.updateOne(
    { slug: 'ethics-in-telehealth' },
    { $set: {
      'modules.0.lessons.1.type': 'text',
      'modules.0.lessons.1.content': '<h2>HIPAA in Telehealth</h2><p>HIPAA applies to virtual sessions just like in-person care.</p><h3>Key Requirements</h3><h4>Platform Must Have:</h4><ul><li>End-to-end encryption</li><li>Business Associate Agreement (BAA)</li><li>No unauthorized recording</li><li>Adequate security controls</li></ul><p><strong>NOT Compliant:</strong> Skype, FaceTime, regular Zoom<br><strong>CAN Be Compliant:</strong> Zoom Healthcare, Doxy.me, SimplePractice (with BAA)</p><h3>Your Environment</h3><ul><li>Private room with locked door</li><li>Headphones for privacy</li><li>Screen not visible to others</li><li>Secure internet connection</li></ul><h3>Client Environment</h3><p>Discuss with clients:</p><ul><li>Finding private location</li><li>Using headphones</li><li>Avoiding public Wi-Fi</li><li>Device security</li></ul><h3>Required BAAs</h3><p>Get signed agreements from:</p><ul><li>Video platform</li><li>EHR system</li><li>Email service</li><li>Cloud storage</li></ul>'
    }}
  );
  console.log('✓ Updated Ethics - Lesson 2');
  
  console.log('\n✅ All courses updated successfully!');
  process.exit(0);
}

updateContent().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
