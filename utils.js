// DROP INTO: client/src/components/CourseBuilder/utils.js

export function countWords(text) {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function countBlockWords(block) {
  let w = 0;
  w += countWords(block.content || "");
  w += countWords(block.question || "");
  w += countWords(block.explanation || "");
  w += countWords(block.instructions || "");
  w += countWords(block.imageCaption || "");
  (block.options || []).forEach(o => { w += countWords(o.text); });
  (block.accordionItems || []).forEach(a => { w += countWords(a.title) + countWords(a.content); });
  (block.matchingPairs || []).forEach(p => { w += countWords(p.term) + countWords(p.definition); });
  (block.cards || []).forEach(c => { w += countWords(c.text); });
  (block.steps || []).forEach(s => { w += countWords(s.text); });
  (block.events || []).forEach(e => { w += countWords(e.text); });
  (block.hotspots || []).forEach(h => { w += countWords(h.label) + countWords(h.info); });
  (block.flashcards || []).forEach(f => { w += countWords(f.front) + countWords(f.back); });
  (block.markers || []).forEach(m => { w += countWords(m.label) + countWords(m.prompt); });
  if (block.nodes) Object.values(block.nodes).forEach(n => {
    w += countWords(n.text || "");
    w += countWords(n.feedback?.message || "");
    (n.choices || []).forEach(c => { w += countWords(c.text); });
  });
  return w;
}
