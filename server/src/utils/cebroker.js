/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * CE Broker Integration
 * Automatically reports CE completions to CE Broker for FL, GA, and other states
 * 
 * CE Broker API Documentation: https://www.cebroker.com/api
 */

// CE Broker course categories mapped to our categories
const CATEGORY_MAP = {
  'ethics': 'ETHICS',
  'core': 'GENERAL',
  'related': 'GENERAL',
  'supervision': 'SUPERVISION',
  'telehealth': 'GENERAL',
  'laws': 'LAWS_RULES',
  'hiv': 'HIV_AIDS',
  'domestic_violence': 'DOMESTIC_VIOLENCE',
  'medical_errors': 'MEDICAL_ERRORS'
};

// State board codes for CE Broker
const STATE_BOARDS = {
  'FL': {
    boardCode: 'FL-MHC',
    boardName: 'Florida Board of Clinical Social Work, Marriage & Family Therapy and Mental Health Counseling',
    licenseTypes: ['LMHC', 'LMFT', 'LCSW']
  },
  'GA': {
    boardCode: 'GA-LPC',
    boardName: 'Georgia Composite Board of Professional Counselors, Social Workers, and Marriage and Family Therapists',
    licenseTypes: ['LPC', 'LMFT', 'LCSW', 'LAPC']
  },
  'SC': {
    boardCode: 'SC-LPC',
    boardName: 'South Carolina Board of Examiners for Licensure of Professional Counselors, Marriage and Family Therapists, and Psycho-Educational Specialists',
    licenseTypes: ['LPC', 'LMFT', 'LPC-A']
  },
  'AL': {
    boardCode: 'AL-LPC',
    boardName: 'Alabama Board of Examiners in Counseling',
    licenseTypes: ['LPC', 'ALC']
  },
  'MS': {
    boardCode: 'MS-LPC',
    boardName: 'Mississippi State Board of Examiners for Licensed Professional Counselors',
    licenseTypes: ['LPC']
  }
};

// CE Broker API Client
export class CEBrokerClient {
  constructor(apiKey, providerId, sandbox = false) {
    this.apiKey = apiKey;
    this.providerId = providerId;
    this.baseUrl = sandbox 
      ? 'https://api.sandbox.cebroker.com/v1'
      : 'https://api.cebroker.com/v1';
  }

  async request(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Provider-ID': this.providerId
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `CE Broker API Error: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('CE Broker API error:', error);
      throw error;
    }
  }

  // Report a course completion
  async reportCompletion(completion) {
    return this.request('/completions', 'POST', completion);
  }

  // Batch report completions
  async reportCompletions(completions) {
    return this.request('/completions/batch', 'POST', { completions });
  }

  // Get completion status
  async getCompletionStatus(completionId) {
    return this.request(`/completions/${completionId}`);
  }

  // Verify a license
  async verifyLicense(state, licenseNumber) {
    return this.request(`/licenses/verify?state=${state}&license_number=${licenseNumber}`);
  }

  // Get provider courses
  async getCourses() {
    return this.request('/courses');
  }

  // Register a course with CE Broker
  async registerCourse(course) {
    return this.request('/courses', 'POST', course);
  }
}

// Build completion record for CE Broker
export function buildCompletionRecord(user, course, completionDate, certificateNumber) {
  // Get CE category
  const category = course.ceuCategories?.[0]?.category?.toLowerCase() || 'core';
  const ceBrokerCategory = CATEGORY_MAP[category] || 'GENERAL';

  return {
    // Learner info
    learner: {
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      licenseNumber: user.licenseNumber || '',
      licenseState: user.licenseState || ''
    },
    
    // Course info
    course: {
      providerId: process.env.CE_BROKER_PROVIDER_ID || '',
      courseId: course._id.toString(),
      title: course.title,
      hours: course.ceuHours || 0,
      category: ceBrokerCategory,
      approvalNumber: course.ceuApprovalNumber || '7760'
    },
    
    // Completion info
    completion: {
      date: completionDate.toISOString().split('T')[0],
      certificateNumber: certificateNumber,
      score: 100 // Passing score
    }
  };
}

// Format for CE Broker API submission
export function formatForCEBroker(completionRecord) {
  return {
    provider_id: completionRecord.course.providerId,
    course_id: completionRecord.course.courseId,
    course_title: completionRecord.course.title,
    credit_hours: completionRecord.course.hours,
    credit_type: completionRecord.course.category,
    approval_number: completionRecord.course.approvalNumber,
    
    licensee_first_name: completionRecord.learner.firstName,
    licensee_last_name: completionRecord.learner.lastName,
    licensee_email: completionRecord.learner.email,
    license_number: completionRecord.learner.licenseNumber,
    license_state: completionRecord.learner.licenseState,
    
    completion_date: completionRecord.completion.date,
    certificate_number: completionRecord.completion.certificateNumber,
    score: completionRecord.completion.score
  };
}

// Check if state uses CE Broker
export function stateUsesCEBroker(state) {
  return Object.keys(STATE_BOARDS).includes(state?.toUpperCase());
}

// Get state board info
export function getStateBoardInfo(state) {
  return STATE_BOARDS[state?.toUpperCase()] || null;
}

// Simulated CE Broker submission (for when API isn't configured)
export async function simulateSubmission(completionRecord) {
  console.log('CE Broker Submission (Simulated):', JSON.stringify(completionRecord, null, 2));
  
  return {
    success: true,
    confirmationNumber: `SIM-${Date.now()}`,
    message: 'Simulated submission - configure CE_BROKER_API_KEY for real submissions',
    data: completionRecord
  };
}

// Main function to report completion
export async function reportCECompletion(user, course, completionDate, certificateNumber) {
  const completionRecord = buildCompletionRecord(user, course, completionDate, certificateNumber);
  
  // Check if CE Broker is configured
  if (!process.env.CE_BROKER_API_KEY || !process.env.CE_BROKER_PROVIDER_ID) {
    console.log('CE Broker not configured, simulating submission');
    return simulateSubmission(completionRecord);
  }

  // Check if user's state uses CE Broker
  if (!stateUsesCEBroker(user.licenseState)) {
    return {
      success: false,
      message: `State ${user.licenseState} does not use CE Broker`,
      data: completionRecord
    };
  }

  try {
    const client = new CEBrokerClient(
      process.env.CE_BROKER_API_KEY,
      process.env.CE_BROKER_PROVIDER_ID,
      process.env.CE_BROKER_SANDBOX === 'true'
    );

    const formatted = formatForCEBroker(completionRecord);
    const result = await client.reportCompletion(formatted);

    return {
      success: true,
      confirmationNumber: result.confirmation_number || result.id,
      message: 'Successfully reported to CE Broker',
      data: result
    };
  } catch (error) {
    console.error('CE Broker submission error:', error);
    return {
      success: false,
      error: error.message,
      data: completionRecord
    };
  }
}

// Get supported states list
export function getSupportedStates() {
  return Object.entries(STATE_BOARDS).map(([code, info]) => ({
    code,
    ...info
  }));
}

export default {
  CEBrokerClient,
  buildCompletionRecord,
  formatForCEBroker,
  stateUsesCEBroker,
  getStateBoardInfo,
  reportCECompletion,
  getSupportedStates,
  CATEGORY_MAP,
  STATE_BOARDS
};
