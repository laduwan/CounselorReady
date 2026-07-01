/**
 * TalentLMS → CounselorReady Migration Script
 * 
 * Migrates users, maps courses, and imports completion records from TalentLMS.
 * Run on Render shell after pushing to GitHub.
 * 
 * Usage:
 *   DRY_RUN=true node server/scripts/migrateTalentLMS.js   (preview only)
 *   node server/scripts/migrateTalentLMS.js                 (execute)
 * 
 * @file server/scripts/migrateTalentLMS.js
 * Copyright © 2026 GAITP LLC. All rights reserved.
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const DRY_RUN = process.env.DRY_RUN === 'true';
const BATCH_ID = `MIG-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`;

// ============================================
// TALENTLMS DATA (extracted from CSV exports)
// ============================================

const COURSE_MAP = {
  'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)': {
    crCode: 'CR-TMH601', crTitle: 'Mastering TeleMental Health', ceHours: 6, category: 'Telehealth'
  },
  'Mastering TeleMental Health: An Essential Guide To Compliant Virtual Healthcare Practice in Georgia': {
    crCode: 'CR-TMH601', crTitle: 'Mastering TeleMental Health', ceHours: 6, category: 'Telehealth'
  },
  'Ethical Practices in Mental Health Counseling': {
    crCode: 'CR-ETH301', crTitle: 'Ethics and Professional Boundaries in Counseling Practice', ceHours: 3, category: 'Ethics'
  },
  'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care (Tra)': {
    crCode: 'CR-308', crTitle: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care', ceHours: 4, category: 'Core'
  },
  'Cultural Sensitivity in Uncertain Political Climates': {
    crCode: 'CR-602', crTitle: 'Cultural Sensitivity in Uncertain Political Climates', ceHours: 1, category: 'Cultural Diversity'
  }
};

// 53 deduped completion records (Meghan Skiba duplicate removed)
const COMPLETIONS = [
  { name: 'Sarah Overton', email: 'soverton@skylandtrail.org', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '01/26/2026, 12:34 PM' },
  { name: 'brandy brock', email: 'BRANDYBOLAN@GMAIL.COM', course: 'Cultural Sensitivity in Uncertain Political Climates', date: '01/15/2026, 10:19 AM' },
  { name: 'Jaylin Ross', email: 'jaylinjross@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '01/13/2026, 01:55 PM' },
  { name: 'Valerie Lawton Edwards', email: 'lawtonedwards@yahoo.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care (Tra)', date: '01/10/2026, 11:39 AM' },
  { name: 'Michelle Thompson', email: 'michelle.n.thompson@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '01/05/2026, 07:13 PM' },
  { name: 'Ryan Snider', email: 'snider.ryanc@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '12/26/2025, 07:59 AM' },
  { name: 'Crystal Johnson', email: 'pathwaystopromise365@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '12/16/2025, 10:42 PM' },
  { name: 'Lisa Guest', email: 'guest.lisa@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '12/16/2025, 04:45 PM' },
  { name: 'Elizabeth Kendrick', email: 'lizlauren1013@gmail.com', course: 'Cultural Sensitivity in Uncertain Political Climates', date: '12/05/2025, 09:52 AM' },
  { name: 'Elizabeth Kendrick', email: 'lizlauren1013@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '12/05/2025, 09:16 AM' },
  { name: 'Felicia Kanu', email: 'nourishwithfelicia@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '12/04/2025, 07:07 PM' },
  { name: 'Shekinah Burnette', email: 'ssisson3084@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '12/04/2025, 03:57 PM' },
  { name: 'Zoe Peralta-Page', email: 'wp7vx@auraprivatemail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '12/03/2025, 08:54 PM' },
  { name: 'Sarah Dundas', email: 'sarangela12@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '12/01/2025, 10:17 AM' },
  { name: 'Kennedy Holmes', email: 'Kennedyhcounselor@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '11/30/2025, 10:56 PM' },
  { name: 'Julie Chahboune', email: 'jchahboune@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '11/11/2025, 10:54 PM' },
  { name: 'Marissa Dogan', email: 'marissa.dogan@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '11/09/2025, 07:14 PM' },
  { name: 'Alyson Hopper', email: 'hopperalyson@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '11/08/2025, 09:30 AM' },
  { name: 'Sara Bolton', email: 'saraepbolton@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '10/17/2025, 01:30 PM' },
  { name: 'Amy McCullough', email: 'mrsamymac@gmail.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care (Tra)', date: '10/16/2025, 07:29 PM' },
  { name: 'Ciara Fernandez', email: 'ciarahowardfamu@yahoo.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care (Tra)', date: '10/16/2025, 09:54 AM' },
  { name: 'Ciara Fernandez', email: 'ciarahowardfamu@yahoo.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '10/16/2025, 09:29 AM' },
  { name: 'Courtney Lozano', email: 'clozano@lesley.edu', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '10/14/2025, 05:16 PM' },
  { name: 'Amy McCullough', email: 'mrsamymac@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '10/10/2025, 11:44 AM' },
  { name: 'Carla Dixon', email: 'Cdixon@istrategiescorp.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '10/06/2025, 10:25 AM' },
  { name: 'Candice Rolle', email: 'rolle.counseling@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '05/14/2025, 11:00 AM' },
  { name: 'Maria Ruiz', email: 'ruizm73@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '04/03/2025, 09:38 PM' },
  { name: 'Shameka Walker', email: 'metamorphosis.changeme@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '04/02/2025, 07:11 AM' },
  { name: 'Whitney Rodriguez', email: 'whitneycaroln35@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '03/22/2025, 10:32 PM' },
  { name: 'Natalie Ross', email: 'natkimross@gmail.com', course: 'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care (Tra)', date: '03/16/2025, 04:01 PM' },
  { name: 'Jocelaine Smith', email: 'jsmithcaringmindswr@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '02/06/2025, 02:21 PM' },
  { name: 'jennifer carmack', email: 'jcarmack24@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '02/06/2025, 11:39 AM' },
  { name: 'Ebony King Adams', email: 'e.kingadams@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '02/06/2025, 11:39 AM' },
  { name: 'La Tonya Klish-Polk', email: 'klish76@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '02/06/2025, 11:38 AM' },
  { name: 'Christina Marra', email: 'christina.marra99@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '02/06/2025, 11:33 AM' },
  { name: 'Bailey Everett', email: 'baileyeverett55@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '02/06/2025, 11:24 AM' },
  { name: 'Hayley Barden', email: 'Hayleybarden4@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '01/30/2025, 10:07 PM' },
  { name: 'Hayley Barden', email: 'Hayleybarden4@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '01/30/2025, 03:13 PM' },
  { name: 'Cheryl Walker', email: 'cheryldwalker@comcast.net', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '12/10/2024, 04:33 PM' },
  { name: 'Dana Gamble', email: 'danagamble16@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '09/27/2024, 03:02 PM' },
  { name: 'Michelle Pintado', email: 'michellepintado@opendoortalk.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/23/2024, 06:08 PM' },
  { name: 'Yvette Marshall', email: 'marshall.talkfromtheheart@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/19/2024, 06:32 AM' },
  { name: 'Isabel Cardenas', email: 'isabelcardenastherapy@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/17/2024, 06:25 PM' },
  { name: 'Shane Phillips', email: 'shanephillips3@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/16/2024, 04:43 PM' },
  { name: 'Corinne Barnickel', email: 'greenhammockcounseling@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/16/2024, 11:28 AM' },
  { name: 'Mallery Higgs', email: 'malhiggs@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/16/2024, 12:41 AM' },
  { name: 'Mallery Higgs', email: 'malhiggs@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '09/15/2024, 10:01 PM' },
  { name: 'Beth-Marie Miller', email: 'BethMarie5280@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/14/2024, 04:23 PM' },
  { name: 'Elizabeth Berry', email: 'eberry83.eb@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/07/2024, 04:46 PM' },
  { name: 'Gabbie Perez', email: 'gabbieperezcounseling@gmail.com', course: 'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia (6Tel1-clone)', date: '09/05/2024, 03:33 PM' },
  { name: 'Meghan Skiba', email: 'meghan.skiba@gmail.com', course: 'Ethical Practices in Mental Health Counseling', date: '09/05/2024, 08:59 AM' },
];

// All 74 learner users from TalentLMS (excluding admin accounts)
const TALENTLMS_USERS = [
  { name: 'Alexandra King', status: 'Active', lastLogin: '10/14/2025' },
  { name: 'Alyson Hopper', status: 'Active', lastLogin: '11/08/2025' },
  { name: 'Amy McCullough', status: 'Active', lastLogin: '11/02/2025' },
  { name: 'Amy Swails', status: 'Active', lastLogin: '01/14/2026' },
  { name: 'Bailey Everett', status: 'Active', lastLogin: '02/06/2025' },
  { name: 'Barbara Lewison, LCSW', status: 'Active', lastLogin: '02/25/2025' },
  { name: 'Beth-Marie Miller', status: 'Active', lastLogin: '09/14/2024' },
  { name: 'Betty Ballard', status: 'Active', lastLogin: '03/18/2025' },
  { name: 'Beverley Theodore', status: 'Active', lastLogin: '11/07/2025' },
  { name: 'Blake Wingo', status: 'Active', lastLogin: '04/04/2025' },
  { name: 'Brandelyn Scott', status: 'Active', lastLogin: '09/17/2024' },
  { name: 'Brittany McCullar', status: 'Active', lastLogin: '10/29/2025' },
  { name: 'Candice Rolle', status: 'Active', lastLogin: '05/14/2025' },
  { name: 'Carla Dixon', status: 'Active', lastLogin: '10/08/2025' },
  { name: 'Cheryl Walker', status: 'Active', lastLogin: '12/10/2024' },
  { name: 'Christina Marra', status: 'Active', lastLogin: '06/25/2025' },
  { name: 'Christina Vaughn-Chesterman', status: 'Active', lastLogin: '10/27/2024' },
  { name: 'Ciara Fernandez', status: 'Inactive', lastLogin: '10/16/2025' },
  { name: 'Corinne Barnickel', status: 'Active', lastLogin: '03/15/2025' },
  { name: 'Courtney Lozano', status: 'Active', lastLogin: '10/14/2025' },
  { name: 'Crystal Johnson', status: 'Active', lastLogin: '12/18/2025' },
  { name: 'Dana Gamble', status: 'Active', lastLogin: '10/01/2024' },
  { name: 'Deborah Glenna', status: 'Active', lastLogin: '10/03/2025' },
  { name: 'Dena Smolar', status: 'Active', lastLogin: '11/15/2025' },
  { name: 'Ebony King Adams', status: 'Active', lastLogin: '02/06/2025' },
  { name: 'Elizabeth Berry', status: 'Active', lastLogin: '09/07/2024' },
  { name: 'Elizabeth Kendrick', status: 'Active', lastLogin: '12/05/2025' },
  { name: 'Essence Fiddemon', status: 'Active', lastLogin: '09/01/2024' },
  { name: 'Felicia Kanu', status: 'Active', lastLogin: '12/04/2025' },
  { name: 'Gabbie Perez', status: 'Active', lastLogin: '09/05/2024' },
  { name: 'Greg White', status: 'Active', lastLogin: '10/06/2025' },
  { name: 'Hayley Barden', status: 'Active', lastLogin: '01/30/2025' },
  { name: 'Isabel Cardenas', status: 'Active', lastLogin: '09/18/2024' },
  { name: 'Jaylin Ross', status: 'Active', lastLogin: '01/13/2026' },
  { name: 'Jenny Meaden', status: 'Active', lastLogin: '04/07/2025' },
  { name: 'Jessica Wiant', status: 'Active', lastLogin: '12/04/2024' },
  { name: 'Jillian McCarter', status: 'Active', lastLogin: '02/18/2025' },
  { name: 'Jocelaine Smith', status: 'Active', lastLogin: '02/06/2025' },
  { name: 'Julie Chahboune', status: 'Active', lastLogin: '11/11/2025' },
  { name: 'Kennedy Holmes', status: 'Active', lastLogin: '11/30/2025' },
  { name: 'La Tonya Klish-Polk', status: 'Active', lastLogin: '02/06/2025' },
  { name: 'Leigh Karegeannes', status: 'Active', lastLogin: '06/03/2025' },
  { name: 'Lindsey Wickard', status: 'Active', lastLogin: '10/15/2025' },
  { name: 'Lisa Guest', status: 'Active', lastLogin: '12/16/2025' },
  { name: 'Mallery Higgs', status: 'Active', lastLogin: '09/18/2024' },
  { name: 'Maria Ruiz', status: 'Active', lastLogin: '04/07/2025' },
  { name: 'Marissa Dogan', status: 'Active', lastLogin: '11/09/2025' },
  { name: 'Marius Haynes', status: 'Active', lastLogin: '01/07/2026' },
  { name: 'Mary Godard', status: 'Active', lastLogin: '05/29/2025' },
  { name: 'Meghan Skiba', status: 'Inactive', lastLogin: '09/05/2024' },
  { name: 'Michelle Pintado', status: 'Active', lastLogin: '09/23/2024' },
  { name: 'Michelle Thompson', status: 'Active', lastLogin: '01/05/2026' },
  { name: 'Natalie Ross', status: 'Active', lastLogin: '03/18/2025' },
  { name: 'Ryan Snider', status: 'Active', lastLogin: '12/28/2025' },
  { name: 'Samantha Ricks', status: 'Active', lastLogin: '06/02/2025' },
  { name: 'Sara Bolton', status: 'Active', lastLogin: '10/17/2025' },
  { name: 'Sara Morgan', status: 'Active', lastLogin: '02/24/2025' },
  { name: 'Sarah Dundas', status: 'Active', lastLogin: '12/01/2025' },
  { name: 'Sarah Overton', status: 'Active', lastLogin: '01/26/2026' },
  { name: 'Shameka Walker', status: 'Inactive', lastLogin: '04/02/2025' },
  { name: 'Shane Phillips', status: 'Inactive', lastLogin: '09/16/2024' },
  { name: 'Shannon Cazier', status: 'Active', lastLogin: '12/07/2025' },
  { name: 'Shannon Martin', status: 'Active', lastLogin: '01/10/2026' },
  { name: 'Shay Locke', status: 'Active', lastLogin: '12/07/2025' },
  { name: 'Shayla Warren', status: 'Active', lastLogin: '11/15/2025' },
  { name: 'Shekinah Burnette', status: 'Active', lastLogin: '12/04/2025' },
  { name: 'Valerie Lawton Edwards', status: 'Active', lastLogin: '01/10/2026' },
  { name: 'Virginia Whitby-Hogan', status: 'Inactive', lastLogin: '-' },
  { name: 'Wendy Turney', status: 'Active', lastLogin: '11/14/2025' },
  { name: 'Whitney Rodriguez', status: 'Active', lastLogin: '12/07/2025' },
  { name: 'Yvette Marshall', status: 'Active', lastLogin: '09/21/2024' },
  { name: 'Zoe Peralta-Page', status: 'Active', lastLogin: '12/03/2025' },
  { name: 'brandy brock', status: 'Active', lastLogin: '01/15/2026' },
  { name: 'jennifer carmack', status: 'Active', lastLogin: '02/06/2025' },
];

// Email lookup — 74 verified learner emails from timeline data
const EMAIL_LOOKUP = {
  'Alexandra King': 'alexking1229@gmail.com',
  'Alyson Hopper': 'hopperalyson@gmail.com',
  'Amy McCullough': 'mrsamymac@gmail.com',
  'Amy Swails': 'aswails.rol@gmail.com',
  'Bailey Everett': 'baileyeverett55@gmail.com',
  'Barbara Lewison, LCSW': 'blewison.lcsw@gmail.com',
  'Beth-Marie Miller': 'BethMarie5280@gmail.com',
  'Betty Ballard': 'bballard41327@gmail.com',
  'Beverley Theodore': 'sipariaborn@gmail.com',
  'Blake Wingo': 'blakewingo1@gmail.com',
  'Brandelyn Scott': 'scott.brandelyn@gmail.com',
  'Brittany McCullar': 'mariel2550@yahoo.com',
  'Candice Rolle': 'rolle.counseling@gmail.com',
  'Carla Dixon': 'Cdixon@istrategiescorp.com',
  'Cheryl Walker': 'cheryldwalker@comcast.net',
  'Christina Marra': 'christina.marra99@gmail.com',
  'Christina Vaughn-Chesterman': 'cvaughnc@lagrange.edu',
  'Ciara Fernandez': 'ciarahowardfamu@yahoo.com',
  'Corinne Barnickel': 'greenhammockcounseling@gmail.com',
  'Courtney Lozano': 'clozano@lesley.edu',
  'Crystal Johnson': 'pathwaystopromise365@gmail.com',
  'Dana Gamble': 'danagamble16@gmail.com',
  'Deborah Glenna': 'dglenna@newheightsga.com',
  'Dena Smolar': 'Denabean624@gmail.com',
  'Ebony King Adams': 'e.kingadams@icloud.com',
  'Elizabeth Berry': 'eberry83.eb@gmail.com',
  'Elizabeth Kendrick': 'lizlauren1013@gmail.com',
  'Essence Fiddemon': 'essencefiddemonpp@gmail.com',
  'Felicia Kanu': 'nourishwithfelicia@gmail.com',
  'Gabbie Perez': 'gabbieperezcounseling@gmail.com',
  'Greg White': 'jgregwhite12@aol.com',
  'Hayley Barden': 'Hayleybarden4@gmail.com',
  'Isabel Cardenas': 'isabelcardenastherapy@gmail.com',
  'Jaylin Ross': 'jaylinjross@gmail.com',
  'Jenny Meaden': 'jennymeaden@gmail.com',
  'Jessica Wiant': 'jessica.wiant@white.k12.ga.us',
  'Jillian McCarter': 'jillianmccarter17@gmail.com',
  'Jocelaine Smith': 'jsmithcaringmindswr@gmail.com',
  'Julie Chahboune': 'jchahboune@gmail.com',
  'Kennedy Holmes': 'Kennedyhcounselor@gmail.com',
  'La Tonya Klish-Polk': 'klish76@gmail.com',
  'Leigh Karegeannes': 'leigh1697@gmail.com',
  'Lindsey Wickard': 'lindswickard@yahoo.com',
  'Lisa Guest': 'guest.lisa@gmail.com',
  'Mallery Higgs': 'mallery@miprivatesesssions.com',
  'Maria Ruiz': 'ruizm73@gmail.com',
  'Marissa Dogan': 'marissa.dogan@gmail.com',
  'Marius Haynes': 'mhaynes@ourhealingspace.org',
  'Mary Godard': 'marylgodard22@gmail.com',
  'Meghan Skiba': 'meghan.skiba@gmail.com',
  'Michelle Pintado': 'michellepintado@opendoortalk.com',
  'Michelle Thompson': 'michelle.n.thompson@gmail.com',
  'Natalie Ross': 'natkimross@gmail.com',
  'Ryan Snider': 'snider.ryanc@gmail.com',
  'Samantha Ricks': 'sbpalmer8@gmail.com',
  'Sara Bolton': 'saraepbolton@gmail.com',
  'Sara Morgan': 'sara@sarakmorganlpc.com',
  'Sarah Dundas': 'sarangela12@gmail.com',
  'Sarah Overton': 'soverton@skylandtrail.org',
  'Shameka Walker': 'metamorphosis.changeme@gmail.com',
  'Shane Phillips': 'shanephillips3@gmail.com',
  'Shannon Cazier': 'ngaplaytherapy@gmail.com',
  'Shannon Martin': 'loganleestrong@gmail.com',
  'Shay Locke': 'Dscounselingllc@gmail.com',
  'Shayla Warren': 'smwarr3136@ung.edu',
  'Shekinah Burnette': 'ssisson3084@gmail.com',
  'Valerie Lawton Edwards': 'lawtonedwards@yahoo.com',
  'Virginia Whitby-Hogan': 'vhogan@gmail.com',
  'Wendy Turney': 'wendymarieturney@gmail.com',
  'Whitney Rodriguez': 'whitneycaroln35@gmail.com',
  'Yvette Marshall': 'marshall.talkfromtheheart@gmail.com',
  'Zoe Peralta-Page': 'wp7vx@auraprivatemail.com',
  'brandy brock': 'BRANDYBOLAN@GMAIL.COM',
  'jennifer carmack': 'jcarmack24@gmail.com',
};

// ============================================
// HELPERS
// ============================================

function generatePassword() {
  return crypto.randomBytes(16).toString('base64url').slice(0, 16);
}

function parseTLMSDate(dateStr) {
  // Format: "MM/DD/YYYY, HH:MM AM/PM" or "MM/DD/YYYY"
  if (!dateStr) return new Date();
  const cleaned = dateStr.split(',')[0].trim();
  const parts = cleaned.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  return new Date(dateStr);
}

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  if (parts.length === 2) return { firstName: parts[0], lastName: parts[1] };
  // Handle multi-word names like "La Tonya Klish-Polk" or "Valerie Lawton Edwards"
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function log(msg, type = 'info') {
  const prefix = { info: '  ', success: '  ✓', warn: '  ⚠', error: '  ✗', header: '\n━━' }[type] || '  ';
  console.log(`${prefix} ${msg}`);
}

// ============================================
// MAIN MIGRATION
// ============================================

async function migrate() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   TalentLMS → CounselorReady Migration              ║');
  console.log(`║   Batch: ${BATCH_ID}                        ║`);
  console.log(`║   Mode:  ${DRY_RUN ? 'DRY RUN (no DB writes)' : '🔴 LIVE — WRITING TO DB'}         ║`);
  console.log('╚══════════════════════════════════════════════════════╝\n');

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  log('Connected to MongoDB', 'success');

  const db = mongoose.connection.db;
  const usersCol = db.collection('users');
  const coursesCol = db.collection('interactivecourses');
  const ceLogsCol = db.collection('celogs');

  // ──────────────────────────────────────
  // PHASE 1: CROSS-REFERENCE USERS
  // ──────────────────────────────────────
  log('PHASE 1: Cross-reference users against CR database', 'header');

  const existingUsers = await usersCol.find({}, {
    projection: { email: 1, firstName: 1, lastName: 1 }
  }).toArray();

  const existingByEmail = new Map();
  for (const u of existingUsers) {
    if (u.email) existingByEmail.set(u.email.toLowerCase(), u);
  }
  log(`Found ${existingUsers.length} existing CR users`, 'info');

  const userResults = { existing: [], newUsers: [], noEmail: [] };
  const userIdByEmail = new Map(); // email → CR userId (for completion import)

  for (const tlmsUser of TALENTLMS_USERS) {
    const email = EMAIL_LOOKUP[tlmsUser.name];
    if (!email) {
      userResults.noEmail.push(tlmsUser.name);
      continue;
    }

    const existingUser = existingByEmail.get(email.toLowerCase());
    if (existingUser) {
      userResults.existing.push({ name: tlmsUser.name, email, crId: existingUser._id });
      userIdByEmail.set(email.toLowerCase(), existingUser._id);

      // Update existing user with migration metadata
      if (!DRY_RUN) {
        await usersCol.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              'migration.source': 'talentlms',
              'migration.importedAt': new Date(),
              'migration.batchId': BATCH_ID,
              'migration.mergedExisting': true
            }
          }
        );
      }
    } else {
      // Create new user
      const { firstName, lastName } = splitName(tlmsUser.name);
      const tempPassword = generatePassword();

      if (!DRY_RUN) {
        // Use the register endpoint pattern: bcrypt hash the password
        const bcrypt = (await import('bcryptjs')).default;
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        const newUser = {
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          lastName,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'user',
          plan: 'free',
          isActive: true,
          agreedToTerms: true,
          agreedAt: new Date(),
          emailVerified: false,
          migration: {
            source: 'talentlms',
            importedAt: new Date(),
            batchId: BATCH_ID,
            welcomeEmailSent: false,
            tempPassword // Store temporarily for welcome email; remove after sending
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await usersCol.insertOne(newUser);
        userIdByEmail.set(email.toLowerCase(), result.insertedId);
        userResults.newUsers.push({ name: tlmsUser.name, email, crId: result.insertedId, tempPassword });
      } else {
        userResults.newUsers.push({ name: tlmsUser.name, email, crId: 'DRY_RUN', tempPassword: '***' });
      }
    }
  }

  log(`Already in CR: ${userResults.existing.length}`, 'success');
  log(`New accounts created: ${userResults.newUsers.length}`, 'success');
  if (userResults.noEmail.length > 0) {
    log(`No email found (skipped): ${userResults.noEmail.length} — ${userResults.noEmail.join(', ')}`, 'warn');
  }

  // Also build alias map — some completions used older emails
  // Map completion emails → canonical user IDs
  const emailAliases = new Map();
  for (const comp of COMPLETIONS) {
    const compEmail = comp.email.toLowerCase();
    const canonicalEmail = (EMAIL_LOOKUP[comp.name] || '').toLowerCase();
    if (compEmail !== canonicalEmail && canonicalEmail) {
      // This completion used a different email than the canonical one
      const canonicalUser = existingByEmail.get(canonicalEmail) || 
                            userIdByEmail.get(canonicalEmail);
      if (canonicalUser) {
        const uid = canonicalUser._id || canonicalUser;
        emailAliases.set(compEmail, uid);
      }
    }
  }
  if (emailAliases.size > 0) {
    log(`Built ${emailAliases.size} email alias mappings for completion matching`, 'info');
  }

  // ──────────────────────────────────────
  // ──────────────────────────────────────
  log('PHASE 2: Map TalentLMS courses to CR courses', 'header');

  const crCourses = await coursesCol.find(
    { slug: { $exists: true } },
    { projection: { slug: 1, courseCode: 1, title: 1, _id: 1 } }
  ).toArray();

  const courseIdByCode = new Map();
  for (const c of crCourses) {
    if (c.courseCode) courseIdByCode.set(c.courseCode, c._id);
  }
  log(`Found ${crCourses.length} CR courses in interactivecourses`, 'info');

  const courseResults = { mapped: [], missing: [] };
  for (const [tlmsName, mapping] of Object.entries(COURSE_MAP)) {
    const crCourseId = courseIdByCode.get(mapping.crCode);
    if (crCourseId) {
      courseResults.mapped.push({ tlms: tlmsName.slice(0, 50), cr: mapping.crCode, crId: crCourseId });
    } else {
      courseResults.missing.push({ tlms: tlmsName.slice(0, 50), cr: mapping.crCode });
    }
  }

  for (const m of courseResults.mapped) {
    log(`${m.cr} ← ${m.tlms}...`, 'success');
  }
  for (const m of courseResults.missing) {
    log(`${m.cr} NOT FOUND in DB — completions will still log with title/hours (no courseId link)`, 'warn');
  }

  // ──────────────────────────────────────
  // PHASE 3: IMPORT COMPLETIONS AS CE LOGS
  // ──────────────────────────────────────
  log('PHASE 3: Import completion records as CE logs', 'header');

  const completionResults = { created: 0, skipped: 0, failed: [] };

  for (const comp of COMPLETIONS) {
    const email = comp.email.toLowerCase();
    const userId = userIdByEmail.get(email) || existingByEmail.get(email)?._id || emailAliases.get(email);

    if (!userId) {
      completionResults.failed.push({ name: comp.name, reason: 'User not found in CR' });
      continue;
    }

    const mapping = COURSE_MAP[comp.course];
    if (!mapping) {
      completionResults.failed.push({ name: comp.name, reason: `Unmapped course: ${comp.course.slice(0, 40)}` });
      continue;
    }

    const courseId = courseIdByCode.get(mapping.crCode) || null;
    const completionDate = parseTLMSDate(comp.date);

    // Check for duplicate CE log (same user + same course title + same date)
    const existingLog = await ceLogsCol.findOne({
      user: userId,
      title: mapping.crTitle,
      completionDate: {
        $gte: new Date(completionDate.getTime() - 86400000),
        $lte: new Date(completionDate.getTime() + 86400000)
      }
    });

    if (existingLog) {
      completionResults.skipped++;
      continue;
    }

    const ceLogDoc = {
      user: userId,
      course: courseId,
      title: mapping.crTitle,
      provider: 'GA Integrated Therapeutic Perspectives LLC',
      hours: mapping.ceHours,
      completionDate,
      category: mapping.category,
      synchronous: false,
      deliveryMethod: 'online',
      nbccApproved: true,
      acepNumber: '7760',
      status: 'completed',
      certificateGenerated: false,
      migration: {
        source: 'talentlms',
        importedAt: new Date(),
        batchId: BATCH_ID,
        originalData: {
          completionDate,
          status: 'completed',
          rawRecord: {
            tlmsCourse: comp.course,
            tlmsName: comp.name,
            tlmsEmail: comp.email,
            tlmsDate: comp.date
          }
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!DRY_RUN) {
      await ceLogsCol.insertOne(ceLogDoc);
    }
    completionResults.created++;
  }

  log(`CE logs created: ${completionResults.created}`, 'success');
  if (completionResults.skipped > 0) {
    log(`Skipped (already exists): ${completionResults.skipped}`, 'warn');
  }
  if (completionResults.failed.length > 0) {
    log(`Failed: ${completionResults.failed.length}`, 'error');
    for (const f of completionResults.failed) {
      log(`  ${f.name}: ${f.reason}`, 'error');
    }
  }

  // ──────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────
  const totalCE = COMPLETIONS.reduce((sum, c) => {
    const m = COURSE_MAP[c.course];
    return sum + (m ? m.ceHours : 0);
  }, 0);

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   MIGRATION SUMMARY                                  ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║   Mode: ${DRY_RUN ? 'DRY RUN' : 'EXECUTED'}                                    ║`);
  console.log(`║   Users — existing: ${String(userResults.existing.length).padEnd(3)} | new: ${String(userResults.newUsers.length).padEnd(3)} | no email: ${String(userResults.noEmail.length).padEnd(2)} ║`);
  console.log(`║   Courses mapped: ${courseResults.mapped.length}/${Object.keys(COURSE_MAP).length}                                 ║`);
  console.log(`║   CE logs created: ${completionResults.created}                                ║`);
  console.log(`║   CE logs skipped: ${completionResults.skipped}                                 ║`);
  console.log(`║   Total CE hours logged: ${totalCE}                            ║`);
  console.log('╚══════════════════════════════════════════════════════╝');

  if (userResults.newUsers.length > 0 && !DRY_RUN) {
    console.log('\n📋 NEW USER ACCOUNTS (save this — temp passwords):');
    console.log('─'.repeat(70));
    for (const u of userResults.newUsers) {
      console.log(`  ${u.email.padEnd(40)} ${u.tempPassword}`);
    }
    console.log('─'.repeat(70));
    console.log('  → Send welcome emails with password reset links before sharing.\n');
  }

  await mongoose.disconnect();
  log('Disconnected from MongoDB', 'success');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
