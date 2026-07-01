/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * TalentLMS → CounselorReady Migration Script
 * 
 * USAGE:
 * 1. Upload this file to: server/src/scripts/runMigration.js
 * 2. In Render shell, run: node src/scripts/runMigration.js
 * 
 * This will:
 * - Create all user accounts
 * - Record their completions
 * - Grant free course access
 * - Send activation emails to everyone
 */

import mongoose from 'mongoose';
import crypto from 'crypto';
import { Resend } from 'resend';

// ============================================
// CONFIG - UPDATE THESE
// ============================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/counselorready';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://counselorready.com';

// Set to false for dry run (no emails sent)
const SEND_EMAILS = true;

// Course mapping - UPDATE WITH YOUR ACTUAL COURSE ID
const TELEMENTAL_HEALTH_COURSE_ID = '696df6c73c601d0e678ce764';

// ============================================
// MIGRATION DATA (embedded)
// ============================================
const migrationData = {
  "exportDate": "2026-01-21",
  "source": "TalentLMS",
  "domain": "gaitp.talentlms.com",
  "summary": {
    "totalUsers": 74,
    "activeUsers": 69,
    "totalCourses": 7,
    "totalCompletions": 50
  },
  "users": [
    {"email": "essencefiddemonpp@gmail.com", "firstName": "Essence", "lastName": "Fiddemon", "login": "EFiddemon", "status": "active", "licenseNumber": null, "talentlmsId": 9},
    {"email": "isabelcardenastherapy@gmail.com", "firstName": "Isabel", "lastName": "Cardenas", "login": "isabelcaramor", "status": "active", "licenseNumber": null, "talentlmsId": 13},
    {"email": "gabbieperezcounseling@gmail.com", "firstName": "Gabbie", "lastName": "Perez", "login": "gabbieperezcounseling", "status": "active", "licenseNumber": null, "talentlmsId": 14},
    {"email": "cheryldwalker@comcast.net", "firstName": "Cheryl", "lastName": "Walker", "login": "404therapist", "status": "active", "licenseNumber": "LPC013140", "talentlmsId": 15},
    {"email": "meghan.skiba@gmail.com", "firstName": "Meghan", "lastName": "Skiba", "login": "mskiba", "status": "inactive", "licenseNumber": null, "talentlmsId": 16},
    {"email": "eberry83.eb@gmail.com", "firstName": "Elizabeth", "lastName": "Berry", "login": "EBerry", "status": "active", "licenseNumber": null, "talentlmsId": 17},
    {"email": "marshall.talkfromtheheart@gmail.com", "firstName": "Yvette", "lastName": "Marshall", "login": "ymarshall65", "status": "active", "licenseNumber": null, "talentlmsId": 18},
    {"email": "malhiggs@gmail.com", "firstName": "Mallery", "lastName": "Higgs", "login": "malhiggs1", "status": "active", "licenseNumber": null, "talentlmsId": 20},
    {"email": "scott.brandelyn@gmail.com", "firstName": "Brandelyn", "lastName": "Scott", "login": "brandicole14", "status": "active", "licenseNumber": null, "talentlmsId": 21},
    {"email": "BethMarie5280@gmail.com", "firstName": "Beth-Marie", "lastName": "Miller", "login": "BethMarie5280@gmail.com", "status": "active", "licenseNumber": null, "talentlmsId": 23},
    {"email": "greenhammockcounseling@gmail.com", "firstName": "Corinne", "lastName": "Barnickel", "login": "corinnekate", "status": "active", "licenseNumber": "MFT001834", "talentlmsId": 24},
    {"email": "shanephillips3@gmail.com", "firstName": "Shane", "lastName": "Phillips", "login": "shanep", "status": "inactive", "licenseNumber": "0000", "talentlmsId": 25},
    {"email": "michellepintado@opendoortalk.com", "firstName": "Michelle", "lastName": "Pintado", "login": "MichelleJ", "status": "active", "licenseNumber": null, "talentlmsId": 26},
    {"email": "danagamble16@gmail.com", "firstName": "Dana", "lastName": "Gamble", "login": "danagamble16", "status": "active", "licenseNumber": null, "talentlmsId": 27},
    {"email": "cvaughnc@lagrange.edu", "firstName": "Christina", "lastName": "Vaughn-Chesterman", "login": "cvaughnc", "status": "active", "licenseNumber": "0000000", "talentlmsId": 29},
    {"email": "jessica.wiant@white.k12.ga.us", "firstName": "Jessica", "lastName": "Wiant", "login": "jozbolt", "status": "active", "licenseNumber": "LPC014115", "talentlmsId": 30},
    {"email": "Hayleybarden4@gmail.com", "firstName": "Hayley", "lastName": "Barden", "login": "hayleybarden4", "status": "active", "licenseNumber": "APC009372", "talentlmsId": 31},
    {"email": "christina.marra99@gmail.com", "firstName": "Christina", "lastName": "Marra", "login": "cmarra", "status": "active", "licenseNumber": "LPC012562", "talentlmsId": 32},
    {"email": "baileyeverett55@gmail.com", "firstName": "Bailey", "lastName": "Everett", "login": "Baileyeverett", "status": "active", "licenseNumber": "prelicensed", "talentlmsId": 33},
    {"email": "jcarmack24@gmail.com", "firstName": "jennifer", "lastName": "carmack", "login": "jcarmack24", "status": "active", "licenseNumber": "LPC013236", "talentlmsId": 35},
    {"email": "e.kingadams@gmail.com", "firstName": "Ebony", "lastName": "King Adams", "login": "ekingadams", "status": "active", "licenseNumber": "Pre licensed", "talentlmsId": 36},
    {"email": "klish76@gmail.com", "firstName": "La Tonya", "lastName": "Klish-Polk", "login": "Klishpolk", "status": "active", "licenseNumber": "LPC013895", "talentlmsId": 37},
    {"email": "jsmithcaringmindswr@gmail.com", "firstName": "Jocelaine", "lastName": "Smith", "login": "Jocelaine", "status": "active", "licenseNumber": "Pre Licensed", "talentlmsId": 38},
    {"email": "jillianmccarter17@gmail.com", "firstName": "Jillian", "lastName": "McCarter", "login": "jillianmc17", "status": "active", "licenseNumber": "APC010101", "talentlmsId": 39},
    {"email": "sara@sarakmorganlpc.com", "firstName": "Sara", "lastName": "Morgan", "login": "SaraMorgan", "status": "active", "licenseNumber": "LPC009840", "talentlmsId": 40},
    {"email": "blewison.lcsw@gmail.com", "firstName": "Barbara", "lastName": "Lewison, LCSW", "login": "blewison", "status": "active", "licenseNumber": "CSW005910", "talentlmsId": 41},
    {"email": "natkimross@gmail.com", "firstName": "Natalie", "lastName": "Ross", "login": "Nat", "status": "active", "licenseNumber": "011109", "talentlmsId": 42},
    {"email": "bballard41327@gmail.com", "firstName": "Betty", "lastName": "Ballard", "login": "Bbal52", "status": "active", "licenseNumber": "LPC004666", "talentlmsId": 43},
    {"email": "whitneycaroln35@gmail.com", "firstName": "Whitney", "lastName": "Rodriguez", "login": "WRod1013", "status": "active", "licenseNumber": "APC009803", "talentlmsId": 44},
    {"email": "jgregwhite12@aol.com", "firstName": "Greg", "lastName": "White", "login": "jgwhite12", "status": "active", "licenseNumber": "LPC006559", "talentlmsId": 45},
    {"email": "metamorphosis.changeme@gmail.com", "firstName": "Shameka", "lastName": "Walker", "login": "Shamekacw", "status": "inactive", "licenseNumber": "LPC019067", "talentlmsId": 46},
    {"email": "ruizm73@gmail.com", "firstName": "Maria", "lastName": "Ruiz", "login": "mariaruiz89", "status": "active", "licenseNumber": "1010", "talentlmsId": 47},
    {"email": "blakewingo1@gmail.com", "firstName": "Blake", "lastName": "Wingo", "login": "Blakewingo1", "status": "active", "licenseNumber": "APC010261", "talentlmsId": 48},
    {"email": "jennymeaden@gmail.com", "firstName": "Jenny", "lastName": "Meaden", "login": "jennymeaden@gmail.com", "status": "active", "licenseNumber": "APC009993", "talentlmsId": 49},
    {"email": "marylgodard22@gmail.com", "firstName": "Mary", "lastName": "Godard", "login": "marylgodard", "status": "active", "licenseNumber": "LPC013762", "talentlmsId": 50},
    {"email": "Denabean624@gmail.com", "firstName": "Dena", "lastName": "Smolar", "login": "Denasmolar", "status": "active", "licenseNumber": "APC010328", "talentlmsId": 52},
    {"email": "rolle.counseling@gmail.com", "firstName": "Candice", "lastName": "Rolle", "login": "Crolle", "status": "active", "licenseNumber": "APC010297", "talentlmsId": 55},
    {"email": "sbpalmer8@gmail.com", "firstName": "Samantha", "lastName": "Ricks", "login": "sricks830", "status": "active", "licenseNumber": "015128", "talentlmsId": 56},
    {"email": "leigh1697@gmail.com", "firstName": "Leigh", "lastName": "Karegeannes", "login": "leighkare", "status": "active", "licenseNumber": "18336", "talentlmsId": 57},
    {"email": "dglenna@newheightsga.com", "firstName": "Deborah", "lastName": "Glenna", "login": "dglenna", "status": "active", "licenseNumber": "008554", "talentlmsId": 58},
    {"email": "Cdixon@istrategiescorp.com", "firstName": "Carla", "lastName": "Dixon", "login": "Carladixon30", "status": "active", "licenseNumber": "LPC 008476", "talentlmsId": 59},
    {"email": "mrsamymac@gmail.com", "firstName": "Amy", "lastName": "McCullough", "login": "mrsdramymac", "status": "active", "licenseNumber": "0000", "talentlmsId": 60},
    {"email": "ciarahowardfamu@yahoo.com", "firstName": "Ciara", "lastName": "Fernandez", "login": "Choward", "status": "inactive", "licenseNumber": "LPC012803", "talentlmsId": 61},
    {"email": "clozano@lesley.edu", "firstName": "Courtney", "lastName": "Lozano", "login": "cchlozano", "status": "active", "licenseNumber": "0000", "talentlmsId": 62},
    {"email": "alexking1229@gmail.com", "firstName": "Alexandra", "lastName": "King", "login": "alexking1229", "status": "active", "licenseNumber": "010669", "talentlmsId": 63},
    {"email": "lindswickard@yahoo.com", "firstName": "Lindsey", "lastName": "Wickard", "login": "lindswickard", "status": "active", "licenseNumber": "APC010647", "talentlmsId": 64},
    {"email": "saraepbolton@gmail.com", "firstName": "Sara", "lastName": "Bolton", "login": "Saraepb", "status": "active", "licenseNumber": "009870", "talentlmsId": 65},
    {"email": "mariel2550@yahoo.com", "firstName": "Brittany", "lastName": "McCullar", "login": "Bmccullar1", "status": "active", "licenseNumber": "Lpc013819", "talentlmsId": 66},
    {"email": "marissa.dogan@gmail.com", "firstName": "Marissa", "lastName": "Dogan", "login": "mhdogan", "status": "active", "licenseNumber": "MSW012726", "talentlmsId": 67},
    {"email": "sipariaborn@gmail.com", "firstName": "Beverley", "lastName": "Theodore", "login": "btheodore", "status": "active", "licenseNumber": "LPC012057", "talentlmsId": 68},
    {"email": "hopperalyson@gmail.com", "firstName": "Alyson", "lastName": "Hopper", "login": "AHopper93", "status": "active", "licenseNumber": "0000", "talentlmsId": 69},
    {"email": "jchahboune@gmail.com", "firstName": "Julie", "lastName": "Chahboune", "login": "jchahboune", "status": "active", "licenseNumber": "APC010728", "talentlmsId": 70},
    {"email": "smwarr3136@ung.edu", "firstName": "Shayla", "lastName": "Warren", "login": "smwarren", "status": "active", "licenseNumber": "0000", "talentlmsId": 71},
    {"email": "wendymarieturney@gmail.com", "firstName": "Wendy", "lastName": "Turney", "login": "wendymarie1129", "status": "active", "licenseNumber": "CSW007314", "talentlmsId": 72},
    {"email": "vhogan@gmail.com", "firstName": "Virginia", "lastName": "Whitby-Hogan", "login": "vwhitby80", "status": "inactive", "licenseNumber": "LPC013796", "talentlmsId": 73},
    {"email": "Kennedyhcounselor@gmail.com", "firstName": "Kennedy", "lastName": "Holmes", "login": "Keke438", "status": "active", "licenseNumber": "APC010736", "talentlmsId": 74},
    {"email": "sarangela12@gmail.com", "firstName": "Sarah", "lastName": "Dundas", "login": "Sdundas", "status": "active", "licenseNumber": "LPC016202", "talentlmsId": 75},
    {"email": "wp7vx@auraprivatemail.com", "firstName": "Zoe", "lastName": "Peralta-Page", "login": "wp7vx@auraprivatemail.com", "status": "active", "licenseNumber": "LPC015709", "talentlmsId": 76},
    {"email": "nourishwithfelicia@gmail.com", "firstName": "Felicia", "lastName": "Kanu", "login": "Ella50", "status": "active", "licenseNumber": "MSW011283", "talentlmsId": 77},
    {"email": "ssisson3084@gmail.com", "firstName": "Shekinah", "lastName": "Burnette", "login": "ssisson3084", "status": "active", "licenseNumber": "0000", "talentlmsId": 78},
    {"email": "lizlauren1013@gmail.com", "firstName": "Elizabeth", "lastName": "Kendrick", "login": "lizlauren1013@gmail.com", "status": "active", "licenseNumber": "016084", "talentlmsId": 79},
    {"email": "ngaplaytherapy@gmail.com", "firstName": "Shannon", "lastName": "Cazier", "login": "gage313", "status": "active", "licenseNumber": "013303", "talentlmsId": 80},
    {"email": "Dscounselingllc@gmail.com", "firstName": "Shay", "lastName": "Locke", "login": "Dscounseling", "status": "active", "licenseNumber": "LPC015122", "talentlmsId": 81},
    {"email": "lawtonedwards@yahoo.com", "firstName": "Valerie", "lastName": "Lawton Edwards", "login": "Valerie", "status": "active", "licenseNumber": "LPC004673", "talentlmsId": 82},
    {"email": "guest.lisa@gmail.com", "firstName": "Lisa", "lastName": "Guest", "login": "lisaguest", "status": "active", "licenseNumber": "009668", "talentlmsId": 83},
    {"email": "pathwaystopromise365@gmail.com", "firstName": "Crystal", "lastName": "Johnson", "login": "crjohnson36", "status": "active", "licenseNumber": "APC008986", "talentlmsId": 84},
    {"email": "snider.ryanc@gmail.com", "firstName": "Ryan", "lastName": "Snider", "login": "rcsnider", "status": "active", "licenseNumber": "0000", "talentlmsId": 85},
    {"email": "michelle.n.thompson@gmail.com", "firstName": "Michelle", "lastName": "Thompson", "login": "MichelleNT1", "status": "active", "licenseNumber": "LPC014923", "talentlmsId": 86},
    {"email": "mhaynes@ourhealingspace.org", "firstName": "Marius", "lastName": "Haynes", "login": "mhaynes1", "status": "active", "licenseNumber": "LPC015981", "talentlmsId": 87},
    {"email": "jaylinjross@gmail.com", "firstName": "Jaylin", "lastName": "Ross", "login": "jaylinjross", "status": "active", "licenseNumber": "LPC016033", "talentlmsId": 88},
    {"email": "loganleestrong@gmail.com", "firstName": "Shannon", "lastName": "Martin", "login": "SMartin28", "status": "active", "licenseNumber": "0000", "talentlmsId": 89},
    {"email": "soverton@skylandtrail.org", "firstName": "Sarah", "lastName": "Overton", "login": "overtonsaraha", "status": "active", "licenseNumber": "CSW008242", "talentlmsId": 90},
    {"email": "BRANDYBOLAN@GMAIL.COM", "firstName": "brandy", "lastName": "brock", "login": "bbrock85", "status": "active", "licenseNumber": "009322", "talentlmsId": 91},
    {"email": "aswails.rol@gmail.com", "firstName": "Amy", "lastName": "Swails", "login": "ASwails", "status": "active", "licenseNumber": "012920", "talentlmsId": 92}
  ],
  "completions": [
    {"userLogin": "isabelcaramor", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "09/03/2024", "completedDate": "09/17/2024", "score": 0},
    {"userLogin": "404therapist", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "09/03/2024", "completedDate": "12/10/2024", "score": 0},
    {"userLogin": "gabbieperezcounseling", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "09/05/2024", "completedDate": "09/05/2024", "score": 0},
    {"userLogin": "EBerry", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "09/06/2024", "completedDate": "09/07/2024", "score": 0},
    {"userLogin": "malhiggs1", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "09/14/2024", "completedDate": "09/16/2024", "score": 0},
    {"userLogin": "brandicole14", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "09/17/2024", "completedDate": "09/22/2024", "score": 0},
    {"userLogin": "danagamble16", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "09/24/2024", "completedDate": "09/27/2024", "score": 0},
    {"userLogin": "Baileyeverett", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "10/07/2024", "completedDate": "10/11/2024", "score": 0},
    {"userLogin": "ekingadams", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "10/15/2024", "completedDate": "10/15/2024", "score": 0},
    {"userLogin": "jgwhite12", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "10/15/2024", "completedDate": "10/16/2024", "score": 0},
    {"userLogin": "Blakewingo1", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "11/09/2024", "completedDate": "11/10/2024", "score": 0},
    {"userLogin": "sricks830", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "11/19/2024", "completedDate": "11/26/2024", "score": 0},
    {"userLogin": "dglenna", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "12/16/2024", "completedDate": "12/17/2024", "score": 0},
    {"userLogin": "hayleybarden4", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "01/30/2025", "completedDate": "01/30/2025", "score": 0},
    {"userLogin": "Jocelaine", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "02/06/2025", "completedDate": "02/06/2025", "score": 0},
    {"userLogin": "Shamekacw", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "04/02/2025", "completedDate": "04/02/2025", "score": 0},
    {"userLogin": "mariaruiz89", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "04/02/2025", "completedDate": "04/03/2025", "score": 0},
    {"userLogin": "Crolle", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "05/14/2025", "completedDate": "05/14/2025", "score": 0},
    {"userLogin": "Carladixon30", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "10/04/2025", "completedDate": "10/06/2025", "score": 0},
    {"userLogin": "mrsdramymac", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "10/10/2025", "completedDate": "10/10/2025", "score": 0},
    {"userLogin": "cchlozano", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "10/14/2025", "completedDate": "10/14/2025", "score": 0},
    {"userLogin": "Choward", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "10/16/2025", "completedDate": "10/16/2025", "score": 0},
    {"userLogin": "mhdogan", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "11/05/2025", "completedDate": "11/09/2025", "score": 0},
    {"userLogin": "AHopper93", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "11/08/2025", "completedDate": "11/08/2025", "score": 0},
    {"userLogin": "jchahboune", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "11/10/2025", "completedDate": "11/11/2025", "score": 0},
    {"userLogin": "Keke438", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "11/30/2025", "completedDate": "11/30/2025", "score": 0},
    {"userLogin": "wp7vx@auraprivatemail.com", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "12/03/2025", "completedDate": "12/03/2025", "score": 0},
    {"userLogin": "Ella50", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "12/04/2025", "completedDate": "12/04/2025", "score": 0},
    {"userLogin": "ssisson3084", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "12/04/2025", "completedDate": "12/04/2025", "score": 0},
    {"userLogin": "lisaguest", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "12/16/2025", "completedDate": "12/16/2025", "score": 0},
    {"userLogin": "crjohnson36", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "12/16/2025", "completedDate": "12/16/2025", "score": 0},
    {"userLogin": "rcsnider", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "12/26/2025", "completedDate": "12/26/2025", "score": 0},
    {"userLogin": "jaylinjross", "courseName": "Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia", "courseCode": "6Tel1-clone", "enrolledDate": "01/08/2026", "completedDate": "01/13/2026", "score": 0},
    {"userLogin": "malhiggs1", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "09/11/2024", "completedDate": "09/15/2024", "score": 0},
    {"userLogin": "danagamble16", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "09/24/2024", "completedDate": "09/27/2024", "score": 0},
    {"userLogin": "hayleybarden4", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "01/30/2025", "completedDate": "01/30/2025", "score": 0},
    {"userLogin": "WRod1013", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "03/22/2025", "completedDate": "03/22/2025", "score": 0},
    {"userLogin": "Saraepb", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "10/17/2025", "completedDate": "10/17/2025", "score": 0},
    {"userLogin": "Sdundas", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "12/01/2025", "completedDate": "12/01/2025", "score": 0},
    {"userLogin": "lizlauren1013@gmail.com", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "12/05/2025", "completedDate": "12/05/2025", "score": 0},
    {"userLogin": "MichelleNT1", "courseName": "Ethical Practices in Mental Health Counseling", "courseCode": null, "enrolledDate": "01/05/2026", "completedDate": "01/05/2026", "score": 0},
    {"userLogin": "Nat", "courseName": "The Neurobiology of Trauma: A Foundation for Trauma-Informed Care", "courseCode": "Tra", "enrolledDate": "03/08/2025", "completedDate": "03/16/2025", "score": 0},
    {"userLogin": "Choward", "courseName": "The Neurobiology of Trauma: A Foundation for Trauma-Informed Care", "courseCode": "Tra", "enrolledDate": "10/16/2025", "completedDate": "10/16/2025", "score": 0},
    {"userLogin": "mrsdramymac", "courseName": "The Neurobiology of Trauma: A Foundation for Trauma-Informed Care", "courseCode": "Tra", "enrolledDate": "10/16/2025", "completedDate": "10/16/2025", "score": 0},
    {"userLogin": "Valerie", "courseName": "The Neurobiology of Trauma: A Foundation for Trauma-Informed Care", "courseCode": "Tra", "enrolledDate": "12/14/2025", "completedDate": "01/10/2026", "score": 0},
    {"userLogin": "gaitp", "courseName": "Cultural Sensitivity in Uncertain Political Climates", "courseCode": null, "enrolledDate": "02/18/2025", "completedDate": "02/27/2025", "score": 0},
    {"userLogin": "lizlauren1013@gmail.com", "courseName": "Cultural Sensitivity in Uncertain Political Climates", "courseCode": null, "enrolledDate": "12/05/2025", "completedDate": "12/05/2025", "score": 0},
    {"userLogin": "bbrock85", "courseName": "Cultural Sensitivity in Uncertain Political Climates", "courseCode": null, "enrolledDate": "01/11/2026", "completedDate": "01/15/2026", "score": 0}
  ]
};

