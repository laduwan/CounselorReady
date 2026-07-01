// generateHandouts.cjs — CR-301, CR-302, CR-303 Participant Handouts
// CounselorReady | GAITP LLC | NBCC ACEP #7760

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, TabStopType, SimpleField, HeadingLevel
} = require('docx');
const fs = require('fs');

// ── Brand Colors ─────────────────────────────────────────────────────────────
const C = {
  burgundy: "6B1D34",
  green:    "4A7C59",
  navy:     "284157",
  honey:    "D4A855",
  white:    "FFFFFF",
  lightGray:"F2F2F2",
  midGray:  "888888",
  darkGray: "2C2C2C",
  rose:     "D0768A",   // "Counselor" on burgundy bg
  lineBurg: "E8D0D6",   // light burgundy tint for ruled lines
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const noBorders = {
  top:    { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right:  { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function hairline(color = C.honey) {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color, space: 4 } },
    children: [new TextRun("")]
  });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: 0, after: pts }, children: [new TextRun("")] });
}

// CounselorReady wordmark — always two TextRuns, Burgundy + Green
// On light bg:
function crWordmark(size = 22, bold = true) {
  return [
    new TextRun({ text: "Counselor", font: "Georgia", size, color: C.burgundy, bold }),
    new TextRun({ text: "Ready", font: "Georgia", size, color: C.green, bold }),
  ];
}

function sectionHeader(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.burgundy, space: 4 } },
    children: [new TextRun({ text, font: "Georgia", size: 26, bold: true, color: C.burgundy })]
  });
}

function subHeader(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, font: "Georgia", size: 22, bold: true, color: C.navy })]
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 0, after: 80 },
    children: [new TextRun({ text, font: "Calibri", size: 20, color: C.darkGray, ...opts })]
  });
}

function bulletItem(text, numbering) {
  return new Paragraph({
    numbering,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text, font: "Calibri", size: 20, color: C.darkGray })]
  });
}

function noteLines(count = 4) {
  const lines = [];
  for (let i = 0; i < count; i++) {
    lines.push(new Paragraph({
      spacing: { before: 0, after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: C.lineBurg, space: 6 } },
      children: [new TextRun({ text: "", font: "Calibri", size: 22 })]
    }));
    lines.push(spacer(80));
  }
  return lines;
}

function twoColRow(leftChildren, rightChildren, leftW = 5200, rightW = 4160) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [leftW, rightW],
    borders: { top: noBorders.top, bottom: noBorders.bottom, left: noBorders.left, right: noBorders.right, insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE } },
    rows: [new TableRow({
      children: [
        new TableCell({ borders: noBorders, width: { size: leftW, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 200 }, children: leftChildren }),
        new TableCell({ borders: noBorders, width: { size: rightW, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 200, right: 0 }, children: rightChildren }),
      ]
    })]
  });
}

function shadeBox(children, fill = "F5F0F2") {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: { style: BorderStyle.SINGLE, size: 4, color: C.burgundy }, bottom: { style: BorderStyle.SINGLE, size: 4, color: C.burgundy }, left: { style: BorderStyle.SINGLE, size: 4, color: C.burgundy }, right: { style: BorderStyle.SINGLE, size: 4, color: C.burgundy } },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        width: { size: 9360, type: WidthType.DXA },
        children,
      })]
    })]
  });
}

// ── Page header/footer ────────────────────────────────────────────────────────
function makeHeader(courseCode, title) {
  return new Header({
    children: [new Paragraph({
      spacing: { before: 0, after: 0 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.burgundy, space: 4 } },
      children: [
        new TextRun({ text: "Counselor", font: "Calibri", size: 18, color: C.burgundy, bold: true }),
        new TextRun({ text: "Ready", font: "Calibri", size: 18, color: C.green, bold: true }),
        new TextRun({ text: `  |  ${courseCode}: ${title}  |  Participant Handout`, font: "Calibri", size: 18, color: C.navy }),
      ]
    })]
  });
}

function makeFooter() {
  return new Footer({
    children: [new Paragraph({
      spacing: { before: 0, after: 0 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.honey, space: 4 } },
      tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
      children: [
        new TextRun({ text: "© 2026 GAITP LLC  |  NBCC ACEP Provider #7760  |  CounselorReady.com", font: "Calibri", size: 17, color: C.navy }),
        new TextRun({ text: "\tPage ", font: "Calibri", size: 17, color: C.navy }),
        new SimpleField("PAGE", { font: "Calibri", size: 17, color: C.burgundy }),
      ]
    })]
  });
}

