/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("No MONGODB_URI"); process.exit(1); }

const EXAM_QUESTIONS = [
  { question: "Which role is a mandated reporter in nearly every jurisdiction?", type: "multiple_choice", options: ["Teacher","Journalist","Good Samaritan","IT professional"], correctAnswer: 0, explanation: "Teachers are designated in virtually every jurisdiction due to sustained contact with children." },
  { question: "Bedsores, dehydration, and being left alone in a dependent adult indicate:", type: "multiple_choice", options: ["Physical abuse","Neglect","Financial exploitation","Emotional abuse"], correctAnswer: 1, explanation: "Neglect is failure to provide basic needs including medical care, nutrition, and supervision." },
  { question: "Timeframe for an initial oral report after forming reasonable suspicion?", type: "multiple_choice", options: ["Within 24 hours","Within 3 business days","Immediately or as soon as practicably possible","End of work week"], correctAnswer: 2, explanation: "The initial oral report must be made immediately. Written follow-up typically follows within 24-72 hours." },
  { question: "A therapist learns a client is neglecting their child. What should the therapist do?", type: "multiple_choice", options: ["Continue therapy without reporting","Consult a colleague and take no action","Tell client to self-report","File a report with child protective services"], correctAnswer: 3, explanation: "The legal duty to report supersedes confidentiality. All major ethics codes recognize mandated reporting as an exception." },
  { question: "An elderly customer is repeatedly pressured by a new acquaintance to withdraw large sums. Warrant a report?", type: "multiple_choice", options: ["No, not enough proof","No, private financial matter","Yes, but confirm with family first","Yes, reasonable suspicion of financial exploitation exists"], correctAnswer: 3, explanation: "The standard is reasonable suspicion, not proof." },
  { question: "What legal standard triggers the duty to file a mandated report?", type: "multiple_choice", options: ["Preponderance of evidence","Beyond reasonable doubt","Reasonable suspicion","Clear and convincing evidence"], correctAnswer: 2, explanation: "Reasonable suspicion is deliberately low. You do not need proof or certainty." },
  { question: "Which statement about mandated reporting and confidentiality is TRUE?", type: "multiple_choice", options: ["Confidentiality always takes precedence","Therapists are exempt","Client consent is required before reporting","Mandated reporting is a recognized exception in all major professional ethics codes"], correctAnswer: 3, explanation: "The APA, NASW, AMA, ACA and others all explicitly recognize mandated reporting as a confidentiality exception." },
  { question: "A good faith report is later found unfounded. What legal consequence does the reporter face?", type: "multiple_choice", options: ["Civil lawsuit","Professional sanctions","Misdemeanor charge","None - good faith reporters have legal immunity"], correctAnswer: 3, explanation: "Good faith immunity protects mandated reporters from civil and criminal liability." },
  { question: "A supervisor says not to report suspected emotional abuse. What should the social worker do?", type: "multiple_choice", options: ["Follow the supervisor","Document and take no action","Wait for next supervision","Report - the duty is personal and non-delegable"], correctAnswer: 3, explanation: "The duty to report is personal and cannot be overridden by a supervisor." },
  { question: "Which is the BEST example of objective documentation for a mandated report?", type: "multiple_choice", options: ["Child seemed depressed about home life","I believe the parents are abusing this child","On March 15 the child said Daddy hits me when I am bad","The injuries are consistent with physical abuse"], correctAnswer: 2, explanation: "Record specific observations, direct quotes, dates, and context - not interpretations or conclusions." },
  { question: "The two-step reporting process requires:", type: "multiple_choice", options: ["Investigate then report","Notify family then call CPS","Consult supervisor then file jointly","Immediate oral report then written follow-up within jurisdiction timeframe"], correctAnswer: 3, explanation: "Step 1: immediate oral report. Step 2: written follow-up. You do not investigate first." },
  { question: "A child asks you not to tell anyone. You have reasonable suspicion of abuse. What do you do?", type: "multiple_choice", options: ["Honor the request","Promise not to tell but keep a record","Wait for child to disclose again","Explain safety comes first then report"], correctAnswer: 3, explanation: "A child request for confidentiality does not override the legal obligation to report." },
  { question: "Which behavioral indicator is MOST concerning for physical abuse?", type: "multiple_choice", options: ["Age-appropriate defiance","Single bruise after playground fall","Reluctance to participate in class","Flinching when adults raise hands combined with long sleeves in warm weather"], correctAnswer: 3, explanation: "Flinching suggests conditioned fear; concealing clothing suggests hidden injuries." },
  { question: "In states with universal mandated reporting, who must report?", type: "multiple_choice", options: ["Only professionals working with children","Only licensed healthcare professionals","Only trained mandated reporters","Every adult regardless of profession"], correctAnswer: 3, explanation: "Universal mandated reporting states require every adult to report." },
  { question: "Which is NOT an appropriate reason to delay a mandated report?", type: "multiple_choice", options: ["Immediate danger requiring 911 first","Needing a moment to collect observations","Cannot safely call from current location","Wanting to gather more evidence"], correctAnswer: 3, explanation: "Wanting more evidence is never appropriate. The standard is reasonable suspicion, not proof." }
];

const EXAM_LESSON = {
  title: "Final Assessment: See Something? Say Something",
  type: "quiz",
  order: 99,
  isExam: true,
  passingScore: 80,
  maxAttempts: 3,
  shuffleQuestions: true,
  showExplanations: true,
  questions: EXAM_QUESTIONS
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const Course = mongoose.connection.collection("courses");
  const course = await Course.findOne({ slug: "mandated-reporter-duty" });

  if (!course) {
    console.error("Course not found - run seedMandatedReporter.js first");
    process.exit(1);
  }

  console.log("Found:", course.title);

  // Add exam lesson to last module, replacing any existing exam
  const updatedModules = course.modules.map((m, i) => {
    if (i === course.modules.length - 1) {
      const lessons = (m.lessons || []).filter(l => !l.isExam);
      lessons.push(EXAM_LESSON);
      return { ...m, lessons };
    }
    return m;
  });

  await Course.updateOne(
    { slug: "mandated-reporter-duty" },
    { $set: { 
      modules: updatedModules,
      assessment: { questions: EXAM_QUESTIONS, passingScore: 80, maxAttempts: 3 }
    }}
  );

  console.log("Final exam added/updated with", EXAM_QUESTIONS.length, "questions");
  console.log("Done.");
  await mongoose.disconnect();
}

main().catch(err => { console.error("Error:", err.message); process.exit(1); });
