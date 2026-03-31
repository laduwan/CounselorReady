/**
 * RNR_CE_UI.js — Researched & Ready CE Design System
 * ═══════════════════════════════════════════════════════════
 * VISUAL SOURCE OF TRUTH for all RNR CE components.
 *
 * This file is the authoritative reference for:
 * - Color tokens
 * - Typography (fonts, sizes, weights)
 * - Component class names and their purposes
 * - Layout structure and woodgrain frame system
 * - Accessibility states
 *
 * Source: researched-and-ready.html (the approved design)
 * Do NOT deviate from these values in any RNR CE file.
 * ═══════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────
// 1. CSS CUSTOM PROPERTIES (copy verbatim into :root)
// ─────────────────────────────────────────────────────────

export const CSS_VARIABLES = `
:root {
  --ink:         #1C1208;   /* primary body text */
  --ink-mid:     #3D2B1A;   /* secondary text, card bylines */
  --ink-muted:   #6B5744;   /* muted/supporting text */
  --ink-faint:   #9C8472;   /* placeholder, labels, captions */

  --parchment:   #F6F1E7;   /* card and panel backgrounds */
  --vellum:      #EFE8D6;   /* page/body background */
  --cream:       #FAF7F0;   /* sidebar, search card, chapter panel */

  --burgundy:    #6B1D34;   /* primary brand — active tabs, titles */
  --burgundy-d:  #4A1224;   /* masthead bg, submit buttons, footer */
  --burgundy-l:  #8B3050;   /* hover states */
  --crimson:     #8B1A2E;   /* error states */

  --green:       #2C4F2E;   /* success text */
  --green-m:     #3D6B40;   /* selected card border, OA stamp, CE fill */
  --green-l:     #EAF0E4;   /* selected card bg, correct answer bg */

  --gold:        #C09040;   /* ornamental accents, ✦ symbols */
  --gold-d:      #8B6820;   /* Cinzel labels, chapter ornaments */
  --gold-l:      #F0DFA0;   /* text on dark/burgundy backgrounds */
  --gold-pale:   #FBF5E2;   /* hover fills, bookplate bg */

  --navy:        #1A2B40;   /* card titles (Playfair Display) */

  --rule:        rgba(107,29,52,0.25);   /* burgundy dividers */
  --rule-gold:   rgba(192,144,64,0.4);   /* gold borders, track borders */

  --shadow-deep: 0 2px 12px rgba(28,18,8,0.15), 0 1px 3px rgba(28,18,8,0.1);
  --shadow-card: 0 1px 4px rgba(28,18,8,0.08);
}
`;

// ─────────────────────────────────────────────────────────
// 2. TYPOGRAPHY
// ─────────────────────────────────────────────────────────

export const TYPOGRAPHY = {
  googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cinzel:wght@400;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap',
  accessibilityFontUrl: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap',

  /**
   * Font usage rules:
   *
   * 'EB Garamond', serif
   *   → Body font. Page body, card abstracts, sidebar filters,
   *     search input, question stems, syllabus text, footer copy.
   *     Default font-size: 15px, line-height: 1.7
   *
   * 'Playfair Display', serif
   *   → Display headings. Masthead name ("Researched & Ready"),
   *     chapter titles, exam titles, certificate course name,
   *     CE hour values in bookplate, ACEP number, diploma score.
   *     font-style: italic is common here.
   *
   * 'Cinzel', serif
   *   → Small-caps labels and stamps. Provider eyebrow,
   *     ACEP label, bookplate title, q-number, oa-stamp,
   *     search button, submit button, action buttons, footer provider.
   *     Always uppercase, letter-spacing: 0.12–0.22em, font-size: 8–10px.
   *
   * 'Cormorant Garamond', serif
   *   → Monogram only (C and R in the seal logo).
   *
   * 'Atkinson Hyperlegible', sans-serif
   *   → Accessibility fallback when body.dyslexia-font is active.
   *     Applied to all text elements including buttons.
   */

  body: `font-family: 'EB Garamond', serif; font-size: 15px; line-height: 1.7;`,
  display: `font-family: 'Playfair Display', serif;`,
  label: `font-family: 'Cinzel', serif; letter-spacing: 0.18em; text-transform: uppercase;`,
  monogram: `font-family: 'Cormorant Garamond', serif; font-weight: 700;`,
};

// ─────────────────────────────────────────────────────────
// 3. WOODGRAIN FRAME SYSTEM
// ─────────────────────────────────────────────────────────

export const WOODGRAIN = {
  /**
   * The page is framed by inlaid woodgrain border strips rendered
   * via SVG feTurbulence filters. These are NOT decorative — they
   * define the page boundary and are part of the brand identity.
   *
   * Structure (top to bottom):
   *   .wg-strip-top     ← 14px woodgrain strip, gold rule below
   *   .rule-double      ← 4px double gold rule
   *   .masthead         ← burgundy header
   *   .chapter-nav      ← cream nav bar
   *   .page-body        ← sidebar + main content
   *     .sidebar-woodborder  ← 12px vertical woodgrain strip (left edge)
   *     .sidebar
   *     .main
   *   .rule-double
   *   .wg-strip-bottom  ← 14px woodgrain strip, gold rule above
   *   .site-footer
   *
   * Corner rosettes (.wg-corner) appear at tl/tr/bl/br intersections.
   */

  stripTopCSS: `
    height: 14px; width: 100%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='14'%3E%3Cfilter id='wg'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015 0.9' numOctaves='5' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.4 0.3 0 0 0.28 0.25 0.18 0 0 0.16 0.12 0.09 0 0 0.08 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='400' height='14' filter='url(%23wg)'/%3E%3C/svg%3E");
    background-size: 400px 14px;
    border-bottom: 1.5px solid rgba(192,144,64,0.5);
  `,

  sidebarBorderCSS: `
    width: 12px; flex-shrink: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='600'%3E%3Cfilter id='wv'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8 0.02' numOctaves='5' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.4 0.3 0 0 0.28 0.25 0.18 0 0 0.16 0.12 0.09 0 0 0.08 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='12' height='600' filter='url(%23wv)'/%3E%3C/svg%3E");
    background-size: 12px 600px;
    border-right: 1.5px solid rgba(192,144,64,0.5);
  `,

  ruleDoubleCSS: `
    height: 4px;
    background: linear-gradient(
      to bottom,
      rgba(192,144,64,0.4) 0, rgba(192,144,64,0.4) 1px,
      transparent 1px, transparent 2px,
      rgba(192,144,64,0.4) 2px, rgba(192,144,64,0.4) 3px
    );
  `,
};

// ─────────────────────────────────────────────────────────
// 4. MASTHEAD
// ─────────────────────────────────────────────────────────

export const MASTHEAD = {
  /**
   * .masthead
   *   background: var(--burgundy-d)  [#4A1224]
   *   Star tile pattern via SVG background-image (gold, 8% opacity, 60px repeat)
   *   height: 68px via .masthead-inner padding
   *
   * .seal
   *   44×44px circle, 1.5px gold border, inner double border
   *   Contains .monogram-cr:
   *     .mono-c  Cormorant Garamond 22px bold, color #D4A855, z-index 2
   *     .mono-r  Cormorant Garamond 16px bold, color #4A7C59 (Hunter Green),
   *              top:8px left:13px, z-index 3 (overlaps C tail)
   *
   * .masthead-name
   *   Playfair Display 22px 400
   *   "Researched" color: var(--parchment)
   *   " & Ready" uses <em> → font-style: italic, color: var(--gold-l)
   *
   * .masthead-provider
   *   Cinzel 9px, color: rgba(255,255,255,0.45), letter-spacing: 0.18em
   *
   * .acep-num
   *   Playfair Display 13px italic, color: var(--gold-l)
   */

  starPatternSVG: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 5 L35 20 L50 20 L38 29 L43 44 L30 35 L17 44 L22 29 L10 20 L25 20 Z' fill='none' stroke='rgba(192,144,64,0.08)' stroke-width='1'/%3E%3C/svg%3E")`,
};