// ── Cover block ───────────────────────────────────────────────────────────────
function coverBlock(course) {
  const rows = [];

  // Burgundy header band
  rows.push(new TableRow({
    children: [new TableCell({
      borders: noBorders,
      shading: { fill: C.burgundy, type: ShadingType.CLEAR },
      margins: { top: 320, bottom: 280, left: 600, right: 600 },
      width: { size: 9360, type: WidthType.DXA },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 40 },
          children: [
            new TextRun({ text: "Counselor", font: "Georgia", size: 32, color: C.rose, bold: true }),
            new TextRun({ text: "Ready", font: "Georgia", size: 32, color: C.green, bold: true }),
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
          children: [new TextRun({ text: "Learn. License. Lead.", font: "Calibri", size: 18, color: "D9D3CE", italic: true })]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 0 },
          children: [new TextRun({ text: "PARTICIPANT HANDOUT", font: "Calibri", size: 20, color: C.honey, bold: true, allCaps: true })]
        }),
      ]
    })]
  }));

  // Course title band
  rows.push(new TableRow({
    children: [new TableCell({
      borders: noBorders,
      shading: { fill: C.navy, type: ShadingType.CLEAR },
      margins: { top: 200, bottom: 200, left: 600, right: 600 },
      width: { size: 9360, type: WidthType.DXA },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: course.title, font: "Georgia", size: 36, bold: true, color: C.white })]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: `${course.courseCode}  |  ${course.ceHours}.0 CE Hours  |  ${course.category}  |  NBCC ACEP #7760`, font: "Calibri", size: 20, color: C.honey })]
        }),
      ]
    })]
  }));

  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360], rows });
}

// ── HANDOUT CONTENT DEFINITIONS ───────────────────────────────────────────────

