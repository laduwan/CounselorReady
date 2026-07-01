/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// DROP INTO: /client/src/components/InteractiveCourseComponents.jsx
// CounselorReady Brand: Burgundy #6B1D34 | Green #4A7C59 | Gold #D4A855 | Navy #284157
// ALL 16 LEARNER BLOCK TYPES

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronDown, ChevronUp, Check, X, GripVertical, 
  Clock, Award, BookOpen, AlertCircle, CheckCircle2,
  ArrowRight, RotateCcw, Play, Pause, Info
} from 'lucide-react';

// ============================================================================
// BRAND PALETTE
// ============================================================================
const B = {
  // Burgundy (H1, CTAs, alerts)
  burgundy:   '#6B1D34',
  burgundyLt: '#8B2542',
  burgundyBg: 'rgba(107,29,52,0.08)',

  // Hunter Green (buttons, nav, success, intervention)
  green:   '#4A7C59',
  greenLt: '#3D6A4A',
  greenBg: 'rgba(74,124,89,0.08)',

  // Honey / Gold (badges, progress, accents)
  gold:   '#D4A855',
  goldLt: '#EACD86',
  goldBg: 'rgba(212,168,85,0.12)',

  // Navy (H2, footer, secondary text)
  navy:   '#284157',
  navyLt: '#4A6B82',
  navyBg: 'rgba(40,65,87,0.06)',

  // Eggshell (backgrounds)
  bg:       '#F5F5DC',
  card:     '#FFFFFF',
  border:   '#E2E2BE',
  borderLt: '#EDEDD0',

  // Text
  text:  '#2C2C2C',
  muted: '#6B7280',
  light: '#9CA3AF',

  // Feedback
  ok:    '#059669',
  okBg:  'rgba(5,150,105,0.08)',
  err:   '#DC2626',
  errBg: 'rgba(220,38,38,0.08)',
};


// Shared button reset
const btnReset = { border: 'none', cursor: 'pointer', fontFamily: 'inherit' };

