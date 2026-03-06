/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not found in .env'); process.exit(1); }

// ╔══════════════════════════════════════════════════════════════════╗
// ║  COUNSELORREADY — SEED COURSE TEMPLATE                         ║
// ║  For importing externally-created courses into the platform     ║
// ║                                                                 ║
// ║  INSTRUCTIONS:                                                  ║
// ║  1. Copy this file and rename: seedYourCourseName.js            ║
// ║  2. Fill in the COURSE_DATA object below                        ║
// ║  3. Add modules with content blocks (all 9 types documented)    ║
// ║  4. Add final assessment questions (min 15 for ACEP)            ║
// ║  5. Run: node src/scripts/seedYourCourseName.js                 ║
// ║                                                                 ║
// ║  ACEP REQUIREMENTS CHECKLIST:                                   ║
// ║  ☐ 6,000+ words per CE hour (e.g., 3 CE = 18,000+ words)       ║
// ║  ☐ 2-3 knowledge checks per module (multipleChoice blocks)      ║
// ║  ☐ 15+ final assessment questions                               ║
// ║  ☐ 80% pass threshold on final assessment                       ║
// ║  ☐ Clear learning objectives (5-8 recommended)                  ║
// ║  ☐ Defined target audience                                      ║
// ║  ☐ ACEP provider info included                                  ║
// ╚══════════════════════════════════════════════════════════════════╝