const handouts = [

  // ── CR-301 ─────────────────────────────────────────────────────────────────
  {
    courseCode: "CR-301",
    title: "Foundations of Couples Counseling: Assessment, Theory, and Case Conceptualization",
    ceHours: 2,
    category: "Clinical Skills",
    filename: "CR-301-Foundations_Couples_Counseling-Handout.docx",
    objectives: [
      "Distinguish among systemic, attachment-based, behavioral, and emotionally focused theoretical frameworks as applied to couples counseling.",
      "Apply a biopsychosocial-systemic lens to comprehensive couples assessment.",
      "Identify key assessment tools used in evidence-based couples practice.",
      "Develop an integrative case conceptualization incorporating attachment patterns, communication dynamics, and cultural context.",
      "Articulate therapeutic alliance challenges in dyadic work and strategies for maintaining neutrality.",
      "Recognize ethical considerations specific to couples counseling.",
    ],
    sections: [
      {
        title: "Module 1: Theoretical Foundations",
        keyPoints: [
          { label: "Systems Theory", detail: "Symptom as relational signal; circular causality; enmeshed vs. disengaged boundaries (Minuchin)" },
          { label: "Object Relations", detail: "Unconscious fit; projective identification; early relational history shapes current dynamics (Scharff & Scharff)" },
          { label: "CBT/IBCT", detail: "Attributional asymmetry in distress; acceptance + change; BMT → IBCT evolution (Christensen et al.)" },
          { label: "Attachment Theory", detail: "Adult attachment styles (secure, anxious, avoidant, fearful); pursue-withdraw cycle as attachment dance (Johnson)" },
          { label: "Narrative/SFBT", detail: "Problem externalization; unique outcomes; miracle question; exception-finding" },
          { label: "EFT", detail: "Attachment + experiential + systemic integration; bonding events; ~70–73% recovery rates" },
          { label: "Cultural Lens", detail: "Examine cultural embeddedness of frameworks; differentiation vs. collectivistic values; hold humility + ethical clarity" },
        ],
        notePrompt: "Which theoretical framework most closely aligns with your current practice? What gaps does today's course reveal?",
      },
      {
        title: "Module 2: Couples Assessment & Case Conceptualization",
        keyPoints: [
          { label: "Couple Satisfaction Index (CSI-16)", detail: "Normed measure; score <51.5 indicates clinical distress; use at intake and monthly" },
          { label: "Revised Conflict Tactics Scale (CTS-2)", detail: "IPV screening — ALWAYS administered individually, never conjointly" },
          { label: "Oral History Interview", detail: "Narrative quality predicts stability; warmth, humor, and 'we' language are positive indicators" },
          { label: "IPV Screening Rule", detail: "Standard conjoint couples counseling is CONTRAINDICATED with coercive control or ongoing violence" },
          { label: "Triple Alliance", detail: "Manage alliance with Partner A + Partner B + the couple as unit simultaneously" },
          { label: "Case Conceptualization Framework", detail: "Attach. pattern × Communication dynamic × Cultural context × Individual functioning = Integrative formulation" },
          { label: "Termination Planning", detail: "Establish explicit success criteria early; success ≠ relationship preservation" },
        ],
        notePrompt: "Describe one clinical situation where you struggled with alliance splits. What would you do differently now?",
      },
    ],
    clinicalFrameworks: [
      { title: "Attachment Styles at a Glance", rows: [
        ["Style", "Self Model", "Other Model", "Relational Pattern"],
        ["Secure", "Positive", "Positive", "Comfortable with closeness and autonomy"],
        ["Anxious-Preoccupied", "Negative", "Positive", "Pursuit, reassurance-seeking, protest"],
        ["Dismissing-Avoidant", "Positive", "Negative", "Self-reliance, emotional distance"],
        ["Fearful-Avoidant", "Negative", "Negative", "Desires closeness, fears rejection"],
      ]},
    ],
    references: [
      "American Counseling Association. (2014). ACA code of ethics.",
      "Christensen, A., Doss, B. D., & Jacobson, N. S. (2020). Integrative behavioral couple therapy (2nd ed.). W. W. Norton.",
      "Epstein, N. B., & Baucom, D. H. (2002). Enhanced cognitive-behavioral therapy for couples. APA.",
      "Johnson, S. M. (2019). The practice of emotionally focused couple therapy (3rd ed.). Routledge.",
      "Nichols, M. P., & Davis, S. D. (2020). Family therapy: Concepts and methods (11th ed.). Pearson.",
    ],
  },

  // ── CR-302 ─────────────────────────────────────────────────────────────────
  {
    courseCode: "CR-302",
    title: "Emotionally Focused Therapy for Couples: Theory, Stages, and Clinical Application",
    ceHours: 2,
    category: "Clinical Skills",
    filename: "CR-302-EFT_for_Couples-Handout.docx",
    objectives: [
      "Describe EFT's three theoretical foundations and their integration into a unified treatment model.",
      "Identify the three stages and nine steps of EFT and their clinical sequencing.",
      "Apply the RISSSC principles to facilitate primary emotional experience in session.",
      "Distinguish primary from secondary emotions and use this distinction clinically.",
      "Describe the Attachment Injury Resolution Model (AIRM) and its application.",
      "Identify populations for which EFT is evidence-supported and contraindications for use.",
    ],
    sections: [
      {
        title: "Module 1: EFT Foundations — Theory and the Negative Cycle",
        keyPoints: [
          { label: "Three Pillars of EFT", detail: "Attachment theory (Bowlby) + Humanistic-experiential (Rogers/Perls) + Systemic theory" },
          { label: "Negative Cycle", detail: "Self-maintaining pattern driven by attachment fear; the cycle is the problem, not either partner" },
          { label: "Primary Emotion", detail: "First, direct response (fear, shame, longing) — carries attachment signal; often unexpressed" },
          { label: "Secondary Emotion", detail: "Reactive, defensive surface emotion (anger, contempt, withdrawal) — masks primary need" },
          { label: "RISSSC", detail: "Repeat · Images · Simple language · Slow · Soft · Client's words — use to deepen emotional experience" },
          { label: "Pursue-Withdraw Cycle", detail: "Pursuer's protest activates withdrawer's deactivation strategy; each move intensifies the other's fear" },
          { label: "Shame in EFT", detail: "Often underlies withdrawal ('I'm not enough') and pursuit ('my needs are too much'); approach slowly with total acceptance" },
        ],
        notePrompt: "Map your last difficult couples session onto the pursue-withdraw cycle. Who was in which position? What primary emotions were beneath the surface?",
      },
      {
        title: "Module 2–3: EFT Stages, Change Events & Special Populations",
        keyPoints: [
          { label: "Stage 1: De-escalation", detail: "Reduce cycle intensity; both partners see cycle as shared enemy; Steps 1–4" },
          { label: "Stage 2: Restructuring", detail: "Withdrawer re-engagement → Blamer softening → bonding events; Steps 5–7" },
          { label: "Stage 3: Consolidation", detail: "New narrative; problem-solving from secure base; new cycle of connection; Steps 8–9" },
          { label: "Withdrawer Re-Engagement", detail: "Withdrawer accesses and expresses attachment need with vulnerability; first Stage 2 event" },
          { label: "Blamer Softening", detail: "Pursuer relinquishes protest; reaches toward partner from vulnerability rather than demand" },
          { label: "AIRM", detail: "Attachment Injury Resolution Model: name injury specifically → injurer contacts impact → forgiveness → bonding event" },
          { label: "Contraindications", detail: "Coercive control/ongoing IPV, active psychosis, severe untreated substance dependence" },
        ],
        notePrompt: "Describe a couple you have seen who might have had an unresolved attachment injury blocking treatment progress. How would you approach it using AIRM?",
      },
    ],
    clinicalFrameworks: [
      { title: "EFT Three Stages — Quick Reference", rows: [
        ["Stage", "Goal", "Key Events", "Steps"],
        ["1 — De-escalation", "Reduce cycle intensity", "Cycle named & externalized", "1–4"],
        ["2 — Restructuring", "Rebuild attachment bond", "Withdrawer re-engagement; Blamer softening", "5–7"],
        ["3 — Consolidation", "New relational narrative", "New cycle of connection; problem-solving", "8–9"],
      ]},
    ],
    references: [
      "Johnson, S. M. (2019). The practice of emotionally focused couple therapy (3rd ed.). Routledge.",
      "Johnson, S. M. (2013). Love sense. Little, Brown.",
      "Johnson, S. M., et al. (2013). Are we lost? Predominantly attachment-based interventions in EFT. Journal of Marital & Family Therapy, 39(2), 175–199.",
      "Coan, J. A., Schaefer, H. S., & Davidson, R. J. (2006). Lending a hand. Psychological Science, 17(12), 1032–1039.",
      "Mikulincer, M., & Shaver, P. R. (2016). Attachment in adulthood (2nd ed.). Guilford.",
    ],
  },

  // ── CR-303 ─────────────────────────────────────────────────────────────────
  {
    courseCode: "CR-303",
    title: "The Gottman Method: Science-Based Couples Therapy",
    ceHours: 2,
    category: "Clinical Skills",
    filename: "CR-303-Gottman_Method-Handout.docx",
    objectives: [
      "Describe the Sound Relationship House theory and the function of each level.",
      "Identify and distinguish among the Four Horsemen and their evidence-based antidotes.",
      "Apply Gottman's assessment approach, including the OHI and Gottman Relationship Checkup.",
      "Explain the clinical distinction between solvable and perpetual problems.",
      "Describe the Gottman-Rapoport Blueprint and apply it to clinical material.",
      "Identify components of the shared meaning system and their clinical relevance.",
    ],
    sections: [
      {
        title: "Module 1: The Sound Relationship House & The Four Horsemen",
        keyPoints: [
          { label: "Love Maps", detail: "Rich cognitive map of partner's inner world — updated continuously; predicts stability under stress" },
          { label: "Fondness & Admiration", detail: "Positive regard buffer; regular expression prevents negative sentiment override" },
          { label: "Turn Toward", detail: "Respond to bids for connection; stable couples turn toward ~86% of the time" },
          { label: "Positive Perspective", detail: "Charitable interpretive lens; counteracts negative sentiment override" },
          { label: "Manage Conflict", detail: "Regulate, not eliminate conflict; physiological flooding threshold ~100 bpm" },
          { label: "Life Dreams", detail: "Honor each partner's existential aspirations within the shared life" },
          { label: "Shared Meaning", detail: "Rituals, roles, shared goals, symbols — the relationship's culture and identity" },
        ],
        notePrompt: "Which level of the SRH is most frequently underdeveloped in the couples you see? What interventions do you currently use at that level?",
      },
      {
        title: "Module 2: Assessment, Conflict Regulation & Shared Meaning",
        keyPoints: [
          { label: "Oral History Interview (OHI)", detail: "How couples tell their story predicts stability as much as content; listen for warmth, humor, 'we' language" },
          { label: "Gottman Relationship Checkup", detail: "~480-question battery; generates clinical report across all SRH levels; clinician portal tool" },
          { label: "Solvable Problems", detail: "~31% of conflicts; situational, negotiable with improved conflict process" },
          { label: "Perpetual Problems", detail: "~69% of conflicts; rooted in core values/dreams; goal = respectful dialogue, not resolution" },
          { label: "Gottman-Rapoport Blueprint", detail: "Softened startup → Repair attempts → Physiological soothing → Understanding before advocacy" },
          { label: "Dreams Within Conflict", detail: "Beneath every perpetual conflict: life dream, symbolic meaning, existential need — excavate it" },
          { label: "20-Minute Break Rule", detail: "Must involve genuine distraction (not rumination); minimum 20 min for physiological reset" },
        ],
        notePrompt: "Identify a perpetual conflict from your caseload. What life dream or symbolic meaning might be embedded beneath the surface argument?",
      },
    ],
    clinicalFrameworks: [
      { title: "Four Horsemen & Their Antidotes", rows: [
        ["Horseman", "Definition", "Antidote"],
        ["Criticism", "Global character attack vs. specific complaint", "Gentle startup: 'I feel… about… I need…'"],
        ["Contempt", "Moral superiority; mockery; most toxic predictor", "Culture of appreciation; shared fondness rituals"],
        ["Defensiveness", "Counterattack; countercomplaints; victim stance", "Take responsibility for even a small part"],
        ["Stonewalling", "Emotional withdrawal; physiological flooding (>100 bpm)", "Physiological self-regulation; 20-min break"],
      ]},
    ],
    references: [
      "Gottman, J. M. (1994). What predicts divorce? Lawrence Erlbaum.",
      "Gottman, J. M., & Silver, N. (1999). The seven principles for making marriage work. Crown.",
      "Gottman, J. M. (2011). The science of trust. W. W. Norton.",
      "Gottman, J. M., & Gottman, J. S. (2015). 10 principles for doing effective couples therapy. W. W. Norton.",
      "Buehlman, K. T., Gottman, J. M., & Katz, L. F. (1992). How a couple views their past predicts their future. Journal of Family Psychology, 5(3–4), 295–318.",
    ],
  },
];