// ============================================================================
// 1. ACCORDION
// ============================================================================
export function Accordion({ items, allowMultiple = false, onComplete }) {
  const [open, setOpen] = useState(new Set());
  const toggle = (i) => {
    setOpen(prev => {
      const n = new Set(allowMultiple ? prev : []);
      prev.has(i) ? n.delete(i) : n.add(i);
      if (n.size === items.length && onComplete) onComplete();
      return n;
    });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ border: `1px solid ${B.border}`, borderRadius: 12, overflow: 'hidden', background: B.card, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <button onClick={() => toggle(i)} style={{ ...btnReset, width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', background: open.has(i) ? B.burgundyBg : B.bg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: open.has(i) ? B.burgundy : B.burgundyBg, color: open.has(i) ? '#fff' : B.burgundy }}>
                <BookOpen size={16} />
              </div>
              <span style={{ fontWeight: 600, color: B.navy, fontSize: 15 }}>{item.title}</span>
            </div>
            <ChevronDown size={20} style={{ color: B.muted, transform: open.has(i) ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>
          {open.has(i) && (
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${B.borderLt}` }}>
              {typeof item.content === 'string' ? <p style={{ color: B.muted, lineHeight: 1.7, margin: 0, fontSize: 14 }}>{item.content}</p> : item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 2. MATCHING EXERCISE
// ============================================================================
export function MatchingExercise({ pairs, instructions = "Drag each term to its matching definition", onComplete }) {
  const [terms, setTerms] = useState([]);
  const [defs, setDefs] = useState([]);
  const [matches, setMatches] = useState({});
  const [dragged, setDragged] = useState(null);
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setTerms([...pairs].sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, id: `t${i}` })));
    setDefs([...pairs].sort(() => Math.random() - 0.5).map((p, i) => ({ ...p, id: `d${i}` })));
  }, [pairs]);

  const check = () => {
    let c = 0; defs.forEach(d => { if (matches[d.id]?.term === d.term) c++; });
    setScore(c); setShow(true); setDone(true); if (onComplete) onComplete(c, pairs.length);
  };
  const reset = () => { setMatches({}); setShow(false); setDone(false); setScore(0); };
  const used = Object.values(matches).map(t => t?.id);
  const avail = terms.filter(t => !used.includes(t.id));

  return (
    <div style={{ background: B.burgundyBg, borderRadius: 16, borderLeft: `4px solid ${B.burgundy}`, overflow: 'hidden', margin: '24px 0' }}>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: B.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GripVertical size={14} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: B.burgundy, letterSpacing: '0.02em' }}>Check Your Understanding</span>
        </div>
        <p style={{ fontSize: 14, color: B.muted, marginBottom: 20, marginLeft: 38 }}>{instructions}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, background: B.card, borderRadius: 12, padding: 20, border: `1px solid ${B.border}` }}>
          <div>
            <h4 style={{ fontWeight: 700, color: B.navy, marginBottom: 10, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Terms</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {avail.map(t => (
                <div key={t.id} draggable={!done} onDragStart={(e) => { setDragged(t); e.dataTransfer.effectAllowed = 'move'; }}
                  style={{ padding: '10px 14px', background: B.greenBg, border: `2px solid ${B.green}44`, borderRadius: 10, cursor: done ? 'default' : 'grab', fontWeight: 600, color: B.green, fontSize: 14, opacity: done ? 0.5 : 1, transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  {t.term}
                </div>
              ))}
              {avail.length === 0 && !show && <p style={{ color: B.light, fontSize: 13, fontStyle: 'italic' }}>All terms matched!</p>}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, color: B.navy, marginBottom: 10, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Definitions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {defs.map(d => {
                const m = matches[d.id]; const ok = show && m?.term === d.term; const bad = show && m && m.term !== d.term;
                return (
                  <div key={d.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (dragged && !matches[d.id]) setMatches(p => ({ ...p, [d.id]: dragged })); setDragged(null); }}
                    style={{ minHeight: 56, padding: '10px 14px', borderRadius: 10, border: `2px dashed ${m ? (ok ? B.ok : bad ? B.err : B.gold) : B.border}`, background: m ? (ok ? B.okBg : bad ? B.errBg : B.goldBg) : B.bg, transition: 'border-color 0.2s, background 0.2s' }}>
                    <p style={{ fontSize: 13, color: B.muted, marginBottom: m ? 8 : 0, lineHeight: 1.5 }}>{d.definition}</p>
                    {m && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 10px', borderRadius: 6, background: ok ? 'rgba(5,150,105,0.12)' : bad ? 'rgba(220,38,38,0.12)' : B.goldBg }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: ok ? B.ok : bad ? B.err : '#92400E' }}>{m.term}</span>
                        {!done && <button onClick={() => setMatches(p => { const n = {...p}; delete n[d.id]; return n; })} style={{ ...btnReset, background: 'none', color: B.light, padding: 2 }}><X size={14} /></button>}
                        {show && (ok ? <CheckCircle2 size={16} color={B.ok} /> : <X size={16} color={B.err} />)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: show ? 'space-between' : 'flex-end', alignItems: 'center' }}>
          {show ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 10, background: score === pairs.length ? B.okBg : B.goldBg, border: `1px solid ${score === pairs.length ? B.ok : B.gold}22` }}>
                <Award size={18} color={score === pairs.length ? B.ok : B.gold} /><span style={{ fontWeight: 700, fontSize: 14, color: score === pairs.length ? B.ok : '#92400E' }}>Score: {score}/{pairs.length}</span>
              </div>
              <button onClick={reset} style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 10, fontWeight: 600, fontSize: 14, color: B.navy }}><RotateCcw size={15} /> Try Again</button>
            </>
          ) : (
            <button onClick={check} disabled={Object.keys(matches).length !== defs.length}
              style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: Object.keys(matches).length === defs.length ? B.burgundy : B.border, color: Object.keys(matches).length === defs.length ? '#fff' : B.light, boxShadow: Object.keys(matches).length === defs.length ? '0 2px 8px rgba(107,29,52,0.25)' : 'none', transition: 'all 0.2s' }}>
              <Check size={16} /> Check Answers
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. MULTIPLE CHOICE
// ============================================================================
export function MultipleChoice({ question, options, explanation, onAnswer }) {
  const [sel, setSel] = useState(null);
  const [sub, setSub] = useState(false);
  const ok = sel !== null && options[sel]?.isCorrect;
  return (
    <div style={{ background: B.burgundyBg, borderRadius: 16, borderLeft: `4px solid ${B.burgundy}`, overflow: 'hidden', margin: '24px 0' }}>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: B.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={14} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: B.burgundy, letterSpacing: '0.02em' }}>Check Your Understanding</span>
        </div>
        <p style={{ fontSize: 16, color: B.navy, fontWeight: 600, marginBottom: 16, lineHeight: 1.6, marginLeft: 38 }}>{question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 38 }}>
          {options.map((o, i) => {
            const s = sel === i; const gc = sub && o.isCorrect; const bc = sub && s && !o.isCorrect;
            return (
              <button key={i} onClick={() => !sub && setSel(i)} disabled={sub}
                style={{ ...btnReset, width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 10, border: `2px solid ${gc ? B.ok : bc ? B.err : s ? B.burgundy : B.border}`, background: gc ? B.okBg : bc ? B.errBg : s ? 'rgba(107,29,52,0.06)' : B.card, display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s', boxShadow: s ? '0 2px 8px rgba(107,29,52,0.12)' : '0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${gc ? B.ok : bc ? B.err : s ? B.burgundy : B.border}`, background: gc ? B.ok : bc ? B.err : s ? B.burgundy : 'transparent', color: (gc||bc||s) ? '#fff' : B.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  {gc ? <Check size={13} /> : bc ? <X size={13} /> : <span style={{ fontSize: 12, fontWeight: 700 }}>{String.fromCharCode(65+i)}</span>}
                </div>
                <span style={{ fontWeight: 500, fontSize: 15, color: gc ? B.ok : bc ? B.err : B.text, lineHeight: 1.4 }}>{o.text}</span>
              </button>
            );
          })}
        </div>
        {sub && explanation && (
          <div style={{ marginTop: 16, marginLeft: 38, padding: 16, borderRadius: 12, background: ok ? B.okBg : B.goldBg, border: `1px solid ${ok ? B.ok : B.gold}22`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Info size={18} style={{ color: ok ? B.ok : B.gold, marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: ok ? B.ok : '#92400E', margin: 0 }}>{ok ? 'Correct!' : 'Not quite — here\'s why:'}</p>
              <p style={{ fontSize: 14, color: ok ? B.ok : '#92400E', marginTop: 4, lineHeight: 1.5 }}>{explanation}</p>
            </div>
          </div>
        )}
        <div style={{ marginTop: 16, marginLeft: 38, display: 'flex', justifyContent: 'flex-end' }}>
          {sub ? (
            <button onClick={() => { setSel(null); setSub(false); }} style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 10, fontWeight: 600, fontSize: 14, color: B.navy }}><RotateCcw size={15} /> Try Again</button>
          ) : (
            <button onClick={() => { setSub(true); if (onAnswer) onAnswer(ok); }} disabled={sel === null}
              style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: sel !== null ? B.burgundy : B.border, color: sel !== null ? '#fff' : B.light, boxShadow: sel !== null ? '0 2px 8px rgba(107,29,52,0.25)' : 'none', transition: 'all 0.2s' }}>
              Submit <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MULTI-SELECT
// ============================================================================
export function MultiSelect({ question, options, explanation, onAnswer }) {
  const [sel, setSel] = useState(new Set());
  const [sub, setSub] = useState(false);
  const toggle = (i) => { if (sub) return; setSel(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; }); };
  const cc = options.filter((o,i) => o.isCorrect && sel.has(i)).length;
  const tc = options.filter(o => o.isCorrect).length;
  const ic = options.filter((o,i) => !o.isCorrect && sel.has(i)).length;
  const perfect = cc === tc && ic === 0;

  return (
    <div style={{ background: B.burgundyBg, borderRadius: 16, borderLeft: `4px solid ${B.burgundy}`, overflow: 'hidden', margin: '24px 0' }}>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: B.burgundy, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={14} style={{ color: '#fff' }} />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: B.burgundy, letterSpacing: '0.02em' }}>Check Your Understanding</span>
            <span style={{ fontSize: 12, color: B.muted, marginLeft: 8 }}>(Select all that apply)</span>
          </div>
        </div>
        <p style={{ fontSize: 16, color: B.navy, fontWeight: 600, marginBottom: 16, lineHeight: 1.6, marginLeft: 38 }}>{question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 38 }}>
          {options.map((o, i) => {
            const s = sel.has(i); const gc = sub && o.isCorrect && s; const bc = sub && !o.isCorrect && s; const miss = sub && o.isCorrect && !s;
            return (
              <button key={i} onClick={() => toggle(i)} disabled={sub}
                style={{ ...btnReset, width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 10, border: `2px solid ${gc ? B.ok : bc ? B.err : miss ? B.gold : s ? B.burgundy : B.border}`, background: gc ? B.okBg : bc ? B.errBg : miss ? B.goldBg : s ? 'rgba(107,29,52,0.06)' : B.card, display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s', boxShadow: s ? '0 2px 8px rgba(107,29,52,0.12)' : '0 1px 2px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${gc ? B.ok : bc ? B.err : miss ? B.gold : s ? B.burgundy : B.border}`, background: gc ? B.ok : bc ? B.err : miss ? B.gold : s ? B.burgundy : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  {(s || miss) && <Check size={13} />}
                </div>
                <span style={{ fontWeight: 500, fontSize: 15, color: gc ? B.ok : bc ? B.err : miss ? '#92400E' : B.text, lineHeight: 1.4 }}>{o.text}</span>
              </button>
            );
          })}
        </div>
        {sub && (
          <div style={{ marginTop: 16, marginLeft: 38, padding: 16, borderRadius: 12, background: perfect ? B.okBg : B.goldBg, border: `1px solid ${perfect ? B.ok : B.gold}22`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <Info size={18} style={{ color: perfect ? B.ok : B.gold, marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: perfect ? B.ok : '#92400E', margin: 0 }}>{perfect ? 'Perfect!' : `${cc}/${tc} correct`}</p>
              {explanation && <p style={{ fontSize: 14, color: perfect ? B.ok : '#92400E', marginTop: 4, lineHeight: 1.5 }}>{explanation}</p>}
            </div>
          </div>
        )}
        <div style={{ marginTop: 16, marginLeft: 38, display: 'flex', justifyContent: 'flex-end' }}>
          {sub ? (
            <button onClick={() => { setSel(new Set()); setSub(false); }} style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: B.card, border: `1.5px solid ${B.border}`, borderRadius: 10, fontWeight: 600, fontSize: 14, color: B.navy }}><RotateCcw size={15} /> Try Again</button>
          ) : (
            <button onClick={() => { setSub(true); if (onAnswer) onAnswer(perfect); }} disabled={sel.size === 0}
              style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: sel.size > 0 ? B.burgundy : B.border, color: sel.size > 0 ? '#fff' : B.light, boxShadow: sel.size > 0 ? '0 2px 8px rgba(107,29,52,0.25)' : 'none', transition: 'all 0.2s' }}>
              Submit <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. IMAGE + TEXT CARD
// ============================================================================
export function ImageTextCard({ image, imageAlt, title, content, imagePosition = 'left', highlight = false }) {
  return (
    <div style={{ background: B.card, borderRadius: 16, overflow: 'hidden', border: `${highlight ? 2 : 1}px solid ${highlight ? B.green : B.border}`, boxShadow: highlight ? `0 0 0 3px ${B.greenBg}` : '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', flexDirection: imagePosition === 'right' ? 'row-reverse' : 'row' }}>
        <div style={{ width: '35%', minHeight: 140, background: B.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {image ? <img src={image} alt={imageAlt || title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
            <div style={{ textAlign: 'center', padding: 20 }}><BookOpen size={36} color={B.green + '44'} /><p style={{ fontSize: 11, color: B.light, marginTop: 6 }}>Course Content</p></div>
          )}
        </div>
        <div style={{ flex: 1, padding: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: B.navy, marginBottom: 10 }}>{title}</h3>
          {typeof content === 'string' ? <p style={{ color: B.muted, lineHeight: 1.7, fontSize: 14 }}>{content}</p> : content}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. SECTION DIVIDER
// ============================================================================
export function SectionDivider({ title, subtitle, sectionNumber }) {
  return (
    <div style={{ position: 'relative', padding: '28px 0' }}>
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: B.border }}></div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: B.burgundy, borderRadius: 12, padding: '14px 24px', boxShadow: '0 4px 16px rgba(107,29,52,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {sectionNumber && <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{sectionNumber}</span></div>}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={16} color="rgba(255,255,255,0.6)" /><h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>{title}</h2></div>
              {subtitle && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. TIMED ASSESSMENT
// ============================================================================
export function TimedAssessment({ title = "Final Assessment", questions, timeLimit = 30, passThreshold = 0.8, onComplete }) {
  const [cq, setCq] = useState(0);
  const [ans, setAns] = useState({});
  const [time, setTime] = useState(timeLimit * 60);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (started && !done && time > 0) { ref.current = setInterval(() => setTime(p => { if (p <= 1) { clearInterval(ref.current); finish(); return 0; } return p - 1; }), 1000); }
    return () => clearInterval(ref.current);
  }, [started, done]);

  const fmt = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const getScore = () => questions.reduce((c, q, i) => ans[i] !== undefined && q.options[ans[i]]?.isCorrect ? c + 1 : c, 0);

  const finish = () => {
    setDone(true); clearInterval(ref.current);
    const s = getScore();
    if (onComplete) onComplete({ score: s, total: questions.length, percentage: s / questions.length, passed: s / questions.length >= passThreshold, timeUsed: timeLimit * 60 - time });
  };

  if (!started) return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden' }}>
      <div style={{ background: B.burgundy, padding: '16px 24px' }}><h3 style={{ color: '#fff', fontWeight: 700, fontSize: 19, margin: 0 }}>{title}</h3></div>
      <div style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: B.burgundyBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><Clock size={40} color={B.burgundy} /></div>
        <h4 style={{ fontSize: 22, fontWeight: 700, color: B.navy, marginBottom: 8 }}>Ready to Begin?</h4>
        <p style={{ color: B.muted }}><strong>{questions.length}</strong> questions · <strong>{timeLimit}</strong> min · <strong>{Math.round(passThreshold * 100)}%</strong> to pass</p>
        <button onClick={() => setStarted(true)} style={{ ...btnReset, marginTop: 24, padding: '12px 32px', background: B.burgundy, color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}><Play size={20} /> Start Assessment</button>
      </div>
    </div>
  );

  if (done) {
    const s = getScore(); const pct = s / questions.length; const passed = pct >= passThreshold;
    return (
      <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden' }}>
        <div style={{ background: passed ? B.green : B.err, padding: '16px 24px' }}><h3 style={{ color: '#fff', fontWeight: 700, fontSize: 19, margin: 0 }}>Assessment Complete</h3></div>
        <div style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: passed ? B.okBg : B.errBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            {passed ? <Award size={48} color={B.ok} /> : <AlertCircle size={48} color={B.err} />}
          </div>
          <h4 style={{ fontSize: 28, fontWeight: 800, color: passed ? B.ok : B.err }}>{passed ? 'Congratulations!' : 'Not Quite'}</h4>
          <p style={{ color: B.muted }}>{passed ? 'You passed!' : `You need ${Math.round(passThreshold*100)}% to pass.`}</p>
          <div style={{ background: B.navyBg, borderRadius: 12, padding: 24, margin: '24px 0' }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: B.navy }}>{Math.round(pct * 100)}%</div>
            <p style={{ color: B.muted }}>{s} of {questions.length} correct</p>
          </div>
          {!passed && <button onClick={() => { setDone(false); setStarted(false); setCq(0); setAns({}); setTime(timeLimit*60); }} style={{ ...btnReset, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', background: B.navyBg, borderRadius: 10, fontWeight: 600, color: B.navy }}><RotateCcw size={16} /> Retry</button>}
        </div>
      </div>
    );
  }

  const q = questions[cq]; const warn = time < 300;
  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden' }}>
      <div style={{ background: B.burgundy, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8, background: warn ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.15)', color: warn ? '#FCA5A5' : '#fff' }}><Clock size={16} /><span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{fmt(time)}</span></div>
      </div>
      <div style={{ height: 3, background: B.border }}><div style={{ height: '100%', background: B.green, width: `${(Object.keys(ans).length / questions.length) * 100}%`, transition: 'width 0.3s' }} /></div>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontSize: 13, color: B.muted }}>Question {cq + 1} of {questions.length}</span>
          <span style={{ fontSize: 13, color: B.muted }}>{Object.keys(ans).length} answered</span>
        </div>
        <p style={{ fontSize: 17, color: B.navy, fontWeight: 600, marginBottom: 24 }}>{q.question}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {q.options.map((o, i) => {
            const s = ans[cq] === i;
            return (
              <button key={i} onClick={() => setAns(p => ({...p, [cq]: i}))}
                style={{ ...btnReset, width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: 12, border: `2px solid ${s ? B.green : B.border}`, background: s ? B.greenBg : B.bg, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${s ? B.green : B.border}`, background: s ? B.green : 'transparent', color: s ? '#fff' : B.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s ? <Check size={16} /> : <span style={{ fontSize: 14, fontWeight: 600 }}>{String.fromCharCode(65+i)}</span>}
                </div>
                <span style={{ fontWeight: 500, color: B.text }}>{o.text}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: `1px solid ${B.border}` }}>
          <button onClick={() => setCq(p => Math.max(0, p-1))} disabled={cq===0} style={{ ...btnReset, padding: '8px 16px', color: cq===0 ? B.light : B.navy, fontWeight: 500, background: 'none' }}>Previous</button>
          <div style={{ display: 'flex', gap: 4 }}>
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCq(i)} style={{ ...btnReset, width: 32, height: 32, borderRadius: '50%', fontWeight: 700, fontSize: 12, background: i === cq ? B.burgundy : ans[i] !== undefined ? B.burgundyBg : B.navyBg, color: i === cq ? '#fff' : ans[i] !== undefined ? B.burgundy : B.light }}>{i+1}</button>
            ))}
          </div>
          {cq === questions.length - 1 ? (
            <button onClick={finish} style={{ ...btnReset, padding: '10px 24px', background: B.green, color: '#fff', borderRadius: 10, fontWeight: 700 }}>Finish</button>
          ) : (
            <button onClick={() => setCq(p => Math.min(questions.length-1, p+1))} style={{ ...btnReset, padding: '8px 16px', color: B.navy, fontWeight: 500, background: 'none' }}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. PROGRESS TRACKER
// ============================================================================
export function ProgressTracker({ sections, currentSection, completedSections, totalTimeEstimate = "4 hours" }) {
  const pct = Math.round((completedSections.length / sections.length) * 100);
  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden' }}>
      <div style={{ background: B.green, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>Course Progress</h3>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{totalTimeEstimate}</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 500, color: B.muted }}>Overall Progress</span><span style={{ fontSize: 13, fontWeight: 700, color: B.green }}>{pct}%</span></div>
          <div style={{ height: 10, background: B.navyBg, borderRadius: 6, overflow: 'hidden' }}><div style={{ height: '100%', background: B.green, borderRadius: 6, width: `${pct}%`, transition: 'width 0.5s' }} /></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sections.map((s, i) => {
            const d = completedSections.includes(i); const c = currentSection === i;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: c ? B.greenBg : d ? B.okBg : B.navyBg, border: c ? `1px solid ${B.green}33` : '1px solid transparent' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: d ? B.ok : c ? B.green : B.border, color: (d||c) ? '#fff' : B.muted }}>
                  {d ? <Check size={16} /> : <span style={{ fontSize: 13, fontWeight: 700 }}>{i+1}</span>}
                </div>
                <span style={{ flex: 1, fontWeight: 500, color: c ? B.green : d ? B.ok : B.muted, fontSize: 14 }}>{s.title}</span>
                {c && <span style={{ fontSize: 11, fontWeight: 700, color: B.green, background: B.greenBg, padding: '4px 10px', borderRadius: 20 }}>In Progress</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. CARD SORT
// ============================================================================
export function CardSort({ categories = [], cards = [], instructions = "Sort each card into the correct category", explanation, onComplete }) {
  const [placed, setPlaced] = useState({});
  const [sub, setSub] = useState(false);
  const [res, setRes] = useState(null);
  const [drag, setDrag] = useState(null);
  const unplaced = cards.filter(c => !placed[c.id]);
  const allIn = Object.keys(placed).length === cards.length;
  const catCol = [B.green, B.burgundy, B.gold, B.navy];

  const check = () => {
    let c = 0; cards.forEach(x => { if (placed[x.id] === x.correctCategory) c++; });
    setRes({ correct: c, total: cards.length, score: Math.round((c / cards.length) * 100) });
    setSub(true); if (onComplete) onComplete(c, cards.length);
  };
  const reset = () => { setPlaced({}); setSub(false); setRes(null); };

  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ background: B.green, padding: '16px 24px' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><GripVertical size={20} /> Card Sort Activity</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>{instructions}</p>
      </div>
      <div style={{ padding: 24 }}>
        {unplaced.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontWeight: 700, color: B.navy, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Cards to Sort</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {unplaced.map(c => (
                <div key={c.id} draggable={!sub} onDragStart={() => setDrag(c)}
                  style={{ padding: '10px 16px', background: B.navyBg, border: `2px solid ${B.border}`, borderRadius: 10, cursor: 'grab', fontWeight: 500, fontSize: 13, color: B.navy }}>{c.text}</div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(categories.length, 3)}, 1fr)`, gap: 16 }}>
          {categories.map((cat, i) => {
            const here = cards.filter(c => placed[c.id] === cat);
            return (
              <div key={cat} onDragOver={(e) => { if (!sub) e.preventDefault(); }} onDrop={() => { if (drag && !sub) { setPlaced(p => ({...p, [drag.id]: cat})); setDrag(null); } }}
                style={{ minHeight: 120, borderRadius: 12, border: `2px dashed ${sub ? B.border : B.green + '66'}`, padding: 16, background: B.bg }}>
                <h4 style={{ fontWeight: 700, fontSize: 13, color: B.navy, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: catCol[i % catCol.length] }}></span>{cat}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: B.light }}>{here.length}</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {here.map(c => {
                    const ok = sub && c.correctCategory === cat; const bad = sub && c.correctCategory !== cat;
                    return (
                      <div key={c.id} style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: ok ? B.okBg : bad ? B.errBg : B.card, color: ok ? B.ok : bad ? B.err : B.text, border: `1px solid ${ok ? B.ok + '33' : bad ? B.err + '33' : B.border}` }}>
                        <span>{c.text}</span>
                        {!sub && <button onClick={() => setPlaced(p => { const n = {...p}; delete n[c.id]; return n; })} style={{ ...btnReset, background: 'none', color: B.light, padding: 0 }}><X size={14} /></button>}
                        {ok && <CheckCircle2 size={14} color={B.ok} />}
                        {bad && <X size={14} color={B.err} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${B.border}`, display: 'flex', justifyContent: sub ? 'space-between' : 'flex-end', alignItems: 'center' }}>
          {sub && res ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 10, background: res.score >= 80 ? B.okBg : B.goldBg }}><Award size={20} color={res.score >= 80 ? B.ok : B.gold} /><span style={{ fontWeight: 700 }}>{res.correct}/{res.total} ({res.score}%)</span></div>
              <button onClick={reset} style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: B.navyBg, borderRadius: 10, fontWeight: 600, color: B.navy }}><RotateCcw size={16} /> Try Again</button>
            </>
          ) : (
            <button onClick={check} disabled={!allIn} style={{ ...btnReset, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, fontWeight: 700, background: allIn ? B.green : B.border, color: allIn ? '#fff' : B.light }}><Check size={16} /> Check Answers</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. SEQUENCING
// ============================================================================
export function Sequencing({ steps = [], instructions = "Arrange the steps in the correct order", explanation, onComplete }) {
  const shuf = (a) => { const r = [...a]; for (let i = r.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; };
  const [items, setItems] = useState(() => shuf(steps));
  const [sub, setSub] = useState(false);
  const [res, setRes] = useState(null);
  const [di, setDi] = useState(null);
  const [oi, setOi] = useState(null);

  const drop = (t) => { if (di===null||di===t) return; const n=[...items]; const [m]=n.splice(di,1); n.splice(t,0,m); setItems(n); setDi(null); setOi(null); };
  const mv = (f,t) => { if(t<0||t>=items.length)return; const n=[...items]; const[m]=n.splice(f,1); n.splice(t,0,m); setItems(n); };
  const check = () => { let c=0; const d=items.map((x,i)=>{ const ok=x.order===i+1; if(ok)c++; return{...x,isCorrect:ok}; }); setRes({correct:c,total:items.length,score:Math.round(c/items.length*100),details:d}); setSub(true); if(onComplete)onComplete(c,items.length); };
  const reset = () => { setItems(shuf(steps)); setSub(false); setRes(null); };

  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ background: B.navy, padding: '16px 24px' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>📋 Sequencing Activity</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{instructions}</p>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((x, i) => {
          const over = oi === i; const d = sub && res ? res.details[i] : null;
          return (
            <div key={x.id} draggable={!sub} onDragStart={() => setDi(i)} onDragOver={(e)=>{if(!sub){e.preventDefault();setOi(i);}}} onDragLeave={()=>setOi(null)} onDrop={()=>{if(!sub)drop(i);}} onDragEnd={()=>{setDi(null);setOi(null);}}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, userSelect: 'none', border: `2px solid ${sub?(d?.isCorrect?B.ok+'66':B.err+'66'):over?B.gold:B.border}`, background: sub?(d?.isCorrect?B.okBg:B.errBg):over?B.goldBg:B.bg, cursor: sub?'default':'grab' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sub?(d?.isCorrect?B.ok:B.err):B.navy, color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{sub?(d?.isCorrect?'✓':x.order):i+1}</div>
              {!sub && <GripVertical size={14} color={B.light} style={{flexShrink:0}} />}
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: B.text }}>{x.text}</span>
              {!sub && <div style={{display:'flex',flexDirection:'column',gap:2}}>
                <button onClick={()=>mv(i,i-1)} style={{...btnReset,background:'none',opacity:i===0?0.3:1,padding:2,lineHeight:1,fontSize:12}}>▲</button>
                <button onClick={()=>mv(i,i+1)} style={{...btnReset,background:'none',opacity:i===items.length-1?0.3:1,padding:2,lineHeight:1,fontSize:12}}>▼</button>
              </div>}
              {sub && !d?.isCorrect && <span style={{fontSize:12,color:B.err,fontWeight:600}}>Correct: #{x.order}</span>}
            </div>
          );
        })}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${B.border}`, display: 'flex', justifyContent: 'space-between' }}>
          {sub ? (
            <>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 16px',borderRadius:10,background:res.score>=80?B.okBg:B.goldBg}}><Award size={20} color={res.score>=80?B.ok:B.gold} /><span style={{fontWeight:700}}>{res.correct}/{res.total} ({res.score}%)</span></div>
              <button onClick={reset} style={{...btnReset,display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:B.navyBg,borderRadius:10,fontWeight:600,color:B.navy}}><RotateCcw size={16} /> Try Again</button>
            </>
          ) : (
            <>
              <button onClick={reset} style={{...btnReset,padding:'8px 16px',background:B.navyBg,borderRadius:10,color:B.muted,fontSize:13}}>↺ Shuffle</button>
              <button onClick={check} style={{...btnReset,display:'flex',alignItems:'center',gap:8,padding:'10px 24px',borderRadius:10,fontWeight:700,background:B.green,color:'#fff'}}><Check size={16} /> Check Order</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. HOTSPOT
// ============================================================================
export function Hotspot({ hotspots = [], hotspotImage, imageDescription, instructions = "Click each point to explore", onComplete }) {
  const [rev, setRev] = useState({});
  const [active, setActive] = useState(null);
  const allDone = Object.keys(rev).length === hotspots.length;
  useEffect(() => { if (allDone && onComplete) onComplete(hotspots.length); }, [allDone]);
  const tog = (id) => { setRev(p => ({...p, [id]: true})); setActive(active === id ? null : id); };
  const info = hotspots.find(h => h.id === active);
  const cols = [B.burgundy, B.green, B.gold, B.navy, '#6366F1', '#8B5CF6'];

  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ background: B.burgundy, padding: '16px 24px' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>🎯 Hotspot Activity</h3>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>{instructions}</p>
        <span style={{ display: 'inline-block', marginTop: 8, background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{Object.keys(rev).length}/{hotspots.length} discovered</span>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', minHeight: 300, background: B.navyBg }}>
          {hotspotImage?.url ? <img src={hotspotImage.url} alt={hotspotImage.alt || imageDescription || 'Diagram'} style={{ width: '100%', display: 'block' }} /> :
           imageDescription ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, padding: 32 }}><p style={{ color: B.light, fontSize: 13, fontStyle: 'italic', textAlign: 'center' }}>{imageDescription}</p></div> :
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}><BookOpen size={64} color={B.border} /></div>}
          {hotspots.map((s, i) => {
            const a = active === s.id; const r = rev[s.id]; const c = s.color || cols[i % cols.length];
            return (
              <button key={s.id} onClick={() => tog(s.id)} style={{ ...btnReset, position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', width: a?44:32, height: a?44:32, borderRadius: '50%', background: a?c:r?c+'CC':c+'44', border: `3px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: a?`0 0 0 6px ${c}33, 0 4px 12px rgba(0,0,0,0.15)`:'0 2px 6px rgba(0,0,0,0.1)', zIndex: a?10:1, transition: 'all 0.2s' }}
                aria-label={`Explore: ${s.label}`}><span style={{ color: a||r?'#fff':c, fontWeight: 800, fontSize: a?16:12 }}>{r?'✓':'?'}</span></button>
            );
          })}
          <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {hotspots.map((s, i) => {
              const c = s.color || cols[i % cols.length];
              return <button key={s.id} onClick={() => tog(s.id)} style={{ ...btnReset, fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 6, background: active===s.id?c:'#ffffffDD', color: active===s.id?'#fff':c, border: `1px solid ${c}66`, opacity: rev[s.id]?1:0.7 }}>{rev[s.id]?'✓ ':''}{s.label}</button>;
            })}
          </div>
        </div>
        {info && <div style={{ marginTop: 16, borderRadius: 12, padding: 16, background: B.navyBg, border: `1px solid ${B.border}` }}><h4 style={{ fontWeight: 700, color: B.navy, marginBottom: 4 }}>{info.label}</h4><p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6, margin: 0 }}>{info.info}</p></div>}
        {allDone && <div style={{ marginTop: 16, background: B.okBg, border: `1px solid ${B.ok}33`, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={20} color={B.ok} /><span style={{ color: B.ok, fontSize: 14, fontWeight: 600 }}>All regions explored! Activity complete.</span></div>}
      </div>
    </div>
  );
}

