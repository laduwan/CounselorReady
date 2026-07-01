/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Create a signature image using Node.js canvas
import { createCanvas } from 'canvas';
import fs from 'fs';

const canvas = createCanvas(400, 100);
const ctx = canvas.getContext('2d');

// Transparent background
ctx.clearRect(0, 0, 400, 100);

// Signature style
ctx.font = 'italic 42px "Times New Roman", Georgia, serif';
ctx.fillStyle = '#2b4133'; // Dark forest color
ctx.textBaseline = 'middle';

// Draw signature with slight slant effect
ctx.save();
ctx.translate(20, 50);
ctx.rotate(-0.05); // Slight tilt
ctx.fillText('Kejuiana Johnson', 0, 0);
ctx.restore();

// Add underline flourish
ctx.beginPath();
ctx.strokeStyle = '#2b4133';
ctx.lineWidth = 1.5;
ctx.moveTo(15, 70);
ctx.bezierCurveTo(80, 75, 200, 65, 320, 72);
ctx.stroke();

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('signature.png', buffer);
console.log('Signature created!');
