/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * xAPI (Tin Can API) Implementation
 * Sends learning statements to an LRS (Learning Record Store)
 */

// xAPI Statement Builder
export function buildStatement(actor, verb, object, result = null, context = null) {
  const statement = {
    actor: {
      objectType: 'Agent',
      name: actor.name,
      mbox: `mailto:${actor.email}`
    },
    verb: {
      id: verb.id,
      display: { 'en-US': verb.display }
    },
    object: {
      objectType: 'Activity',
      id: object.id,
      definition: {
        type: object.type,
        name: { 'en-US': object.name },
        description: { 'en-US': object.description || '' }
      }
    },
    timestamp: new Date().toISOString()
  };

  if (result) {
    statement.result = result;
  }

  if (context) {
    statement.context = context;
  }

  return statement;
}

// Common xAPI Verbs
export const VERBS = {
  LAUNCHED: {
    id: 'http://adlnet.gov/expapi/verbs/launched',
    display: 'launched'
  },
  INITIALIZED: {
    id: 'http://adlnet.gov/expapi/verbs/initialized',
    display: 'initialized'
  },
  COMPLETED: {
    id: 'http://adlnet.gov/expapi/verbs/completed',
    display: 'completed'
  },
  PASSED: {
    id: 'http://adlnet.gov/expapi/verbs/passed',
    display: 'passed'
  },
  FAILED: {
    id: 'http://adlnet.gov/expapi/verbs/failed',
    display: 'failed'
  },
  ATTEMPTED: {
    id: 'http://adlnet.gov/expapi/verbs/attempted',
    display: 'attempted'
  },
  EXPERIENCED: {
    id: 'http://adlnet.gov/expapi/verbs/experienced',
    display: 'experienced'
  },
  PROGRESSED: {
    id: 'http://adlnet.gov/expapi/verbs/progressed',
    display: 'progressed'
  },
  EARNED: {
    id: 'http://adlnet.gov/expapi/verbs/earned',
    display: 'earned'
  }
};

// Activity Types
export const ACTIVITY_TYPES = {
  COURSE: 'http://adlnet.gov/expapi/activities/course',
  MODULE: 'http://adlnet.gov/expapi/activities/module',
  LESSON: 'http://adlnet.gov/expapi/activities/lesson',
  ASSESSMENT: 'http://adlnet.gov/expapi/activities/assessment',
  INTERACTION: 'http://adlnet.gov/expapi/activities/interaction'
};

// xAPI Client for sending statements to LRS
export class xAPIClient {
  constructor(endpoint, username, password) {
    this.endpoint = endpoint;
    this.auth = Buffer.from(`${username}:${password}`).toString('base64');
  }

  async sendStatement(statement) {
    try {
      const response = await fetch(`${this.endpoint}/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.auth}`,
          'X-Experience-API-Version': '1.0.3'
        },
        body: JSON.stringify(statement)
      });

      if (!response.ok) {
        throw new Error(`xAPI Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('xAPI send error:', error);
      throw error;
    }
  }

  async sendStatements(statements) {
    try {
      const response = await fetch(`${this.endpoint}/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.auth}`,
          'X-Experience-API-Version': '1.0.3'
        },
        body: JSON.stringify(statements)
      });

      if (!response.ok) {
        throw new Error(`xAPI Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('xAPI batch send error:', error);
      throw error;
    }
  }

  async getStatements(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    
    try {
      const response = await fetch(`${this.endpoint}/statements?${queryString}`, {
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'X-Experience-API-Version': '1.0.3'
        }
      });

      if (!response.ok) {
        throw new Error(`xAPI Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('xAPI get error:', error);
      throw error;
    }
  }
}

// Helper to create course launch statement
export function createCourseLaunchStatement(user, course, baseUrl) {
  return buildStatement(
    { name: user.name, email: user.email },
    VERBS.LAUNCHED,
    {
      id: `${baseUrl}/courses/${course.slug}`,
      type: ACTIVITY_TYPES.COURSE,
      name: course.title,
      description: course.description
    }
  );
}

// Helper to create lesson completion statement
export function createLessonCompleteStatement(user, course, lesson, baseUrl, duration = null) {
  const result = {
    completion: true
  };

  if (duration) {
    result.duration = `PT${Math.round(duration)}S`; // ISO 8601 duration
  }

  return buildStatement(
    { name: user.name, email: user.email },
    VERBS.COMPLETED,
    {
      id: `${baseUrl}/courses/${course.slug}/lessons/${lesson._id}`,
      type: ACTIVITY_TYPES.LESSON,
      name: lesson.title,
      description: ''
    },
    result,
    {
      contextActivities: {
        parent: [{
          objectType: 'Activity',
          id: `${baseUrl}/courses/${course.slug}`,
          definition: {
            type: ACTIVITY_TYPES.COURSE,
            name: { 'en-US': course.title }
          }
        }]
      }
    }
  );
}

// Helper to create quiz attempt statement
export function createQuizAttemptStatement(user, course, quiz, score, passed, baseUrl) {
  return buildStatement(
    { name: user.name, email: user.email },
    passed ? VERBS.PASSED : VERBS.FAILED,
    {
      id: `${baseUrl}/courses/${course.slug}/quizzes/${quiz._id}`,
      type: ACTIVITY_TYPES.ASSESSMENT,
      name: quiz.title,
      description: ''
    },
    {
      score: {
        scaled: score / 100,
        raw: score,
        min: 0,
        max: 100
      },
      success: passed,
      completion: true
    },
    {
      contextActivities: {
        parent: [{
          objectType: 'Activity',
          id: `${baseUrl}/courses/${course.slug}`,
          definition: {
            type: ACTIVITY_TYPES.COURSE,
            name: { 'en-US': course.title }
          }
        }]
      }
    }
  );
}

// Helper to create course completion statement
export function createCourseCompleteStatement(user, course, baseUrl, ceHours = null) {
  const result = {
    completion: true,
    success: true
  };

  const extensions = {};
  if (ceHours) {
    extensions['https://counselorready.com/xapi/extensions/ce-hours'] = ceHours;
  }

  if (Object.keys(extensions).length > 0) {
    result.extensions = extensions;
  }

  return buildStatement(
    { name: user.name, email: user.email },
    VERBS.COMPLETED,
    {
      id: `${baseUrl}/courses/${course.slug}`,
      type: ACTIVITY_TYPES.COURSE,
      name: course.title,
      description: course.description
    },
    result
  );
}

// Helper to create CE earned statement
export function createCEEarnedStatement(user, course, ceHours, baseUrl) {
  return buildStatement(
    { name: user.name, email: user.email },
    VERBS.EARNED,
    {
      id: `${baseUrl}/courses/${course.slug}/certificate`,
      type: 'http://activitystrea.ms/schema/1.0/badge',
      name: `${course.title} CE Certificate`,
      description: `${ceHours} CE hours earned`
    },
    {
      extensions: {
        'https://counselorready.com/xapi/extensions/ce-hours': ceHours,
        'https://counselorready.com/xapi/extensions/provider': 'NBCC ACEP #7760'
      }
    }
  );
}

export default {
  buildStatement,
  VERBS,
  ACTIVITY_TYPES,
  xAPIClient,
  createCourseLaunchStatement,
  createLessonCompleteStatement,
  createQuizAttemptStatement,
  createCourseCompleteStatement,
  createCEEarnedStatement
};
