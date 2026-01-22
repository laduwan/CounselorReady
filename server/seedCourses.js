// seed-courses.ts
// Run with: npx ts-node prisma/seed-courses.ts
// Or add to your existing seed.ts file

import { PrismaClient } from '@prisma/client';
import seedData from './counselorready-course-seed.json';

const prisma = new PrismaClient();

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  videoDuration?: number;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  passingScore: number;
  questions: QuizQuestion[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  ceHours: number;
  ceType: string;
  price: number;
  level: string;
  isPublished: boolean;
  isFree: boolean;
  thumbnailUrl: string;
  learningObjectives: string[];
  modules: Module[];
  quiz: Quiz;
  bibliography: string[];
}

async function main() {
  console.log('🌱 Starting course seed...');
  
  const courses: Course[] = seedData.courses;
  
  for (const courseData of courses) {
    console.log(`📚 Seeding: ${courseData.title}`);
    
    // Check if course already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug: courseData.slug }
    });
    
    if (existingCourse) {
      console.log(`   ⏭️  Skipping (already exists): ${courseData.slug}`);
      continue;
    }
    
    // Create the course
    const course = await prisma.course.create({
      data: {
        slug: courseData.slug,
        title: courseData.title,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        ceHours: courseData.ceHours,
        ceType: courseData.ceType,
        price: courseData.price,
        level: courseData.level,
        isPublished: courseData.isPublished,
        isFree: courseData.isFree,
        thumbnailUrl: courseData.thumbnailUrl,
        learningObjectives: courseData.learningObjectives,
        bibliography: courseData.bibliography,
      }
    });
    
    // Create modules and lessons
    for (const moduleData of courseData.modules) {
      const module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleData.title,
          order: moduleData.order,
        }
      });
      
      // Create lessons
      for (const lessonData of moduleData.lessons) {
        await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: lessonData.title,
            content: lessonData.content,
            videoUrl: lessonData.videoUrl || null,
            videoDuration: lessonData.videoDuration || null,
            order: lessonData.order,
          }
        });
      }
    }
    
    // Create quiz
    if (courseData.quiz) {
      const quiz = await prisma.quiz.create({
        data: {
          courseId: course.id,
          passingScore: courseData.quiz.passingScore,
        }
      });
      
      // Create quiz questions
      for (let i = 0; i < courseData.quiz.questions.length; i++) {
        const q = courseData.quiz.questions[i];
        await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: i + 1,
          }
        });
      }
    }
    
    console.log(`   ✅ Created: ${courseData.title}`);
  }
  
  console.log('\n✨ Course seeding complete!');
  
  // Summary
  const totalCourses = await prisma.course.count();
  const freeCourses = await prisma.course.count({ where: { isFree: true } });
  const paidCourses = await prisma.course.count({ where: { isFree: false } });
  
  console.log('\n📊 Summary:');
  console.log(`   Total courses: ${totalCourses}`);
  console.log(`   Free courses: ${freeCourses}`);
  console.log(`   Paid courses: ${paidCourses}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