// ─────────────────────────────────────────────────────────
// 5. CHAPTER NAVIGATION
// ─────────────────────────────────────────────────────────

export const CHAPTER_NAV = {
  /**
   * Four chapters with Roman numerals: I. Search & Select, II. AI Analysis,
   * III. Assessment, IV. Certificate & Syllabus
   *
   * .chapter-tab
   *   background: var(--cream), font: EB Garamond 13px
   *   border-bottom: 2px solid transparent
   *   color: var(--ink-faint)
   *
   * .chapter-tab.active
   *   color: var(--burgundy)
   *   border-bottom-color: var(--burgundy)
   *
   * .chapter-tab.done
   *   color: var(--green-m)
   *   .ch-num shows ✓ checkmark, background: var(--green-m)
   *
   * .ch-roman  Cinzel 10px, color: var(--gold-d)
   */
};

// ─────────────────────────────────────────────────────────
// 6. SIDEBAR — BOOKPLATE & FILTERS
// ─────────────────────────────────────────────────────────

export const SIDEBAR = {
  /**
   * width: 210px, background: var(--cream)
   * border-right: 1px solid var(--rule-gold)
   *
   * .bookplate (CE hours selector)
   *   background: var(--parchment), border: 1px solid var(--rule-gold)
   *   ✦ ornament centered on top border (gold, 10px)
   *   .bookplate-title: Cinzel 9px, color: var(--burgundy), uppercase
   *
   * .ce-btn (2×2 grid)
   *   Playfair Display 14px, border: 1px solid var(--rule-gold)
   *   background: var(--cream)
   *   .ce-btn.selected: background var(--burgundy), color var(--gold-l)
   *
   * Word thermometer (.thermometer)
   *   .thermo-track: 5px height, border: 1px var(--rule-gold)
   *   .thermo-fill: background var(--green-m), width animates
   *   .thermo-fill.warn: background var(--gold-d)
   *   .thermo-status.ok: color var(--green), font-weight 500, not italic
   *
   * .filter-btn
   *   EB Garamond 13px, border-left: 2px solid transparent
   *   .filter-btn.active: color var(--burgundy), bg var(--gold-pale),
   *     border-left-color: var(--burgundy)
   */
};

