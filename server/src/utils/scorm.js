/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse SCORM manifest
export function parseScormManifest(manifestXml) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });
  
  const manifest = parser.parse(manifestXml);
  const root = manifest.manifest;
  
  // Extract course info
  const courseInfo = {
    title: '',
    description: '',
    identifier: root['@_identifier'] || 'course',
    organizations: [],
    resources: []
  };
  
  // Get organizations (course structure)
  const orgs = root.organizations;
  if (orgs && orgs.organization) {
    const org = Array.isArray(orgs.organization) ? orgs.organization[0] : orgs.organization;
    courseInfo.title = org.title || 'Imported Course';
    
    // Get items (lessons/modules)
    if (org.item) {
      const items = Array.isArray(org.item) ? org.item : [org.item];
      courseInfo.organizations = parseItems(items);
    }
  }
  
  // Get resources
  if (root.resources && root.resources.resource) {
    const resources = Array.isArray(root.resources.resource) 
      ? root.resources.resource 
      : [root.resources.resource];
    
    courseInfo.resources = resources.map(r => ({
      identifier: r['@_identifier'],
      type: r['@_type'],
      href: r['@_href'],
      scormType: r['@_adlcp:scormtype'] || r['@_adlcp:scormType'] || 'sco'
    }));
  }
  
  return courseInfo;
}

// Parse nested items recursively
function parseItems(items, depth = 0) {
  return items.map(item => {
    const parsed = {
      identifier: item['@_identifier'],
      identifierref: item['@_identifierref'],
      title: item.title || 'Untitled',
      isModule: depth === 0,
      children: []
    };
    
    if (item.item) {
      const children = Array.isArray(item.item) ? item.item : [item.item];
      parsed.children = parseItems(children, depth + 1);
    }
    
    return parsed;
  });
}

// Convert parsed SCORM to Course format
export function scormToCourse(scormData, extractedPath) {
  const course = {
    slug: scormData.identifier.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title: scormData.title,
    description: `Imported SCORM course: ${scormData.title}`,
    instructor: 'Imported',
    accessType: 'subscription',
    ceuEligible: false,
    ceuHours: 0,
    status: 'draft',
    modules: []
  };
  
  // Build modules from organizations
  scormData.organizations.forEach((item, index) => {
    if (item.isModule || item.children.length > 0) {
      // This is a module
      const module = {
        title: item.title,
        order: index + 1,
        lessons: []
      };
      
      // Add children as lessons
      if (item.children.length > 0) {
        item.children.forEach((child, lIndex) => {
          const resource = scormData.resources.find(r => r.identifier === child.identifierref);
          module.lessons.push({
            title: child.title,
            type: 'text',
            content: resource ? `<p>Content from: ${resource.href}</p><p>Edit this lesson to add your content.</p>` : '<p>No content found</p>',
            duration: 10,
            order: lIndex + 1,
            isFree: false,
            scormIdentifier: child.identifier,
            scormResourceRef: child.identifierref
          });
        });
      } else {
        // Module with no children - make it a lesson
        const resource = scormData.resources.find(r => r.identifier === item.identifierref);
        module.lessons.push({
          title: item.title,
          type: 'text',
          content: resource ? `<p>Content from: ${resource.href}</p><p>Edit this lesson to add your content.</p>` : '<p>No content found</p>',
          duration: 10,
          order: 1,
          isFree: false
        });
      }
      
      course.modules.push(module);
    } else {
      // Single item - create a module for it
      const resource = scormData.resources.find(r => r.identifier === item.identifierref);
      course.modules.push({
        title: item.title,
        order: index + 1,
        lessons: [{
          title: item.title,
          type: 'text',
          content: resource ? `<p>Content from: ${resource.href}</p><p>Edit this lesson to add your content.</p>` : '<p>No content found</p>',
          duration: 10,
          order: 1,
          isFree: false
        }]
      });
    }
  });
  
  // If no modules were created, create a default one
  if (course.modules.length === 0) {
    course.modules.push({
      title: 'Module 1',
      order: 1,
      lessons: [{
        title: 'Introduction',
        type: 'text',
        content: '<p>Edit this lesson to add your content.</p>',
        duration: 10,
        order: 1,
        isFree: true
      }]
    });
  }
  
  return course;
}

