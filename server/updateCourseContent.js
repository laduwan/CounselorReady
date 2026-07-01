import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './src/models/Course.js';

dotenv.config();

async function updateCourseContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Clinical Documentation course
    const docCourse = await Course.findOne({ slug: 'clinical-documentation' });
    if (docCourse) {
      docCourse.modules[0].lessons[0] = {
        title: 'Why Documentation Matters',
        type: 'text',
        content: `
          <h2>The Importance of Clinical Documentation</h2>
          <p>Clinical documentation is one of the most critical skills for mental health professionals. Quality documentation serves multiple essential purposes:</p>
          
          <h3>1. Legal Protection</h3>
          <p>Your clinical notes are legal documents that protect both you and your clients. In the event of a complaint, lawsuit, or audit, your documentation demonstrates that you:</p>
          <ul>
            <li>Provided appropriate assessment and treatment</li>
            <li>Followed professional standards of care</li>
            <li>Made informed clinical decisions</li>
            <li>Obtained proper informed consent</li>
          </ul>
          
          <h3>2. Continuity of Care</h3>
          <p>Good documentation ensures seamless care whether you're sick, on vacation, or a client transfers to another provider. Your notes should contain enough detail that another qualified professional could understand:</p>
          <ul>
            <li>The client's presenting problems and history</li>
            <li>Current treatment goals and interventions</li>
            <li>Progress toward goals</li>
            <li>Safety concerns and risk factors</li>
          </ul>
          
          <h3>3. Insurance Reimbursement</h3>
          <p>Insurance companies require documentation that demonstrates medical necessity for treatment. Without proper documentation, claims may be denied or require repayment. Your notes must show:</p>
          <ul>
            <li>Clear diagnosis based on DSM-5 criteria</li>
            <li>Functional impairment from symptoms</li>
            <li>Measurable treatment goals</li>
            <li>Evidence-based interventions</li>
            <li>Progress or lack thereof</li>
          </ul>
          
          <h3>4. Quality Care</h3>
          <p>The process of documenting sessions helps you:</p>
          <ul>
            <li>Organize your clinical thinking</li>
            <li>Track patterns over time</li>
            <li>Monitor treatment effectiveness</li>
            <li>Make informed treatment decisions</li>
          </ul>
          
          <h3>Common Documentation Mistakes</h3>
          <p>Many clinicians struggle with documentation. Common errors include:</p>
          <ul>
            <li><strong>Too vague:</strong> "Client discussed feelings" doesn't demonstrate medical necessity</li>
            <li><strong>Too detailed:</strong> Word-for-word transcripts are time-consuming and unnecessary</li>
            <li><strong>Missing key elements:</strong> Forgetting to document risk assessment or treatment plan</li>
            <li><strong>Inconsistent:</strong> Notes vary wildly in format and detail</li>
            <li><strong>Delayed:</strong> Completing notes weeks after sessions</li>
          </ul>
          
          <h3>The Goal of This Course</h3>
          <p>By the end of this course, you will:</p>
          <ul>
            <li>Understand what insurers mean by "medical necessity"</li>
            <li>Write clear, concise progress notes</li>
            <li>Document functional impairment effectively</li>
            <li>Use efficient note formats (SOAP, DAP, BIRP)</li>
            <li>Protect yourself legally while saving time</li>
          </ul>
          
          <p><strong>Ready to improve your documentation skills? Let's get started!</strong></p>
        `,
        duration: 15,
        order: 1,
        isFree: true
      };
      
      await docCourse.save();
      console.log('✅ Updated Clinical Documentation course');
    }

    // Update Ethics in Telehealth course
    const ethicsCourse = await Course.findOne({ slug: 'ethics-in-telehealth' });
    if (ethicsCourse) {
      ethicsCourse.modules[0].lessons[0] = {
        title: 'Welcome & Overview',
        type: 'text',
        content: `
          <h2>Welcome to Ethics in Telehealth Practice</h2>
          <p>Welcome to this comprehensive course on ethical practice in telehealth counseling. Whether you're new to virtual therapy or looking to strengthen your telehealth skills, this course will provide you with the knowledge and tools to practice ethically and effectively online.</p>
          
          <h3>Why This Course Matters</h3>
          <p>Telehealth has transformed mental health care delivery, offering unprecedented access to services. However, it also presents unique ethical challenges that traditional in-person practice doesn't face. As a licensed professional, you need to understand these challenges and how to navigate them.</p>
          
          <h3>What You'll Learn</h3>
          <p>This 3-hour course covers all essential aspects of telehealth ethics:</p>
          
          <h4>Module 1: Introduction to Telehealth Ethics</h4>
          <ul>
            <li>Overview of telehealth in mental health</li>
            <li>HIPAA compliance for virtual sessions</li>
            <li>Technology requirements and platform selection</li>
            <li>Setting up a secure virtual office</li>
          </ul>
          
          <h4>Module 2: Informed Consent & Boundaries</h4>
          <ul>
            <li>Elements of telehealth informed consent</li>
            <li>Documentation requirements</li>
            <li>Maintaining therapeutic boundaries virtually</li>
            <li>Managing dual relationships online</li>
          </ul>
          
          <h4>Module 3: Emergency Protocols & Crisis Management</h4>
          <ul>
            <li>Creating safety plans for virtual clients</li>
            <li>Crisis assessment and intervention remotely</li>
            <li>Coordinating with local emergency services</li>
            <li>Documentation of crisis situations</li>
          </ul>
          
          <h3>Course Format</h3>
          <p>This course includes:</p>
          <ul>
            <li><strong>Text-based lessons</strong> that you can read at your own pace</li>
            <li><strong>Real-world examples</strong> and case scenarios</li>
            <li><strong>Practical templates</strong> and checklists</li>
            <li><strong>Knowledge checks</strong> to reinforce learning</li>
          </ul>
          
          <h3>CE Credit Information</h3>
          <p><strong>Credit Hours:</strong> 3 hours of Ethics CE credit<br>
          <strong>NBCC Approved:</strong> Course Provider #7760<br>
          <strong>Requirements:</strong> Complete all lessons and pass the final quiz with 80% or higher</p>
          
          <h3>About Your Instructor</h3>
          <p>This course is provided by GA Integrated Therapeutic Perspectives LLC, an NBCC-Approved Continuing Education Provider. Our courses are developed by licensed mental health professionals with extensive telehealth experience.</p>
          
          <h3>Getting Started</h3>
          <p>Navigate through the course using the sidebar on the left. You can complete lessons in order or jump to specific topics. Don't forget to mark each lesson complete as you go!</p>
          
          <p><strong>Ready to begin? Click "Next" to start learning!</strong></p>
        `,
        duration: 10,
        order: 1,
        isFree: true
      };
      
      ethicsCourse.modules[0].lessons[1] = {
        title: 'HIPAA in Telehealth',
        type: 'text',
        content: `
          <h2>HIPAA Compliance in Telehealth Settings</h2>
          <p>The Health Insurance Portability and Accountability Act (HIPAA) applies to telehealth just as it does to in-person services. However, conducting therapy online introduces new risks and considerations for protecting client privacy.</p>
          
          <h3>HIPAA Basics Review</h3>
          <p>HIPAA has three main components relevant to telehealth:</p>
          
          <h4>1. Privacy Rule</h4>
          <p>Protects individually identifiable health information (PHI). In telehealth, this includes:</p>
          <ul>
            <li>Video and audio recordings of sessions</li>
            <li>Screen captures or screenshots</li>
            <li>Chat messages and emails</li>
            <li>Electronic health records accessed during sessions</li>
            <li>Appointment scheduling information</li>
          </ul>
          
          <h4>2. Security Rule</h4>
          <p>Requires safeguards to protect electronic PHI (ePHI). Key requirements:</p>
          <ul>
            <li><strong>Access controls:</strong> Password protection, two-factor authentication</li>
            <li><strong>Encryption:</strong> Data must be encrypted in transit and at rest</li>
            <li><strong>Audit controls:</strong> Track who accesses client information</li>
            <li><strong>Device security:</strong> Secure computers, tablets, and phones used for telehealth</li>
          </ul>
          
          <h4>3. Breach Notification Rule</h4>
          <p>Requires notification if client information is compromised. This includes:</p>
          <ul>
            <li>Unauthorized access to client records</li>
            <li>Lost or stolen devices containing PHI</li>
            <li>Hacking or cyber attacks</li>
            <li>Accidental disclosure via insecure platforms</li>
          </ul>
          
          <h3>Telehealth-Specific HIPAA Risks</h3>
          
          <h4>Platform Security</h4>
          <p>Not all video platforms are HIPAA-compliant. A platform must:</p>
          <ul>
            <li>Offer end-to-end encryption</li>
            <li>Sign a Business Associate Agreement (BAA)</li>
            <li>Not record or store sessions without your control</li>
            <li>Provide adequate security controls</li>
          </ul>
          
          <p><strong>❌ NOT HIPAA-Compliant:</strong> Skype, FaceTime, Facebook Messenger, regular Zoom accounts</p>
          <p><strong>✅ CAN Be HIPAA-Compliant:</strong> Zoom for Healthcare, Doxy.me, VSee, SimplePractice Telehealth (with BAA)</p>
          
          <h4>Your Environment</h4>
          <p>You must ensure privacy from your location:</p>
          <ul>
            <li>Private room with locked door</li>
            <li>No other people present or within earshot</li>
            <li>Headphones to prevent others from hearing</li>
            <li>Screen positioned so others can't see</li>
            <li>Professional, neutral background</li>
          </ul>
          
          <h4>Client Environment</h4>
          <p>You should discuss with clients:</p>
          <ul>
            <li>Finding a private location for sessions</li>
            <li>Using headphones</li>
            <li>Ensuring others won't interrupt</li>
            <li>Risks of public Wi-Fi networks</li>
            <li>Device security (passwords, updated software)</li>
          </ul>
          
          <h3>Business Associate Agreements (BAA)</h3>
          <p>Any vendor that handles PHI on your behalf must sign a BAA. This includes:</p>
          <ul>
            <li>Video platform providers</li>
            <li>Electronic health record (EHR) systems</li>
            <li>Email services used for client communication</li>
            <li>Cloud storage providers</li>
            <li>Appointment scheduling tools</li>
            <li>Credit card processors (if they see client names)</li>
          </ul>
          
          <p><strong>Important:</strong> A BAA is a legal contract. Don't use any service for telehealth until you have a signed BAA in place.</p>
          
          <h3>Email and Messaging</h3>
          <p>Regular email is NOT HIPAA-compliant. Options include:</p>
          <ul>
            <li>Encrypted email services (Hushmail, ProtonMail)</li>
            <li>Secure patient portals</li>
            <li>Practice management systems with secure messaging</li>
            <li>Getting client written consent to use regular email (document the risks)</li>
          </ul>
          
          <h3>COVID-19 Enforcement Discretion</h3>
          <p><strong>Note:</strong> During the COVID-19 public health emergency, HHS exercised enforcement discretion for telehealth platforms. This has now ended. You must use fully HIPAA-compliant platforms.</p>
          
          <h3>Practical Checklist</h3>
          <p>Before conducting telehealth sessions, ensure you have:</p>
          <ul>
            <li>✓ HIPAA-compliant video platform with signed BAA</li>
            <li>✓ Encrypted, password-protected devices</li>
            <li>✓ Private, secure location for sessions</li>
            <li>✓ Secure internet connection (not public Wi-Fi)</li>
            <li>✓ Updated telehealth informed consent</li>
            <li>✓ Process for documenting HIPAA violations</li>
            <li>✓ Cyber liability insurance</li>
          </ul>
          
          <h3>Resources</h3>
          <p>For more information:</p>
          <ul>
            <li>HHS Office for Civil Rights: <a href="https://www.hhs.gov/hipaa" target="_blank">www.hhs.gov/hipaa</a></li>
            <li>Telehealth.HHS.gov: Federal telehealth resources</li>
            <li>Your state licensing board's telehealth guidelines</li>
          </ul>
          
          <p><strong>Next, we'll look at choosing the right telehealth platform for your practice.</strong></p>
        `,
        duration: 30,
        order: 2,
        isFree: true
      };
      
      await ethicsCourse.save();
      console.log('✅ Updated Ethics in Telehealth course');
    }

    console.log('\n✅ Course content updated successfully!');
    console.log('Refresh your course player to see the new content.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating courses:', error);
    process.exit(1);
  }
}

updateCourseContent();
