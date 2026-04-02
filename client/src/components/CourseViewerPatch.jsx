/**
 * CourseViewerPatch.jsx
 * Drop-in patch for CourseViewer.jsx
 * See INTEGRATION GUIDE at bottom.
 */

import { useState, useEffect, useRef, useMemo } from 'react';

const T = {
  burgundy:'#6B1D34',burgundyLt:'#F9F0F3',burgundyMd:'#EDD5DC',
  forest:'#4A7C59',forestLt:'#EDF4EF',navy:'#1C2B4A',
  honey:'#8B5E2E',honeyLt:'#FDF3E7',cream:'#FAF5EC',creamDk:'#F0EAE0',
  pewter:'#DDD9D3',amber:'#92600A',amberLt:'#FEF3C7',amberBd:'#F59E0B',
  red:'#991B1B',redLt:'#FEF2F2',redBd:'#DC2626',blue:'#1E3A5F',
  blueLt:'#EFF6FF',blueBd:'#3B82F6',purple:'#4C1D95',purpleLt:'#F5F3FF',purpleBd:'#7C3AED',
};

// ── 1. SHARED CALLOUT LIBRARY ──────────────────────────────────
export const SHARED_CALLOUT_LIBRARY = {
  'hipaa':{ label:'HIPAA', type:'definition', body:'Health Insurance Portability and Accountability Act (1996). Protects patient health information from disclosure without consent.' },
  'aca-code':{ label:'ACA Code of Ethics', type:'reference', body:'American Counseling Association Code of Ethics. Primary ethical framework for licensed counselors. Violations may result in licensure action.' },
  'duty-to-warn':{ label:'Duty to Warn', type:'ethics', body:'Tarasoff obligation — clinicians must protect identifiable third parties from credible, serious client threats.' },
  'informed-consent':{ label:'Informed Consent', type:'definition', body:'Client must understand treatment, fees, limits of confidentiality, and risks before services begin. Must be documented.' },
  'telehealth-rule':{ label:'GA Rule 135', type:'reference', body:'Georgia Composite Board Rule 135-11-.01. Governs telemental health delivery, disclosures, and clinical appropriateness screening.' },
  'mandatory-report':{ label:'Mandatory Reporting', type:'warning', body:'Georgia law requires reporting known/suspected abuse of a child, elder, or person with a disability. Failure to report is a misdemeanor.' },
  'lpc-a-note':{ label:'LPC-A Note', type:'clinical', body:'Pre-licensed associates must obtain supervisor approval before this intervention. Document the supervisory consultation.' },
  'nbcc-standard':{ label:'NBCC Standard', type:'reference', body:'National Board for Certified Counselors standard. Applies to NCC credential holders and NBCC-approved CE providers.' },
  'phi':{ label:'PHI', type:'definition', body:'Protected Health Information — any health data that can identify a patient, including names, dates, geographic data, and contact information.' },
  'gcscw':{ label:'GCSCW', type:'reference', body:'Georgia Composite Board of Social Work — licensing authority for social workers in Georgia, with separate CE requirements.' },
};

// ── PILL + ALERT STYLE MAPS ────────────────────────────────────
const PILL_STYLES = {
  definition:{ bg:T.forestLt, border:T.forest,   text:T.forest,  icon:'📖' },
  clinical:  { bg:T.blueLt,   border:T.blueBd,   text:T.blue,    icon:'🩺' },
  ethics:    { bg:T.amberLt,  border:T.amberBd,  text:T.amber,   icon:'⚖️' },
  example:   { bg:T.honeyLt,  border:T.honey,    text:T.honey,   icon:'💬' },
  reference: { bg:T.creamDk,  border:T.pewter,   text:T.navy,    icon:'📎' },
  warning:   { bg:T.redLt,    border:T.redBd,    text:T.red,     icon:'⚠️' },
};