// ─────────────────────────────────────────────────────────
// 7. SEARCH CARD
// ─────────────────────────────────────────────────────────

export const SEARCH_CARD = {
  /**
   * .search-card
   *   background: var(--cream), border: 1px solid var(--rule-gold)
   *   ::before content: '✦  SCHOLAR SEARCH  ✦'
   *     Cinzel 8.5px, letter-spacing 0.22em, color var(--gold-d), centered
   *
   * .search-input
   *   background: var(--parchment), font: EB Garamond 14px
   *   border: 1px solid rgba(192,144,64,0.5), border-radius: 3px
   *   placeholder: italic
   *   :focus border-color: var(--burgundy), box-shadow: 0 0 0 2px rgba(107,29,52,0.08)
   *
   * .search-btn
   *   background: var(--burgundy), color: var(--gold-l)
   *   font: Cinzel 10px 600, letter-spacing: 0.12em
   *
   * .search-provenance
   *   EB Garamond 11px italic, color var(--ink-faint), centered
   *   Text: "Searching OpenAlex · Psychology & Counseling fields only · Open access verified"
   */
};

// ─────────────────────────────────────────────────────────
// 8. ARTICLE CARDS — INDEX CARD STYLE
// ─────────────────────────────────────────────────────────

export const ARTICLE_CARD = {
  /**
   * .article-card
   *   background: var(--cream)
   *   border: 1px solid rgba(192,144,64,0.4)
   *   border-radius: 3px
   *   box-shadow: var(--shadow-card)
   *   ::before pseudo — 4px left colored strip (transparent by default)
   *   :hover → border-color var(--gold), shadow-deep, translateY(-1px)
   *
   * .article-card.selected
   *   border-color: var(--green-m)
   *   background: var(--green-l)
   *   ::before background: var(--green-m)
   *
   * .card-body  padding: 11px 14px 11px 18px
   *
   * .check-box
   *   16×16px, border: 1px solid var(--rule-gold), background var(--parchment)
   *   .selected → background var(--green-m), border var(--green)
   *   .check-mark color: white, font-size: 10px
   *
   * .card-title
   *   Playfair Display 13.5px 500, color: var(--navy)
   *
   * .card-byline
   *   EB Garamond 11px italic, color: var(--ink-faint)
   *
   * .card-abstract
   *   EB Garamond 12px, color: var(--ink-muted), 2-line clamp
   *
   * .card-kw  (keyword pills)
   *   EB Garamond 10px italic, background var(--parchment),
   *   border: 1px solid var(--rule), padding: 1px 7px, border-radius: 2px
   *
   * .oa-stamp  (Open Access badge)
   *   Cinzel 8px, color var(--green), border var(--green-m),
   *   background var(--green-l), padding 1px 6px
   *
   * .card-estwords
   *   EB Garamond 11px italic, color var(--green), margin-left auto
   *   Format: "8,412 words · 1.5 CE hrs"
   */

  /**
   * Download button (.dl-btn) inside card footer:
   *   Cinzel 8px, letter-spacing 0.1em, color var(--gold-d)
   *   border: 1px solid var(--rule-gold), border-radius: 2px
   *   .dl-btn.oa → border/color var(--green)
   */
};

