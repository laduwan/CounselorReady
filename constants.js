// DROP INTO: client/src/components/CourseBuilder/constants.js

// ─── Brand Colors ───
export const C = {
  burgundy: "#6B1D34", burgundyLight: "#8B2D4A", burgundyFaded: "rgba(107,29,52,0.08)",
  green: "#4A7C59", greenLight: "#5A9469", greenFaded: "rgba(74,124,89,0.08)",
  gold: "#D4A855", goldLight: "#E0BC72", goldFaded: "rgba(212,168,85,0.12)",
  navy: "#34495E", navyLight: "#4A6278",
  bg: "#FAFAF8", card: "#FFFFFF",
  border: "#E8E4DF", borderLight: "#F0EDE8",
  text: "#2C2C2C", textMuted: "#6B7280", textLight: "#9CA3AF",
  danger: "#DC2626", dangerFaded: "rgba(220,38,38,0.08)",
  purple: "#7C3AED", teal: "#0F766E", amber: "#B45309", slate: "#1E293B",
};

// ─── Block Type Registry — 17 Total ───
export const BLOCK_TYPES = [
  // Content (auto-complete on render)
  { type: "sectionDivider", label: "Section Divider", icon: "§", color: C.navy, category: "content" },
  { type: "text", label: "Text Content", icon: "¶", color: C.green, category: "content" },
  { type: "imageText", label: "Image + Text", icon: "🖼", color: C.greenLight, category: "content" },
  { type: "image", label: "Standalone Image", icon: "📷", color: C.teal, category: "content" },
  { type: "accordion", label: "Accordion", icon: "≡", color: C.gold, category: "content" },
  { type: "resources", label: "Resources", icon: "🔎", color: C.navy, category: "content" },
  { type: "videoEmbed", label: "Video + Markers", icon: "🎬", color: C.slate, category: "content" },
  // Knowledge Checks (graded, count for ACEP)
  { type: "multipleChoice", label: "Multiple Choice", icon: "◉", color: C.burgundy, category: "assessment" },
  { type: "multiSelect", label: "Multi-Select", icon: "☑", color: C.burgundyLight, category: "assessment" },
  { type: "matching", label: "Matching", icon: "↔", color: C.navyLight, category: "assessment" },
  { type: "cardSort", label: "Card Sort", icon: "🗂", color: "#0284C7", category: "assessment" },
  { type: "sequencing", label: "Sequencing", icon: "📋", color: C.navy, category: "assessment" },
  { type: "timeline", label: "Timeline", icon: "📅", color: C.teal, category: "assessment" },
  // Interactive Engagement
  { type: "reflection", label: "Reflection", icon: "💭", color: C.green, category: "interactive" },
  { type: "hotspot", label: "Hotspot / Diagram", icon: "🎯", color: C.purple, category: "interactive" },
  { type: "scenarioTree", label: "Scenario Tree", icon: "🔀", color: C.burgundy, category: "interactive" },
  { type: "flashcardDeck", label: "Flashcard Deck", icon: "🃏", color: C.amber, category: "interactive" },
];

export const BLOCK_DEFAULTS = {
  sectionDivider: { title: "", sectionNumber: 1, subtitle: "" },
  text: { content: "" },
  imageText: { title: "", content: "", image: "", imageAlt: "", imagePosition: "left", highlight: false },
  image: { imageUrl: "", imageAltText: "", imageCaption: "", imageSize: "large", imageAlignment: "center" },
  accordion: { accordionItems: [{ title: "", content: "" }] },
  multipleChoice: { question: "", options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }], explanation: "" },
  multiSelect: { question: "", options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }], explanation: "" },
  matching: { matchingPairs: [{ term: "", definition: "" }], matchingInstructions: "" },
  reflection: { question: "", minLength: 50 },
  resources: { resources: [{ title: "", url: "", type: "pdf" }] },
  cardSort: { instructions: "", categories: ["Category 1", "Category 2"], cards: [{ id: "c1", text: "", correctCategory: "Category 1" }], explanation: "" },
  sequencing: { instructions: "", steps: [{ id: "s1", text: "", order: 1 }], explanation: "" },
  hotspot: { instructions: "", hotspotImage: null, imageDescription: "", hotspots: [], explanation: "" },
  timeline: { instructions: "", events: [{ id: "t1", text: "", year: "", order: 1 }], explanation: "" },
  scenarioTree: { scenarioTitle: "", instructions: "", startNode: "start", nodes: { start: { text: "", choices: [{ text: "", next: "" }], feedback: null } } },
  flashcardDeck: { instructions: "", flashcards: [{ id: "f1", front: "", back: "" }] },
  videoEmbed: { videoTitle: "", videoUrl: "", videoDuration: "", thumbnailUrl: "", markers: [{ id: "v1", time: "0:00", label: "", prompt: "" }] },
};

export const ACEP_RULES = {
  wordsPerCEHour: 6000,
  knowledgeChecksPerModule: { min: 2, max: 5 },
  finalExamQuestions: 15,
  passThreshold: 0.80,
};

export const KNOWLEDGE_CHECK_TYPES = ["multipleChoice", "multiSelect", "matching", "cardSort", "sequencing", "timeline"];
export const ENGAGEMENT_TYPES = ["accordion", "hotspot", "scenarioTree", "flashcardDeck", "reflection"];
export const CONTENT_TYPES = ["sectionDivider", "text", "imageText", "image", "resources", "videoEmbed"];