const ALERT_CONFIG = {
  ethics:    { icon:'⚖️',  label:'Ethics Alert',        bg:T.amberLt,  border:T.amberBd,  text:T.amber,   pulse:true  },
  mandatory: { icon:'🚨',  label:'Mandatory Report',     bg:T.redLt,    border:T.redBd,    text:T.red,     pulse:true  },
  donot:     { icon:'⛔',  label:'Do Not',               bg:T.redLt,    border:T.redBd,    text:T.red,     pulse:true  },
  document:  { icon:'📋',  label:'Must Document',        bg:T.blueLt,   border:T.blueBd,   text:T.blue,    pulse:false },
  supervisor:{ icon:'👁️',  label:'Supervisor Required',  bg:T.purpleLt, border:T.purpleBd, text:T.purple,  pulse:false },
  legal:     { icon:'⚖️',  label:'Legal Exposure',       bg:T.redLt,    border:'#7F1D1D',  text:'#7F1D1D', pulse:true  },
  protocol:  { icon:'🔴',  label:'Protocol Required',    bg:'#FFF7ED',  border:'#EA580C',  text:'#C2410C', pulse:true  },
};

// ── 2. AUTHORING SYNTAX PARSER ─────────────────────────────────
// Converts {{callout:id}} and {{alert:type}} in HTML strings
export function parseAuthoringSyntax(html, blockCallouts={}, courseCalloutLibrary={}) {
  if (!html || typeof html !== 'string') return html;
  const lib = { ...SHARED_CALLOUT_LIBRARY, ...courseCalloutLibrary, ...blockCallouts };

  let out = html.replace(/\{\{callout:([^}]+)\}\}/g, (_, id) => {
    const key = id.trim();
    const def = lib[key];
    if (!def) return `<span style="display:inline-flex;align-items:center;gap:2px;padding:1px 6px;border-radius:20px;background:#f0f0f0;border:1px solid #ccc;color:#666;font-size:0.78rem;font-weight:600;cursor:pointer;vertical-align:middle;" title="Unknown term: ${key}">⬡ ${key}</span>`;
    const ps = PILL_STYLES[def.type] || PILL_STYLES.definition;
    return `<span data-callout="${key}" title="${def.body}" role="button" tabindex="0" style="display:inline-flex;align-items:center;gap:3px;padding:1px 7px;border-radius:20px;background:${ps.bg};border:1px solid ${ps.border};color:${ps.text};font-size:0.78rem;font-weight:600;cursor:pointer;vertical-align:middle;line-height:1.6;">${ps.icon} ${def.label} <span style="font-size:0.65rem;opacity:0.6;">▼</span></span>`;
  });

  out = out.replace(/\{\{alert:([^}]+)\}\}/g, (_, type) => {
    const key = type.trim();
    const cfg = ALERT_CONFIG[key] || ALERT_CONFIG.ethics;
    return `<span data-alert="${key}" role="button" tabindex="0" style="display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:20px;background:${cfg.bg};border:1.5px solid ${cfg.border};color:${cfg.text};font-size:0.78rem;font-weight:700;cursor:pointer;vertical-align:middle;line-height:1.7;" title="Click for details">${cfg.icon} ${cfg.label}</span>`;
  });

  return out;
}

// ── 3. INLINE CALLOUT PILL (React component) ───────────────────
export function InlineCalloutPill({ label, type='definition', body, onAcknowledge }) {
  const [open, setOpen] = useState(false);
  const [acked, setAcked] = useState(false);
  const ref = useRef(null);
  const s = PILL_STYLES[type] || PILL_STYLES.definition;

  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <span ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} style={{
        display:'inline-flex', alignItems:'center', gap:3, padding:'1px 7px', borderRadius:20,
        background: acked ? T.forestLt : s.bg, border:`1px solid ${acked ? T.forest : s.border}`,
        color: acked ? T.forest : s.text, fontSize:'0.78rem', fontWeight:600,
        cursor:'pointer', verticalAlign:'middle', lineHeight:1.6, transition:'all 0.15s',
      }}>
        <span style={{ fontSize:'0.7rem' }}>{acked ? '✓' : s.icon}</span>
        {label}
        <span style={{ fontSize:'0.65rem', opacity:0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <span style={{
          position:'absolute', bottom:'130%', left:'50%', transform:'translateX(-50%)',
          width:280, zIndex:100, background:'#fff', border:`1.5px solid ${s.border}`,
          borderRadius:10, padding:'12px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', display:'block',
        }}>
          <span style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, paddingBottom:8, borderBottom:`1px solid ${T.pewter}` }}>
            <span>{s.icon}</span>
            <span style={{ fontWeight:700, fontSize:'0.85rem', color:s.text }}>{label}</span>
            <span style={{ marginLeft:'auto', fontSize:'0.65rem', fontWeight:600, padding:'1px 6px', borderRadius:10, background:s.bg, color:s.text, border:`1px solid ${s.border}`, textTransform:'uppercase', letterSpacing:'0.04em' }}>{type}</span>
          </span>
          <span style={{ display:'block', fontSize:'0.82rem', lineHeight:1.6, color:'#444' }}>{body}</span>
          {(type === 'warning' || type === 'ethics') && !acked && (
            <button onClick={() => { setAcked(true); onAcknowledge?.(label); setOpen(false); }} style={{
              marginTop:8, width:'100%', padding:'5px 10px', borderRadius:6,
              background:s.bg, border:`1px solid ${s.border}`, color:s.text, fontSize:'0.75rem', fontWeight:700, cursor:'pointer',
            }}>✓ I've read this</button>
          )}
          <button onClick={() => setOpen(false)} style={{ position:'absolute', top:8, right:10, background:'none', border:'none', color:'#aaa', fontSize:'1rem', cursor:'pointer' }}>×</button>
        </span>
      )}
    </span>
  );
}