// ─────────────────────────────────────────────────────────
// 9. SELECTED FOLIO (article pairing tray)
// ─────────────────────────────────────────────────────────

export const FOLIO = {
  /**
   * .selected-folio
   *   background var(--cream), border var(--rule-gold)
   *   Shows selected articles with word count and CE hrs
   *
   * .folio-title  Cinzel 9px, color var(--burgundy)
   * .folio-badge  Playfair Display 11px italic, color var(--gold-d),
   *               background var(--gold-pale), border var(--rule-gold), pill border-radius
   *
   * .folio-item  divider: 1px dotted rgba(192,144,64,0.3)
   * .folio-bullet  color var(--gold), font-size 10px
   * .folio-ititle  font-size 12px italic, color var(--ink-mid)
   * .folio-words   Cinzel, color var(--green)
   *
   * .proceed-btn
   *   Cinzel 10px 600, letter-spacing 0.14em
   *   background var(--burgundy), color var(--gold-l)
   *   :disabled → background var(--vellum), color var(--ink-faint)
   */
};

// ─────────────────────────────────────────────────────────
// 10. CHAPTER PANELS (AI Analysis, Assessment, Certificate)
// ─────────────────────────────────────────────────────────

export const CHAPTER_PANEL = {
  /**
   * .chapter-panel
   *   background var(--cream), border: 1px solid var(--rule-gold)
   *   border-radius: 4px, box-shadow var(--shadow-card)
   *
   * .chapter-ornament
   *   Playfair Display 12px italic, color var(--gold-d)
   *   Format: "— Chapter the [Ordinal] —"
   *
   * .chapter-title
   *   Playfair Display 26px 400, color var(--burgundy), centered
   *
   * .chapter-sub
   *   EB Garamond 13px italic, color var(--ink-muted), centered
   *
   * .proceed-btn-ornate
   *   Cinzel 10px 600, letter-spacing 0.15em
   *   background var(--burgundy), color var(--gold-l)
   *   ::before ::after content: '✦'
   */

  /**
   * AI ANALYSIS PANEL:
   * .scroll-proclamation (generated course title display)
   *   background var(--parchment), border var(--rule-gold)
   *   ::before ::after content: '— ✦ —' (EB Garamond 13px italic, gold-d)
   *   .proclaim-label: Cinzel 8px, color var(--burgundy)
   *   .proclaim-title: Playfair Display 19px italic 400, color var(--burgundy-d)
   *
   * .ai-scanning-row  parchment bg, gold border, flex with .ink-spinner
   * .ink-spinner: 20px circle, border-top: var(--burgundy), CSS spin animation
   *
   * .conn-fleuron: color var(--gold-d), font-size 12px
   *
   * .compliance-rule
   *   background var(--gold-pale), border var(--rule-gold)
   *   EB Garamond 12px, color var(--gold-d)
   */
};

// ─────────────────────────────────────────────────────────
// 11. ASSESSMENT (Step 3)
// ─────────────────────────────────────────────────────────

