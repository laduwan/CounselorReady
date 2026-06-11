/**
 * patchCR427Content.js
 * Targeted fix: adds the authored content block to the CR-427 geriatric substance-use
 * course, located by TITLE (its slug is 'seasoned-struggling-...', no 'and', which a
 * prior slug-keyed patch missed). Idempotent; recomputes wordCount.
 * Run: node src/scripts/patchCR427Content.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { countCourseWords } from '../utils/courseWordCount.js';
dotenv.config();
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const BLOCK = {"title":"Physiological Vulnerability and Treatment Adaptation in Older Adults","content":"<h2>Physiological Vulnerability and Treatment Adaptation in Older Adults</h2>\n<p>Effective intervention with older adults who misuse substances depends on understanding why aging bodies respond differently to alcohol and medications, and on adapting otherwise familiar treatments to the realities of later life. The same quantity of a substance that was unremarkable at forty can produce intoxication, injury, or dangerous interactions at seventy, and treatment models designed for younger populations frequently require modification to be safe and effective.</p>\n<h3>Age-Related Pharmacological Changes</h3>\n<p>Several physiological shifts converge to heighten vulnerability. With age, lean body mass and total body water decline while the proportion of body fat rises, so water-soluble substances such as alcohol reach higher blood concentrations from a given dose. Hepatic metabolism and renal clearance slow, prolonging the time medications and their active metabolites remain in circulation. The aging central nervous system also becomes more sensitive to sedating agents, meaning that even standard doses can impair balance, cognition, and reaction time. The clinical consequence is that older adults experience the effects of alcohol and sedatives at lower thresholds and for longer durations, raising the risk of falls, fractures, motor vehicle crashes, cognitive impairment that can be mistaken for dementia, and undertreated medical conditions.</p>\n<h3>High-Risk Substances and Polypharmacy</h3>\n<p>Benzodiazepines warrant particular vigilance. Long-term use in older adults is associated with falls, hip fractures, cognitive impairment, and motor vehicle accidents, and abrupt discontinuation carries seizure risk; deprescribing is therefore best pursued through a gradual, individualized taper rather than sudden cessation. Alcohol interacts dangerously with many commonly prescribed medications, potentiating sedation and gastrointestinal bleeding and undermining the effectiveness of treatments for hypertension and diabetes. Prescription opioid use raises concerns about respiratory depression, constipation, and interaction with other CNS depressants. Polypharmacy magnifies all of these risks: an older adult managing multiple chronic conditions may take many medications whose cumulative and interactive effects are poorly tracked across prescribers, so a careful medication reconciliation is an essential and often revealing part of assessment.</p>\n<h3>Adapting Treatment for Later Life</h3>\n<p>Treatment that is effective with younger adults generally remains effective with older adults, but it must be adapted in pace, content, and setting. Motivational interviewing is well suited to this population because it respects autonomy and avoids the confrontation that can alienate older clients who carry shame about substance use. Sessions may need to proceed more slowly, accommodate sensory and cognitive changes through clear written materials and reduced session density, and incorporate cognitive screening so that treatment planning accounts for any impairment. Age-specific or age-sensitive group programming tends to outperform mixed-age groups for older adults, who often relate more readily to peers facing similar losses—bereavement, retirement, declining health, and social isolation—which frequently function as both triggers and maintaining factors. Coordinating closely with primary care and addressing co-occurring depression, grief, and chronic pain are central rather than ancillary, because untreated comorbidity reliably undermines recovery. Framed this way, treatment of substance use in later life is less a matter of importing a standard protocol than of tailoring evidence-based methods to a body and a life stage with distinctive needs.</p>\n<h3>Co-Occurring Conditions and Elevated Suicide Risk</h3>\n<p>Substance misuse in older adults rarely occurs in isolation, and the conditions that accompany it materially raise the stakes of accurate assessment. Depression is the most common comorbidity, and the relationship is bidirectional: alcohol and sedatives can deepen depressive symptoms, while untreated depression drives self-medication. Chronic pain, insomnia, bereavement, and the cascade of losses that characterize later life all function as both triggers for use and targets that, if addressed directly, reduce reliance on substances. Cognitive impairment complicates the picture further, because substance-induced deficits can mimic or accelerate neurodegenerative change, and distinguishing reversible from progressive impairment requires careful longitudinal observation rather than a single snapshot. Clinicians must hold all of this alongside a sobering epidemiological reality: older adults, and older men in particular, have among the highest suicide rates of any age group, and the combination of substance use, depression, social isolation, access to means, and physical illness is especially lethal. Routine, direct screening for suicidal ideation is therefore not optional in this population. Integrating substance use treatment with mental health care, pain management, and primary care—rather than treating each problem in a separate silo—is the approach most likely to interrupt these reinforcing cycles and to keep an older client safe while recovery takes hold.</p>\n<p>Relapse prevention with older adults benefits from attention to the specific contexts in which use tends to recur. Transitions such as the death of a spouse, a move from home to assisted living, hospitalization, or the onset of a new disability can destabilize hard-won gains, and anticipating these high-risk junctures allows the clinician and client to plan supports in advance. Where appropriate and consented to, involving family members or other trusted supports strengthens the recovery environment, provided the clinician guards against shaming dynamics and respects the older adult's autonomy and dignity. Building structured, meaningful activity and social connection into the recovery plan directly counters the isolation that so often drives use, and even modest gains—renewed contact with family, participation in a community program, restored sleep—can compound into durable change when the clinician frames recovery in later life as an expansion of life rather than merely the removal of a substance.</p>"};
const RX = /seasoned|substance use disorder.*older|older adult.*substance|substance.*older adult/i;
const FLOOR_PER_CE = 6000;

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');

const matches = await col.find({ title: { $regex: RX } }, { projection: { _id:1, title:1, slug:1, courseCode:1, ceHours:1, sections:1 } }).toArray();
if (matches.length === 0) { console.log('NO MATCH'); }
else if (matches.length > 1) { console.log('AMBIGUOUS: ' + matches.map(m=>m.courseCode+'/'+m.slug).join(', ') + ' — not modifying'); }
else {
  const doc = matches[0];
  const floor = (doc.ceHours||0) * FLOOR_PER_CE;
  const secs = doc.sections || [];
  if (!secs.length) { console.log(doc.courseCode + ' (' + doc.slug + '): no sections — SKIP'); }
  else {
    const before = countCourseWords(doc);
    const last = secs[secs.length-1];
    last.contentBlocks = last.contentBlocks || [];
    if (last.contentBlocks.some(b => (b.title||'') === BLOCK.title)) {
      console.log(doc.courseCode + ' (' + doc.slug + '): block already present (' + before + '/' + floor + ') — SKIP');
    } else {
      const maxOrder = Math.max(0, ...last.contentBlocks.map(b => b.order||0));
      last.contentBlocks.push({ type:'text', order:maxOrder+1, title:BLOCK.title, content:BLOCK.content });
      const after = countCourseWords(doc);
      await col.updateOne({ _id: doc._id }, { $set: { sections: secs, wordCount: after } });
      console.log(doc.courseCode + ' (' + doc.slug + '): ' + before + ' -> ' + after + ' / floor ' + floor + '  ' + (after>=floor?'PASS':'STILL SHORT ('+(floor-after)+')'));
    }
  }
}
await mongoose.disconnect();
console.log('Done.');
