import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './src/models/Course.js';

dotenv.config();

const sampleCourses = [
  {
    slug: 'ethics-in-telehealth',
    title: 'Ethics in Telehealth Practice',
    subtitle: 'Navigate Ethical Challenges in Virtual Counseling',
    description: 'A comprehensive 3-hour course covering HIPAA compliance, informed consent, emergency protocols, and ethical decision-making in telehealth settings. Learn best practices for maintaining therapeutic boundaries and ensuring client safety in virtual environments.',
    thumbnail: null,
    accessType: 'free',
    price: 0,
    ceuEligible: true,
    ceuHours: 3,
    ceuCategories: [
      { category: 'ethics', hours: 3 }
    ],
    ceuApprovalNumber: '7760',
    instructor: 'GA Integrated Therapeutic Perspectives LLC',
    status: 'published',
    publishedAt: new Date(),
    modules: [
      {
        title: 'Introduction to Telehealth Ethics',
        description: 'Foundation concepts and HIPAA compliance',
        order: 1,
        lessons: [
          {
            title: 'Welcome & Course Overview',
            type: 'video',
            content: 'Introduction to the course structure and learning objectives',
            duration: 10,
            order: 1,
            isFree: true
          },
          {
            title: 'HIPAA in Telehealth',
            type: 'text',
            content: '<h2>Understanding HIPAA Compliance</h2><p>Key requirements for protecting client information in virtual settings...</p>',
            duration: 30,
            order: 2,
            isFree: true
          },
          {
            title: 'Secure Platforms',
            type: 'text',
            content: '<h2>Choosing HIPAA-Compliant Platforms</h2><p>Evaluation criteria and best practices...</p>',
            duration: 20,
            order: 3,
            isFree: false
          }
        ]
      },
      {
        title: 'Informed Consent & Boundaries',
        description: 'Client agreements and therapeutic boundaries',
        order: 2,
        lessons: [
          {
            title: 'Virtual Informed Consent',
            type: 'text',
            content: '<h2>Informed Consent Documentation</h2><p>Required elements for telehealth consent...</p>',
            duration: 30,
            order: 1,
            isFree: false
          },
          {
            title: 'Maintaining Boundaries',
            type: 'text',
            content: '<h2>Therapeutic Boundaries in Virtual Settings</h2><p>Challenges and strategies...</p>',
            duration: 25,
            order: 2,
            isFree: false
          }
        ]
      },
      {
        title: 'Emergency Protocols & Crisis Management',
        description: 'Safety planning and emergency response',
        order: 3,
        lessons: [
          {
            title: 'Safety Planning',
            type: 'text',
            content: '<h2>Creating Effective Safety Plans</h2><p>Essential components for virtual clients...</p>',
            duration: 25,
            order: 1,
            isFree: false
          },
          {
            title: 'Crisis Response',
            type: 'text',
            content: '<h2>Managing Crisis Situations</h2><p>Protocols and procedures...</p>',
            duration: 30,
            order: 2,
            isFree: false
          },
          {
            title: 'Final Quiz',
            type: 'quiz',
            content: 'Assessment of course knowledge',
            duration: 20,
            order: 3,
            isFree: false
          }
        ]
      }
    ],
    settings: {
      linearProgression: true,
      certificateEnabled: true,
      passingScore: 80
    }
  },

  {
    slug: 'trauma-informed-care',
    title: 'Trauma-Informed Care Principles',
    subtitle: 'Building Safety and Empowerment in Clinical Practice',
    description: 'Explore the foundations of trauma-informed care with this 6-hour course. Learn to recognize trauma responses, create safety, and apply evidence-based interventions that promote healing and resilience.',
    thumbnail: null,
    accessType: 'paid',
    price: 49.99,
    ceuEligible: true,
    ceuHours: 6,
    ceuCategories: [
      { category: 'core', hours: 6 }
    ],
    ceuApprovalNumber: '7760',
    instructor: 'GA Integrated Therapeutic Perspectives LLC',
    status: 'published',
    publishedAt: new Date(),
    modules: [
      {
        title: 'Understanding Trauma',
        description: 'Foundations of trauma psychology',
        order: 1,
        lessons: [
          {
            title: 'Course Introduction',
            type: 'video',
            content: 'Overview of trauma-informed care approach',
            duration: 15,
            order: 1,
            isFree: true
          },
          {
            title: 'Types of Trauma',
            type: 'text',
            content: '<h2>Trauma Classifications</h2><p>Acute, chronic, and complex trauma...</p>',
            duration: 45,
            order: 2,
            isFree: false
          }
        ]
      },
      {
        title: 'The Six Principles',
        description: 'SAMHSA trauma-informed approach',
        order: 2,
        lessons: [
          {
            title: 'Safety',
            type: 'text',
            content: '<h2>Creating Physical and Emotional Safety</h2><p>Strategies for establishing safety...</p>',
            duration: 40,
            order: 1,
            isFree: false
          },
          {
            title: 'Trustworthiness & Transparency',
            type: 'text',
            content: '<h2>Building Trust</h2><p>Transparent communication and decision-making...</p>',
            duration: 40,
            order: 2,
            isFree: false
          },
          {
            title: 'Peer Support & Collaboration',
            type: 'text',
            content: '<h2>Collaborative Relationships</h2><p>Peer support and shared decision-making...</p>',
            duration: 40,
            order: 3,
            isFree: false
          }
        ]
      },
      {
        title: 'Clinical Applications',
        description: 'Evidence-based interventions',
        order: 3,
        lessons: [
          {
            title: 'Assessment Strategies',
            type: 'text',
            content: '<h2>Trauma-Sensitive Assessment</h2><p>Screening and evaluation approaches...</p>',
            duration: 45,
            order: 1,
            isFree: false
          },
          {
            title: 'Intervention Techniques',
            type: 'text',
            content: '<h2>Evidence-Based Interventions</h2><p>Therapeutic approaches for trauma...</p>',
            duration: 50,
            order: 2,
            isFree: false
          },
          {
            title: 'Self-Care for Clinicians',
            type: 'text',
            content: '<h2>Preventing Vicarious Trauma</h2><p>Self-care strategies and burnout prevention...</p>',
            duration: 35,
            order: 3,
            isFree: false
          },
          {
            title: 'Final Assessment',
            type: 'quiz',
            content: 'Comprehensive quiz on trauma-informed care',
            duration: 30,
            order: 4,
            isFree: false
          }
        ]
      }
    ],
    settings: {
      linearProgression: true,
      certificateEnabled: true,
      passingScore: 80
    }
  },

  {
    slug: 'cultural-competence',
    title: 'Cultural Competence in Counseling',
    subtitle: 'Enhancing Multicultural Awareness and Skills',
    description: 'Develop essential cultural competence skills in this 3-hour course. Examine your own cultural identity, learn to recognize biases, and apply culturally responsive interventions with diverse client populations.',
    thumbnail: null,
    accessType: 'paid',
    price: 29.99,
    ceuEligible: true,
    ceuHours: 3,
    ceuCategories: [
      { category: 'related', hours: 3 }
    ],
    ceuApprovalNumber: '7760',
    instructor: 'GA Integrated Therapeutic Perspectives LLC',
    status: 'published',
    publishedAt: new Date(),
    modules: [
      {
        title: 'Foundations of Cultural Competence',
        description: 'Self-awareness and cultural identity',
        order: 1,
        lessons: [
          {
            title: 'Introduction to Cultural Competence',
            type: 'video',
            content: 'Why cultural competence matters in counseling',
            duration: 10,
            order: 1,
            isFree: true
          },
          {
            title: 'Cultural Self-Awareness',
            type: 'text',
            content: '<h2>Examining Your Cultural Identity</h2><p>Reflecting on your own cultural background...</p>',
            duration: 35,
            order: 2,
            isFree: false
          },
          {
            title: 'Recognizing Bias',
            type: 'text',
            content: '<h2>Implicit Bias and Microaggressions</h2><p>Understanding unconscious bias...</p>',
            duration: 30,
            order: 3,
            isFree: false
          }
        ]
      },
      {
        title: 'Working with Diverse Populations',
        description: 'Culturally responsive interventions',
        order: 2,
        lessons: [
          {
            title: 'Cultural Assessment',
            type: 'text',
            content: '<h2>Culturally Sensitive Assessment</h2><p>Gathering cultural information...</p>',
            duration: 30,
            order: 1,
            isFree: false
          },
          {
            title: 'Adapting Interventions',
            type: 'text',
            content: '<h2>Culturally Adapted Therapies</h2><p>Modifying approaches for cultural fit...</p>',
            duration: 35,
            order: 2,
            isFree: false
          },
          {
            title: 'Language and Communication',
            type: 'text',
            content: '<h2>Cross-Cultural Communication</h2><p>Working with interpreters and language barriers...</p>',
            duration: 30,
            order: 3,
            isFree: false
          },
          {
            title: 'Knowledge Check',
            type: 'quiz',
            content: 'Assessment of cultural competence knowledge',
            duration: 15,
            order: 4,
            isFree: false
          }
        ]
      }
    ],
    settings: {
      linearProgression: true,
      certificateEnabled: true,
      passingScore: 80
    }
  },

  {
    slug: 'suicide-assessment-intervention',
    title: 'Suicide Assessment and Intervention',
    subtitle: 'Evidence-Based Approaches to Suicide Prevention',
    description: 'Master evidence-based suicide assessment and intervention strategies in this critical 6-hour course. Learn to identify risk factors, conduct comprehensive assessments, and implement effective safety planning with at-risk clients.',
    thumbnail: null,
    accessType: 'paid',
    price: 59.99,
    ceuEligible: true,
    ceuHours: 6,
    ceuCategories: [
      { category: 'core', hours: 6 }
    ],
    ceuApprovalNumber: '7760',
    instructor: 'GA Integrated Therapeutic Perspectives LLC',
    status: 'published',
    publishedAt: new Date(),
    modules: [
      {
        title: 'Understanding Suicidality',
        description: 'Risk factors and warning signs',
        order: 1,
        lessons: [
          {
            title: 'Course Overview',
            type: 'video',
            content: 'Introduction to suicide prevention',
            duration: 10,
            order: 1,
            isFree: true
          },
          {
            title: 'Epidemiology',
            type: 'text',
            content: '<h2>Suicide Statistics and Trends</h2><p>Current data on suicide rates...</p>',
            duration: 30,
            order: 2,
            isFree: false
          },
          {
            title: 'Risk Factors',
            type: 'text',
            content: '<h2>Identifying Risk Factors</h2><p>Static and dynamic risk factors...</p>',
            duration: 40,
            order: 3,
            isFree: false
          }
        ]
      },
      {
        title: 'Assessment Strategies',
        description: 'Comprehensive suicide risk assessment',
        order: 2,
        lessons: [
          {
            title: 'Screening Tools',
            type: 'text',
            content: '<h2>Evidence-Based Screening Instruments</h2><p>Columbia Protocol, PHQ-9, and others...</p>',
            duration: 45,
            order: 1,
            isFree: false
          },
          {
            title: 'Clinical Interview',
            type: 'text',
            content: '<h2>Conducting Suicide Assessments</h2><p>Interview techniques and questions...</p>',
            duration: 50,
            order: 2,
            isFree: false
          },
          {
            title: 'Documentation',
            type: 'text',
            content: '<h2>Legal and Ethical Documentation</h2><p>Proper documentation practices...</p>',
            duration: 35,
            order: 3,
            isFree: false
          }
        ]
      },
      {
        title: 'Intervention and Safety Planning',
        description: 'Crisis intervention and ongoing management',
        order: 3,
        lessons: [
          {
            title: 'Safety Planning',
            type: 'text',
            content: '<h2>Collaborative Safety Planning</h2><p>Stanley-Brown Safety Plan approach...</p>',
            duration: 45,
            order: 1,
            isFree: false
          },
          {
            title: 'Crisis Intervention',
            type: 'text',
            content: '<h2>Immediate Crisis Response</h2><p>De-escalation and hospitalization decisions...</p>',
            duration: 40,
            order: 2,
            isFree: false
          },
          {
            title: 'Follow-Up Care',
            type: 'text',
            content: '<h2>Ongoing Risk Management</h2><p>Continuing care and monitoring...</p>',
            duration: 35,
            order: 3,
            isFree: false
          },
          {
            title: 'Final Examination',
            type: 'quiz',
            content: 'Comprehensive assessment of course material',
            duration: 30,
            order: 4,
            isFree: false
          }
        ]
      }
    ],
    settings: {
      linearProgression: true,
      certificateEnabled: true,
      passingScore: 85
    }
  },

  {
    slug: 'clinical-documentation',
    title: 'Clinical Documentation Essentials',
    subtitle: 'Medical Necessity and Progress Note Writing',
    description: 'Master the art of clinical documentation with this practical 4-hour course. Learn to write progress notes that meet insurance requirements, demonstrate medical necessity, and protect you legally while maintaining efficiency.',
    thumbnail: null,
    accessType: 'free',
    price: 0,
    ceuEligible: true,
    ceuHours: 4,
    ceuCategories: [
      { category: 'core', hours: 4 }
    ],
    ceuApprovalNumber: '7760',
    instructor: 'GA Integrated Therapeutic Perspectives LLC',
    status: 'published',
    publishedAt: new Date(),
    modules: [
      {
        title: 'Documentation Fundamentals',
        description: 'Legal and ethical requirements',
        order: 1,
        lessons: [
          {
            title: 'Why Documentation Matters',
            type: 'video',
            content: 'The importance of quality documentation',
            duration: 15,
            order: 1,
            isFree: true
          },
          {
            title: 'Legal Requirements',
            type: 'text',
            content: '<h2>Legal Standards for Documentation</h2><p>HIPAA, state laws, and professional standards...</p>',
            duration: 30,
            order: 2,
            isFree: true
          },
          {
            title: 'Common Documentation Errors',
            type: 'text',
            content: '<h2>Mistakes to Avoid</h2><p>Common pitfalls and how to avoid them...</p>',
            duration: 25,
            order: 3,
            isFree: false
          }
        ]
      },
      {
        title: 'Medical Necessity',
        description: 'Demonstrating need for treatment',
        order: 2,
        lessons: [
          {
            title: 'What is Medical Necessity?',
            type: 'text',
            content: '<h2>Understanding Medical Necessity</h2><p>Insurance requirements and criteria...</p>',
            duration: 35,
            order: 1,
            isFree: false
          },
          {
            title: 'Documenting Impairment',
            type: 'text',
            content: '<h2>Functional Impairment</h2><p>Describing how symptoms affect functioning...</p>',
            duration: 30,
            order: 2,
            isFree: false
          }
        ]
      },
      {
        title: 'Progress Note Formats',
        description: 'SOAP, DAP, and BIRP notes',
        order: 3,
        lessons: [
          {
            title: 'SOAP Notes',
            type: 'text',
            content: '<h2>Subjective, Objective, Assessment, Plan</h2><p>Writing effective SOAP notes...</p>',
            duration: 30,
            order: 1,
            isFree: false
          },
          {
            title: 'DAP Notes',
            type: 'text',
            content: '<h2>Data, Assessment, Plan</h2><p>Streamlined documentation approach...</p>',
            duration: 25,
            order: 2,
            isFree: false
          },
          {
            title: 'Practice Examples',
            type: 'text',
            content: '<h2>Real-World Examples</h2><p>Sample notes with annotations...</p>',
            duration: 40,
            order: 3,
            isFree: false
          },
          {
            title: 'Final Quiz',
            type: 'quiz',
            content: 'Test your documentation knowledge',
            duration: 20,
            order: 4,
            isFree: false
          }
        ]
      }
    ],
    settings: {
      linearProgression: true,
      certificateEnabled: true,
      passingScore: 80
    }
  }
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses (optional - comment out if you want to keep existing)
    // await Course.deleteMany({});
    // console.log('Cleared existing courses');

    // Insert sample courses
    const courses = await Course.insertMany(sampleCourses);
    console.log(`✅ Successfully added ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`  - ${course.title} (${course.ceuHours} CE hours)`);
    });

    console.log('\nCourse Details:');
    console.log('- 2 FREE courses (Ethics in Telehealth, Clinical Documentation)');
    console.log('- 3 PAID courses (Trauma-Informed Care, Cultural Competence, Suicide Assessment)');
    console.log('- Total CE Hours Available: 22 hours');
    console.log('- All courses NBCC-approved (ACEP #7760)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
}

seedCourses();