export const ASSESSMENT = {
  /**
   * .exam-header: border-bottom var(--rule-gold), flex space-between
   * .exam-title: Playfair Display 22px italic 400, color var(--burgundy)
   * .exam-fraction: Playfair Display 22px, color var(--burgundy)
   *
   * .question-block
   *   border: 1px solid rgba(192,144,64,0.35), border-radius: 3px
   *   background: var(--cream)
   *
   * .q-number
   *   Cinzel 8.5px, letter-spacing 0.18em, color var(--gold-d), uppercase
   *   Format: "Question I", "Question II", etc.
   *
   * .q-stem
   *   EB Garamond 14px 500, color var(--ink), line-height 1.6
   *
   * .q-opt
   *   flex row, border: 1px solid rgba(192,144,64,0.3)
   *   background: var(--parchment)
   *   EB Garamond 13px
   *   .q-opt:hover → background var(--gold-pale), border var(--gold)
   *   .q-opt.selected → background var(--gold-pale), border var(--gold)
   *   .q-opt.correct → background var(--green-l), border var(--green-m), color var(--green)
   *   .q-opt.incorrect → background #fdf0f0, border #c0392b, color #8b1a1a
   *
   * .q-radio  14×14px custom radio circle, border var(--rule-gold), 50% border-radius
   *   .selected/.correct → filled green-m with ✓
   *   .incorrect → filled #c0392b with ✕
   *
   * .submit-exam-btn
   *   Cinzel 10px 600, letter-spacing 0.15em
   *   background var(--burgundy), color var(--gold-l)
   *   Width 100%, margin-top 12px
   *   Text: "✦  SUBMIT EXAMINATION  ✦"
   */
};

// ─────────────────────────────────────────────────────────
// 12. CERTIFICATE & SCORE (Step 4)
// ─────────────────────────────────────────────────────────

export const CERTIFICATE = {
  /**
   * .diploma-score (score circle)
   *   90×90px circle, centered
   *   .pass → background var(--green-l), border 2px var(--green-m),
   *     box-shadow: 0 0 0 4px var(--cream), 0 0 0 5px var(--rule-gold)
   *   .fail → background #fdf0f0, border 2px #c0392b
   *
   * .diploma-pct  Playfair Display 26px 600
   *   .pass → color var(--green)
   *   .fail → color #c0392b
   *
   * .diploma-lbl  EB Garamond 10px italic, color var(--ink-faint)
   *
   * .certificate
   *   border: 2px solid var(--rule-gold), border-radius: 4px
   *   background: var(--parchment)
   *   ::before → inset border (6px, 1px, rgba(192,144,64,0.3))
   *   ::after → "CounselorReady" watermark text (Cinzel 8px, 25% opacity)
   *   .cert-watermark → large centered Cinzel text, 5% opacity
   *
   * .cert-provider  Cinzel 9px, letter-spacing 0.22em, color var(--gold-d)
   * .cert-declaration  Playfair Display 12px italic, color var(--ink-muted)
   * .cert-coursename  Playfair Display 18px italic 400, color var(--burgundy-d)
   * .cert-divider  1px var(--rule-gold)
   * .cert-fact-val  Playfair Display 15px 600, color var(--ink-mid)
   * .cert-fact-key  Cinzel 7.5px, letter-spacing 0.18em, color var(--gold-d)
   *
   * .action-row  2-column grid, gap 8px
   * .action-primary  background var(--green-m), color var(--parchment)
   * .action-secondary  background var(--cream), color var(--burgundy)
   *
   * .syllabus-scroll
   *   EB Garamond 11.5px, color var(--ink-muted)
   *   background var(--parchment), border var(--rule-gold)
   *   max-height 180px, overflow-y auto, white-space pre-wrap
   */
};

// ─────────────────────────────────────────────────────────
// 13. DOCUMENT TOOLBAR (Read / Print / Download / Save)
// ─────────────────────────────────────────────────────────

export const DOC_TOOLBAR = {
  /**
   * .doc-toolbar
   *   position: sticky top:0 z-index:200
   *   background: var(--burgundy-d)
   *   border-bottom: 1px solid rgba(192,144,64,0.3)
   *   height: 36px
   *
   * .doc-toolbar-label  Cinzel 8px, color rgba(255,255,255,0.35)
   *
   * .doc-btn
   *   background: rgba(255,255,255,0.07)
   *   border: 1px solid rgba(192,144,64,0.3)
   *   Cinzel 8px 600, letter-spacing 0.12em, color var(--gold-l)
   *   :hover → rgba(255,255,255,0.14), stronger gold border
   *
   * .doc-btn-save (Save to Tracker)
   *   background: rgba(74,124,89,0.25), border rgba(74,124,89,0.5)
   *   Positioned margin-left: auto (right-aligned)
   *
   * .save-toast
   *   Fixed bottom-right, background var(--burgundy-d)
   *   border var(--rule-gold), EB Garamond 14px italic, color var(--gold-l)
   *   Animates in with translateY + opacity
   *
   * Button actions: Print, Syllabus .txt, Syllabus .docx, Certificate .pdf,
   *   Certificate .html, Save to Tracker
   */
};