const COURSE_DATA = {

  // ────────────────────────────────────────────────────
  // COURSE METADATA
  // ────────────────────────────────────────────────────

  title: "YOUR COURSE TITLE HERE",
  slug: "your-course-slug-here",                          // URL-friendly, lowercase, hyphens
  code: "CR-XXX",                                          // Course code (e.g., CR-401, CR-501)
  
  description: "Full course description (2-4 sentences). Include what the course covers, target audience, and key takeaways. This appears on the course catalog page.",
  
  shortDescription: "One-line summary for cards and listings.",
  
  ceHours: 3,                                              // CE credit hours (1, 2, 3, 4, etc.)
  credits: 3,                                              // Usually matches ceHours
  category: "Clinical Practice",                           // Options: "Clinical Practice", "Ethics", "Crisis Intervention", 
                                                           //          "Assessment", "Supervision", "Cultural Competency",
                                                           //          "Substance Abuse", "Trauma", "Professional Development"
  level: "Intermediate",                                   // "Beginner", "Intermediate", "Intermediate to Advanced", "Advanced"
  contentArea: "Clinical Practice",                        // Primary content area
  creditType: "NBCC",                                      // "NBCC" for standard CE
  
  acepProvider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    number: "7760"
  },
  
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Mental Health Counselors (LMHC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
    "Graduate-level counseling students under supervision"
  ],
  
  instructionalLevel: "Intermediate",
  deliveryMethod: "online",
  estimatedMinutes: 180,                                   // ceHours × 60
  
  objectives: [
    // 5-8 learning objectives using Bloom's taxonomy action verbs:
    // Analyze, Apply, Compare, Construct, Create, Critique, Define,
    // Demonstrate, Describe, Develop, Differentiate, Evaluate, Examine,
    // Explain, Identify, Illustrate, Implement, Integrate, Interpret
    "Define key concepts and theoretical frameworks related to [TOPIC]",
    "Identify assessment tools and clinical indicators for [TOPIC]",
    "Apply evidence-based intervention strategies in clinical practice",
    "Evaluate ethical considerations and professional boundaries",
    "Develop a personalized implementation plan for integrating new knowledge into practice",
  ],
  
  contentAreas: ["Clinical Practice"],                     // Array of content areas
  categories: ["Clinical Skills"],                         // Tags for filtering
  tags: ["tag1", "tag2", "tag3"],                          // Search/filter tags
  
  price: 45,                                               // Price in USD (0 for free courses)
  isActive: true,
  isFeatured: false,
  status: "draft",                                         // "draft" or "published" — start as draft!
  isPublished: false,                                      // Set to true only after review
  passingScore: 80,                                        // ACEP requires 80%
  maxAttempts: 3,                                          // Exam attempts allowed
  
  accessibility: {
    wcagLevel: "AA",
    screenReaderOptimized: true,
    keyboardNavigable: true,
    colorContrastCompliant: true,
    altTextProvided: true
  },


  // ────────────────────────────────────────────────────
  // MODULES (course content goes here)
  // ────────────────────────────────────────────────────
  // 
  // ACEP GUIDELINES:
  //   • Each module needs 2-3 knowledge checks (multipleChoice blocks)
  //   • Aim for ~6,000 words per CE hour across all modules
  //   • Include a mix of block types for engagement
  //   • Recommended: 3-5 modules for a 3 CE course
  //
  // AVAILABLE BLOCK TYPES (all 9):
  //   1. sectionDivider  — Module header/divider
  //   2. text            — HTML content (paragraphs, headings, lists)
  //   3. accordion       — Expandable sections
  //   4. multipleChoice  — Single-answer knowledge check
  //   5. multiSelect     — Multiple-correct-answer question
  //   6. matching        — Term-to-definition matching exercise
  //   7. reflection      — Open-ended reflection prompt
  //   8. imageText       — Image with accompanying text
  //   9. resources       — Links and downloadable resources
  // ────────────────────────────────────────────────────

  modules: [

    // ══════════════════════════════════════════════════
    // MODULE 1
    // ══════════════════════════════════════════════════
    {
      title: "Module 1 Title: Foundations and Key Concepts",
      order: 1,
      contentBlocks: [

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 1: sectionDivider            │
        // │  Use at the start of every module        │
        // └─────────────────────────────────────────┘
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Module 1",
          subtitle: "Foundations and Key Concepts",
          accessibility: { role: "heading", ariaLevel: 2 }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 2: text                      │
        // │  Main content — uses HTML formatting     │
        // │  This is where most word count lives     │
        // │                                          │
        // │  Supported HTML:                         │
        // │    <p>         — paragraphs              │
        // │    <h2>        — subheadings              │
        // │    <strong>    — bold                     │
        // │    <em>        — italic                   │
        // │    <ul><li>    — bullet lists             │
        // │    <ol><li>    — numbered lists           │
        // │    <blockquote>— quotes                   │
        // │                                          │
        // │  TIP: Break long content into multiple   │
        // │  text blocks (~500-800 words each) for   │
        // │  better readability                      │
        // └─────────────────────────────────────────┘
        {
          type: "text",
          content: `<p>Opening paragraph that introduces the module topic and sets the context for learning. This should connect to the overall course objectives and explain why this content matters for clinical practice.</p>
<p>Continue with foundational concepts. Use <strong>bold text</strong> for key terms and <em>italics</em> for emphasis. Each text block should be a coherent section of content.</p>
<h2>Subheading for a New Section</h2>
<p>Additional content under the subheading. Remember: aim for 6,000+ words per CE hour across ALL text blocks in ALL modules combined. For a 3-CE course, you need at least 18,000 words total.</p>
<p>Include clinical examples, research citations, and practical applications throughout. Content should be substantive enough that a professional can implement learnings in their Monday morning practice.</p>`,
          accessibility: { role: "article" }
        },

        // Another text block — break up long content for readability
        {
          type: "text",
          content: `<h2>Another Section Within This Module</h2>
<p>More content here. You can have as many text blocks as needed per module.</p>
<p>Include research citations in APA format within the text: (Author, Year). Full references go in the references array at the bottom of the course data.</p>`,
          accessibility: { role: "article" }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 3: accordion                 │
        // │  Expandable sections — great for:        │
        // │    • Demographic breakdowns              │
        // │    • Comparing theories/models            │
        // │    • Listing risk factors                 │
        // │    • Case examples by population          │
        // │  Each item has a title + HTML content    │
        // └─────────────────────────────────────────┘
        {
          type: "accordion",
          accordionItems: [
            {
              title: "First Expandable Section",
              content: `<p>Detailed content for this section. Accordion items are great for organizing related but distinct subtopics that learners can explore at their own pace.</p>
<p>Include 2-3 paragraphs of substantive content per accordion item. This content counts toward the word requirement.</p>`
            },
            {
              title: "Second Expandable Section",
              content: `<p>Content for the second section. Each accordion item should be self-contained but related to the others in the group.</p>`
            },
            {
              title: "Third Expandable Section",
              content: `<p>Content for the third section. You can include <strong>bold</strong>, <em>italic</em>, and other HTML formatting within accordion items.</p>`
            },
            {
              title: "Fourth Expandable Section",
              content: `<p>Aim for 3-6 items per accordion block. Too many becomes overwhelming; too few doesn't justify the accordion format.</p>`
            }
          ],
          accessibility: { role: "region", ariaLabel: "Expandable content sections" }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 8: imageText                 │
        // │  Image + text side by side               │
        // │                                          │
        // │  imagePosition: "left" or "right"        │
        // │                                          │
        // │  IMAGE OPTIONS:                          │
        // │  • Cloudinary URL (preferred):           │
        // │    "https://res.cloudinary.com/..."       │
        // │  • Local placeholder path:               │
        // │    "/images/courses/your-course/img.png"  │
        // │    (upload to Cloudinary later via admin) │
        // └─────────────────────────────────────────┘
        {
          type: "imageText",
          title: "Visual Concept Title",
          content: `<p>Description of the visual. This block is ideal for frameworks, diagrams, infographics, or clinical tools that benefit from visual representation.</p><p>Explain what the learner should take away from the image and how it connects to the content.</p>`,
          image: `/images/courses/your-course-slug/placeholder-image.png`,
          imageAlt: "Descriptive alt text for accessibility — describe what the image shows",
          imagePosition: "right",                          // "left" or "right"
          accessibility: { role: "figure", ariaLabel: "Descriptive label for this figure" }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 4: multipleChoice            │
        // │  Single-answer knowledge check           │
        // │                                          │
        // │  ACEP REQUIREMENT: 2-3 per module        │
        // │  Exactly ONE option has isCorrect: true  │
        // │  Include meaningful explanation           │
        // └─────────────────────────────────────────┘
        {
          type: "multipleChoice",
          question: "Which of the following best describes [KEY CONCEPT FROM THIS MODULE]?",
          options: [
            { text: "Incorrect answer A — make plausible but clearly wrong", isCorrect: false },
            { text: "Correct answer — this is the right one", isCorrect: true },
            { text: "Incorrect answer C — common misconception", isCorrect: false },
            { text: "Incorrect answer D — another plausible distractor", isCorrect: false }
          ],
          explanation: "Explanation of why the correct answer is right and why the distractors are wrong. This is a teaching moment — be thorough.",
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },

        // Second knowledge check for this module
        {
          type: "multipleChoice",
          question: "According to [RESEARCHER/THEORY], the primary factor in [CONCEPT] is:",
          options: [
            { text: "Option A", isCorrect: false },
            { text: "Option B", isCorrect: false },
            { text: "Option C", isCorrect: true },
            { text: "Option D", isCorrect: false }
          ],
          explanation: "Detailed explanation connecting back to the module content.",
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },

        // Third knowledge check (recommended for larger modules)
        {
          type: "multipleChoice",
          question: "A counselor working with [SCENARIO] should FIRST:",
          options: [
            { text: "Option A", isCorrect: false },
            { text: "Option B", isCorrect: true },
            { text: "Option C", isCorrect: false },
            { text: "Option D", isCorrect: false }
          ],
          explanation: "Clinical reasoning explanation.",
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 7: reflection                │
        // │  Open-ended reflection prompt            │
        // │  Encourages clinical self-awareness      │
        // │                                          │
        // │  Optional: minLength (character minimum) │
        // │  Recommended: 1 per module               │
        // └─────────────────────────────────────────┘
        {
          type: "reflection",
          question: "Reflect on your current clinical practice. How do you currently approach [TOPIC]? What challenges have you encountered, and what would you like to do differently after completing this module?",
          minLength: 150,                                  // Optional: minimum character count
          accessibility: { role: "textbox", ariaLabel: "Reflection prompt" }
        }
      ]
    },


    // ══════════════════════════════════════════════════
    // MODULE 2
    // ══════════════════════════════════════════════════
    {
      title: "Module 2 Title: Assessment and Clinical Application",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Module 2",
          subtitle: "Assessment and Clinical Application",
          accessibility: { role: "heading", ariaLevel: 2 }
        },

        {
          type: "text",
          content: `<p>Module 2 opening content. Continue building on Module 1 foundations with practical application.</p>
<p>Add as many text blocks as needed to meet word count requirements.</p>`,
          accessibility: { role: "article" }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 5: multiSelect               │
        // │  Multiple-correct-answer question        │
        // │  "Select ALL that apply"                 │
        // │                                          │
        // │  Multiple options can be isCorrect: true │
        // │  Great for assessing comprehensive       │
        // │  understanding                           │
        // └─────────────────────────────────────────┘
        {
          type: "multiSelect",
          question: "Which of the following are evidence-based approaches to [TOPIC]? (Select all that apply)",
          options: [
            { text: "Correct approach A", isCorrect: true },
            { text: "Incorrect approach — common myth", isCorrect: false },
            { text: "Correct approach B", isCorrect: true },
            { text: "Correct approach C", isCorrect: true },
            { text: "Incorrect approach — outdated practice", isCorrect: false },
            { text: "Correct approach D", isCorrect: true }
          ],
          explanation: "Explanation of which answers are correct and why. Address why the incorrect options are wrong — this corrects common misconceptions.",
          accessibility: { ariaLabel: "Multi-select knowledge check", announceCorrect: true }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 6: matching                  │
        // │  Term ↔ Definition matching exercise     │
        // │                                          │
        // │  Great for:                              │
        // │    • Matching theories to descriptions   │
        // │    • Matching symptoms to disorders      │
        // │    • Matching interventions to scenarios  │
        // │  Aim for 4-6 pairs                       │
        // └─────────────────────────────────────────┘
        {
          type: "matching",
          matchingInstructions: "Match each term to its correct definition or description.",
          matchingPairs: [
            { term: "Term 1", definition: "Definition or description for Term 1" },
            { term: "Term 2", definition: "Definition or description for Term 2" },
            { term: "Term 3", definition: "Definition or description for Term 3" },
            { term: "Term 4", definition: "Definition or description for Term 4" }
          ],
          accessibility: { ariaLabel: "Matching exercise", role: "application" }
        },

        // More text content...
        {
          type: "text",
          content: `<p>Continue with module content. Include clinical vignettes and case examples.</p>
<h2>Clinical Vignette</h2>
<p><em>"Maria, a 34-year-old Latina woman, presents to your office reporting..." [Describe clinical scenario that illustrates key concepts from this module. Include enough detail for learners to practice applying assessment/intervention skills.]</em></p>
<p>Analysis of the vignette and how it connects to the module content.</p>`,
          accessibility: { role: "article" }
        },

        // Module 2 knowledge checks (2-3 required)
        {
          type: "multipleChoice",
          question: "In the clinical vignette above, the MOST appropriate initial intervention would be:",
          options: [
            { text: "Option A", isCorrect: false },
            { text: "Option B", isCorrect: true },
            { text: "Option C", isCorrect: false },
            { text: "Option D", isCorrect: false }
          ],
          explanation: "Clinical reasoning for the correct answer.",
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },

        {
          type: "multipleChoice",
          question: "Second knowledge check question for Module 2:",
          options: [
            { text: "Option A", isCorrect: true },
            { text: "Option B", isCorrect: false },
            { text: "Option C", isCorrect: false },
            { text: "Option D", isCorrect: false }
          ],
          explanation: "Explanation.",
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },

        {
          type: "reflection",
          question: "Consider a client you've worked with who presented with [RELEVANT ISSUE]. How might the assessment approaches discussed in this module have changed your clinical approach?",
          accessibility: { role: "textbox", ariaLabel: "Reflection prompt" }
        }
      ]
    },


    // ══════════════════════════════════════════════════
    // MODULE 3
    // ══════════════════════════════════════════════════
    {
      title: "Module 3 Title: Ethics, Special Populations, and Integration",
      order: 3,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 3,
          title: "Module 3",
          subtitle: "Ethics, Special Populations, and Integration",
          accessibility: { role: "heading", ariaLevel: 2 }
        },

        {
          type: "text",
          content: `<p>Module 3 content. This is often where ethics, cultural considerations, special populations, and integration/implementation content goes.</p>`,
          accessibility: { role: "article" }
        },

        // Add more text blocks, accordions, imageText, etc. as needed...

        // Module 3 knowledge checks
        {
          type: "multipleChoice",
          question: "Module 3 knowledge check 1:",
          options: [
            { text: "Option A", isCorrect: false },
            { text: "Option B", isCorrect: false },
            { text: "Option C", isCorrect: true },
            { text: "Option D", isCorrect: false }
          ],
          explanation: "Explanation.",
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },

        {
          type: "multipleChoice",
          question: "Module 3 knowledge check 2:",
          options: [
            { text: "Option A", isCorrect: false },
            { text: "Option B", isCorrect: true },
            { text: "Option C", isCorrect: false },
            { text: "Option D", isCorrect: false }
          ],
          explanation: "Explanation.",
          accessibility: { ariaLabel: "Knowledge check question", announceCorrect: true }
        },

        {
          type: "reflection",
          question: "As you conclude this course, identify three specific changes you plan to implement in your practice based on what you've learned. How will you measure the impact of these changes?",
          minLength: 200,
          accessibility: { role: "textbox", ariaLabel: "Final reflection prompt" }
        },

        // ┌─────────────────────────────────────────┐
        // │  BLOCK TYPE 9: resources                 │
        // │  Links and downloadable resources        │
        // │                                          │
        // │  type options:                           │
        // │    "website" — external link             │
        // │    "pdf"     — downloadable PDF          │
        // │    "document"— downloadable doc          │
        // │    "video"   — video link                │
        // │                                          │
        // │  Best placed at the end of the final     │
        // │  module as supplementary materials       │
        // └─────────────────────────────────────────┘
        {
          type: "resources",
          resources: [
            { title: "Resource Name 1 — Website", url: "https://example.com", type: "website" },
            { title: "Downloadable Clinical Tool (PDF)", url: "/downloads/your-course/clinical-tool.pdf", type: "pdf" },
            { title: "Assessment Template (Word)", url: "/downloads/your-course/template.docx", type: "document" },
            { title: "Supplementary Video", url: "https://youtube.com/watch?v=example", type: "video" }
          ],
          accessibility: { role: "list", ariaLabel: "Course resources and downloads" }
        }
      ]
    }

    // ══════════════════════════════════════════════════
    // ADD MORE MODULES AS NEEDED
    // Copy the module structure above and increment:
    //   order: 4, sectionNumber: 4, etc.
    // 
    // RECOMMENDED MODULE COUNT BY CE HOURS:
    //   1 CE  →  2-3 modules
    //   2 CE  →  3-4 modules
    //   3 CE  →  4-5 modules
    //   4 CE  →  5-7 modules
    //   6 CE  →  7-9 modules
    // ══════════════════════════════════════════════════
  ],


  // ────────────────────────────────────────────────────
  // FINAL ASSESSMENT
  // ────────────────────────────────────────────────────
  // ACEP REQUIREMENT: Minimum 15 questions, 80% pass rate
  // Questions should cover ALL modules proportionally
  // All questions are multiple-choice with exactly 1 correct answer
  // ────────────────────────────────────────────────────

  assessment: {
    title: "Final Assessment: YOUR COURSE TITLE",
    passingScore: 80,
    instructions: "This assessment evaluates your understanding of the course material. You must score 80% or higher to receive CE credit. You have 3 attempts.",
    questions: [

      // MODULE 1 QUESTIONS (aim for 5 questions per module for a 3-module course)
      {
        question: "Assessment question 1 (from Module 1 content):",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: true },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation of the correct answer."
      },
      {
        question: "Assessment question 2:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: true },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 3:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: true },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 4:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: true }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 5:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: true },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },

      // MODULE 2 QUESTIONS
      {
        question: "Assessment question 6 (from Module 2 content):",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: true },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 7:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: true },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 8:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: true },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 9:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: true },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 10:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: true }
        ],
        explanation: "Explanation."
      },

      // MODULE 3 QUESTIONS
      {
        question: "Assessment question 11 (from Module 3 content):",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: true },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 12:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: true },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 13:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: true },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 14:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: true },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false }
        ],
        explanation: "Explanation."
      },
      {
        question: "Assessment question 15:",
        type: "multiple-choice",
        options: [
          { text: "Option A", isCorrect: false },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: true }
        ],
        explanation: "Explanation."
      }

      // ADD MORE QUESTIONS AS NEEDED
      // More questions = more robust assessment
      // 15 is the minimum; 20-25 is ideal
    ]
  },


  // ────────────────────────────────────────────────────
  // REFERENCES
  // ────────────────────────────────────────────────────
  // APA 7th edition format
  // Include all sources cited in course content
  // ────────────────────────────────────────────────────

  references: [
    "Author, A.A. (Year). Title of article. Journal Name, Volume(Issue), Pages. https://doi.org/xxxxx",
    "Author, B.B., & Author, C.C. (Year). Title of book. Publisher.",
    "Organization Name. (Year). Title of report or resource. https://www.example.com",
    // Add all references cited in the course content
  ]
};


