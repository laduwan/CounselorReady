// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — constants.js
// Single source of truth for block types, defaults, and ACEP rules.
// ─────────────────────────────────────────────────────────────────────────────

// Brand palette (matches design-tokens.css / Color_Spec_v1)
export const C = {
  burgundy:     "#6B1D34",
  burgundyFaded:"#6B1D3420",
  hunterGreen:  "#4A7C59",
  honey:        "#D4A855",
  navy:         "#284157",   // ← correct value per Color_Spec_v1 (NOT #284157)
  stone:        "#F8F7F4",
  card:         "#FFFFFF",
  border:       "#E5E0D8",
  borderLight:  "#F0EDE8",
  textMuted:    "#8A8178",
  textLight:    "#B0A89E",
  danger:       "#DC2626",
  purple:       "#7C3AED",
};

// ─── 17 valid block types ────────────────────────────────────────────────────

export const BLOCK_TYPE_CONFIG = {
  sectionDivider: { label: "Section Divider", icon: "📐", color: C.navy,       category: "Structure"  },
  text:           { label: "Text Block",       icon: "📝", color: C.hunterGreen,category: "Content"    },
  accordion:      { label: "Accordion",        icon: "📂", color: C.hunterGreen,category: "Content"    },
  image:          { label: "Image",            icon: "🖼",  color: "#0891B2",    category: "Media"      },
  imageText:      { label: "Image + Text",     icon: "🖼",  color: "#0891B2",    category: "Media"      },
  videoEmbed:     { label: "Video Embed",      icon: "▶️", color: "#DC2626",    category: "Media"      },
  multipleChoice: { label: "Knowledge Check",  icon: "✅", color: C.burgundy,   category: "Assessment", isKC: true },
  multiSelect:    { label: "Multi-Select KC",  icon: "☑️", color: C.burgundy,   category: "Assessment", isKC: true },
  matching:       { label: "Matching",         icon: "🔗", color: C.burgundy,   category: "Assessment", isKC: true },
  reflection:     { label: "Reflection",       icon: "💭", color: C.purple,     category: "Engagement" },
  flashcardDeck:  { label: "Flashcard Deck",   icon: "🃏", color: C.purple,     category: "Engagement" },
  cardSort:       { label: "Card Sort",        icon: "🗂",  color: C.purple,     category: "Engagement" },
  sequencing:     { label: "Sequencing",       icon: "🔢", color: C.purple,     category: "Engagement" },
  scenarioTree:   { label: "Scenario Tree",    icon: "🌳", color: C.purple,     category: "Engagement" },
  hotspot:        { label: "Hotspot Image",    icon: "🎯", color: C.purple,     category: "Engagement" },
  timeline:       { label: "Timeline",         icon: "📅", color: C.purple,     category: "Engagement" },
  resources:      { label: "Resources",        icon: "🔗", color: C.honey,      category: "Supplement" },
};

export const BLOCK_TYPES = Object.keys(BLOCK_TYPE_CONFIG);

// Grouped for the BlockPicker UI
export const BLOCK_TYPE_GROUPS = [
  {
    label: "Structure",
    types: ["sectionDivider"],
  },
  {
    label: "Content",
    types: ["text", "accordion"],
  },
  {
    label: "Media",
    types: ["image", "imageText", "videoEmbed"],
  },
  {
    label: "Assessment",
    types: ["multipleChoice", "multiSelect", "matching"],
  },
  {
    label: "Engagement",
    types: ["reflection", "flashcardDeck", "cardSort", "sequencing", "scenarioTree", "hotspot", "timeline"],
  },
  {
    label: "Supplement",
    types: ["resources"],
  },
];

// ─── Block defaults (canonical schema format) ────────────────────────────────
// options: [String], correctAnswer: Number (0-based) — never {text, isCorrect}

