# CounselorReady — Claude Code Instructions

## Locked Code Policy

Sections of code marked with `// @lock` (or `/* @lock */`) comments are **protected** and must NOT be modified, removed, or overridden by Claude. This includes everything between a `// @lock-start` and `// @lock-end` pair.

### Locked Areas (do NOT change these):

1. **Color Palette** (`client/tailwind.config.cjs`)
   - The entire `colors` object inside `theme.extend` is locked.
   - Do NOT add, remove, rename, or change any color hex values.
   - Do NOT modify the aliases section (forest, moss, dustyrose, stone).

2. **Font Families** (`client/tailwind.config.cjs`)
   - The `fontFamily` config (display, sans, body) is locked.
   - Do NOT change fonts or their fallback stacks.

3. **Base Layer Styles** (`client/src/index.css`)
   - The `@layer base` block (body colors, heading styles) is locked.
   - Do NOT change background colors, text colors, or font assignments in base.

4. **Component Layer Styles** (`client/src/index.css`)
   - `.btn-primary`, `.btn-secondary`, `.btn-tertiary` button styles are locked.
   - `.card` container styling is locked.
   - `.header-nav` styling is locked.

5. **Layout Structure** (`client/src/components/Layout.jsx`)
   - The overall page structure (header, sidebar, main content area) is locked.
   - Navigation ordering and hierarchy is locked.

6. **Course Catalog Page** (`client/src/pages/InteractiveCourseCatalog.jsx`) — FULLY LOCKED
   - The entire visual design of this page is locked: layout, colors, and all elements.
   - **Header banner**: teal-600 to emerald-600 gradient with white text — locked.
   - **Filter bar**: white background, rounded-xl, gray-300 borders, teal-500 focus rings — locked.
   - **Grid layout**: 1/2/3-column responsive grid with gap-6 — locked.
   - **CourseCard (grid view)**: gradient thumbnail (teal-500 → emerald-600), white/30 book icon, gray-100 border, teal-600 action text — all locked.
   - **CourseListItem (list view)**: teal/emerald icon gradient, teal-600 progress bar fill, gray-200 track — all locked.
   - **View toggle**: teal-600 active state, gray-600 inactive — locked.
   - Do NOT change any className, color value, gradient, spacing, border, shadow, or component hierarchy on this page.
   - Functional/data changes (API calls, state logic, filtering) are allowed — visual changes are not.

7. **All Page Aesthetics** — LOCKED to current burgundy/forest brand scheme
   - Do NOT change colors, gradients, spacing, fonts, or visual styling on any existing page without explicit user approval.
   - Buttons use burgundy-700/burgundy-800 — do NOT change to moss, teal, or any other color.
   - Logo uses gradient `linear-gradient(135deg, #8B2542, #6B1D34)` — do NOT flatten to solid color.
   - Landing page gradients and color transitions — do NOT simplify to flat colors.
   - When adding new features, match existing page aesthetics — do NOT introduce new color schemes.

### How to mark new locked sections:

Use these comment markers in any file:
```js
// @lock-start: <reason>
... protected code ...
// @lock-end
```

Or for single lines:
```js
const PRIMARY_COLOR = '#8B2542'; // @lock
```

### General Rules:
- When in doubt about whether something is locked, ask before changing it.
- If a task requires changing a locked section, explicitly confirm with the user first.
- Accessibility styles in index.css should be preserved as-is.
