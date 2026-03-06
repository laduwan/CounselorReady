/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * LTI (Learning Tools Interoperability) Provider Implementation
 * Allows other LMS platforms (Canvas, Moodle, Blackboard) to embed our courses
 */

import crypto from 'crypto';

// LTI 1.1 OAuth signature verification
export function verifyOAuthSignature(params, consumerSecret, url, method = 'POST') {
  // Build base string
  const sortedParams = Object.keys(params)
    .filter(k => k !== 'oauth_signature')
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

  const baseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');

  // Create signature
  const key = `${encodeURIComponent(consumerSecret)}&`;
  const signature = crypto
    .createHmac('sha1', key)
    .update(baseString)
    .digest('base64');

  return signature === params.oauth_signature;
}

// Generate OAuth signature for responses
export function generateOAuthSignature(params, consumerSecret, url, method = 'POST') {
  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

  const baseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');

  const key = `${encodeURIComponent(consumerSecret)}&`;
  return crypto
    .createHmac('sha1', key)
    .update(baseString)
    .digest('base64');
}

// Parse LTI launch request
export function parseLTILaunch(body) {
  return {
    // OAuth params
    consumerKey: body.oauth_consumer_key,
    signature: body.oauth_signature,
    signatureMethod: body.oauth_signature_method,
    timestamp: body.oauth_timestamp,
    nonce: body.oauth_nonce,
    version: body.oauth_version,

    // LTI params
    ltiMessageType: body.lti_message_type,
    ltiVersion: body.lti_version,
    resourceLinkId: body.resource_link_id,
    resourceLinkTitle: body.resource_link_title,

    // User info
    userId: body.user_id,
    userFullName: body.lis_person_name_full,
    userFirstName: body.lis_person_name_given,
    userLastName: body.lis_person_name_family,
    userEmail: body.lis_person_contact_email_primary,
    roles: body.roles,

    // Context info
    contextId: body.context_id,
    contextTitle: body.context_title,
    contextLabel: body.context_label,
    contextType: body.context_type,

    // Tool consumer info
    toolConsumerInstanceGuid: body.tool_consumer_instance_guid,
    toolConsumerInstanceName: body.tool_consumer_instance_name,

    // Outcome service (for reporting grades back)
    lisOutcomeServiceUrl: body.lis_outcome_service_url,
    lisResultSourcedId: body.lis_result_sourcedid,

    // Custom parameters
    customCourseId: body.custom_course_id,
    customCourseSlug: body.custom_course_slug,

    // Launch presentation
    launchPresentationReturnUrl: body.launch_presentation_return_url,
    launchPresentationLocale: body.launch_presentation_locale
  };
}

// Check if user is instructor/admin
export function isInstructor(roles) {
  if (!roles) return false;
  const instructorRoles = [
    'Instructor',
    'Administrator',
    'urn:lti:role:ims/lis/Instructor',
    'urn:lti:role:ims/lis/Administrator',
    'urn:lti:instrole:ims/lis/Administrator'
  ];
  return instructorRoles.some(r => roles.includes(r));
}