// ─────────────────────────────────────────────────────────
// 14. ACCESSIBILITY BAR
// ─────────────────────────────────────────────────────────

export const A11Y_BAR = {
  /**
   * .a11y-bar
   *   background var(--cream), border-bottom 1px var(--rule-gold)
   *   min-height: 38px, overflow-x: auto
   *
   * .a11y-label  Cinzel 8px, color var(--gold-d)
   * .a11y-btn  EB Garamond 12px, border var(--rule-gold)
   *   .on → background var(--burgundy), color var(--gold-l)
   *
   * Body class accessibility states:
   *   body.font-lg     → font-size: 17px
   *   body.font-xl     → font-size: 19px
   *   body.dyslexia-font → Atkinson Hyperlegible throughout
   *   body.line-relax  → line-height: 2.0
   *   body.high-contrast → blacks/whites replace parchment tones,
   *                        rule-gold becomes rgba(0,0,0,0.4)
   *   body.reduced-motion → animation/transition: none
   */
};

// ─────────────────────────────────────────────────────────
// 15. FOOTER
// ─────────────────────────────────────────────────────────

export const FOOTER = {
  /**
   * .site-footer
   *   background: var(--burgundy-d)
   *   border-top: 1px solid rgba(192,144,64,0.4)
   *   padding: 16px 28px, flex row
   *
   * .footer-seal-wrap  52×52px circle, gold border, image of seal
   * .footer-divider    1px × 40px, rgba(192,144,64,0.3)
   * .footer-provider   Cinzel 8.5px, color var(--gold-l), uppercase
   * .footer-copy       EB Garamond 12px italic, color rgba(255,255,255,0.45)
   * .footer-acep-label Cinzel 8px, color rgba(192,144,64,0.7)
   * .footer-acep-num   Playfair Display 13px italic, color var(--gold-l)
   *
   * Provider text: "GA Integrated Therapeutic Perspectives LLC"
   * Copyright: "Researched & Ready™ — counselorready.com · GAITP LLC © 2026"
   * ACEP: "NBCC ACEP · Provider No. 7760"
   */
};

// ─────────────────────────────────────────────────────────
// 16. LOADING & EMPTY STATES
// ─────────────────────────────────────────────────────────

export const STATES = {
  /**
   * .loading-pg  centered, padding 36px 20px
   * .loading-quill  28px, float animation (translateY 0 → -8px → 0, 2s ease-in-out)
   * .loading-txt  EB Garamond 14px italic, color var(--ink-muted)
   *
   * .empty-pg  centered, color var(--ink-faint)
   * .empty-icon  30px, opacity 0.35
   * .empty-txt  EB Garamond 14px italic
   */
};

// ─────────────────────────────────────────────────────────
// 17. PRINT STYLES
// ─────────────────────────────────────────────────────────

export const PRINT = {
  /**
   * @media print:
   * - Hide: doc-toolbar, a11y-bar, chapter-nav, masthead, sidebar,
   *         sidebar-woodborder, wg-strips, search-card, selected-folio,
   *         results-meta, #resultsList, proceed buttons, steps 1-3
   * - Show: #step4 (certificate only)
   * - .certificate → border: 3px double #8B6820
   * - body → background: white (no texture)
   * - @page → margin: 1in, size: letter portrait
   */
};

// ─────────────────────────────────────────────────────────
// 18. ORNAMENTAL PATTERNS
// ─────────────────────────────────────────────────────────

export const ORNAMENTS = {
  /**
   * .ornament  EB Garamond 18px italic, color var(--gold), font-style italic
   * .small-caps  font-variant: small-caps, letter-spacing: 0.08em
   *
   * Common ornamental characters used throughout:
   *   ✦  — gold star, section dividers, button decoration, bookplate ornament
   *   —  — em dash, chapter ornament framing ("— Chapter the Third —")
   *   ·  — interpunct, metadata separators
   *   ✓  — checkmark, correct answers, completed chapter tabs
   *   ✕  — incorrect answers
   *   ❧  — reference fleuron (conn-fleuron in connection list)
   *
   * Background paper texture (body):
   *   SVG feTurbulence fractalNoise, baseFrequency 0.75, numOctaves 4,
   *   grayscale, opacity 0.04 — subtle woven paper effect
   */

  paperTexture: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
};

