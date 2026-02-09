// Placeholder course parser utility functions
// Full parser implementation to be added later

export function parseCourseMarkdown(markdownText) {
  console.log('⚠️  Course markdown parsing disabled (placeholder mode)');
  
  // Return minimal valid structure
  return {
    title: 'Imported Course',
    description: 'Course parser feature temporarily unavailable',
    modules: [],
    objectives: [],
    metadata: {}
  };
}

export function transformToCourseModel(parsedCourse) {
  console.log('⚠️  Course model transformation disabled (placeholder mode)');
  
  // Return minimal course model
  return {
    title: parsedCourse.title || 'Untitled Course',
    description: parsedCourse.description || '',
    modules: parsedCourse.modules || [],
    objectives: parsedCourse.objectives || [],
    status: 'draft',
    isPublished: false,
    ceHours: 0,
    category: 'General'
  };
}

export function parseMultipleCourses(markdownTexts) {
  console.log('⚠️  Multiple course parsing disabled (placeholder mode)');
  
  // Return empty array
  return [];
}

export default {
  parseCourseMarkdown,
  transformToCourseModel,
  parseMultipleCourses
};
