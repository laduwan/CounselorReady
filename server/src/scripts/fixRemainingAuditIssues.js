/**
 * fixRemainingAuditIssues.js
 *
 * Fixes the 11 courses still flagged after the first audit pass:
 *
 * CONTENT PATCHES:
 *   CR-415  elephant-in-the-room-difficult-conversations  conclusion:0w
 *   CR-104  suicide-risk-assessment-interactive           conclusion:44w
 *   CR-102  crisis-intervention-and-suicide-prevention-… intro:2w
 *   CR-TMH601  mastering-telemental-health (short slug)  intro:17w
 *   CR-422  inside-out-neurobiology-of-trauma             intro:76w
 *   (none)  cultural-humility-in-counseling-practice-copy  desc:35w
 *   CR-SXH-105  trauma-informed-practice-sexual-trauma   desc:43w
 *   CR-SXH-108  couples-counseling-sexual-dysfunction    desc:47w
 *
 * BULLET FIXES (expand to accordion blocks):
 *   neurobiology-of-trauma   — accordion items still bullet-heavy
 *   trauma-informed-care     — accordion items still bullet-heavy
 *   active-listening-skills  — li tags in accordion or ol blocks
 *
 * Usage:
 *   node src/scripts/fixRemainingAuditIssues.js          # dry-run
 *   node src/scripts/fixRemainingAuditIssues.js --apply  # write
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

function stripHtml(h) { return (h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function wordCount(s) { return s.trim().split(/\s+/).filter(Boolean).length; }
function countLi(h) { return ((h||'').match(/<li\b/gi)||[]).length; }
function countP(h)  { return ((h||'').match(/<p\b/gi)||[]).length; }

// ── Bullet → prose converter ─────────────────────────────────────────────────

function getLiItems(ulHtml) {
  const items = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(ulHtml)) !== null) {
    const text = m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if (text) items.push(text.replace(/\.$/, ''));
  }
  return items;
}

function joinItems(items) {
  if (!items.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0,-1).join(', ') + `, and ${items[items.length-1]}`;
}

function convertBulletsToP(html) {
  if (!html) return html;
  let r = html;

  // Convert <ul> lists (informational, not sequential)
  r = r.replace(
    /<p>\s*(<strong>[^<]+:?\s*<\/strong>)\s*<\/p>\s*<ul>([\s\S]*?)<\/ul>/gi,
    (_, label, ul) => { const i = getLiItems(ul); return i.length ? `<p>${label} ${joinItems(i)}.</p>` : _; }
  );
  r = r.replace(
    /<p>([^<]{12,}?:)\s*<\/p>\s*<ul>([\s\S]*?)<\/ul>/gi,
    (_, intro, ul) => { const i = getLiItems(ul); return i.length ? `<p>${intro.replace(/:$/,'')+': '+joinItems(i)}.</p>` : _; }
  );
  r = r.replace(
    /<ul>([\s\S]*?)<\/ul>/gi,
    (_, ul) => { const i = getLiItems(ul); return i.length ? i.map(x=>`<p>${x}.</p>`).join('\n') : ''; }
  );
  return r;
}

// ── Content patches ──────────────────────────────────────────────────────────

const CONTENT_PATCHES = [
  {
    slug: 'elephant-in-the-room-difficult-conversations',
    conclusion: `<h2>Taking This Into Every Session</h2>
<p>The skill you leave this course with is not a technique — it is a stance. The willingness to stay curious when a client becomes defensive, to name what you observe without condemning what you see, to hold a rupture long enough for it to become a repair rather than collapsing it prematurely into reassurance. These are the moments that define clinical work at its most meaningful.</p>
<p>Your own discomfort is your most reliable signal. When you notice the impulse to change the subject, soften the observation, or wait until next session — that is precisely when the conversation needs to happen. The clients who challenge you most are often the ones most in need of a clinician who will not flinch. That steadiness, practiced deliberately, becomes one of the most powerful therapeutic tools you carry.</p>
<p>Name one avoided conversation from your current caseload. Not the most difficult one — just one. Bring it to supervision this week. The practice of saying it out loud is the first step toward saying it in the room where it needs to be said.</p>`,
  },

  {
    slug: 'suicide-risk-assessment-interactive',
    conclusion: `<h2>What You Now Carry Into Every Clinical Encounter</h2>
<p>Effective suicide risk assessment is not a skill you use only in obvious crises — it is an orientation that sharpens over a career. Every client in every session is assessed implicitly: for the quality of their connection to life, for the presence of psychological pain that exceeds their available coping, for the signals that suggest something more needs to be asked directly. The tools and frameworks in this course make that implicit process explicit, more accurate, and more defensible.</p>
<p>The Columbia Suicide Severity Rating Scale, the collaborative assessment model, the distinction between ideation and intent and access and plan — these are the vocabulary of competent suicide risk practice. They allow you to communicate clearly with other providers, document your reasoning in a way that reflects actual clinical judgment, and make decisions that can withstand ethical and legal scrutiny because they are grounded in evidence rather than intuition alone.</p>
<p>Most importantly: asking directly saves lives. The research on this point is unambiguous. A client who has been asked clearly about suicidal ideation by a clinician who did not flinch, who gathered the information without panicking, and who responded with both clinical precision and genuine human care — that client is more likely to return, more likely to disclose, and more likely to reach out in crisis. Your willingness to ask the question is itself therapeutic. Carry it forward.</p>`,
  },

  {
    slug: 'crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide',
    intro: `<h2>When the Moment Arrives</h2>
<p>Crisis presentations do not announce themselves in advance. They arrive in the middle of a scheduled session, at the end of a phone call, in the waiting room, in the voicemail a client left at 11pm. The clinician who has prepared for this moment — who has a practiced framework, clear language, and a regulated nervous system — responds with precision. The clinician who hasn't, improvises under pressure, and improvisation in a crisis is the highest-risk condition a clinical encounter can create.</p>
<p>This course is preparation. It is a comprehensive clinical foundation for the full arc of crisis work — from the theoretical models that explain how crises develop and resolve, through the specific assessment and intervention skills that determine outcomes, to the professional self-care practices that allow clinicians to sustain this work over time without being destroyed by it. The goal is not to make crisis work feel comfortable — it should never feel comfortable — but to make it feel competent. Competence is what protects your clients. Competence is what allows you to be present with them in the moments that matter most.</p>`,
  },

  {
    slug: 'mastering-telemental-health',
    intro: `<h2>The Practice Has Changed. The Standard Hasn't.</h2>
<p>Telehealth transformed from an accommodation to an expectation in the span of a single year — and the regulatory, ethical, and clinical frameworks for virtual practice have been catching up ever since. Mental health professionals who moved their practices online discovered that the technical logistics were more manageable than anticipated, but that the clinical and compliance dimensions were more complex: informed consent in a virtual environment, managing crisis at a distance, maintaining therapeutic presence through a screen, navigating Georgia-specific regulations, and ensuring the technology itself didn't become a liability.</p>
<p>This course provides the comprehensive foundation that telehealth practice requires — not just the regulatory framework, but the clinical skills and professional judgment that make virtual care genuinely effective and fully compliant with Georgia Rule 135-11. Whether you are new to telehealth or have been practicing virtually for years, the material here will deepen your competence and strengthen your compliance.</p>`,
  },

  {
    slug: 'inside-out-neurobiology-of-trauma',
    intro: `<h2>Understanding the Brain That Walked Into Your Office</h2>
<p>Every client who has experienced trauma brings a nervous system that has been reorganized by that experience. The hippocampus that was supposed to contextualize threatening experiences — to file them as past and not present — is functioning differently. The prefrontal cortex that regulates emotional responses goes offline under stress in ways it shouldn't. The amygdala that scans for threat has been calibrated to a level of danger that once made sense and now interferes with safety in every domain of the client's life.</p>
<p>When clinicians understand these mechanisms — not as metaphors but as actual neurobiological processes — they stop fighting the symptom and start working with the biology. They understand why a client who wants to heal still cannot control their startle response, why traditional talk therapy alone is insufficient for many trauma presentations, and which evidence-based approaches align with the brain's actual healing mechanisms. That understanding transforms clinical practice at a foundational level, and this course provides it in clinical depth.</p>`,
  },

  {
    slug: 'cultural-humility-in-counseling-practice-copy',
    description: `Cultural humility — the ongoing practice of self-reflection, openness, and learning in cross-cultural clinical relationships — is increasingly recognized as a more accurate and effective framework than cultural competence for the complexity of real clinical work. This 1.5-hour continuing education course examines the foundations of cultural humility: what distinguishes it from competence, how it develops through reflective practice rather than knowledge acquisition alone, the research connecting cultural humility to therapeutic alliance and treatment outcomes, and the specific skills of culturally humble engagement — asking rather than assuming, acknowledging limitations, addressing power differentials, and remaining genuinely curious about each client's unique cultural experience. Applicable across treatment settings and client populations.`,
  },

  {
    slug: 'trauma-informed-practice-sexual-trauma',
    description: `Sexual trauma is one of the most prevalent trauma histories in any clinical caseload, and its treatment requires both trauma-informed principles and specific clinical adaptations for the unique dimensions of sexual violation — shame, boundary disruption, body-based distress, and the relational betrayal that often accompanies it. This 2-hour continuing education course provides a comprehensive clinical foundation in trauma-informed practice with survivors of sexual trauma: understanding the spectrum of sexual violence and its psychological impact, conducting trauma-informed assessments that do not retraumatize, evidence-based treatment adaptations for sexual trauma including CPT and PE modifications, working with shame as a primary maintaining factor, and addressing the specific therapeutic relationship dynamics that arise in sexual trauma treatment. Includes attention to diverse survivor populations including men, LGBTQ+ survivors, and survivors from communities where disclosure carries particular cultural risk.`,
  },

  {
    slug: 'couples-counseling-sexual-dysfunction',
    description: `Sexual dysfunction rarely lives in one person — it lives in the space between two people, shaped by the attachment patterns, communication styles, cultural scripts, and relational dynamics that define the couple's relationship. This 2-hour continuing education course prepares mental health professionals to assess and treat sexual dysfunction through a relational and systemic lens: the major models of sexual response and dysfunction, conducting individual and dyadic sexual health assessments, understanding how partners co-create and maintain sexual problems, evidence-based couples interventions for the most common sexual dysfunctions, and the clinical decision-making process for referral to specialized sex therapy or medical care. Integrates Gottman-informed relational research, attachment theory, and contemporary sex therapy frameworks in a clinically practical synthesis.`,
  },
];

// ── Bullet-fix targets ────────────────────────────────────────────────────────

const BULLET_TARGETS = [
  'neurobiology-of-trauma',
  'trauma-informed-care',
  'active-listening-skills',
];

// ── Engine ────────────────────────────────────────────────────────────────────

function isWeakText(html) {
  return wordCount(stripHtml(html || '')) < 80;
}

async function applyContentPatch(col, patch) {
  const course = await col.findOne({ slug: patch.slug });
  if (!course) { console.log(`  NOT FOUND: ${patch.slug}`); return; }

  const sections = course.sections || [];
  const firstSec = sections[0];
  const lastSec  = sections[sections.length - 1];
  const setPayload = {};
  const actions = [];

  if (patch.description && wordCount(stripHtml(course.description||'')) < 60) {
    setPayload.description = patch.description;
    actions.push(`desc → ${wordCount(stripHtml(patch.description))}w`);
  }

  if (patch.intro && firstSec) {
    const blocks = firstSec.contentBlocks || [];
    const firstText = blocks.find(b => b.type === 'text');
    if (!firstText || isWeakText(firstText.content)) {
      let patchedBlocks;
      if (!firstText) {
        patchedBlocks = [...blocks, { type:'text', order: 99, content: patch.intro }];
      } else {
        patchedBlocks = blocks.map(b => b===firstText ? {...b, content:patch.intro} : b);
      }
      patchedBlocks.sort((a,b)=>(a.order||0)-(b.order||0)).forEach((b,i)=>{b.order=i+1;});
      const patchedSections = sections.map((s,i)=>i===0?{...s,contentBlocks:patchedBlocks}:s);
      setPayload.sections = patchedSections;
      actions.push(`intro → ${wordCount(stripHtml(patch.intro))}w`);
    }
  }

  if (patch.conclusion && lastSec && lastSec !== firstSec) {
    const blocks = lastSec.contentBlocks || [];
    const textBlocks = blocks.filter(b=>b.type==='text');
    const lastText = textBlocks[textBlocks.length-1];
    const needsConclusion = !lastText || isWeakText(lastText.content);
    if (needsConclusion) {
      let patchedBlocks;
      if (!lastText) {
        const maxOrder = blocks.reduce((m,b)=>Math.max(m,b.order||0),0);
        patchedBlocks = [...blocks, {type:'text',order:maxOrder+1,content:patch.conclusion}];
      } else {
        patchedBlocks = blocks.map(b=>b===lastText?{...b,content:patch.conclusion}:b);
      }
      patchedBlocks.forEach((b,i)=>{b.order=i+1;});
      const lastIdx = sections.length-1;
      const patchedSections = (setPayload.sections||sections).map((s,i)=>
        i===lastIdx ? {...s,contentBlocks:patchedBlocks} : s
      );
      setPayload.sections = patchedSections;
      actions.push(`conclusion → ${wordCount(stripHtml(patch.conclusion))}w`);
    }
  }

  if (!actions.length) { console.log(`  SKIP (already OK): ${course.title.slice(0,50)}`); return; }

  console.log(`  PATCH: ${(course.courseCode||'?').padEnd(12)} ${course.title.slice(0,45)} | ${actions.join(' | ')}`);
  if (!DRY) {
    setPayload.updatedAt = new Date();
    const r = await col.updateOne({_id:course._id},{$set:setPayload});
    if (r.modifiedCount===1) console.log('  ✅ Written');
    else console.error('  ❌ Write failed');
  }
}

async function applyBulletFix(col, slug) {
  const course = await col.findOne({ slug });
  if (!course) { console.log(`  NOT FOUND: ${slug}`); return; }

  const sections = course.sections || [];
  let liBefore=0, liAfter=0, pBefore=0, pAfter=0, changed=0;

  const patchedSections = sections.map(sec => {
    const patchedBlocks = (sec.contentBlocks||[]).map(block => {
      // text/imageText blocks
      if (block.type==='text' || block.type==='imageText') {
        const src = block.content || block.textContent || '';
        if (!countLi(src)) return block;
        liBefore+=countLi(src); pBefore+=countP(src);
        const conv = convertBulletsToP(src);
        liAfter+=countLi(conv); pAfter+=countP(conv);
        if (conv!==src) { changed++; return block.content!==undefined?{...block,content:conv}:{...block,textContent:conv}; }
        return block;
      }
      // accordion blocks — convert accordionItems[*].content
      if (block.type==='accordion') {
        const items = (block.accordionItems||[]).map(item => {
          const src = item.content||'';
          if (!countLi(src)) return item;
          liBefore+=countLi(src); pBefore+=countP(src);
          const conv = convertBulletsToP(src);
          liAfter+=countLi(conv); pAfter+=countP(conv);
          if (conv!==src) { changed++; return {...item,content:conv}; }
          return item;
        });
        return {...block, accordionItems:items};
      }
      return block;
    });
    return {...sec, contentBlocks:patchedBlocks};
  });

  const pctBefore = pBefore+liBefore>0 ? Math.round(liBefore/(pBefore+liBefore)*100) : 0;
  const pctAfter  = pAfter+liAfter>0   ? Math.round(liAfter/(pAfter+liAfter)*100)   : 0;

  console.log(`  ${(course.courseCode||'?').padEnd(12)} ${course.title.slice(0,45)}`);
  console.log(`    Before: ${liBefore}li/${pBefore}p = ${pctBefore}% | After: ${liAfter}li/${pAfter}p = ${pctAfter}% | Blocks: ${changed}`);

  if (!changed) { console.log('    Nothing to convert'); return; }
  if (!DRY) {
    const r = await col.updateOne({_id:course._id},{$set:{sections:patchedSections,updatedAt:new Date()}});
    if (r.modifiedCount===1) {
      const rb = await col.findOne({_id:course._id},{projection:{sections:1}});
      let rbLi=0,rbP=0;
      (rb.sections||[]).forEach(s=>(s.contentBlocks||[]).forEach(b=>{
        const c=b.content||b.textContent||'';
        rbLi+=countLi(c);rbP+=countP(c);
        (b.accordionItems||[]).forEach(a=>{rbLi+=countLi(a.content||'');rbP+=countP(a.content||'');});
      }));
      const rbPct = rbP+rbLi>0?Math.round(rbLi/(rbP+rbLi)*100):0;
      console.log(`    ✅ Written — read-back: ${rbLi}li/${rbP}p = ${rbPct}%`);
    } else console.error('    ❌ Write failed');
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n'+'='.repeat(72));
  console.log('fixRemainingAuditIssues — '+(DRY?'DRY RUN':'APPLYING WRITES'));
  console.log('='.repeat(72)+'\n');

  console.log('── CONTENT PATCHES ─────────────────────────────────────────────');
  for (const p of CONTENT_PATCHES) await applyContentPatch(col, p);

  console.log('\n── BULLET FIXES (text + accordion blocks) ──────────────────────');
  for (const s of BULLET_TARGETS) await applyBulletFix(col, s);

  console.log('\n'+'='.repeat(72));
  if (DRY) console.log('Re-run with --apply to write. Then: node src/scripts/auditIntrosConclusions.js');
  console.log('='.repeat(72)+'\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err=>{ console.error('Fatal:',err); process.exit(1); });