// ╔══════════════════════════════════════════════════════════════════╗
// ║  SEED SCRIPT — DO NOT MODIFY BELOW THIS LINE                   ║
// ║  (unless you need to change the title match pattern)            ║
// ╚══════════════════════════════════════════════════════════════════╝

async function main() {
  // ── Extract a search pattern from the title ──
  // This finds an existing course with a matching title to UPDATE,
  // or CREATES a new one if no match is found.
  const titleWords = COURSE_DATA.title.split(/\s+/).slice(0, 4).join('\\s+');
  const titlePattern = new RegExp(titleWords, 'i');

  console.log('\n' + '═'.repeat(60));
  console.log(`  SEED: ${COURSE_DATA.title}`);
  console.log('═'.repeat(60));

  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB\n');

  const Course = mongoose.connection.models.Course ||
    mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

  // ── Check for existing course ──
  const existing = await Course.findOne({ title: titlePattern });

  if (existing) {
    await Course.updateOne({ _id: existing._id }, { $set: COURSE_DATA });
    console.log(`  ✅ UPDATED existing course`);
    console.log(`     ID: ${existing._id}`);
  } else {
    const created = await Course.create(COURSE_DATA);
    console.log(`  ✅ CREATED new course`);
    console.log(`     ID: ${created._id}`);
  }

  // ── Print Statistics ──
  const totalBlocks = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.length || 0), 0
  );
  const totalKC = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.filter(b => b.type === 'multipleChoice').length || 0), 0
  );
  const totalMultiSelect = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.filter(b => b.type === 'multiSelect').length || 0), 0
  );
  const totalMatching = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.filter(b => b.type === 'matching').length || 0), 0
  );
  const totalReflections = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.filter(b => b.type === 'reflection').length || 0), 0
  );
  const totalImages = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.filter(b => b.type === 'imageText').length || 0), 0
  );
  const totalResources = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.filter(b => b.type === 'resources').length || 0), 0
  );

  // ── Estimate word count from text and accordion blocks ──
  let estimatedWords = 0;
  COURSE_DATA.modules.forEach(m => {
    (m.contentBlocks || []).forEach(b => {
      if (b.type === 'text' && b.content) {
        estimatedWords += b.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
      }
      if (b.type === 'accordion' && b.accordionItems) {
        b.accordionItems.forEach(item => {
          if (item.content) {
            estimatedWords += item.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
          }
        });
      }
      if (b.type === 'imageText' && b.content) {
        estimatedWords += b.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
      }
    });
  });
  const requiredWords = COURSE_DATA.ceHours * 6000;

  console.log(`\n  📊 Course Statistics:`);
  console.log(`     Title: ${COURSE_DATA.title}`);
  console.log(`     Code: ${COURSE_DATA.code}`);
  console.log(`     CE Hours: ${COURSE_DATA.ceHours}`);
  console.log(`     Modules: ${COURSE_DATA.modules.length}`);
  console.log(`     Content Blocks: ${totalBlocks}`);
  console.log(`     ── Knowledge Checks (multipleChoice): ${totalKC}`);
  console.log(`     ── Multi-Select Questions: ${totalMultiSelect}`);
  console.log(`     ── Matching Exercises: ${totalMatching}`);
  console.log(`     ── Reflection Prompts: ${totalReflections}`);
  console.log(`     ── Image+Text Blocks: ${totalImages}`);
  console.log(`     ── Resource Blocks: ${totalResources}`);
  console.log(`     Final Assessment Questions: ${COURSE_DATA.assessment.questions.length}`);
  console.log(`     Estimated Word Count: ${estimatedWords.toLocaleString()}`);
  console.log(`     Required Words (${COURSE_DATA.ceHours} CE × 6,000): ${requiredWords.toLocaleString()}`);
  console.log(`     Word Count Status: ${estimatedWords >= requiredWords ? '✅ MEETS REQUIREMENT' : '⚠️  BELOW REQUIREMENT — add more content'}`);
  console.log(`     Accessibility: WCAG ${COURSE_DATA.accessibility.wcagLevel}`);

  // ── ACEP Compliance Warnings ──
  console.log(`\n  🔍 ACEP Compliance Check:`);
  
  let issues = 0;
  
  if (COURSE_DATA.assessment.questions.length < 15) {
    console.log(`     ⚠️  Assessment has ${COURSE_DATA.assessment.questions.length} questions (minimum 15)`);
    issues++;
  } else {
    console.log(`     ✅ Assessment: ${COURSE_DATA.assessment.questions.length} questions`);
  }

  if (estimatedWords < requiredWords) {
    console.log(`     ⚠️  Word count: ${estimatedWords.toLocaleString()} / ${requiredWords.toLocaleString()} required`);
    issues++;
  } else {
    console.log(`     ✅ Word count: ${estimatedWords.toLocaleString()} / ${requiredWords.toLocaleString()} required`);
  }

  COURSE_DATA.modules.forEach((m, i) => {
    const kcCount = (m.contentBlocks || []).filter(b => b.type === 'multipleChoice').length;
    if (kcCount < 2) {
      console.log(`     ⚠️  Module ${i + 1} has ${kcCount} knowledge checks (minimum 2)`);
      issues++;
    } else {
      console.log(`     ✅ Module ${i + 1}: ${kcCount} knowledge checks`);
    }
  });

  if (COURSE_DATA.objectives.length < 5) {
    console.log(`     ⚠️  Only ${COURSE_DATA.objectives.length} objectives (recommend 5-8)`);
    issues++;
  } else {
    console.log(`     ✅ Objectives: ${COURSE_DATA.objectives.length}`);
  }

  if (issues === 0) {
    console.log(`\n  🎉 All ACEP compliance checks passed!`);
  } else {
    console.log(`\n  ⚠️  ${issues} issue(s) to address before publishing`);
  }

  console.log(`\n  📝 Status: ${COURSE_DATA.status.toUpperCase()} (set status: "published" and isPublished: true when ready)`);

  await mongoose.disconnect();
  console.log('\n✅ Done.\n');
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
