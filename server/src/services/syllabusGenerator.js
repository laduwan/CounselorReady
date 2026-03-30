/**
 * Syllabus Generator for Research Ready CE
 * Generates DOCX files using the docx npm package.
 */

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, BorderStyle, ShadingType, HeadingLevel,
  TableLayoutType
} from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors (hex without #)
const BURGUNDY = '7B2D3E';
const LIGHT_BURGUNDY = 'F5EBED';
const GREEN = '2D5A3D';
const LIGHT_GREEN = 'E8F0EB';
const GOLD = 'A8892A';
const LIGHT_GOLD = 'F8F3E3';
const LIGHT_GRAY = 'F5F5F5';
const MID_GRAY = 'DDDDDD';
const WHITE = 'FFFFFF';

function shadedCell(text, color, options = {}) {
  return new TableCell({
    shading: { type: ShadingType.SOLID, color },
    children: [new Paragraph({
      alignment: options.alignment || AlignmentType.LEFT,
      children: [new TextRun({
        text,
        bold: options.bold || false,
        color: options.textColor || '333333',
        size: options.size || 20,
        font: 'Calibri'
      })]
    })],
    width: options.width ? { size: options.width, type: WidthType.PERCENTAGE } : undefined
  });
}

function textRun(text, options = {}) {
  return new TextRun({
    text,
    bold: options.bold || false,
    italics: options.italics || false,
    color: options.color || '333333',
    size: options.size || 20,
    font: options.font || 'Calibri'
  });
}

/**
 * Generate a syllabus DOCX for a completed Research Ready CE course.
 */
export async function generateSyllabus({
  course, answers, score, certificateId, completionDate
}) {
  const instructionalWC = course.instructionalWordCount || course.wordCount;
  const rawWC = course.rawWordCount || course.wordCount;
  const rawCalc = (instructionalWC / 6000).toFixed(2);
  const ceCalcFormula = course.ceCalcFormula || `${instructionalWC.toLocaleString()} ÷ 6,000 = ${rawCalc} → ${course.ceHours} CE hr(s)`;
  const completionDateStr = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const fullTextSourceLabel = course.fullTextSource ? `Full article text retrieved from ${course.fullTextSource}${course.fullTextUrl ? ': ' + course.fullTextUrl : ''}` : '';
  const engagementStatus = course.engagementConfirmed ? 'Yes' : 'No';
  const researchHrs = course.researchHours || course.ceHours; // peer-reviewed = research hours

  // Build question results
  const questionResults = course.questions.map((q, i) => {
    const learnerAnswer = answers[i];
    const isCorrect = learnerAnswer === q.correct;
    return { index: i + 1, question: q.question, correct: q.correct, learnerAnswer, isCorrect };
  });

  // Build objectives mastery mapping
  const objectivesMastery = course.objectives.map((obj, i) => {
    // Map questions to objectives (distribute evenly)
    const qIndices = [];
    for (let qi = 0; qi < course.questions.length; qi++) {
      if (qi % course.objectives.length === i) qIndices.push(qi);
    }
    const correct = qIndices.filter(qi => questionResults[qi]?.isCorrect).length;
    const pct = qIndices.length > 0 ? Math.round((correct / qIndices.length) * 100) : 0;
    return {
      objective: obj,
      questionNums: qIndices.map(qi => qi + 1).join(', '),
      mastery: `${pct}%`
    };
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // === HEADER ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            textRun('CounselorReady — CE Course Syllabus', { bold: true, size: 28, color: BURGUNDY }),
            textRun(' | NBCC ACEP #7760', { size: 20, color: '666666' })
          ]
        }),

        // === TITLE BLOCK (burgundy background) ===
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: BURGUNDY },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 100, after: 60 },
                      children: [textRun('CE COURSE SYLLABUS', { bold: true, size: 24, color: WHITE })]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 60 },
                      children: [textRun(course.courseTitle || course.title, { bold: true, size: 22, color: WHITE })]
                    }),
                    ...(course.courseTitle && course.courseTitle !== course.title ? [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 40 },
                      children: [textRun(`Source article: ${course.title}`, { size: 16, color: 'F0D0D8', italics: true })]
                    })] : []),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 100 },
                      children: [textRun(
                        `${(course.format || 'standalone').charAt(0).toUpperCase() + (course.format || 'standalone').slice(1)} Format  |  ${course.ceHours} CE Hour(s)  |  Completed ${completionDateStr}`,
                        { size: 18, color: 'F0D0D8' }
                      )]
                    })
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { before: 200 } }),

        // === INFO TABLE ===
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                shadedCell('Provider', LIGHT_GRAY, { bold: true, width: 25 }),
                shadedCell('CounselorReady (GA Integrated Therapeutic Perspectives LLC)', WHITE, { width: 25 }),
                shadedCell('Accreditation', LIGHT_GRAY, { bold: true, width: 25 }),
                shadedCell('NBCC ACEP #7760', WHITE, { width: 25 })
              ]
            }),
            new TableRow({
              children: [
                shadedCell('CE Format', LIGHT_GRAY, { bold: true }),
                shadedCell(`Researched-N-Ready CE — ${course.format}`, WHITE),
                shadedCell('Completion Date', LIGHT_GRAY, { bold: true }),
                shadedCell(completionDateStr, WHITE)
              ]
            }),
            new TableRow({
              children: [
                shadedCell('Total CE Hours', LIGHT_GRAY, { bold: true }),
                new TableCell({
                  children: [new Paragraph({
                    children: [textRun(`${course.ceHours}`, { bold: true, color: GREEN, size: 22 })]
                  })]
                }),
                shadedCell('Content Areas', LIGHT_GRAY, { bold: true }),
                shadedCell(course.contentAreas.join(', '), WHITE)
              ]
            }),
            new TableRow({
              children: [
                shadedCell('Raw Word Count', LIGHT_GRAY, { bold: true }),
                shadedCell(`${rawWC.toLocaleString()} words (total tokens)`, WHITE),
                shadedCell('Instructional Prose', LIGHT_GRAY, { bold: true }),
                shadedCell(`${instructionalWC.toLocaleString()} words (after exclusions)`, WHITE)
              ]
            }),
            new TableRow({
              children: [
                shadedCell('CE Hour Calculation', LIGHT_GRAY, { bold: true }),
                shadedCell(ceCalcFormula, WHITE),
                shadedCell('Research Hours', LIGHT_GRAY, { bold: true }),
                shadedCell(`${researchHrs} (peer-reviewed = research hours)`, WHITE)
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { before: 200 } }),

        // === CITATION (green background) ===
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: LIGHT_GREEN },
                  children: [
                    new Paragraph({
                      spacing: { before: 80, after: 40 },
                      children: [textRun('Article Citation (APA 7th Edition)', { bold: true, color: GREEN, size: 22 })]
                    }),
                    new Paragraph({
                      spacing: { after: 60 },
                      children: [
                        textRun(`${course.authors} (${course.year}). ${course.title}. `, {}),
                        textRun(course.journal, { italics: true }),
                        textRun(course.doi ? `. ${course.doi}` : '.', {})
                      ]
                    }),
                    ...(fullTextSourceLabel ? [new Paragraph({
                      spacing: { after: 80 },
                      children: [textRun(fullTextSourceLabel, { size: 18, italics: true, color: '666666' })]
                    })] : [])
                  ]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { before: 200 } }),

        // === LEARNING OBJECTIVES ===
        new Paragraph({
          spacing: { after: 100 },
          children: [textRun('Learning Objectives', { bold: true, size: 24, color: BURGUNDY })]
        }),
        ...course.objectives.map((obj, i) => new Paragraph({
          spacing: { after: 60 },
          children: [textRun(`${i + 1}. ${obj}`, { size: 20 })]
        })),

        new Paragraph({ spacing: { before: 200 } }),

        // === ASSESSMENT RESULTS TABLE ===
        new Paragraph({
          spacing: { after: 100 },
          children: [textRun('Assessment Results', { bold: true, size: 24, color: BURGUNDY })]
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            // Header row
            new TableRow({
              children: [
                shadedCell('#', BURGUNDY, { bold: true, textColor: WHITE, width: 5 }),
                shadedCell('Question', BURGUNDY, { bold: true, textColor: WHITE, width: 45 }),
                shadedCell('Correct', BURGUNDY, { bold: true, textColor: WHITE, width: 18 }),
                shadedCell('Your Answer', BURGUNDY, { bold: true, textColor: WHITE, width: 18 }),
                shadedCell('Result', BURGUNDY, { bold: true, textColor: WHITE, width: 14 })
              ]
            }),
            // Data rows with alternating shading
            ...questionResults.map((qr, i) => {
              const bgColor = i % 2 === 0 ? WHITE : LIGHT_GRAY;
              const optionLetter = (idx) => ['A', 'B', 'C', 'D'][idx] || '?';
              return new TableRow({
                children: [
                  shadedCell(String(qr.index), bgColor),
                  shadedCell(qr.question.substring(0, 80) + (qr.question.length > 80 ? '...' : ''), bgColor),
                  shadedCell(optionLetter(qr.correct), bgColor),
                  shadedCell(optionLetter(qr.learnerAnswer), bgColor),
                  shadedCell(qr.isCorrect ? '\u2713' : '\u2717', bgColor, {
                    textColor: qr.isCorrect ? GREEN : BURGUNDY, bold: true
                  })
                ]
              });
            }),
            // Score summary
            new TableRow({
              children: [
                new TableCell({
                  columnSpan: 4,
                  shading: { type: ShadingType.SOLID, color: LIGHT_GOLD },
                  children: [new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [textRun('Total Score:', { bold: true, color: GOLD })]
                  })]
                }),
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: LIGHT_GOLD },
                  children: [new Paragraph({
                    children: [textRun(`${score}%`, { bold: true, color: GOLD, size: 22 })]
                  })]
                })
              ]
            })
          ]
        }),

        new Paragraph({ spacing: { before: 200 } }),

        // === OBJECTIVES MASTERY TABLE ===
        new Paragraph({
          spacing: { after: 100 },
          children: [textRun('Objectives Mastery', { bold: true, size: 24, color: BURGUNDY })]
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                shadedCell('Objective', GREEN, { bold: true, textColor: WHITE, width: 55 }),
                shadedCell('Questions', GREEN, { bold: true, textColor: WHITE, width: 25 }),
                shadedCell('Mastery', GREEN, { bold: true, textColor: WHITE, width: 20 })
              ]
            }),
            ...objectivesMastery.map((om, i) => {
              const bgColor = i % 2 === 0 ? WHITE : LIGHT_GREEN;
              return new TableRow({
                children: [
                  shadedCell(om.objective.substring(0, 100) + (om.objective.length > 100 ? '...' : ''), bgColor),
                  shadedCell(om.questionNums, bgColor),
                  shadedCell(om.mastery, bgColor, { bold: true })
                ]
              });
            })
          ]
        }),

        new Paragraph({ spacing: { before: 200 } }),

        // === ATTESTATION BLOCK ===
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: LIGHT_GRAY },
                  children: [
                    new Paragraph({
                      spacing: { before: 100, after: 80 },
                      children: [textRun('Attestation', { bold: true, size: 24, color: BURGUNDY })]
                    }),
                    new Paragraph({
                      spacing: { after: 60 },
                      children: [textRun(
                        'This document certifies that the learner completed a self-study continuing education activity through CounselorReady. The learner read the referenced peer-reviewed scholarly article in its entirety, completed a posttest assessment achieving a passing score of 75% or higher, and met all requirements for the award of NBCC-approved continuing education credit.',
                        { size: 18 }
                      )]
                    }),
                    new Paragraph({
                      spacing: { after: 60 },
                      children: [textRun(
                        `Instructional word count: ${instructionalWC.toLocaleString()} words. CE credit calculated at 6,000 words per 1.0 CE hour, rounded down to the nearest 0.5 hours.`,
                        { size: 18 }
                      )]
                    }),
                    new Paragraph({
                      spacing: { after: 60 },
                      children: [textRun(
                        `Research hour allocation: ${researchHrs} research hour(s) (peer-reviewed article = research hours).`,
                        { size: 18 }
                      )]
                    }),
                    new Paragraph({
                      spacing: { after: 60 },
                      children: [textRun(
                        `Learner confirmed full article access via Read view prior to assessment: ${engagementStatus}`,
                        { size: 18 }
                      )]
                    }),
                    new Paragraph({
                      spacing: { after: 60 },
                      children: [textRun(
                        'Retain this syllabus for a minimum of 5 years from the completion date for audit and verification purposes per NBCC documentation requirements.',
                        { size: 18, italics: true }
                      )]
                    }),
                    new Paragraph({ spacing: { before: 80 } }),
                    new Paragraph({
                      spacing: { after: 40 },
                      children: [
                        textRun('Provider Signature: ', { bold: true, size: 18 }),
                        textRun('CounselorReady / GA Integrated Therapeutic Perspectives LLC', { size: 18 })
                      ]
                    }),
                    new Paragraph({
                      spacing: { after: 100 },
                      children: [
                        textRun(`Completion Date: ${completionDateStr}`, { size: 18 }),
                        textRun(`    |    Certificate ID: ${certificateId}`, { size: 18 })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }]
  });

  // Generate and save DOCX
  const uploadsDir = path.resolve(__dirname, '../../uploads/syllabi');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${certificateId}.docx`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  return `/uploads/syllabi/${fileName}`;
}