// ── 4. HIGH-STAKES ALERT PILL ──────────────────────────────────
export function HighStakesAlertPill({ alertType='ethics', body, onAcknowledge }) {
  const [open, setOpen] = useState(false);
  const [acked, setAcked] = useState(false);
  const [pulsing, setPulsing] = useState(true);
  const ref = useRef(null);
  const cfg = ALERT_CONFIG[alertType] || ALERT_CONFIG.ethics;

  useEffect(() => {
    const t = setTimeout(() => setPulsing(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <span ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <style>{`@keyframes crPulse{0%,100%{box-shadow:0 0 0 0 ${cfg.border}55}50%{box-shadow:0 0 0 5px transparent}}`}</style>
      <button onClick={() => setOpen(o => !o)} style={{
        display:'inline-flex', alignItems:'center', gap:4, padding:'2px 9px', borderRadius:20,
        background: acked ? T.forestLt : cfg.bg, border:`1.5px solid ${acked ? T.forest : cfg.border}`,
        color: acked ? T.forest : cfg.text, fontSize:'0.78rem', fontWeight:700,
        cursor:'pointer', verticalAlign:'middle', lineHeight:1.7,
        animation: pulsing && !acked ? 'crPulse 1.2s ease-in-out infinite' : 'none', transition:'all 0.2s',
      }}>
        <span>{acked ? '✓' : cfg.icon}</span>
        {cfg.label}
      </button>

      {open && (
        <span style={{
          position:'absolute', bottom:'130%', left:'50%', transform:'translateX(-50%)',
          width:300, zIndex:200, background:'#fff', border:`2px solid ${cfg.border}`,
          borderRadius:10, padding:'14px 16px', boxShadow:'0 12px 32px rgba(0,0,0,0.15)', display:'block',
        }}>
          <span style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${cfg.border}40` }}>
            <span style={{ fontSize:'1.2rem' }}>{cfg.icon}</span>
            <span style={{ fontWeight:800, fontSize:'0.9rem', color:cfg.text }}>{cfg.label}</span>
          </span>
          <span style={{ display:'block', fontSize:'0.83rem', lineHeight:1.65, color:'#333', marginBottom:12 }}>{body}</span>
          {!acked ? (
            <button onClick={() => { setAcked(true); setOpen(false); onAcknowledge?.(alertType, body); }} style={{
              width:'100%', padding:'7px 12px', borderRadius:7,
              background:cfg.bg, border:`1.5px solid ${cfg.border}`,
              color:cfg.text, fontSize:'0.8rem', fontWeight:800, cursor:'pointer',
            }}>✓ Acknowledged — I understand</button>
          ) : (
            <span style={{ display:'block', textAlign:'center', fontSize:'0.78rem', color:T.forest, fontWeight:700 }}>✓ Acknowledged</span>
          )}
          <button onClick={() => setOpen(false)} style={{ position:'absolute', top:8, right:10, background:'none', border:'none', color:'#aaa', fontSize:'1.1rem', cursor:'pointer' }}>×</button>
        </span>
      )}
    </span>
  );
}

// ── 5. KNOWLEDGE CHECK PILL ────────────────────────────────────
export function KnowledgeCheckPill({ section, sectionIndex, onComplete, progress }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(progress?.completedKC?.[sectionIndex] || false);
  const [score, setScore] = useState(null);
  const questions = section?.quizQuestions || [];
  if (!questions.length) return null;

  const handleComplete = result => {
    setDone(true); setScore(result.score); setOpen(false);
    onComplete?.(sectionIndex, result);
  };

  return (
    <div style={{ marginTop:24 }}>
      <style>{`@keyframes crFadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <button onClick={() => !done && setOpen(o => !o)} aria-expanded={open} style={{
        display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:20,
        background: done ? T.forestLt : open ? T.burgundyMd : T.cream,
        border:`1.5px solid ${done ? T.forest : T.burgundy}`,
        color: done ? T.forest : T.burgundy, fontSize:'0.85rem', fontWeight:700,
        cursor: done ? 'default' : 'pointer', transition:'all 0.2s',
      }}>
        <span>{done ? '✓' : '🎯'}</span>
        {done ? `Knowledge Check Complete${score !== null ? ` · ${Math.round(score*100)}%` : ''}` : `${open?'Hide':'Start'} Knowledge Check · ${questions.length} Question${questions.length!==1?'s':''}`}
        {!done && <span style={{ fontSize:'0.7rem', opacity:0.6 }}>{open?'▲':'▼'}</span>}
      </button>

      {open && !done && (
        <div style={{ marginTop:12, borderRadius:12, border:`1.5px solid ${T.burgundyMd}`, background:T.burgundyLt, padding:20, animation:'crFadeIn 0.2s ease' }}>
          <KCQuizInline questions={questions} onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
}

function KCQuizInline({ questions, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const q = questions[current];

  const handleSubmit = () => {
    if (current < questions.length - 1) { setCurrent(c => c+1); return; }
    let correct = 0;
    questions.forEach((q,i) => { if (answers[i] === q.options?.findIndex(o => o.isCorrect)) correct++; });
    const res = { score:correct/questions.length, correct, total:questions.length };
    setResults(res); onComplete(res);
  };

  if (results) return (
    <div style={{ textAlign:'center', padding:'8px 0' }}>
      <div style={{ fontSize:'2rem', marginBottom:8 }}>{results.score>=0.7?'🎉':'📚'}</div>
      <div style={{ fontWeight:700, fontSize:'1rem', color:results.score>=0.7?T.forest:T.honey }}>
        {results.correct}/{results.total} Correct · {Math.round(results.score*100)}%
      </div>
      <div style={{ fontSize:'0.8rem', color:'#666', marginTop:4 }}>
        {results.score>=0.7 ? 'Well done! Continue to the next section.' : 'Review the material and try again if needed.'}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', gap:5, marginBottom:14 }}>
        {questions.map((_,i) => <span key={i} style={{ width:8, height:8, borderRadius:'50%', background:i<current?T.forest:i===current?T.burgundy:T.pewter, display:'inline-block', transition:'background 0.2s' }} />)}
      </div>
      <p style={{ fontWeight:600, fontSize:'0.9rem', color:T.navy, marginBottom:12, lineHeight:1.5 }}>{q?.question}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {(q?.options||[]).map((opt,i) => (
          <button key={i} onClick={() => setAnswers(a => ({...a,[current]:i}))} style={{
            padding:'8px 12px', borderRadius:8, textAlign:'left',
            background:answers[current]===i?T.burgundyMd:'#fff',
            border:`1.5px solid ${answers[current]===i?T.burgundy:T.pewter}`,
            color:T.navy, fontSize:'0.83rem', cursor:'pointer', transition:'all 0.15s',
          }}>
            <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:20, height:20, borderRadius:'50%', marginRight:8, background:answers[current]===i?T.burgundy:T.creamDk, color:answers[current]===i?'#fff':T.navy, fontSize:'0.7rem', fontWeight:700, flexShrink:0 }}>
              {String.fromCharCode(65+i)}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={answers[current]===undefined} style={{
        marginTop:14, padding:'7px 20px', borderRadius:8, border:'none',
        background:answers[current]!==undefined?T.burgundy:T.pewter,
        color:'#fff', fontSize:'0.83rem', fontWeight:700, cursor:answers[current]!==undefined?'pointer':'default',
      }}>
        {current<questions.length-1?'Next →':'Submit'}
      </button>
    </div>
  );
}

// ── 6. SLIM SECTION DIVIDER ────────────────────────────────────
export function SlimSectionDivider({ sectionNumber, title, subtitle }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', margin:'4px 0 16px', borderBottom:`2px solid ${T.burgundy}` }}>
      {sectionNumber && <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:'50%', background:T.burgundy, color:'#fff', fontSize:'0.75rem', fontWeight:800, flexShrink:0 }}>{sectionNumber}</span>}
      <div style={{ flex:1, minWidth:0 }}>
        <h2 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:T.navy, fontFamily:"'Cormorant Garamond',Georgia,serif", lineHeight:1.3 }}>{title}</h2>
        {subtitle && <p style={{ margin:'2px 0 0', fontSize:'0.78rem', color:'#666', lineHeight:1.4 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ── 7. SLIM CALLOUT BLOCK ──────────────────────────────────────
const CALLOUT_CFG = {
  info:    { icon:'ℹ️',  border:T.blueBd,   bg:T.blueLt,   text:T.blue   },
  warning: { icon:'⚠️',  border:T.amberBd,  bg:T.amberLt,  text:T.amber  },
  ethics:  { icon:'⚖️',  border:T.amberBd,  bg:T.amberLt,  text:T.amber  },
  clinical:{ icon:'🩺',  border:T.blueBd,   bg:T.blueLt,   text:T.blue   },
  tip:     { icon:'💡',  border:T.forest,   bg:T.forestLt, text:T.forest },
  key:     { icon:'🔑',  border:T.honey,    bg:T.honeyLt,  text:T.honey  },
  donot:   { icon:'⛔',  border:T.redBd,    bg:T.redLt,    text:T.red    },
  protocol:{ icon:'📋',  border:'#EA580C',  bg:'#FFF7ED',  text:'#C2410C'},
};

export function SlimCalloutBlock({ type='info', title, items=[], content }) {
  const cfg = CALLOUT_CFG[type] || CALLOUT_CFG.info;
  return (
    <div style={{ borderLeft:`3px solid ${cfg.border}`, background:cfg.bg, borderRadius:'0 8px 8px 0', padding:'10px 14px', margin:'12px 0' }}>
      {title && (
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:(items.length||content)?6:0 }}>
          <span style={{ fontSize:'0.85rem' }}>{cfg.icon}</span>
          <span style={{ fontSize:'0.82rem', fontWeight:700, color:cfg.text }}>{title}</span>
        </div>
      )}
      {content && <p style={{ margin:0, fontSize:'0.82rem', color:'#444', lineHeight:1.6 }} dangerouslySetInnerHTML={{ __html:content }} />}
      {items.length>0 && (
        <ul style={{ margin:'4px 0 0', paddingLeft:16 }}>
          {items.map((item,i) => <li key={i} style={{ fontSize:'0.82rem', color:'#444', lineHeight:1.6, marginBottom:2 }}>{item}</li>)}
        </ul>
      )}
    </div>
  );
}

// ── 8. SLIM ACCORDION ─────────────────────────────────────────
export function SlimAccordion({ items=[] }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div style={{ border:`1px solid ${T.pewter}`, borderRadius:10, overflow:'hidden', margin:'8px 0' }}>
      {items.map((item,i) => (
        <div key={i} style={{ borderBottom:i<items.length-1?`1px solid ${T.pewter}`:'none' }}>
          <button onClick={() => setOpenIdx(openIdx===i?null:i)} aria-expanded={openIdx===i} style={{
            width:'100%', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'10px 14px', background:openIdx===i?T.burgundyLt:'#fff', border:'none', cursor:'pointer', gap:8, transition:'background 0.15s',
          }}>
            <span style={{ fontSize:'0.85rem', fontWeight:600, color:T.navy, lineHeight:1.4 }}>{item.title}</span>
            <span style={{ fontSize:'0.7rem', color:T.burgundy, flexShrink:0, display:'inline-block', transform:openIdx===i?'rotate(180deg)':'rotate(0deg)', transition:'transform 0.2s' }}>▼</span>
          </button>
          {openIdx===i && (
            <div style={{ padding:'10px 14px', background:T.burgundyLt, borderTop:`1px solid ${T.burgundyMd}`, fontSize:'0.83rem', color:'#444', lineHeight:1.65, animation:'crFadeIn 0.15s ease' }}
              dangerouslySetInnerHTML={{ __html:item.content }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── 9. READING PROGRESS BAR ────────────────────────────────────
export function ReadingProgressBar({ scrollContainerRef }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;
    const fn = () => { const t=el.scrollHeight-el.clientHeight; setPct(t>0?Math.min(100,(el.scrollTop/t)*100):0); };
    el.addEventListener('scroll', fn, { passive:true });
    return () => el.removeEventListener('scroll', fn);
  }, [scrollContainerRef]);
  return (
    <div style={{ position:'sticky', top:0, height:3, background:T.pewter, zIndex:20 }}>
      <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${T.burgundy},${T.forest})`, transition:'width 0.1s linear' }} />
    </div>
  );
}

// ── 10. READ TIME LABEL ────────────────────────────────────────
export function ReadTimeLabel({ htmlContent, wordsPerMinute=200 }) {
  const minutes = useMemo(() => {
    if (!htmlContent) return 1;
    const words = htmlContent.replace(/<[^>]*>/g,' ').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words/wordsPerMinute));
  }, [htmlContent, wordsPerMinute]);
  return <span style={{ fontSize:'0.72rem', color:'#999', fontWeight:500, display:'inline-flex', alignItems:'center', gap:3 }}>⏱ ~{minutes} min read</span>;
}

// ── 11. BOOKMARK BUTTON ────────────────────────────────────────
export function BookmarkButton({ blockId, label, courseSlug }) {
  const key = `cr-bookmarks-${courseSlug}`;
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)||'[]').some(b=>b.id===blockId); }
    catch { return false; }
  });
  const toggle = () => {
    try {
      const bm = JSON.parse(localStorage.getItem(key)||'[]');
      const updated = saved ? bm.filter(b=>b.id!==blockId) : [...bm,{id:blockId,label,savedAt:Date.now()}];
      localStorage.setItem(key, JSON.stringify(updated)); setSaved(!saved);
    } catch {}
  };
  return (
    <button onClick={toggle} title={saved?'Remove bookmark':'Bookmark this'} aria-label={saved?'Remove bookmark':'Bookmark'} style={{ background:'none', border:'none', color:saved?T.honey:'#ccc', fontSize:'0.85rem', cursor:'pointer', padding:'2px 4px', lineHeight:1, transition:'color 0.15s' }}>
      {saved?'🔖':'☆'}
    </button>
  );
}

// ── 12. SECTION SUMMARY PILL ───────────────────────────────────
export function SectionSummaryPill({ objectives=[], estimatedTime }) {
  const [open, setOpen] = useState(false);
  if (!objectives.length) return null;
  return (
    <div style={{ marginBottom:16 }}>
      <button onClick={() => setOpen(o=>!o)} aria-expanded={open} style={{
        display:'inline-flex', alignItems:'center', gap:5, padding:'3px 11px', borderRadius:20,
        background:open?T.navy:T.cream, border:`1px solid ${T.navy}`, color:open?'#fff':T.navy,
        fontSize:'0.78rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s',
      }}>
        📄 What You'll Learn
        {estimatedTime && <span style={{ opacity:0.65, marginLeft:2 }}>· ~{estimatedTime} min</span>}
        <span style={{ fontSize:'0.65rem', opacity:0.65 }}>{open?'▲':'▼'}</span>
      </button>
      {open && (
        <div style={{ marginTop:8, padding:'10px 14px', background:T.cream, border:`1px solid ${T.pewter}`, borderRadius:8, animation:'crFadeIn 0.15s ease' }}>
          <ul style={{ margin:0, paddingLeft:16 }}>
            {objectives.map((obj,i) => <li key={i} style={{ fontSize:'0.82rem', color:T.navy, lineHeight:1.6, marginBottom:2 }}>{obj}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── 13. BLOCK AUDIO TOGGLE ─────────────────────────────────────
export function BlockAudioToggle({ htmlContent, ttsRate=0.9, a11yEnabled=false }) {
  const [speaking, setSpeaking] = useState(false);
  if (!a11yEnabled || !('speechSynthesis' in window)) return null;
  const speak = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const text = (htmlContent||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate=ttsRate; u.onend=()=>setSpeaking(false); u.onerror=()=>setSpeaking(false);
    window.speechSynthesis.speak(u); setSpeaking(true);
  };
  return (
    <button onClick={speak} aria-label={speaking?'Stop reading':'Read aloud'} style={{
      display:'inline-flex', alignItems:'center', gap:4, background:'none',
      border:`1px solid ${T.pewter}`, borderRadius:6, padding:'2px 8px',
      color:speaking?T.burgundy:'#aaa', fontSize:'0.72rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s',
    }}>{speaking?'⏹ Stop':'🔊 Read'}</button>
  );
}

// ── 14. CE CREDIT TRACKER PILL ─────────────────────────────────
export function CECreditTrackerPill({ earnedHours=0, totalHours=3, ceProvider }) {
  const pct = Math.min(100,(earnedHours/totalHours)*100);
  const done = earnedHours>=totalHours;
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px', borderRadius:20, background:done?T.forestLt:T.cream, border:`1.5px solid ${done?T.forest:T.pewter}`, fontSize:'0.78rem', fontWeight:600, color:done?T.forest:T.navy }}>
      <span>{done?'✅':'⏱'}</span>
      <span>{earnedHours.toFixed(1)} / {totalHours} CE hrs</span>
      <span style={{ display:'inline-block', width:48, height:4, background:T.pewter, borderRadius:4, overflow:'hidden' }}>
        <span style={{ display:'block', height:'100%', width:`${pct}%`, background:done?T.forest:T.burgundy, transition:'width 0.3s', borderRadius:4 }} />
      </span>
      {ceProvider && <span style={{ fontSize:'0.65rem', opacity:0.6, fontWeight:500 }}>{ceProvider}</span>}
    </div>
  );
}

// ── 15. BLOCK LINTER ──────────────────────────────────────────
export function blockLinter(course) {
  const issues = [];
  if (!course?.sections?.length) { issues.push({ severity:'error', section:'root', block:null, message:'Course has no sections.' }); return issues; }
  if (!course.ceHours)    issues.push({ severity:'warning', section:'root', block:null, message:'Missing ceHours.' });
  if (!course.slug)       issues.push({ severity:'error',   section:'root', block:null, message:'Missing slug (required for routing).' });
  if (!course.acepNumber && !course.ceProvider) issues.push({ severity:'warning', section:'root', block:null, message:'Missing ACEP number / CE provider.' });

  course.sections.forEach((sec,si) => {
    const sL = `S${si+1}: "${sec.title||'Untitled'}"`;
    if (!sec.title) issues.push({ severity:'warning', section:sL, block:null, message:'No section title.' });
    let words=0;
    (sec.contentBlocks||[]).forEach((b,bi) => {
      const bL = `Block ${bi+1} (${b.type})`;
      if ((b.type==='image'||b.type==='imageText') && !b.imageAlt && !b.alt) issues.push({ severity:'warning', section:sL, block:bL, message:'Image missing alt text.' });
      if (b.type==='multipleChoice'||b.type==='multiSelect') {
        if (!(b.options||[]).some(o=>o.isCorrect)) issues.push({ severity:'error', section:sL, block:bL, message:'No correct answer marked.' });
        if (!b.explanation) issues.push({ severity:'warning', section:sL, block:bL, message:'Missing explanation for correct answer.' });
      }
      if (b.type==='matching' && (b.matchingPairs||[]).length<2) issues.push({ severity:'warning', section:sL, block:bL, message:'Fewer than 2 matching pairs.' });
      if ((b.type==='video'||b.type==='videoEmbed') && !b.url && !b.videoUrl) issues.push({ severity:'error', section:sL, block:bL, message:'Video missing URL.' });
      if (b.type==='flashcardDeck' && !(b.flashcards?.length)) issues.push({ severity:'error', section:sL, block:bL, message:'Flashcard deck has no cards.' });
      if (b.type==='text') words += (b.content||b.textContent||'').replace(/<[^>]*>/g,' ').trim().split(/\s+/).filter(Boolean).length;
    });
    const cePS = course.ceHours ? course.ceHours/course.sections.length : null;
    if (cePS && words<cePS*1000) issues.push({ severity:'info', section:sL, block:null, message:`~${words} words. Target ~${Math.ceil(cePS*2500)} for ${cePS.toFixed(1)} CE hrs.` });
    if (!sec.quizQuestions?.length && !sec.hasQuiz) issues.push({ severity:'info', section:sL, block:null, message:'No knowledge check questions.' });
  });
  return issues;
}

/*
═══════════════════════════════════════════════════════════════
INTEGRATION GUIDE
═══════════════════════════════════════════════════════════════

STEP 1 — Import into CourseViewer.jsx
────────────────────────────────────────
import {
  parseAuthoringSyntax,
  InlineCalloutPill, HighStakesAlertPill, KnowledgeCheckPill,
  SlimSectionDivider, SlimCalloutBlock, SlimAccordion,
  ReadingProgressBar, ReadTimeLabel, BookmarkButton,
  SectionSummaryPill, BlockAudioToggle, CECreditTrackerPill,
  blockLinter, SHARED_CALLOUT_LIBRARY,
} from './CourseViewerPatch';


STEP 2 — Replace sectionDivider renderer
──────────────────────────────────────────
case 'sectionDivider':
  return <SlimSectionDivider
    sectionNumber={block.sectionNumber}
    title={block.title}
    subtitle={block.subtitle} />;


STEP 3 — Replace callout renderer
────────────────────────────────────
case 'callout':
  return <SlimCalloutBlock
    type={block.calloutType || block.variant || 'info'}
    title={block.title}
    items={block.items || []}
    content={block.content} />;


STEP 4 — Replace accordion renderer
──────────────────────────────────────
case 'accordion':
  return <SlimAccordion
    items={block.accordionItems || block.items || []} />;


STEP 5 — Upgrade text block renderer
──────────────────────────────────────
case 'text': {
  const parsed = parseAuthoringSyntax(
    block.content || block.textContent || '',
    block.callouts || {}
  );
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
        <ReadTimeLabel htmlContent={parsed} />
        <BookmarkButton
          blockId={`${courseSlug}-${sectionIdx}-${blockIdx}`}
          label={section.title}
          courseSlug={courseSlug} />
        <BlockAudioToggle
          htmlContent={parsed}
          a11yEnabled={a11y?.narration}
          ttsRate={a11y?.ttsRate} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: safeHTML(parsed) }} />
    </div>
  );
}


STEP 6 — Add KC pill at end of SectionView (replaces KC block)
────────────────────────────────────────────────────────────────
<KnowledgeCheckPill
  section={section}
  sectionIndex={sectionIndex}
  onComplete={handleKCComplete}
  progress={progress} />


STEP 7 — Add section summary pill at top of SectionView
──────────────────────────────────────────────────────────
<SectionSummaryPill
  objectives={section.objectives || []}
  estimatedTime={section.estimatedTime} />


STEP 8 — Add reading progress bar in SectionView
──────────────────────────────────────────────────
const scrollRef = useRef(null);
...
<ReadingProgressBar scrollContainerRef={scrollRef} />
<div ref={scrollRef} style={{ overflowY:'auto', flex:1 }}>
  {... content ...}
</div>


STEP 9 — Add CE tracker pill in course header
───────────────────────────────────────────────
<CECreditTrackerPill
  earnedHours={progress?.earnedHours || 0}
  totalHours={course.ceHours}
  ceProvider={`NBCC ACEP #${course.acepNumber}`} />


STEP 10 — HighStakesAlertPill in JSX
──────────────────────────────────────
<HighStakesAlertPill
  alertType="ethics"
  body="Disclosing client identity without written consent
        violates ACA Code A.2.a and may result in licensure action."
  onAcknowledge={(type, body) => logAcknowledgment(type, body)} />


STEP 11 — Run blockLinter before publishing
─────────────────────────────────────────────
const issues = blockLinter(courseJSON);
const errors = issues.filter(i => i.severity === 'error');
if (errors.length) { [block publish button] }
console.table(issues);


COURSE JSON AUTHORING SHORTHAND
─────────────────────────────────
In any text block "content" field:

"content": "<p>Before disclosing, confirm {{callout:informed-consent}}
 is signed. Third-party disclosure without consent triggers
 {{alert:ethics}} and the {{callout:duty-to-warn}} obligation.</p>"

Built-in callout IDs:
 hipaa · aca-code · duty-to-warn · informed-consent
 telehealth-rule · mandatory-report · lpc-a-note
 nbcc-standard · phi · gcscw

Alert types:
 ethics · mandatory · donot · document
 supervisor · legal · protocol

Per-block custom callouts via block.callouts:
 { "my-term": { label:"My Term", type:"clinical", body:"Definition..." } }
*/