// ============================================
// SETUP
// ============================================
const resend = new Resend(RESEND_API_KEY);

const COLORS = {
  burgundy: '#6b1d34',
  forest: '#34503d',
  gold: '#d4a012',
  stone: '#f5f5f4'
};

// ============================================
// USER SCHEMA (inline to avoid import issues)
// ============================================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, default: 'user' },
  status: { type: String, default: 'pending' },
  profile: {
    firstName: String,
    lastName: String,
    licenseNumber: String
  },
  activationToken: String,
  activationExpires: Date,
  migratedFrom: String,
  migrationData: {
    talentlmsId: Number,
    talentlmsLogin: String,
    importedAt: Date
  },
  courseCompletions: [{
    courseName: String,
    courseId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    source: String
  }],
  grantedCourseAccess: [{
    courseId: mongoose.Schema.Types.ObjectId,
    grantedAt: Date,
    reason: String
  }]
}, { timestamps: true, strict: false });

// ============================================
// EMAIL TEMPLATE
// ============================================
const emailWrapper = (content, preheader = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.stone}; font-family: 'Helvetica Neue', Arial, sans-serif;">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${COLORS.stone};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: ${COLORS.burgundy}; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                <span style="color: ${COLORS.gold};">Counselor</span>Ready
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color: ${COLORS.stone}; padding: 24px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; color: ${COLORS.forest}; font-size: 12px;">
                NBCC Approved Continuing Education Provider (ACEP #7760)
              </p>
              <p style="margin: 0; color: #999999; font-size: 11px;">
                © ${new Date().getFullYear()} GA Integrated Therapeutic Perspectives LLC
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

function getMigrationEmailContent(firstName, activationLink, hasFreeCourse) {
  return `
    <h2 style="margin: 0 0 16px 0; color: ${COLORS.burgundy}; font-size: 24px;">
      Hi ${firstName},
    </h2>
    
    <p style="margin: 0 0 16px 0; color: ${COLORS.forest}; font-size: 16px; line-height: 1.6;">
      <strong>GA ITP Academy has evolved into CounselorReady</strong> — a brand new CE platform built for mental health professionals like you.
    </p>
    
    <div style="background-color: ${COLORS.stone}; border-radius: 12px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 12px 0; color: ${COLORS.forest}; font-size: 15px;">
        ✓ <strong>Your CE credits transferred</strong>
      </p>
      <p style="margin: 0 0 12px 0; color: ${COLORS.forest}; font-size: 15px;">
        ✓ <strong>Same NBCC approval</strong> (ACEP #7760)
      </p>
      ${hasFreeCourse ? `
      <p style="margin: 0; color: ${COLORS.burgundy}; font-size: 15px; font-weight: 600;">
        ✓ <strong>FREE: Updated Telemental Health course</strong>
      </p>
      ` : ''}
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${activationLink}" 
         style="display: inline-block; background-color: ${COLORS.burgundy}; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Activate Your Account
      </a>
    </div>
    
    <p style="margin: 0 0 24px 0; color: #666; font-size: 13px; text-align: center;">
      This link expires in 14 days
    </p>
    
    <p style="margin: 0; color: ${COLORS.burgundy}; font-size: 15px;">
      <strong>Kejuiana Johnson, LPC</strong><br>
      <span style="color: ${COLORS.forest};">Founder, CounselorReady</span>
    </p>
  `;
}

// ============================================
// MAIN MIGRATION FUNCTION
// ============================================
async function runMigration() {
  console.log('');
  console.log('='.repeat(50));
  console.log('  TalentLMS → CounselorReady Migration');
  console.log('='.repeat(50));
  console.log('');

  // Connect to MongoDB
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✓ Connected\n');

  const User = mongoose.model('User', userSchema);

  console.log(`Loaded: ${migrationData.users.length} users, ${migrationData.completions.length} completions\n`);

  // Build completions lookup by email
  const completionsByEmail = {};
  for (const completion of migrationData.completions || []) {
    const user = migrationData.users.find(u => u.login === completion.userLogin);
    if (user?.email) {
      const email = user.email.toLowerCase();
      if (!completionsByEmail[email]) {
        completionsByEmail[email] = [];
      }
      completionsByEmail[email].push(completion);
    }
  }

  // Results tracking
  const results = {
    created: 0,
    skipped: 0,
    emailsSent: 0,
    emailsFailed: 0,
    errors: []
  };

  // Process each user
  console.log('Processing users...\n');

  for (const userData of migrationData.users) {
    if (!userData.email) {
      results.skipped++;
      continue;
    }

    const email = userData.email.toLowerCase();
    
    try {
      // Check if exists
      const existing = await User.findOne({ email });
      if (existing) {
        console.log(`  SKIP: ${email} (already exists)`);
        results.skipped++;
        continue;
      }

      // Generate activation token
      const activationToken = crypto.randomBytes(32).toString('hex');
      const activationExpires = new Date();
      activationExpires.setDate(activationExpires.getDate() + 14);

      // Check if user completed Telemental Health course
      const userCompletions = completionsByEmail[email] || [];
      const completedTelemental = userCompletions.some(c => 
        c.courseName.includes('TeleMental Health') || 
        c.courseName.includes('Telemental Health')
      );

      // Build user object
      const newUserData = {
        email,
        password: crypto.randomBytes(32).toString('hex'),
        role: 'user',
        status: 'pending',
        profile: {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          licenseNumber: userData.licenseNumber ? String(userData.licenseNumber) : ''
        },
        activationToken,
        activationExpires,
        migratedFrom: 'talentlms',
        migrationData: {
          talentlmsId: userData.talentlmsId,
          talentlmsLogin: userData.login,
          importedAt: new Date()
        },
        courseCompletions: userCompletions.map(c => ({
          courseName: c.courseName,
          completedAt: c.completedDate ? new Date(c.completedDate) : new Date(),
          source: 'talentlms'
        }))
      };

      // Grant free access if they completed Telemental Health
      if (completedTelemental && TELEMENTAL_HEALTH_COURSE_ID) {
        newUserData.grantedCourseAccess = [{
          courseId: new mongoose.Types.ObjectId(TELEMENTAL_HEALTH_COURSE_ID),
          grantedAt: new Date(),
          reason: 'migration_bonus'
        }];
      }

      // Create user
      const newUser = await User.create(newUserData);
      results.created++;

      const firstName = userData.firstName || 'there';
      const activationLink = `${FRONTEND_URL}/activate?token=${activationToken}`;

      // Send email
      if (SEND_EMAILS && RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'CounselorReady <noreply@counselorready.com>',
            to: email,
            replyTo: 'support@counselorready.com',
            subject: "Your CounselorReady account is ready — action required",
            html: emailWrapper(
              getMigrationEmailContent(firstName, activationLink, completedTelemental),
              'Your CE credits have been transferred to CounselorReady'
            )
          });
          results.emailsSent++;
          console.log(`  ✓ ${email} - created + email sent`);
        } catch (emailErr) {
          results.emailsFailed++;
          console.log(`  ✓ ${email} - created (email failed: ${emailErr.message})`);
        }
      } else {
        console.log(`  ✓ ${email} - created (email skipped)`);
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 100));

    } catch (err) {
      console.log(`  ✗ ${email} - ERROR: ${err.message}`);
      results.errors.push({ email, error: err.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('  MIGRATION COMPLETE');
  console.log('='.repeat(50));
  console.log(`  Users created:  ${results.created}`);
  console.log(`  Users skipped:  ${results.skipped}`);
  console.log(`  Emails sent:    ${results.emailsSent}`);
  console.log(`  Emails failed:  ${results.emailsFailed}`);
  console.log(`  Errors:         ${results.errors.length}`);
  console.log('='.repeat(50));
  console.log('');

  if (results.errors.length > 0) {
    console.log('Errors:');
    results.errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
    console.log('');
  }

  await mongoose.disconnect();
  console.log('Done!\n');
}

// Run it
runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
