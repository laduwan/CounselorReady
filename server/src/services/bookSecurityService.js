/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Book Security Service
 *
 * Private asset delivery + per-buyer watermarking for the Books store.
 * Book PDFs are stored PRIVATELY (Cloudinary type:'authenticated' or S3) and
 * are never served directly — each download is fetched server-side, stamped
 * with the buyer's identity, and streamed to that buyer only.
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { v2 as cloudinary } from 'cloudinary';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import logger from '../utils/logger.js';

// Configure Cloudinary (same block as certificateService.js)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Fetch the private book asset and return it as a Buffer.
 * @param {Object} book - Book document (must have assetKey, assetProvider)
 * @returns {Promise<Buffer>}
 */
export async function fetchPrivateAsset(book) {
  if (!book || !book.assetKey) {
    throw new Error('fetchPrivateAsset: book.assetKey is missing');
  }

  const provider = book.assetProvider || 'cloudinary';

  if (provider === 's3') {
    const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: book.assetKey
    });
    const response = await s3.send(command);
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  // Cloudinary — build a signed authenticated delivery URL, then fetch it.
  const downloadUrl = cloudinary.utils.private_download_url(book.assetKey, 'pdf', {
    resource_type: 'raw',
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + 300 // 5 min expiry
  });

  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`fetchPrivateAsset: Cloudinary fetch failed (${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Stamp a per-buyer watermark footer onto every page of a PDF.
 * Never throws — if the buffer is not a valid PDF the original is returned.
 * @param {Buffer} pdfBuffer
 * @param {Object} opts - { name, email, orderNumber, title, author }
 * @returns {Promise<Buffer>}
 */
export async function watermarkPdf(pdfBuffer, { name, email, orderNumber, title, author } = {}) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const footer = `Licensed to ${name} · ${email} · Order ${orderNumber} · Not for redistribution`;
    const fontSize = 7;
    const burgundy = rgb(0.42, 0.11, 0.20); // #6B1D34

    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width } = page.getSize();
      const textWidth = font.widthOfTextAtSize(footer, fontSize);
      page.drawText(footer, {
        x: (width - textWidth) / 2,
        y: 18,
        size: fontSize,
        font,
        color: burgundy
      });
    }

    // PDF metadata
    if (title) pdfDoc.setTitle(title);
    if (author) pdfDoc.setAuthor(author);
    pdfDoc.setProducer('CounselorReady');
    if (orderNumber) pdfDoc.setKeywords([orderNumber]);

    const stamped = await pdfDoc.save();
    return Buffer.from(stamped);
  } catch (err) {
    logger.warn({ err }, 'watermarkPdf: could not watermark asset — returning original buffer');
    return pdfBuffer;
  }
}

/**
 * Slugify a string for use in a filename.
 */
function slugifyForFilename(str) {
  return String(str || 'book')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'book';
}

/**
 * Fetch, watermark and package a buyer-specific copy of a book.
 * @param {Object} book - Book document
 * @param {Object} order - BookOrder document
 * @returns {Promise<{ buffer: Buffer, filename: String }>}
 */
export async function buildWatermarkedCopy(book, order) {
  const raw = await fetchPrivateAsset(book);
  const buffer = await watermarkPdf(raw, {
    name: order.watermarkName || '',
    email: order.watermarkEmail || '',
    orderNumber: order.orderNumber,
    title: book.title,
    author: book.author
  });
  const filename = `${slugifyForFilename(book.title)}-${order.orderNumber}.pdf`;
  return { buffer, filename };
}

/**
 * Determine whether an order is currently eligible for download.
 * @param {Object} order - BookOrder document
 * @param {Object} book - Book document
 * @returns {{ allowed: Boolean, reason: String }}
 */
export function canDownload(order, book) {
  if (!order || order.status !== 'paid') {
    return { allowed: false, reason: 'This order is not eligible for download' };
  }

  const limit = book.downloadLimit || 5;
  if ((order.downloadCount || 0) >= limit) {
    return {
      allowed: false,
      reason: 'Download limit reached — contact support@counselorready.com'
    };
  }

  const windowDays = book.downloadWindowDays || 90;
  const createdAt = order.createdAt ? new Date(order.createdAt).getTime() : Date.now();
  const expiresAt = createdAt + windowDays * 24 * 60 * 60 * 1000;
  if (Date.now() > expiresAt) {
    return { allowed: false, reason: 'Download window expired' };
  }

  return { allowed: true, reason: '' };
}