// Build LTI outcome XML for grade passback
export function buildOutcomeXML(sourcedId, score, messageId = null) {
  const msgId = messageId || crypto.randomUUID();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<imsx_POXEnvelopeRequest xmlns="http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
  <imsx_POXHeader>
    <imsx_POXRequestHeaderInfo>
      <imsx_version>V1.0</imsx_version>
      <imsx_messageIdentifier>${msgId}</imsx_messageIdentifier>
    </imsx_POXRequestHeaderInfo>
  </imsx_POXHeader>
  <imsx_POXBody>
    <replaceResultRequest>
      <resultRecord>
        <sourcedGUID>
          <sourcedId>${sourcedId}</sourcedId>
        </sourcedGUID>
        <result>
          <resultScore>
            <language>en</language>
            <textString>${score}</textString>
          </resultScore>
        </result>
      </resultRecord>
    </replaceResultRequest>
  </imsx_POXBody>
</imsx_POXEnvelopeRequest>`;
}

// Send grade back to LMS
export async function sendGrade(outcomeServiceUrl, sourcedId, score, consumerKey, consumerSecret) {
  const xml = buildOutcomeXML(sourcedId, score);
  
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_version: '1.0',
    oauth_body_hash: crypto.createHash('sha1').update(xml).digest('base64')
  };

  oauthParams.oauth_signature = generateOAuthSignature(
    oauthParams,
    consumerSecret,
    outcomeServiceUrl,
    'POST'
  );

  const authHeader = 'OAuth ' + Object.keys(oauthParams)
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(', ');

  try {
    const response = await fetch(outcomeServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': authHeader
      },
      body: xml
    });

    const responseText = await response.text();
    return {
      success: response.ok && responseText.includes('success'),
      response: responseText
    };
  } catch (error) {
    console.error('LTI grade send error:', error);
    return { success: false, error: error.message };
  }
}

// LTI configuration for tool consumers
export function getLTIConfig(baseUrl, courseSlug = null) {
  const launchUrl = courseSlug 
    ? `${baseUrl}/api/lti/launch/${courseSlug}`
    : `${baseUrl}/api/lti/launch`;

  return {
    title: 'CounselorReady CE Courses',
    description: 'NBCC-Approved Continuing Education courses for mental health professionals',
    launchUrl: launchUrl,
    icon: `${baseUrl}/favicon.svg`,
    customParameters: courseSlug ? { course_slug: courseSlug } : {},
    extensions: {
      canvas: {
        privacy_level: 'public',
        tool_id: 'counselorready',
        domain: new URL(baseUrl).hostname
      }
    }
  };
}

// Generate LTI cartridge XML (for easy LMS installation)
export function generateLTICartridge(baseUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<cartridge_basiclti_link xmlns="http://www.imsglobal.org/xsd/imslticc_v1p0"
    xmlns:blti="http://www.imsglobal.org/xsd/imsbasiclti_v1p0"
    xmlns:lticm="http://www.imsglobal.org/xsd/imslticm_v1p0"
    xmlns:lticp="http://www.imsglobal.org/xsd/imslticp_v1p0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsglobal.org/xsd/imslticc_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticc_v1p0.xsd
      http://www.imsglobal.org/xsd/imsbasiclti_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imsbasiclti_v1p0.xsd
      http://www.imsglobal.org/xsd/imslticm_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticm_v1p0.xsd
      http://www.imsglobal.org/xsd/imslticp_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticp_v1p0.xsd">
  <blti:title>CounselorReady CE Courses</blti:title>
  <blti:description>NBCC-Approved Continuing Education courses for mental health professionals. Provider #7760.</blti:description>
  <blti:icon>${baseUrl}/favicon.svg</blti:icon>
  <blti:launch_url>${baseUrl}/api/lti/launch</blti:launch_url>
  <blti:extensions platform="canvas.instructure.com">
    <lticm:property name="tool_id">counselorready</lticm:property>
    <lticm:property name="privacy_level">public</lticm:property>
    <lticm:property name="domain">${new URL(baseUrl).hostname}</lticm:property>
    <lticm:options name="course_navigation">
      <lticm:property name="enabled">true</lticm:property>
      <lticm:property name="text">CounselorReady CE</lticm:property>
    </lticm:options>
  </blti:extensions>
  <cartridge_bundle identifierref="BLTI001_Bundle"/>
  <cartridge_icon identifierref="BLTI001_Icon"/>
</cartridge_basiclti_link>`;
}

export default {
  verifyOAuthSignature,
  generateOAuthSignature,
  parseLTILaunch,
  isInstructor,
  buildOutcomeXML,
  sendGrade,
  getLTIConfig,
  generateLTICartridge
};