// ── Document builder ──────────────────────────────────────────────────────────
function buildHandout(h) {
  const numbering = {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 440, hanging: 220 } } } }] },
      { reference: "obj",    levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 440, hanging: 220 } } } }] },
    ]
  };

  const children = [];

  // Cover block
  children.push(coverBlock(h));
  children.push(spacer(200));

  // Learning Objectives
  children.push(sectionHeader("Learning Objectives"));
  children.push(spacer(60));
  h.objectives.forEach(obj => children.push(bulletItem(obj, { reference: "obj", level: 0 })));
  children.push(spacer(120));

  // Modules
  h.sections.forEach((sec, si) => {
    children.push(sectionHeader(sec.title));
    children.push(spacer(60));

    // Key concepts table
    const border = { style: BorderStyle.SINGLE, size: 2, color: "DDCCCC" };
    const borders = { top: border, bottom: border, left: border, right: border };

    // Header row
    const tableRows = [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            borders,
            shading: { fill: C.burgundy, type: ShadingType.CLEAR },
            width: { size: 2400, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "Concept", font: "Georgia", size: 20, bold: true, color: C.white })] })]
          }),
          new TableCell({
            borders,
            shading: { fill: C.burgundy, type: ShadingType.CLEAR },
            width: { size: 6960, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: "Clinical Application", font: "Georgia", size: 20, bold: true, color: C.white })] })]
          }),
        ]
      })
    ];

    sec.keyPoints.forEach((kp, i) => {
      const rowFill = i % 2 === 0 ? "FAFAFA" : "F5F0F2";
      tableRows.push(new TableRow({
        children: [
          new TableCell({
            borders,
            shading: { fill: rowFill, type: ShadingType.CLEAR },
            width: { size: 2400, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: kp.label, font: "Calibri", size: 19, bold: true, color: C.navy })] })]
          }),
          new TableCell({
            borders,
            shading: { fill: rowFill, type: ShadingType.CLEAR },
            width: { size: 6960, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: kp.detail, font: "Calibri", size: 19, color: C.darkGray })] })]
          }),
        ]
      }));
    });

    children.push(new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [2400, 6960], rows: tableRows }));
    children.push(spacer(140));

    // Reflection prompt
    children.push(shadeBox([
      new Paragraph({ spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "✦  Reflection Prompt", font: "Georgia", size: 20, bold: true, color: C.burgundy })] }),
      new Paragraph({ spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: sec.notePrompt, font: "Calibri", size: 19, italic: true, color: C.darkGray })] }),
    ]));
    children.push(spacer(100));

    // Note lines
    children.push(subHeader("My Notes"));
    children.push(...noteLines(5));
    children.push(spacer(120));
  });

  // Clinical Frameworks
  if (h.clinicalFrameworks && h.clinicalFrameworks.length) {
    children.push(sectionHeader("Quick Reference Frameworks"));
    children.push(spacer(60));

    h.clinicalFrameworks.forEach(fw => {
      children.push(subHeader(fw.title));
      const border = { style: BorderStyle.SINGLE, size: 2, color: "DDCCCC" };
      const borders = { top: border, bottom: border, left: border, right: border };
      const colCount = fw.rows[0].length;
      const colW = Math.floor(9360 / colCount);
      const cols = Array(colCount).fill(colW);
      const fwRows = fw.rows.map((row, ri) =>
        new TableRow({
          children: row.map((cell, ci) => new TableCell({
            borders,
            shading: { fill: ri === 0 ? C.navy : (ri % 2 === 0 ? "FAFAFA" : "F2F0F5"), type: ShadingType.CLEAR },
            width: { size: colW, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Calibri", size: ri === 0 ? 19 : 18, bold: ri === 0, color: ri === 0 ? C.white : C.darkGray })] })]
          }))
        })
      );
      children.push(new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: cols, rows: fwRows }));
      children.push(spacer(120));
    });
  }

  // Action Planning
  children.push(sectionHeader("Action Planning: Clinical Takeaways"));
  children.push(bodyText("Based on this course, I will integrate the following into my couples counseling practice:"));
  children.push(...noteLines(4));
  children.push(spacer(60));
  children.push(bodyText("A clinical or ethical question this course has raised for me:"));
  children.push(...noteLines(3));
  children.push(spacer(120));

  // Key References
  children.push(sectionHeader("Key References"));
  children.push(spacer(60));
  h.references.forEach(ref => {
    children.push(new Paragraph({
      spacing: { before: 0, after: 80 },
      indent: { left: 440, hanging: 440 },
      children: [new TextRun({ text: ref, font: "Calibri", size: 18, color: C.darkGray })]
    }));
  });

  const doc = new Document({
    numbering,
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
        }
      },
      headers: { default: makeHeader(h.courseCode, h.title) },
      footers: { default: makeFooter() },
      children,
    }]
  });

  return doc;
}


