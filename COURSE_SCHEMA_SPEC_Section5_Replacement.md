# ═══════════════════════════════════════════════════════════════
# REPLACE Section 5 in COURSE_SCHEMA_SPEC_v2.md with this
# ═══════════════════════════════════════════════════════════════

## 5. Module & Content Block Structure Rules

Each module contains a `contentBlocks[]` array with the 17 valid block types. Knowledge checks are individual `multipleChoice` blocks distributed throughout content — NOT wrapper blocks. The final exam lives in the top-level `assessment` object — NOT inside any module.

### The 17 Valid Block Types

| Category | Block Types |
|---|---|
| Content | `sectionDivider`, `text`, `imageText`, `image`, `accordion`, `resources`, `videoEmbed` |
| Knowledge Check | `multipleChoice`, `multiSelect`, `matching`, `cardSort`, `sequencing`, `timeline` |
| Engagement | `reflection`, `scenarioTree`, `flashcardDeck`, `hotspot` |

### Correct Structure for a 3CE Course (7 sections per Gold Standard)

```
Module 1: sectionDivider → text → accordion → text → blockquote → activity → text → 2-3 multipleChoice → reflection
Module 2: sectionDivider → text → accordion → text → blockquote → activity → text → 2-3 multipleChoice → reflection
Module 3: sectionDivider → text → flashcardDeck → text → blockquote → scenarioTree → text → 2-3 multipleChoice → reflection
Module 4: sectionDivider → text → matching → text → blockquote → scenarioTree → text → 2-3 multipleChoice → reflection
Module 5: sectionDivider → text → accordion → text → blockquote → activity → text → 2-3 multipleChoice → reflection
Module 6: sectionDivider → text → matching → text → blockquote → cardSort → text → 2-3 multipleChoice → reflection
Module 7 (Conclusion): sectionDivider → key takeaways text → accordion → ethical practice plan text → reflection → resources → references text (NO knowledge checks in conclusion)
```

Final exam: top-level `assessment` object with ≥ 15 questions, `passingScore: 80`, `maxAttempts: 3`.

### Banned Patterns

Do NOT use any of these — they are from deprecated schemas and cause rendering failures:

```javascript
// ❌ lessons[] array — old schema, requires viewer fallback
modules: [{ lessons: [{ type: "text" }, { type: "quiz" }] }]

// ❌ knowledgeCheck wrapper — viewer has no case for this
contentBlocks: [{ type: "knowledgeCheck", questions: [...] }]

// ❌ quiz block with isExam — exam belongs in top-level assessment
contentBlocks: [{ type: "quiz", isExam: true, questions: [...] }]

// ❌ { text, isCorrect } options — causes grading failures
options: [{ text: "A", isCorrect: false }, { text: "B", isCorrect: true }]
```

### Also Update Section 7 Seed Script Template

Replace the collection line in the template opener:

```javascript
// ✅ CORRECT
const Course = mongoose.connection.collection("interactivecourses");

// ❌ WRONG (currently in the spec)
const Course = mongoose.connection.collection("courses");
```
