// uploadLocal.js — Run on YOUR machine, not Render
// 1. Save all 10 PNGs to a folder (e.g., C:\Users\laduw\CounselorReady\ethics-images\)
// 2. Update CREDS below with your Cloudinary values from Render dashboard
// 3. Run: node uploadLocal.js

const cloudinary = require('cloudinary').v2;
const path = require('path');

// ── PASTE YOUR CLOUDINARY CREDS HERE ──
cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
});

// ── Point this to wherever you saved the PNGs ──
const IMG_DIR = path.join(__dirname, 'ethics-images');

const FOLDER = 'counselorready/courses/ethics-decision-making';

const images = [
  { file: '01_course_title_card.png', id: 'course_title_card' },
  { file: '02_five_ethical_principles.png', id: 'five_ethical_principles' },
  { file: '03_seven_step_model.png', id: 'seven_step_model' },
  { file: '04_boundary_crossings_vs_violations.png', id: 'boundary_crossings_vs_violations' },
  { file: '05_confidentiality_limits.png', id: 'confidentiality_limits' },
  { file: '06_soap_note_format.png', id: 'soap_note_format' },
  { file: '07_telehealth_ethics.png', id: 'telehealth_ethics' },
  { file: '08_selfcare_domains.png', id: 'selfcare_domains' },
  { file: '09_dual_relationship_decision_tree.png', id: 'dual_relationship_decision_tree' },
  { file: '10_aca_code_quick_reference.png', id: 'aca_code_quick_reference' },
];

async function upload() {
  console.log('\nUploading 10 ethics course images to Cloudinary...\n');

  for (const img of images) {
    try {
      const filePath = path.join(IMG_DIR, img.file);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: FOLDER,
        public_id: img.id,
        overwrite: true,
        tags: ['ethics-course', 'CR-ETHICS-001']
      });
      console.log(`✅ ${img.file}\n   ${result.secure_url}\n`);
    } catch (err) {
      console.error(`❌ ${img.file}: ${err.message}\n`);
    }
  }
  console.log('Done!');
}

upload();