// ─────────────────────────────────────────────────────────
// 19. PAGE STRUCTURE (HTML skeleton)
// ─────────────────────────────────────────────────────────

export const HTML_STRUCTURE = `
<!-- Exact page structure — do not deviate -->

<div class="wg-strip-top"></div>
<div class="rule-double"></div>

<div class="doc-toolbar">...</div>

<header class="masthead">
  <div class="masthead-inner">
    <div class="seal">
      <div class="monogram-cr">
        <span class="mono-c">C</span>
        <span class="mono-r">R</span>
      </div>
    </div>
    <div class="masthead-titles">
      <div class="masthead-provider">CounselorReady</div>
      <div class="masthead-name">Researched <em>&amp; Ready</em></div>
    </div>
    <div class="masthead-acep">
      <span class="acep-label">NBCC ACEP</span>
      <span class="acep-num">No. 7760</span>
    </div>
  </div>
  <div class="rule-double"></div>
</header>

<nav class="chapter-nav">
  <div class="chapter-tab active" id="step-nav-1">
    <div class="ch-num"><span>I</span></div> Search &amp; Select
  </div>
  <div class="chapter-tab" id="step-nav-2">
    <div class="ch-num"><span>II</span></div> AI Analysis
  </div>
  <div class="chapter-tab" id="step-nav-3">
    <div class="ch-num"><span>III</span></div> Assessment
  </div>
  <div class="chapter-tab" id="step-nav-4">
    <div class="ch-num"><span>IV</span></div> Certificate &amp; Syllabus
  </div>
</nav>

<div class="a11y-bar">...</div>

<div class="page-body">
  <div class="sidebar-woodborder"></div>
  <aside class="sidebar">...</aside>
  <main class="main">
    <!-- Steps 1–4 here, show/hide via JS -->
    <div id="step1">...</div>
    <div id="step2" class="hidden">...</div>
    <div id="step3" class="hidden">...</div>
    <div id="step4" class="hidden">...</div>
  </main>
</div>

<div class="rule-double"></div>
<div class="wg-strip-bottom"></div>

<footer class="site-footer">...</footer>

<div class="save-toast" id="saveToast"></div>
`;

// ─────────────────────────────────────────────────────────
// DEFAULT EXPORT — summary for quick reference
// ─────────────────────────────────────────────────────────

export default {
  name: 'RNR CE (Researched & Ready) Design System',
  version: '1.0',
  sourceFile: 'researched-and-ready.html',
  fonts: ['EB Garamond', 'Playfair Display', 'Cinzel', 'Cormorant Garamond'],
  palette: {
    pageBackground: '#EFE8D6',    // --vellum
    cardBackground: '#FAF7F0',    // --cream
    parchment: '#F6F1E7',         // --parchment
    primaryText: '#1C1208',       // --ink
    burgundy: '#6B1D34',          // --burgundy
    burgundyDark: '#4A1224',      // --burgundy-d (masthead, buttons, footer)
    gold: '#C09040',              // --gold
    goldDark: '#8B6820',          // --gold-d (Cinzel labels)
    goldLight: '#F0DFA0',         // --gold-l (text on dark bg)
    goldPale: '#FBF5E2',          // --gold-pale (hover fills)
    goldBorder: 'rgba(192,144,64,0.4)',  // --rule-gold
    green: '#3D6B40',             // --green-m (selected, OA, CE)
    greenLight: '#EAF0E4',        // --green-l (selected bg, correct)
    navy: '#1A2B40',              // --navy (card titles)
  },
  woodgrain: 'SVG feTurbulence inlaid strips — top/bottom (horizontal) and sidebar (vertical)',
  notes: [
    'body background uses --vellum (#EFE8D6) with a paper texture SVG overlay at 4% opacity',
    'All Cinzel usage is uppercase with wide letter-spacing (0.12–0.22em) at small sizes (7.5–10px)',
    'EB Garamond is used for nearly all body text; Playfair Display for display/headline text',
    'Gold double-rule (.rule-double) separates the woodgrain strips from the masthead and footer',
    'Star tile SVG pattern overlays the masthead at 8% opacity (rgba(192,144,64,0.08))',
    'All ornamental characters (✦ ✓ ✕ ❧) are plain Unicode, not icon fonts',
    'Accessibility: 5 body class states (font-lg, font-xl, dyslexia-font, line-relax, high-contrast, reduced-motion)',
  ],
};