// ============================================================================
// 12. TIMELINE
// ============================================================================
export function Timeline({ events = [], instructions = "Arrange events in chronological order", onComplete }) {
  const shuf = (a) => { const r = [...a]; for (let i = r.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; };
  const [items, setItems] = useState(() => shuf(events));
  const [sub, setSub] = useState(false);
  const [res, setRes] = useState(null);
  const [di, setDi] = useState(null);
  const [oi, setOi] = useState(null);

  const drop = (t) => { if(di===null||di===t)return; const n=[...items]; const[m]=n.splice(di,1); n.splice(t,0,m); setItems(n); setDi(null); setOi(null); };
  const check = () => { let c=0; const d=items.map((x,i)=>{ const ok=x.order===i+1; if(ok)c++; return{...x,isCorrect:ok}; }); setRes({correct:c,total:items.length,score:Math.round(c/items.length*100),details:d}); setSub(true); if(onComplete)onComplete(c,items.length); };
  const reset = () => { setItems(shuf(events)); setSub(false); setRes(null); };

  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ background: B.green, padding: '16px 24px' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>📅 Timeline Activity</h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>{instructions}</p>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ position: 'relative', paddingLeft: 48 }}>
          <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: 2, background: B.border }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((x, i) => {
              const over = oi === i; const d = sub && res ? res.details[i] : null;
              return (
                <div key={x.id} draggable={!sub} onDragStart={()=>setDi(i)} onDragOver={(e)=>{if(!sub){e.preventDefault();setOi(i);}}} onDragLeave={()=>setOi(null)} onDrop={()=>{if(!sub)drop(i);}} onDragEnd={()=>{setDi(null);setOi(null);}}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: `2px solid ${sub?(d?.isCorrect?B.ok+'66':B.err+'66'):over?B.gold:B.border}`, background: sub?(d?.isCorrect?B.okBg:B.errBg):over?B.goldBg:B.card, cursor: sub?'default':'grab' }}>
                  <div style={{ position: 'absolute', left: -34, width: 14, height: 14, borderRadius: '50%', background: sub?(d?.isCorrect?B.ok:B.err):B.green, border: '2px solid #fff', boxShadow: `0 0 0 2px ${B.border}` }}></div>
                  <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, minWidth: 50, color: sub?(d?.isCorrect?B.ok:B.err):B.burgundy }}>{x.year}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: B.text }}>{x.text}</span>
                  {sub && d?.isCorrect && <CheckCircle2 size={14} color={B.ok} />}
                  {sub && !d?.isCorrect && <span style={{ fontSize: 12, color: B.err, fontWeight: 600 }}>#{x.order}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${B.border}`, display: 'flex', justifyContent: 'space-between' }}>
          {sub ? (
            <>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 16px',borderRadius:10,background:res.score>=80?B.okBg:B.goldBg}}><Award size={20} color={res.score>=80?B.ok:B.gold} /><span style={{fontWeight:700}}>{res.correct}/{res.total} correct</span></div>
              <button onClick={reset} style={{...btnReset,display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:B.navyBg,borderRadius:10,fontWeight:600,color:B.navy}}><RotateCcw size={16} /> Try Again</button>
            </>
          ) : (
            <>
              <button onClick={reset} style={{...btnReset,padding:'8px 16px',background:B.navyBg,borderRadius:10,color:B.muted,fontSize:13}}>↺ Shuffle</button>
              <button onClick={check} style={{...btnReset,display:'flex',alignItems:'center',gap:8,padding:'10px 24px',borderRadius:10,fontWeight:700,background:B.green,color:'#fff'}}><Check size={16} /> Check Order</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 13. SCENARIO TREE
// ============================================================================
export function ScenarioTree({ scenarioTitle, startNode, nodes = {}, onComplete }) {
  const [cur, setCur] = useState(startNode);
  const [hist, setHist] = useState([]);
  const node = nodes[cur];
  if (!node) return <div style={{ padding: 16, color: B.err }}>Missing node: {cur}</div>;

  const choose = (next) => { setHist(p => [...p, cur]); setCur(next); if (nodes[next]?.isEnd && onComplete) onComplete(true); };
  const back = () => { if (!hist.length) return; setCur(hist[hist.length-1]); setHist(h => h.slice(0,-1)); };
  const restart = () => { setCur(startNode); setHist([]); };

  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ background: B.burgundy, padding: '16px 24px' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>🔀 {scenarioTitle || 'Clinical Scenario'}</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>Step {hist.length + 1}</p>
      </div>
      <div style={{ padding: 24 }}>
        {node.feedback?.message && (
          <div style={{ marginBottom: 16, padding: 16, borderRadius: 12, background: node.feedback.type==='positive'?B.okBg:node.feedback.type==='caution'?B.goldBg:B.navyBg, border: `1px solid ${node.feedback.type==='positive'?B.ok+'33':node.feedback.type==='caution'?B.gold+'33':B.border}`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            {node.feedback.type==='positive' ? <CheckCircle2 size={20} color={B.ok} style={{marginTop:2,flexShrink:0}} /> : node.feedback.type==='caution' ? <AlertCircle size={20} color={B.gold} style={{marginTop:2,flexShrink:0}} /> : <Info size={20} color={B.muted} style={{marginTop:2,flexShrink:0}} />}
            <p style={{ fontSize: 14, color: B.text, margin: 0, lineHeight: 1.6 }}>{node.feedback.message}</p>
          </div>
        )}
        <p style={{ color: B.navy, lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>{node.text}</p>
        {node.isEnd ? (
          <div style={{ padding: 24, borderRadius: 12, textAlign: 'center', background: node.feedback?.type==='positive'?B.okBg:B.goldBg }}>
            <Award size={40} color={node.feedback?.type==='positive'?B.ok:B.gold} style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: 700, color: B.navy, marginBottom: 4 }}>Scenario Complete</p>
            <p style={{ fontSize: 13, color: B.muted }}>You've completed this clinical scenario.</p>
            <button onClick={restart} style={{ ...btnReset, marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: B.card, border: `1px solid ${B.border}`, borderRadius: 10, fontWeight: 600, color: B.navy }}><RotateCcw size={16} /> Try a Different Path</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: B.light, textTransform: 'uppercase', letterSpacing: 1 }}>Choose your response:</p>
            {(node.choices || []).map((ch, i) => (
              <button key={i} onClick={() => choose(ch.next)}
                style={{ ...btnReset, width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: 12, border: `2px solid ${B.border}`, background: B.bg, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: B.greenBg, color: B.green, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: 14 }}>{String.fromCharCode(65+i)}</div>
                <span style={{ flex: 1, fontWeight: 500, color: B.text }}>{ch.text}</span>
                <ArrowRight size={16} color={B.light} />
              </button>
            ))}
          </div>
        )}
        {hist.length > 0 && !node.isEnd && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${B.border}` }}>
            <button onClick={back} style={{ ...btnReset, fontSize: 13, color: B.muted, background: 'none' }}>← Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 14. FLASHCARD DECK
// ============================================================================
export function FlashcardDeck({ flashcards = [], instructions, onComplete }) {
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [seen, setSeen] = useState(new Set());
  const allDone = seen.size === flashcards.length;
  const card = flashcards[idx];
  useEffect(() => { if (allDone && onComplete) onComplete(flashcards.length); }, [allDone]);
  const doFlip = () => { setFlip(!flip); if (!flip) setSeen(p => new Set([...p, idx])); };
  if (!card) return null;

  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ background: B.gold, padding: '16px 24px' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 }}>🃏 Flashcard Deck</h3>
        {instructions && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>{instructions}</p>}
        <span style={{ display: 'inline-block', marginTop: 8, background: 'rgba(255,255,255,0.25)', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>{seen.size}/{flashcards.length} reviewed</span>
      </div>
      <div style={{ padding: 24 }}>
        <div onClick={doFlip} style={{ minHeight: 220, borderRadius: 12, border: `2px solid ${B.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, position: 'relative', background: flip ? B.okBg : B.bg, transition: 'background 0.3s' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, color: flip ? B.ok : B.light }}>{flip ? 'Answer' : 'Term'} · Card {idx + 1} of {flashcards.length}</p>
            <p style={{ fontSize: 18, fontWeight: 600, color: flip ? B.ok : B.navy, lineHeight: 1.5 }}>{flip ? card.back : card.front}</p>
            <p style={{ fontSize: 12, color: B.light, marginTop: 16 }}>Click to {flip ? 'see term' : 'reveal answer'}</p>
          </div>
          {seen.has(idx) && <div style={{ position: 'absolute', top: 12, right: 12 }}><CheckCircle2 size={20} color={B.ok + '88'} /></div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <button onClick={() => { setFlip(false); setIdx(p => (p-1+flashcards.length)%flashcards.length); }} style={{ ...btnReset, padding: '8px 16px', color: B.navy, fontWeight: 500, background: 'none' }}>← Previous</button>
          <div style={{ display: 'flex', gap: 4 }}>
            {flashcards.map((_, i) => <button key={i} onClick={() => { setFlip(false); setIdx(i); }} style={{ ...btnReset, width: 10, height: 10, borderRadius: '50%', padding: 0, background: i === idx ? B.burgundy : seen.has(i) ? B.ok + '66' : B.border }} />)}
          </div>
          <button onClick={() => { setFlip(false); setIdx(p => (p+1)%flashcards.length); }} style={{ ...btnReset, padding: '8px 16px', color: B.navy, fontWeight: 500, background: 'none' }}>Next →</button>
        </div>
        {allDone && <div style={{ marginTop: 16, background: B.okBg, border: `1px solid ${B.ok}33`, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={20} color={B.ok} /><span style={{ color: B.ok, fontSize: 14, fontWeight: 600 }}>All cards reviewed! Activity complete.</span></div>}
      </div>
    </div>
  );
}

// ============================================================================
// 15. VIDEO EMBED
// ============================================================================
export function VideoEmbed({ videoUrl, videoTitle, videoDuration, markers = [], onComplete }) {
  const [watched, setWatched] = useState(new Set());
  const [active, setActive] = useState(null);
  const allDone = watched.size === markers.length;
  useEffect(() => { if (allDone && markers.length > 0 && onComplete) onComplete(markers.length); }, [allDone]);
  const click = (m) => { setWatched(p => new Set([...p, m.id])); setActive(active === m.id ? null : m.id); };
  const aData = markers.find(m => m.id === active);

  return (
    <div style={{ background: B.card, borderRadius: 16, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ background: B.navy, padding: '16px 24px' }}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Play size={20} /> {videoTitle || 'Video Content'}</h3>
        {videoDuration && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>Duration: {videoDuration}</p>}
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ background: '#0F172A', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          {videoUrl ? (
            <div style={{ aspectRatio: '16/9' }}><iframe src={videoUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen title={videoTitle || 'Video'} /></div>
          ) : (
            <div style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Play size={28} color="rgba(255,255,255,0.6)" /></div>
            </div>
          )}
          {markers.length > 0 && (
            <div style={{ padding: '8px 16px', background: '#1E293B' }}>
              <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                {markers.map((m, i) => {
                  const pct = markers.length > 1 ? (i / (markers.length - 1)) * 100 : 50;
                  return <button key={m.id} onClick={() => click(m)} style={{ ...btnReset, position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%,-50%)', width: active===m.id?14:10, height: active===m.id?14:10, borderRadius: '50%', border: active===m.id?'2px solid #fff':'none', padding: 0, background: watched.has(m.id)?B.gold:'rgba(255,255,255,0.4)' }} title={`${m.time} — ${m.label}`} />;
                })}
              </div>
            </div>
          )}
        </div>
        {markers.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: B.light, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Key Moments</p>
            {markers.map(m => (
              <button key={m.id} onClick={() => click(m)} style={{ ...btnReset, width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', marginBottom: 4, borderRadius: 8, textAlign: 'left', background: active===m.id?B.goldBg:'transparent' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: B.burgundy, minWidth: 42 }}>{m.time}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: B.text }}>{m.label}</span>
                {watched.has(m.id) && <CheckCircle2 size={14} color={B.ok} />}
                {m.prompt && !watched.has(m.id) && <span style={{ fontSize: 11, color: B.gold, fontWeight: 600 }}>💬</span>}
              </button>
            ))}
          </div>
        )}
        {aData?.prompt && (
          <div style={{ padding: 16, borderRadius: 12, background: B.goldBg, border: `1px solid ${B.gold}33`, marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>💬 Discussion Prompt — {aData.time}</p>
            <p style={{ fontSize: 14, color: B.text, lineHeight: 1.6, margin: 0 }}>{aData.prompt}</p>
          </div>
        )}
        {allDone && markers.length > 0 && <div style={{ background: B.okBg, border: `1px solid ${B.ok}33`, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={20} color={B.ok} /><span style={{ color: B.ok, fontSize: 14, fontWeight: 600 }}>All key moments reviewed!</span></div>}
      </div>
    </div>
  );
}

// ============================================================================
// 16. STANDALONE IMAGE
// ============================================================================
export function ImageBlock({ imageUrl, imageAltText, imageCaption, imageSize = 'large', imageAlignment = 'center', imageBorder = 'none', imageShape = 'default', onComplete }) {
  useEffect(() => { if (onComplete) onComplete(); }, []);
  const w = { small: '40%', medium: '60%', large: '85%', full: '100%' }[imageSize] || '85%';
  const border = imageBorder === 'subtle' ? '1px solid #E8E4DF' : imageBorder === 'solid' ? '2px solid #9CA3AF' : 'none';
  const shadow = imageBorder === 'rounded' ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.08)';
  const radius = imageShape === 'circle' ? '50%' : imageShape === 'pill' ? 999 : imageShape === 'rounded' ? 20 : 12;
  return (
    <figure style={{ margin: '24px 0', textAlign: imageAlignment }}>
      {imageUrl ? (
        <img src={imageUrl} alt={imageAltText || imageCaption || 'Course image'} style={{ width: w, maxWidth: '100%', borderRadius: radius, boxShadow: shadow, border, display: 'inline-block' }} loading="lazy" />
      ) : (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: B.navyBg, borderRadius: 12, padding: 48, width: w }}><BookOpen size={48} color={B.border} /></div>
      )}
      {imageCaption && <figcaption style={{ marginTop: 8, fontSize: 13, color: B.muted, fontStyle: 'italic', maxWidth: w, display: 'inline-block' }}>{imageCaption}</figcaption>}
    </figure>
  );
}

// ============================================================================
// KNOWLEDGE CHECK MODAL — compact trigger + popup overlay
// ============================================================================
export function KnowledgeCheckModal({ type, completed, children }) {
  const [open, setOpen] = useState(false);

  const labels = {
    matching: 'Matching Exercise',
    multipleChoice: 'Knowledge Check',
    multiSelect: 'Multi-Select Check',
    cardSort: 'Card Sort Activity',
    sequencing: 'Sequencing Activity',
    hotspot: 'Hotspot Activity',
    timeline: 'Timeline Activity',
    scenarioTree: 'Clinical Scenario',
    flashcardDeck: 'Flashcard Deck',
  };
  const label = labels[type] || 'Interactive Activity';

  return (
    <>
      {/* Compact inline trigger */}
      <button
        onClick={() => setOpen(true)}
        style={{
          ...btnReset,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 20px',
          margin: '20px 0',
          borderRadius: 12,
          border: `2px solid ${completed ? B.ok : B.burgundy}44`,
          background: completed ? B.okBg : B.burgundyBg,
          transition: 'all 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: completed ? B.ok : B.burgundy,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          {completed
            ? <CheckCircle2 size={16} style={{ color: '#fff' }} />
            : <AlertCircle size={16} style={{ color: '#fff' }} />
          }
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: completed ? B.ok : B.burgundy }}>
            {completed ? `${label} — Completed` : label}
          </span>
          <span style={{ display: 'block', fontSize: 12, color: B.muted, marginTop: 2 }}>
            {completed ? 'Click to review' : 'Click to open'}
          </span>
        </div>
        <ArrowRight size={18} style={{ color: completed ? B.ok : B.burgundy, flexShrink: 0 }} />
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            background: B.bg, borderRadius: 16,
            width: '100%', maxWidth: 640, maxHeight: '85vh',
            overflowY: 'auto', position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                ...btnReset,
                position: 'sticky', top: 12, float: 'right', marginRight: 12, marginTop: 12,
                width: 32, height: 32, borderRadius: '50%',
                background: B.card, border: `1px solid ${B.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <X size={16} style={{ color: B.muted }} />
            </button>

            {/* Render the actual knowledge check component */}
            <div style={{ padding: 4 }}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
