/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * State-mandate suggestion map (Practice Compliance §3.9).
 *
 * DATA ONLY. Starts with the owner's licensure states (GA, TX, FL, ID) and is
 * easily extended. Drives "suggested global tracks" from an org's
 * settings.statesOfOperation. Suggestions are advisory — never auto-assigned.
 */
export const STATE_MANDATES = {
  GA: {
    name: 'Georgia',
    suggestedTracks: ['Annual Compliance Core — Clinical', 'New Clinician Onboarding'],
    suggestedCourses: ['CR-PC102-GA', 'CR-PC202-GA'],
    notes: 'GA Composite Board Rule 135-9/135-11. Ethics hours must be synchronous. Agency orgs add the DBHDD/DCH layer.'
  },
  TX: {
    name: 'Texas',
    suggestedTracks: ['Annual Compliance Core — Clinical', 'Supervisor Track'],
    suggestedCourses: ['CR-PC102-TX', 'CR-PC202-TX'],
    notes: 'Texas LPC rules. Supervision of associates documented per board requirements.'
  },
  FL: {
    name: 'Florida',
    suggestedTracks: ['Annual Compliance Core — Clinical'],
    suggestedCourses: ['CR-PC102-FL', 'CR-PC202-FL'],
    notes: 'Florida 491 board. Telehealth registration tracked as a credential.'
  },
  ID: {
    name: 'Idaho',
    suggestedTracks: ['Annual Compliance Core — Clinical'],
    suggestedCourses: ['CR-PC102-ID', 'CR-PC202-ID'],
    notes: 'Idaho counseling board requirements.'
  }
};

/**
 * Suggest global track names + state-variant courses for an org's states.
 * @param {string[]} states - e.g. ['GA','TX']
 * @returns {{ tracks: string[], courses: string[], states: object[] }}
 */
export function suggestForStates(states = []) {
  const tracks = new Set();
  const courses = new Set();
  const stateInfo = [];
  for (const raw of states) {
    const code = String(raw || '').toUpperCase();
    const entry = STATE_MANDATES[code];
    if (!entry) continue;
    entry.suggestedTracks.forEach(t => tracks.add(t));
    entry.suggestedCourses.forEach(c => courses.add(c));
    stateInfo.push({ code, name: entry.name, notes: entry.notes });
  }
  return { tracks: [...tracks], courses: [...courses], states: stateInfo };
}

export default STATE_MANDATES;