// ── Upload to Cloudinary ───────────────────────────────────────────────────────
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzfscjhdx',
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set');
  process.exit(1);
}

(async () => {
  console.log('\n════════════════════════════════════════════════════');
  console.log('CounselorReady — Generate & Upload Handouts');
  console.log('GAITP LLC | NBCC ACEP #7760');
  console.log('════════════════════════════════════════════════════\n');

  const results = [];

  for (const h of handouts) {
    process.stdout.write(`Building ${h.courseCode}...`);
    const doc = buildHandout(h);
    const buffer = await Packer.toBuffer(doc);
    process.stdout.write(` ${Math.round(buffer.length/1024)} KB | Uploading...`);

    // Upload buffer directly — no temp file needed
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'counselorready/course-resources/couples-series',
          public_id: h.courseCode.toLowerCase() + '-handout',
          overwrite: true,
          format: 'docx',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    console.log(` ✅`);
    console.log(`   URL: ${uploadResult.secure_url}`);
    results.push({ courseCode: h.courseCode, url: uploadResult.secure_url });
  }

  console.log('\n════════════════════════════════════════════════════');
  console.log('ADD THESE TO YOUR SEED SCRIPTS:');
  console.log('════════════════════════════════════════════════════\n');
  results.forEach(r => {
    console.log(`${r.courseCode}:`);
    console.log(`  {`);
    console.log(`    type: "resources",`);
    console.log(`    resources: [{`);
    console.log(`      title: "Participant Handout — ${r.courseCode}",`);
    console.log(`      url: "${r.url}",`);
    console.log(`      type: "docx"`);
    console.log(`    }]`);
    console.log(`  },\n`);
  });
})();
