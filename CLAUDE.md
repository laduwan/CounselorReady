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
