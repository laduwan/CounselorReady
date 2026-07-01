/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Lightweight request validation middleware.
 *
 * Usage:
 *   validate({ body: { title: 'string', hours: 'number' } })
 *   validate({ body: { email: 'email' } })
 *   validate({ query: { page: 'positiveInt?' } })   // optional field
 *
 * Supported type strings:
 *   'string'       – non-empty trimmed string
 *   'email'        – basic email format
 *   'number'       – finite number (accepts string-encoded)
 *   'positiveInt'  – integer > 0
 *   'boolean'      – true / false / 'true' / 'false'
 *   'date'         – value parseable by Date
 *   'array'        – Array.isArray
 *   'objectId'     – 24-char hex string (Mongo ObjectId)
 *
 * Append '?' to make a field optional (e.g. 'string?').
 */
export function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const source of ['body', 'query', 'params']) {
      if (!schema[source]) continue;

      for (const [field, rawRule] of Object.entries(schema[source])) {
        const optional = rawRule.endsWith('?');
        const rule = optional ? rawRule.slice(0, -1) : rawRule;
        // Support dot-notation for nested fields (e.g. 'supervisor.name')
        const value = field.split('.').reduce((obj, key) => obj?.[key], req[source] || {});

        if (value === undefined || value === null || value === '') {
          if (!optional) errors.push(`${field} is required`);
          continue;
        }

        switch (rule) {
          case 'string':
            if (typeof value !== 'string' || !value.trim()) {
              errors.push(`${field} must be a non-empty string`);
            }
            break;
          case 'email':
            if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              errors.push(`${field} must be a valid email`);
            }
            break;
          case 'number':
            if (isNaN(Number(value)) || !isFinite(Number(value))) {
              errors.push(`${field} must be a number`);
            }
            break;
          case 'positiveInt': {
            const n = Number(value);
            if (!Number.isInteger(n) || n < 1) {
              errors.push(`${field} must be a positive integer`);
            }
            break;
          }
          case 'boolean':
            if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
              errors.push(`${field} must be a boolean`);
            }
            break;
          case 'date':
            if (isNaN(Date.parse(value))) {
              errors.push(`${field} must be a valid date`);
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              errors.push(`${field} must be an array`);
            }
            break;
          case 'objectId':
            if (typeof value !== 'string' || !/^[0-9a-fA-F]{24}$/.test(value)) {
              errors.push(`${field} must be a valid ID`);
            }
            break;
          default:
            break;
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    next();
  };
}