// Generate SCORM 1.2 manifest
export function generateScormManifest(course) {
  const identifier = course.slug || 'course';
  
  // Build items from modules/lessons
  let itemsXml = '';
  let resourcesXml = '';
  let resourceIndex = 0;
  
  course.modules.forEach((module, mIndex) => {
    const moduleId = `module_${mIndex}`;
    itemsXml += `      <item identifier="${moduleId}">\n`;
    itemsXml += `        <title>${escapeXml(module.title)}</title>\n`;
    
    module.lessons.forEach((lesson, lIndex) => {
      const lessonId = `lesson_${mIndex}_${lIndex}`;
      const resourceId = `resource_${resourceIndex}`;
      
      itemsXml += `        <item identifier="${lessonId}" identifierref="${resourceId}">\n`;
      itemsXml += `          <title>${escapeXml(lesson.title)}</title>\n`;
      itemsXml += `        </item>\n`;
      
      resourcesXml += `    <resource identifier="${resourceId}" type="webcontent" adlcp:scormtype="sco" href="content/${lessonId}.html">\n`;
      resourcesXml += `      <file href="content/${lessonId}.html"/>\n`;
      resourcesXml += `    </resource>\n`;
      
      resourceIndex++;
    });
    
    itemsXml += `      </item>\n`;
  });
  
  const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
    http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${escapeXml(course.title)}</title>
${itemsXml}    </organization>
  </organizations>
  <resources>
${resourcesXml}  </resources>
</manifest>`;
  
  return manifest;
}

// Generate SCORM API wrapper
export function generateScormApiWrapper() {
  return `
var API = null;

function findAPI(win) {
  var tries = 0;
  while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
    tries++;
    if (tries > 7) return null;
    win = win.parent;
  }
  return win.API;
}

function getAPI() {
  if (API == null) {
    API = findAPI(window);
    if ((API == null) && (window.opener != null)) {
      API = findAPI(window.opener);
    }
  }
  return API;
}

function LMSInitialize() {
  var api = getAPI();
  if (api) return api.LMSInitialize("");
  return "false";
}

function LMSFinish() {
  var api = getAPI();
  if (api) return api.LMSFinish("");
  return "false";
}

function LMSGetValue(name) {
  var api = getAPI();
  if (api) return api.LMSGetValue(name);
  return "";
}

function LMSSetValue(name, value) {
  var api = getAPI();
  if (api) return api.LMSSetValue(name, value);
  return "false";
}

function LMSCommit() {
  var api = getAPI();
  if (api) return api.LMSCommit("");
  return "false";
}

// Initialize on load
window.onload = function() {
  LMSInitialize();
  LMSSetValue("cmi.core.lesson_status", "incomplete");
};

// Complete lesson
function completelesson() {
  LMSSetValue("cmi.core.lesson_status", "completed");
  LMSSetValue("cmi.core.score.raw", "100");
  LMSCommit();
}

// Finish on unload
window.onunload = function() {
  LMSFinish();
};
`;
}

// Generate lesson HTML for SCORM
export function generateLessonHtml(lesson, courseTitle) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(lesson.title)} - ${escapeXml(courseTitle)}</title>
  <script src="../scorm_api.js"></script>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #6b1d34; }
    h2 { color: #34503d; }
    .complete-btn { background: #6b1d34; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; margin-top: 20px; }
    .complete-btn:hover { background: #4a1524; }
  </style>
</head>
<body>
  <h1>${escapeXml(lesson.title)}</h1>
  <div class="content">
    ${lesson.content || '<p>No content available.</p>'}
  </div>
  <button class="complete-btn" onclick="completeLesson()">Mark Complete</button>
</body>
</html>`;
}

// Create SCORM package as zip buffer
export async function createScormPackage(course) {
  const zip = new AdmZip();
  
  // Add manifest
  const manifest = generateScormManifest(course);
  zip.addFile('imsmanifest.xml', Buffer.from(manifest, 'utf8'));
  
  // Add SCORM API wrapper
  const apiWrapper = generateScormApiWrapper();
  zip.addFile('scorm_api.js', Buffer.from(apiWrapper, 'utf8'));
  
  // Add lesson content files
  course.modules.forEach((module, mIndex) => {
    module.lessons.forEach((lesson, lIndex) => {
      const lessonHtml = generateLessonHtml(lesson, course.title);
      const filename = `content/lesson_${mIndex}_${lIndex}.html`;
      zip.addFile(filename, Buffer.from(lessonHtml, 'utf8'));
    });
  });
  
  return zip.toBuffer();
}

// Helper to escape XML
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default {
  parseScormManifest,
  scormToCourse,
  generateScormManifest,
  createScormPackage
};