export const BLOCK_DEFAULTS = {
  sectionDivider: {
    type: "sectionDivider",
    title: "New Section",
    sectionNumber: 1,
    subtitle: "",
  },
  text: {
    type: "text",
    content: "",
    heading: "",
  },
  accordion: {
    type: "accordion",
    title: "Accordion Title",
    items: [{ title: "Item 1", content: "" }],
  },
  image: {
    type: "image",
    url: "",
    caption: "",
    alt: "",
    alignment: "center",
  },
  imageText: {
    type: "imageText",
    imageUrl: "",
    imageAlt: "",
    imageCaption: "",
    imagePosition: "left",
    content: "",
  },
  videoEmbed: {
    type: "videoEmbed",
    url: "",
    title: "",
    description: "",
    markers: [],
  },
  multipleChoice: {
    type: "multipleChoice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,        // 0-based index
    explanation: "",
    rationale: "",
  },
  multiSelect: {
    type: "multiSelect",
    question: "",
    options: ["", "", "", ""],
    correctAnswers: [0],     // array of 0-based indices
    explanation: "",
  },
  matching: {
    type: "matching",
    instructions: "Match each term to its definition.",
    pairs: [{ term: "", definition: "" }],
  },
  reflection: {
    type: "reflection",
    prompt: "",
    minWords: 50,
    placeholder: "Take a moment to reflect...",
  },
  flashcardDeck: {
    type: "flashcardDeck",
    title: "Flashcard Deck",
    cards: [{ front: "", back: "" }],
  },
  cardSort: {
    type: "cardSort",
    instructions: "Sort the following items into categories.",
    categories: [{ label: "Category A", color: "#E11D48" }, { label: "Category B", color: "#6366F1" }],
    cards: [{ text: "", category: "" }],
  },
  sequencing: {
    type: "sequencing",
    instructions: "Place the following steps in the correct order.",
    steps: [{ text: "", order: 1 }],
  },
  scenarioTree: {
    type: "scenarioTree",
    title: "Clinical Scenario",
    nodes: [
      {
        id: "root",
        text: "Describe the scenario...",
        isRoot: true,
        choices: [],
      },
    ],
  },
  hotspot: {
    type: "hotspot",
    imageUrl: "",
    imageAlt: "",
    instructions: "Click on the highlighted areas to learn more.",
    pins: [],
  },
  timeline: {
    type: "timeline",
    title: "Timeline",
    events: [{ year: "", title: "", description: "" }],
  },
  resources: {
    type: "resources",
    title: "Additional Resources",
    links: [{ label: "", url: "" }],
  },
};

// ─── ACEP / NBCC compliance rules ────────────────────────────────────────────

export const ACEP_RULES = {
  WORDS_PER_CE_HOUR: 6000,       // NBCC requirement — non-negotiable
  MIN_WORDS_PER_CE_HOUR: 6000,   // alias used by validator
  MIN_KC_PER_SECTION: 2,
  MAX_KC_PER_SECTION: 5,
  KC_PER_SECTION: { MIN: 2, MAX: 5 },  // nested alias used by validator/ACEP tab
  MIN_ASSESSMENT_QUESTIONS: 15,
  MAX_ASSESSMENT_QUESTIONS: 25,
  PASS_THRESHOLD: 0.80,
  MAX_ATTEMPTS: 3,
  MAX_WORDS_PER_TEXT_BLOCK: 1500,
  MAX_TEXT_BLOCK_WORDS: 1500,    // alias used by validator
  MAX_ANSWER_OPTION_FREQUENCY: 0.40,
  MAX_ANSWER_DIST_PCT: 0.40,    // alias used by validator
};

// KC block types (count toward KC-per-section rule)
// Array form used by validator; Set form used by legacy code
export const KC_BLOCK_TYPES = [
  "multipleChoice", "multiSelect", "matching",
  "cardSort", "sequencing", "timeline",
];
export const KC_BLOCK_TYPES_SET = new Set(KC_BLOCK_TYPES);

// ACEP provider hardcoded defaults (per platform spec)
export const ACEP_PROVIDER = {
  name: "GA Integrated Therapeutic Perspectives LLC",
  shortName: "GAITP LLC",
  acepNumber: "7760",
  approvalBody: "NBCC",
};

// Validation error codes
export const VALIDATION_CODES = {
  WORD_COUNT_LOW:           "WORD_COUNT_LOW",
  TEXT_BLOCK_TOO_LONG:      "TEXT_BLOCK_TOO_LONG",
  KC_COUNT_LOW:             "KC_COUNT_LOW",
  KC_COUNT_HIGH:            "KC_COUNT_HIGH",
  NO_SECTION_DIVIDER:       "NO_SECTION_DIVIDER",
  NO_OBJECTIVES:            "NO_OBJECTIVES",
  NO_TARGET_AUDIENCE:       "NO_TARGET_AUDIENCE",
  ASSESSMENT_TOO_FEW:       "ASSESSMENT_TOO_FEW",
  ANSWER_DIST_SKEWED:       "ANSWER_DIST_SKEWED",
  NO_REFERENCES:            "NO_REFERENCES",
  MISSING_TITLE:            "MISSING_TITLE",
  MISSING_CE_HOURS:         "MISSING_CE_HOURS",
  CORRECT_ANSWER_UNSET:     "CORRECT_ANSWER_UNSET",
};
