import { useState, useRef, useEffect } from "react";

const BRAND = {
  burgundy: "#6B1D34",
  green: "#4A7C59",
  gold: "#D4A855",
  navy: "#284157",
  eggshell: "#F5F5DC",
  stone: "#F8F7F4",
  burgundyLight: "#8B3A54",
  greenLight: "#5A9469",
  rose: "#D0768A",
};

const NOTE_FORMATS = {
  SOAP: {
    label: "SOAP",
    desc: "Subjective, Objective, Assessment, Plan",
    sections: ["Subjective", "Objective", "Assessment", "Plan"],
    prompts: {
      Subjective: "Client's reported symptoms, feelings, concerns, and statements",
      Objective: "Clinician observations, behaviors, affect, appearance, test results",
      Assessment: "Clinical impressions, progress toward goals, diagnosis considerations",
      Plan: "Next steps, homework, referrals, follow-up schedule",
    },
  },
  DAP: {
    label: "DAP",
    desc: "Data, Assessment, Plan",
    sections: ["Data", "Assessment", "Plan"],
    prompts: {
      Data: "Session content, client statements, clinician observations, interventions used",
      Assessment: "Clinical impressions, progress, diagnostic considerations",
      Plan: "Next steps, homework, referrals, follow-up",
    },
  },
  BIRP: {
    label: "BIRP",
    desc: "Behavior, Intervention, Response, Plan",
    sections: ["Behavior", "Intervention", "Response", "Plan"],
    prompts: {
      Behavior: "Client's presenting behavior, mood, affect, statements",
      Intervention: "Techniques and interventions used by clinician",
      Response: "Client's response to interventions, shifts in session",
      Plan: "Next steps, homework, follow-up, referrals",
    },
  },
  NARRATIVE: {
    label: "Narrative",
    desc: "Free-form clinical narrative",
    sections: ["Narrative"],
    prompts: {
      Narrative: "Session summary including presenting concerns, interventions, client response, and plan",
    },
  },
};

const SESSION_TYPES = [
  "Individual Therapy", "Couples Therapy", "Family Therapy", "Group Therapy",
  "Intake/Assessment", "Crisis Intervention", "Telehealth Session", "Case Management",
];

const MODALITIES = [
  "CBT", "DBT", "EMDR", "Psychodynamic", "Person-Centered", "Solution-Focused",
  "Motivational Interviewing", "Narrative Therapy", "ACT", "Gestalt", "Play Therapy",
  "Somatic Experiencing", "IFS", "EFT", "Trauma-Focused CBT",
];

const GUIDED_PROMPTS = {
  SOAP: {
    intro: "For a SOAP note, think through each section as you jot your bullets:",
    sections: [
      {
        letter: "S",
        title: "Subjective",
        color: "#6B1D34",
        prompts: [
          "What did the client say was their reason for coming today?",
          "How did they describe their mood or symptoms since last session? (use their words)",
          "Any new stressors, life events, or changes they reported?",
          "Did they report any changes in sleep, appetite, energy, or concentration?",
          "What did they say about homework or between-session practice?",
          "Any statements about suicidal/homicidal ideation, self-harm, or substance use?",
        ],
        example: '"Ct. stated she feels \'overwhelmed and stuck\' — reported sleeping 3-4 hrs/night since job loss last Tuesday. Denied SI/HI. Did not complete thought record — said she \'couldn\'t focus.\'"'
      },
      {
        letter: "O",
        title: "Objective",
        color: "#4A7C59",
        prompts: [
          "What did you observe about their appearance? (grooming, eye contact, posture)",
          "How would you describe their affect and mood presentation?",
          "Speech patterns? (rate, volume, tone, coherence)",
          "Psychomotor activity? (agitation, slowing, fidgeting, restlessness)",
          "What interventions or techniques did YOU use in session?",
          "Any screening tools administered and scores? (PHQ-9, GAD-7, PCL-5, etc.)",
        ],
        example: '"Ct. appeared fatigued — dark circles, minimal eye contact. Affect was flat with constricted range. Speech slow but coherent. PHQ-9 score: 18 (moderately severe). Used cognitive restructuring to examine catastrophic thinking patterns."'
      },
      {
        letter: "A",
        title: "Assessment",
        color: "#284157",
        prompts: [
          "What is your clinical impression of where the client is today?",
          "Progress toward treatment goals — better, same, worse?",
          "Any diagnostic clarifications or rule-outs?",
          "Risk level — what is your assessment of current safety?",
          "What themes or patterns are emerging across sessions?",
        ],
        example: '"Ct. presents with worsening depressive symptoms consistent with MDD exacerbation following acute stressor. Moderate risk — passive SI without plan. Limited progress on Goal 1 (cognitive distortions) due to sleep disruption."'
      },
      {
        letter: "P",
        title: "Plan",
        color: "#D4A855",
        prompts: [
          "What is the plan for next session — what will you focus on?",
          "Any homework or between-session tasks assigned?",
          "Referrals made or needed? (psychiatry, PCP, group, etc.)",
          "Any medication changes discussed or recommended?",
          "Safety planning — any updates to the safety plan?",
          "Frequency of sessions — same, increasing, decreasing?",
        ],
        example: '"Continue weekly sessions. Assigned simplified thought record (3-column). Refer to Dr. Patel for medication evaluation — will send referral tomorrow. Reviewed safety plan — updated emergency contacts. Next session: March 15."'
      },
    ],
  },
  DAP: {
    intro: "For a DAP note, the Data section does the heavy lifting — it's where most of your bullets go:",
    sections: [
      {
        letter: "D",
        title: "Data",
        color: "#6B1D34",
        prompts: [
          "What did the client report about their week and current symptoms?",
          "What topics or themes were discussed in session?",
          "What interventions did you use? (technique name + brief description)",
          "What did you observe — affect, behavior, appearance, engagement?",
          "Any direct quotes that capture their state? (use their words)",
          "Any screening tools, scores, or measurable data points?",
        ],
        example: '"Ct. reported 4 panic attacks this week, up from 1 last week. Explored triggers — all work-related. Introduced diaphragmatic breathing and practiced in session. Ct. was engaged, affect anxious but brightened during skills practice. GAD-7: 15."'
      },
      {
        letter: "A",
        title: "Assessment",
        color: "#4A7C59",
        prompts: [
          "What is your clinical interpretation of today's session?",
          "Progress toward treatment plan goals?",
          "Risk assessment — any safety concerns?",
          "How effective were the interventions used today?",
        ],
        example: '"Anxiety symptoms escalating — likely related to upcoming performance review. Ct. responded well to breathing technique in session. Moderate progress on Goal 2 (distress tolerance). No safety concerns."'
      },
      {
        letter: "P",
        title: "Plan",
        color: "#284157",
        prompts: [
          "Next session focus and date?",
          "Homework or skills to practice between sessions?",
          "Referrals, coordination, or follow-up actions?",
          "Any changes to treatment plan or session frequency?",
        ],
        example: '"Practice diaphragmatic breathing 2x daily using handout. Next session: introduce cognitive restructuring for work-related catastrophizing. Maintain weekly frequency. No referrals needed at this time."'
      },
    ],
  },
  BIRP: {
    intro: "BIRP notes track the session flow: what the client brought in, what you did, how they responded, and what's next:",
    sections: [
      {
        letter: "B",
        title: "Behavior",
        color: "#6B1D34",
        prompts: [
          "What behavior or presentation did the client bring into session?",
          "What did they say about their current state — mood, symptoms, concerns?",
          "Observable behavior — agitation, tearfulness, avoidance, engagement level?",
          "Any behaviors reported between sessions? (arguments, isolation, substance use, etc.)",
        ],
        example: '"Ct. arrived 10 min late, appeared agitated. Reported argument with partner last night — stated he \'almost walked out for good.\' Pacing, rapid speech, difficulty sitting still. Reported drinking 4 beers after the argument."'
      },
      {
        letter: "I",
        title: "Intervention",
        color: "#4A7C59",
        prompts: [
          "What specific techniques or interventions did you use?",
          "Did you use any worksheets, handouts, or structured exercises?",
          "Any psychoeducation provided? On what topic?",
          "De-escalation, grounding, or containment strategies used?",
          "Any motivational interviewing, role-play, or behavioral rehearsal?",
        ],
        example: '"Used MI to explore ambivalence about relationship. Reflected discrepancy between stated values (family) and behavior (avoidance). Introduced HALT check (Hungry, Angry, Lonely, Tired) as trigger awareness tool. Practiced 5-4-3-2-1 grounding."'
      },
      {
        letter: "R",
        title: "Response",
        color: "#284157",
        prompts: [
          "How did the client respond to the interventions?",
          "Any shifts in affect, insight, or engagement during session?",
          "Did they express any new understanding or awareness?",
          "Were they resistant, receptive, or somewhere in between?",
        ],
        example: '"Ct. initially defensive but softened when exploring values. Acknowledged pattern of avoidance → conflict → drinking. Stated: \'I know I need to deal with this differently.\' Affect shifted from agitated to reflective by end of session."'
      },
      {
        letter: "P",
        title: "Plan",
        color: "#D4A855",
        prompts: [
          "What's the plan for next session?",
          "Homework or between-session practice?",
          "Any referrals or coordination needed?",
          "Safety considerations and follow-up?",
        ],
        example: '"Ct. agreed to use HALT check before next argument. Will track triggers and responses in journal. Discuss alcohol use patterns in more depth next session. Consider referral to couples therapy. Next session: Thursday."'
      },
    ],
  },
  NARRATIVE: {
    intro: "A narrative note tells the story of the session in flowing prose. Use these prompts to make sure you hit all the key elements:",
    sections: [
      {
        letter: "•",
        title: "Opening / Context",
        color: "#6B1D34",
        prompts: [
          "Why did the client come in today — what was the presenting focus?",
          "How did they present at the start of session? (mood, affect, appearance)",
          "Any updates since last session — life events, symptom changes, homework?",
        ],
        example: '"Ct. presented for regularly scheduled session. Reported improved mood since starting Lexapro 2 weeks ago. Appeared brighter, made eye contact, smiled appropriately."'
      },
      {
        letter: "•",
        title: "Session Content & Interventions",
        color: "#4A7C59",
        prompts: [
          "What was the main theme or focus of the session?",
          "What interventions or techniques were used?",
          "Any pivotal moments, breakthroughs, or points of resistance?",
          "Any direct quotes that capture the session's essence?",
        ],
        example: '"Session focused on grief processing around mother\'s death. Used empty chair technique — ct. spoke directly to mother. Ct. wept openly and expressed guilt about missing last phone call. Pivotal moment of emotional release."'
      },
      {
        letter: "•",
        title: "Clinical Impressions & Safety",
        color: "#284157",
        prompts: [
          "What is your overall clinical impression from this session?",
          "Progress toward treatment goals?",
          "Risk assessment — any safety concerns noted or addressed?",
          "Diagnostic considerations or changes?",
        ],
        example: '"Ct. demonstrates increasing capacity for emotional processing. Grief response appears normative. Denied SI/HI. No safety concerns. Diagnosis unchanged."'
      },
      {
        letter: "•",
        title: "Plan & Follow-Up",
        color: "#D4A855",
        prompts: [
          "Next session date and planned focus?",
          "Homework or between-session tasks?",
          "Any referrals, coordination, or follow-up needed?",
        ],
        example: '"Next session in 1 week — plan to continue grief work using narrative letter-writing exercise. Ct. will journal about favorite memories with mother. No referrals at this time."'
      },
    ],
  },
};

function CRLogo({ size = "md" }) {
  const sizes = { sm: { font: 18, sub: 10 }, md: { font: 24, sub: 12 }, lg: { font: 32, sub: 14 } };
  const s = sizes[size];
  return (
    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: s.font, letterSpacing: "-0.5px" }}>
      <span style={{ color: BRAND.burgundy }}>Counselor</span>
      <span style={{ color: BRAND.green }}>Ready</span>
    </span>
  );
}

function TabButton({ active, onClick, children, icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        border: "none",
        borderBottom: active ? `3px solid ${BRAND.burgundy}` : "3px solid transparent",
        background: active ? "rgba(107,29,52,0.06)" : "transparent",
        color: active ? BRAND.burgundy : BRAND.navy,
        fontFamily: "'Lato', sans-serif",
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      {children}
    </button>
  );
}

function FormatCard({ format, selected, onClick }) {
  const f = NOTE_FORMATS[format];
  const isSelected = selected === format;
  return (
    <button
      onClick={() => onClick(format)}
      style={{
        padding: "16px",
        border: `2px solid ${isSelected ? BRAND.burgundy : "#ddd"}`,
        borderRadius: 10,
        background: isSelected ? "rgba(107,29,52,0.05)" : "#fff",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s ease",
        flex: "1 1 140px",
        minWidth: 140,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isSelected && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${BRAND.burgundy}, ${BRAND.rose})` }} />
      )}
      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 20, color: isSelected ? BRAND.burgundy : BRAND.navy, marginBottom: 4 }}>
        {f.label}
      </div>
      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#777", lineHeight: 1.4 }}>
        {f.desc}
      </div>
    </button>
  );
}

function PillSelect({ options, selected, onChange, multi = false }) {
  const toggle = (opt) => {
    if (multi) {
      onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
    } else {
      onChange(opt);
    }
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const isActive = multi ? selected.includes(opt) : selected === opt;
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: `1.5px solid ${isActive ? BRAND.green : "#ccc"}`,
              background: isActive ? "rgba(74,124,89,0.1)" : "#fff",
              color: isActive ? BRAND.green : BRAND.navy,
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TextArea({ label, placeholder, value, onChange, rows = 4, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 13, fontWeight: 600, color: BRAND.navy, marginBottom: 6 }}>
        {label}
      </label>
      {hint && <div style={{ fontSize: 12, color: "#888", marginBottom: 6, fontStyle: "italic" }}>{hint}</div>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1.5px solid #ddd",
          fontFamily: "'Lato', sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
          background: "#fff",
        }}
        onFocus={(e) => (e.target.style.borderColor = BRAND.green)}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12, flex: 1 }}>
      <label style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 13, fontWeight: 600, color: BRAND.navy, marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1.5px solid #ddd",
          fontFamily: "'Lato', sans-serif",
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = BRAND.green)}
        onBlur={(e) => (e.target.style.borderColor = "#ddd")}
      />
    </div>
  );
}

function PromptGuide({ format }) {
  const [expanded, setExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const guide = GUIDED_PROMPTS[format];
  if (!guide) return null;

  const toggleSection = (idx) => {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: expanded ? `linear-gradient(135deg, rgba(107,29,52,0.06), rgba(74,124,89,0.04))` : "rgba(107,29,52,0.03)",
          border: `1.5px solid ${expanded ? BRAND.burgundy + "30" : "#ddd"}`,
          borderRadius: expanded ? "10px 10px 0 0" : 10,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Lato', sans-serif",
          transition: "all 0.2s",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.burgundy} strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.burgundy }}>
            What to Document — {NOTE_FORMATS[format].label} Guide
          </span>
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BRAND.navy} strokeWidth="2"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {expanded && (
        <div style={{
          border: `1.5px solid ${BRAND.burgundy}30`,
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          background: "#fff",
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 16px", background: "rgba(40,65,87,0.03)", borderBottom: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 12.5px, color: "#666", lineHeight: 1.5, margin: 0 }}>
              {guide.intro}
            </p>
          </div>

          {guide.sections.map((sec, idx) => {
            const isOpen = expandedSections[idx] !== false; // default open
            return (
              <div key={idx} style={{ borderBottom: idx < guide.sections.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <button
                  onClick={() => toggleSection(idx)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: sec.color,
                      color: "#fff",
                      fontSize: 12, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}>
                      {sec.letter}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: sec.color }}>
                      {sec.title}
                    </span>
                  </span>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 16px 14px 52px" }}>
                    <div style={{ marginBottom: 10 }}>
                      {sec.prompts.map((p, i) => (
                        <div key={i} style={{
                          fontSize: 12.5px,
                          color: "#555",
                          lineHeight: 1.6,
                          paddingLeft: 12,
                          borderLeft: `2px solid ${sec.color}20`,
                          marginBottom: 5,
                        }}>
                          {p}
                        </div>
                      ))}
                    </div>
                    <div style={{
                      background: `${sec.color}08`,
                      border: `1px solid ${sec.color}18`,
                      borderRadius: 8,
                      padding: "10px 12px",
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: sec.color, marginBottom: 4 }}>
                        Example
                      </div>
                      <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, fontStyle: "italic" }}>
                        {sec.example}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CRNoteWriter() {
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState("SOAP");
  const [sessionType, setSessionType] = useState("Individual Therapy");
  const [modalities, setModalities] = useState([]);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [duration, setDuration] = useState("50");
  const [clientInitials, setClientInitials] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [bulletPoints, setBulletPoints] = useState("");
  const [riskLevel, setRiskLevel] = useState("None identified");
  const [riskDetails, setRiskDetails] = useState("");
  const [generatedNote, setGeneratedNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  const [noteMode, setNoteMode] = useState("new"); // "new" | "addendum"
  const [existingNote, setExistingNote] = useState("");
  const [addendumReason, setAddendumReason] = useState("");
  const [practiceInfo, setPracticeInfo] = useState({ name: "", npi: "", address: "", phone: "" });
  const noteRef = useRef(null);
  const [loadingDots, setLoadingDots] = useState("");

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadingDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const isElevatedRisk = riskLevel && !riskLevel.startsWith("None");

  const RISK_BOOSTER = `
CRITICAL — ELEVATED RISK DOCUMENTATION:
The clinician has indicated elevated risk. You MUST include comprehensive safety documentation:
1. SUICIDE RISK ASSESSMENT: Document ideation (passive vs active), plan specificity, intent, means access, timeline, and protective factors. Use Columbia Suicide Severity Rating Scale (C-SSRS) language where applicable.
2. MEANS RESTRICTION: Document whether means restriction was discussed, what means were identified, and what steps were taken (e.g., "firearm stored with family member," "medications locked by spouse").
3. SAFETY PLAN: Document whether a safety plan was created or updated, and list the key components (warning signs, coping strategies, contacts, crisis resources).
4. DUTY TO WARN/PROTECT: If applicable, document whether Tarasoff duty was triggered and what actions were taken.
5. DISPOSITION: Document the clinical decision-making for disposition (e.g., why outpatient vs. inpatient, what would change the disposition).
6. FOLLOW-UP: Document specific follow-up plan including timeline (e.g., "next session in 48 hours," "phone check-in tomorrow at 10am").
7. COLLATERAL: Document any collateral contacts made and information obtained.
Include these elements even if the clinician's bullet points don't explicitly mention all of them — prompt the sections with "Not assessed" or "Not indicated" if information is missing, so the clinician can fill in.`;

  const generateNote = async () => {
    if (noteMode === "new" && !bulletPoints.trim()) {
      setError("Please enter session bullet points before generating.");
      return;
    }
    if (noteMode === "addendum" && (!existingNote.trim() || !addendumReason.trim())) {
      setError("Please paste the existing note and describe what needs to be added.");
      return;
    }
    setError("");
    setIsGenerating(true);
    setGeneratedNote("");

    if (noteMode === "addendum") {
      // ADDENDUM GENERATION
      const addendumPrompt = `You are a clinical documentation assistant. Generate a properly formatted clinical addendum to an existing progress note.

RULES:
- Begin with "ADDENDUM" header, followed by the current date and time
- State the original note date if identifiable from the existing note
- Write in professional clinical language appropriate for medical records
- Use third person ("The client" or "Ct.")
- The addendum should ONLY contain the new or corrected information — do not rewrite the original note
- Include a clear reason for the addendum (late entry, correction, additional information, etc.)
- End with a signature line placeholder
- Keep the addendum focused and concise

Original note:
${existingNote}

Reason for addendum / new information:
${addendumReason}`;

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: addendumPrompt,
            messages: [{ role: "user", content: "Generate the addendum." }],
          }),
        });
        const data = await response.json();
        if (data.content && data.content[0]) {
          setGeneratedNote(data.content[0].text);
          setActiveTab("result");
        } else {
          setError("Unable to generate addendum. Please try again.");
        }
      } catch (err) {
        setError("Connection error. Please check your network and try again.");
      }
      setIsGenerating(false);
      return;
    }

    // NEW NOTE GENERATION
    const formatInfo = NOTE_FORMATS[format];
    const systemPrompt = `You are a clinical documentation assistant for licensed mental health professionals. Generate a professional ${formatInfo.label} note based on the clinician's session bullet points. 

RULES:
- Write in professional clinical language appropriate for medical records
- Use third person ("The client" or "Ct.")
- Be specific and behavioral in descriptions
- Include measurable observations where possible
- Do NOT fabricate details not provided by the clinician
- Do NOT include any PHI — use only the initials provided
- Format with clear section headers for: ${formatInfo.sections.join(", ")}
- Keep the note concise but thorough (typically 200-400 words total)
- End the Plan section with next session date/frequency if mentioned
${isElevatedRisk ? RISK_BOOSTER : '- If risk factors are noted, include appropriate safety language'}

Session context:
- Format: ${formatInfo.label}
- Session Type: ${sessionType}
- Duration: ${duration} minutes
- Modalities: ${modalities.length ? modalities.join(", ") : "Not specified"}
- Diagnosis: ${diagnosis || "Not provided"}
- Risk Level: ${riskLevel}
${isElevatedRisk && riskDetails ? `- Risk Details: ${riskDetails}` : ''}
- Client: ${clientInitials || "Ct."}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `Generate a ${formatInfo.label} note from these session bullet points:\n\n${bulletPoints}`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.content && data.content[0]) {
        setGeneratedNote(data.content[0].text);
        setActiveTab("result");
      } else {
        setError("Unable to generate note. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please check your network and try again.");
    }
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedNote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = generatedNote;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setBulletPoints("");
    setGeneratedNote("");
    setClientInitials("");
    setDiagnosis("");
    setRiskDetails("");
    setError("");
    setExistingNote("");
    setAddendumReason("");
    setNoteMode("new");
    setActiveTab("compose");
  };

  const exportPDF = () => {
    const pi = practiceInfo;
    const header = [pi.name, pi.npi ? `NPI: ${pi.npi}` : '', pi.address, pi.phone].filter(Boolean).join(' | ');
    const noteTitle = noteMode === "addendum" ? "ADDENDUM" : `${NOTE_FORMATS[format].label} NOTE`;
    const w = window.open('', '', 'width=700,height=900');
    w.document.write(`<html><head><title>${noteTitle} — ${clientInitials || 'Ct.'}</title>
    <style>
      body{font-family:Georgia,'Times New Roman',serif;padding:40px 48px;font-size:12.5px;line-height:1.7;color:#222}
      .header{border-bottom:2px solid #6B1D34;padding-bottom:10px;margin-bottom:20px}
      .practice-name{font-size:16px;font-weight:bold;color:#6B1D34}
      .practice-info{font-size:10.5px;color:#666;margin-top:2px}
      .note-meta{font-size:11px;color:#888;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #eee}
      .note-body{white-space:pre-wrap;font-size:12.5px;line-height:1.8}
      .sig-area{margin-top:40px;border-top:1px solid #ddd;padding-top:20px}
      .sig-line{margin-top:30px;border-bottom:1px solid #999;width:60%;padding-bottom:4px}
      .sig-label{font-size:10px;color:#888;margin-top:2px}
      .footer{margin-top:40px;text-align:center;font-size:9px;color:#bbb;border-top:1px solid #eee;padding-top:8px}
    </style></head><body>
    <div class="header">
      <div class="practice-name">${pi.name || (clientInitials ? clientInitials + ' — Clinical Note' : 'Clinical Note')}</div>
      ${header ? `<div class="practice-info">${header}</div>` : ''}
    </div>
    <div class="note-meta">
      <strong>${noteTitle}</strong> — ${clientInitials || 'Ct.'}<br>
      Date: ${sessionDate} | Duration: ${duration} min | Type: ${sessionType}
      ${modalities.length ? ' | Modalities: ' + modalities.join(', ') : ''}
      ${diagnosis ? ' | Dx: ' + diagnosis : ''}
    </div>
    <div class="note-body">${generatedNote.replace(/\n/g, '<br>')}</div>
    <div class="sig-area">
      <div class="sig-line"></div>
      <div class="sig-label">Clinician Signature &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</div>
      ${pi.name ? `<div style="margin-top:8px;font-size:11px;color:#555">${pi.name}${pi.npi ? ' | NPI: ' + pi.npi : ''}</div>` : ''}
    </div>
    <div class="footer">Generated with CounselorReady Clinical Tools — counselorready.com | This is a draft — review before signing.</div>
    </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div style={{ minHeight: "100vh", background: BRAND.stone, fontFamily: "'Lato', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${BRAND.burgundy} 0%, ${BRAND.burgundyLight} 100%)`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(107,29,52,0.3)",
      }}>
        <div>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 24, letterSpacing: "-0.5px" }}>
              <span style={{ color: "#D0768A" }}>Counselor</span>
              <span style={{ color: BRAND.green }}>Ready</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A855" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 600, letterSpacing: "0.5px" }}>
              Clinical Note Writer
            </span>
            <span style={{
              background: BRAND.gold,
              color: BRAND.burgundy,
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 10,
              letterSpacing: "0.5px",
            }}>
              AI-POWERED
            </span>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, textAlign: "right", lineHeight: 1.5 }}>
          <div>HIPAA Notice: No data is stored.</div>
          <div>Notes are generated in-session only.</div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e5", display: "flex", padding: "0 24px" }}>
        <TabButton active={activeTab === "compose" && noteMode === "new"} onClick={() => { setNoteMode("new"); setActiveTab("compose"); }} icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        }>New Note</TabButton>
        <TabButton active={activeTab === "compose" && noteMode === "addendum"} onClick={() => { setNoteMode("addendum"); setActiveTab("compose"); }} icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
        }>Addendum</TabButton>
        <TabButton active={activeTab === "result"} onClick={() => activeTab === "result" || generatedNote ? setActiveTab("result") : null} icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
        }>Generated Note</TabButton>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 20px" }}>
        {activeTab === "compose" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Format Selection */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: BRAND.burgundy, marginBottom: 12, fontWeight: 700 }}>
                Note Format
              </h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {Object.keys(NOTE_FORMATS).map((f) => (
                  <FormatCard key={f} format={f} selected={format} onClick={setFormat} />
                ))}
              </div>
            </div>

            {/* Session Details Card */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              marginBottom: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: BRAND.burgundy, marginBottom: 16, fontWeight: 700 }}>
                Session Details
              </h3>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                <InputField label="Session Date" value={sessionDate} onChange={setSessionDate} type="date" />
                <InputField label="Duration (min)" value={duration} onChange={setDuration} placeholder="50" />
                <InputField label="Client Initials" value={clientInitials} onChange={setClientInitials} placeholder="e.g. J.D." />
              </div>
              <InputField label="Diagnosis / Presenting Concerns" value={diagnosis} onChange={setDiagnosis} placeholder="e.g. F33.1 MDD, Recurrent, Moderate; relationship conflict" />

              <div style={{ marginBottom: 16, marginTop: 8 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.navy, marginBottom: 8 }}>Session Type</label>
                <PillSelect options={SESSION_TYPES} selected={sessionType} onChange={setSessionType} />
              </div>

              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.navy, marginBottom: 8 }}>
                  Modalities Used <span style={{ fontWeight: 400, color: "#999" }}>(select all that apply)</span>
                </label>
                <PillSelect options={MODALITIES} selected={modalities} onChange={setModalities} multi />
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.navy, marginBottom: 8 }}>Risk Level</label>
                <PillSelect
                  options={["None identified", "Low — passive ideation, no plan", "Moderate — ideation with vague plan", "High — active plan, intent, means"]}
                  selected={riskLevel}
                  onChange={setRiskLevel}
                />

                {isElevatedRisk && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{
                      background: `rgba(107,29,52,0.06)`,
                      border: `1.5px solid ${BRAND.burgundy}30`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      marginBottom: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND.burgundy} strokeWidth="2.5">
                          <path d="M12 9v4" /><path d="M12 17h.01" />
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        </svg>
                        <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.burgundy, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Risk Documentation Booster — Active
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#777", lineHeight: 1.5, margin: 0 }}>
                        Elevated risk detected. The AI will automatically expand safety documentation including: suicide risk assessment (C-SSRS language), means restriction, safety plan status, duty to warn analysis, disposition rationale, follow-up timeline, and collateral contacts.
                      </p>
                    </div>
                    <TextArea
                      label="Risk Details (the more specific, the better the documentation)"
                      value={riskDetails}
                      onChange={setRiskDetails}
                      rows={3}
                      placeholder={"e.g. Ct. endorsed active SI with plan (overdose on Klonopin). Has 60-count bottle at home. Denied intent — stated 'I wouldn't actually do it but I think about it every night.' One prior attempt 2022. Safety plan reviewed and updated — emergency contacts: spouse, sister. Voluntary hospitalization offered — ct. declined."}
                      hint="Include: ideation type, plan specifics, means access, prior attempts, safety plan status, voluntary hospitalization offered Y/N"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Practice Info for PDF Export (collapsible) */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: "16px 24px",
              marginBottom: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                onClick={() => document.getElementById("practiceInfoFields").style.display = document.getElementById("practiceInfoFields").style.display === "none" ? "block" : "none"}>
                <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.navy, display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BRAND.green} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Practice Header for PDF Export
                  <span style={{ fontSize: 11, fontWeight: 400, color: "#aaa" }}>(optional — for audit-ready prints)</span>
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </div>
              <div id="practiceInfoFields" style={{ display: "none", marginTop: 14 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 200px" }}>
                    <InputField label="Practice Name" value={practiceInfo.name} onChange={(v) => setPracticeInfo({ ...practiceInfo, name: v })} placeholder="e.g. Mindful Pathways Counseling" />
                  </div>
                  <div style={{ flex: "1 1 150px" }}>
                    <InputField label="NPI" value={practiceInfo.npi} onChange={(v) => setPracticeInfo({ ...practiceInfo, npi: v })} placeholder="e.g. 1234567890" />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 250px" }}>
                    <InputField label="Address" value={practiceInfo.address} onChange={(v) => setPracticeInfo({ ...practiceInfo, address: v })} placeholder="e.g. 123 Peachtree St, Atlanta, GA" />
                  </div>
                  <div style={{ flex: "1 1 150px" }}>
                    <InputField label="Phone" value={practiceInfo.phone} onChange={(v) => setPracticeInfo({ ...practiceInfo, phone: v })} placeholder="e.g. (404) 555-0123" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            <div style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              marginBottom: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid #eee",
            }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: BRAND.burgundy, marginBottom: 4, fontWeight: 700 }}>
                Session Notes
              </h3>
              <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.5 }}>
                Enter your bullet points, shorthand, or quick notes from the session. The AI will transform them into a polished {NOTE_FORMATS[format].label} note.
              </p>

              <PromptGuide format={format} />

              <TextArea
                label=""
                value={bulletPoints}
                onChange={setBulletPoints}
                rows={8}
                placeholder={format === "SOAP"
                  ? `Your bullets — the guide above shows what to include:\n\nS: Ct. reported increased anxiety since last session, sleeping 3-4 hrs\nO: Appeared fatigued, flat affect, PHQ-9 score 18\nA: Worsening depressive sx, moderate risk - passive SI no plan\nP: Continue weekly, refer to psychiatry, assigned thought record`
                  : format === "DAP"
                  ? `Your bullets — the guide above shows what to include:\n\nD: Ct. reported 4 panic attacks this week, explored triggers — all work-related. Introduced diaphragmatic breathing. GAD-7: 15. Ct. engaged, affect anxious.\nA: Anxiety escalating re: performance review. Responded well to breathing technique.\nP: Practice breathing 2x daily, introduce cognitive restructuring next session.`
                  : format === "BIRP"
                  ? `Your bullets — the guide above shows what to include:\n\nB: Ct. arrived agitated, reported argument with partner, pacing, rapid speech, drank 4 beers after\nI: MI exploring ambivalence, HALT check, 5-4-3-2-1 grounding\nR: Initially defensive, softened during values exploration, acknowledged avoidance pattern\nP: Use HALT check before next argument, track triggers in journal, next session Thursday`
                  : `Your bullets — the guide above shows what to include:\n\n- Ct. presented for regular session, reported improved mood since starting Lexapro\n- Session focused on grief processing — used empty chair technique\n- Ct. wept openly, expressed guilt about missing mother's last call\n- Demonstrates increasing capacity for emotional processing\n- Denied SI/HI, no safety concerns\n- Next session 1 week, continue grief work with narrative letter-writing`
                }
              />

              {error && (
                <div style={{
                  background: "#FFF5F5",
                  border: "1px solid #FED7D7",
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: "#C53030",
                  fontSize: 13,
                  marginBottom: 12,
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={generateNote}
                disabled={isGenerating}
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  background: isGenerating ? "#999" : `linear-gradient(135deg, ${BRAND.burgundy}, ${BRAND.burgundyLight})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'Lato', sans-serif",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: isGenerating ? "none" : "0 4px 12px rgba(107,29,52,0.3)",
                }}
              >
                {isGenerating ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Generating{loadingDots}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Generate {NOTE_FORMATS[format].label} Note
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === "result" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {generatedNote ? (
              <>
                <div style={{
                  background: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: "1px solid #eee",
                  marginBottom: 20,
                }}>
                  {/* Note Header */}
                  <div style={{
                    background: `linear-gradient(135deg, rgba(107,29,52,0.04), rgba(74,124,89,0.04))`,
                    padding: "16px 24px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: BRAND.burgundy }}>
                        {NOTE_FORMATS[format].label} Note — {clientInitials || "Ct."}
                      </div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                        {sessionDate} | {duration} min | {sessionType}
                        {modalities.length > 0 && ` | ${modalities.join(", ")}`}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={copyToClipboard}
                        style={{
                          padding: "8px 16px",
                          background: copied ? BRAND.green : "#fff",
                          color: copied ? "#fff" : BRAND.green,
                          border: `1.5px solid ${BRAND.green}`,
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "'Lato', sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          transition: "all 0.2s",
                        }}
                      >
                        {copied ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Note Content */}
                  <div
                    ref={noteRef}
                    style={{
                      padding: 24,
                      fontFamily: "'Lato', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.8,
                      color: "#333",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {generatedNote}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={resetForm}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      background: "#fff",
                      color: BRAND.navy,
                      border: "1.5px solid #ddd",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    New Note
                  </button>
                  <button
                    onClick={() => { setActiveTab("compose"); }}
                    style={{
                      flex: 1,
                      padding: "12px 20px",
                      background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.greenLight})`,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Lato', sans-serif",
                      boxShadow: "0 4px 12px rgba(74,124,89,0.3)",
                    }}
                  >
                    Edit & Regenerate
                  </button>
                </div>

                {/* Disclaimer */}
                <div style={{
                  marginTop: 20,
                  padding: "12px 16px",
                  background: "rgba(212,168,85,0.08)",
                  borderRadius: 8,
                  border: `1px solid rgba(212,168,85,0.2)`,
                  fontSize: 11,
                  color: "#888",
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: BRAND.gold }}>Clinical Responsibility Notice:</strong> This AI-generated note is a draft. You are responsible for reviewing, editing, and approving all clinical documentation before it becomes part of the client record. Always verify accuracy against your clinical judgment.
                </div>

                {/* Course Pitch — Billing & Medical Necessity */}
                <div style={{
                  marginTop: 20,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid rgba(107,29,52,0.15)`,
                  background: "#fff",
                }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${BRAND.burgundy}, ${BRAND.burgundyLight})`,
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BRAND.gold} strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#fff",
                    }}>
                      Writing the note is only half the battle.
                    </span>
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <p style={{ fontSize: 13.5px, color: "#444", lineHeight: 1.7, marginBottom: 14 }}>
                      A clean note doesn't guarantee a paid claim. If your documentation doesn't demonstrate
                      <strong style={{ color: BRAND.burgundy }}> medical necessity</strong>, insurers will deny it — and you'll
                      work for free. Most clinicians were never taught how to connect clinical language to billing
                      outcomes.
                    </p>
                    <div style={{
                      background: `rgba(107,29,52,0.04)`,
                      borderRadius: 8,
                      padding: "14px 16px",
                      marginBottom: 14,
                    }}>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 17,
                        fontWeight: 700,
                        color: BRAND.burgundy,
                        marginBottom: 8,
                      }}>
                        Mental Health Billing Essentials
                      </div>
                      <div style={{ fontSize: 12.5px, color: "#555", lineHeight: 1.7 }}>
                        <span style={{ fontWeight: 600, color: BRAND.navy }}>What you'll walk away with:</span>
                        {" "}How to write notes that satisfy medical necessity on the first read.
                        CPT code selection for individual, family, couples, and group sessions — and the documentation
                        each one requires. How to avoid the top 5 claim denial triggers. Modifier usage that doesn't
                        get flagged. Sliding scale documentation that protects you in an audit.
                        Real examples of notes that got denied vs. notes that got paid — side by side.
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: 6,
                          background: "rgba(74,124,89,0.1)", color: BRAND.green,
                          fontSize: 11, fontWeight: 700,
                        }}>NBCC Approved</span>
                        <span style={{
                          padding: "4px 10px", borderRadius: 6,
                          background: "rgba(212,168,85,0.1)", color: BRAND.gold,
                          fontSize: 11, fontWeight: 700,
                        }}>CE Credit</span>
                        <span style={{
                          padding: "4px 10px", borderRadius: 6,
                          background: "rgba(40,65,87,0.08)", color: BRAND.navy,
                          fontSize: 11, fontWeight: 700,
                        }}>Self-Paced</span>
                      </div>
                      <a
                        href="https://counselorready.com/courses"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "10px 20px",
                          background: `linear-gradient(135deg, ${BRAND.burgundy}, ${BRAND.burgundyLight})`,
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: "none",
                          fontFamily: "'Lato', sans-serif",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          boxShadow: "0 2px 8px rgba(107,29,52,0.25)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Explore the Course
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </a>
                    </div>
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #f0f0f0" }}>
                      <p style={{ fontSize: 11.5px, color: "#999", lineHeight: 1.6, margin: 0 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 700, fontSize: 13 }}>
                          <span style={{ color: BRAND.burgundy }}>Counselor</span>
                          <span style={{ color: BRAND.green }}>Ready</span>
                        </span>
                        {" "}— NBCC ACEP Provider #7760 | GA Integrated Therapeutic Perspectives LLC
                      </p>
                    </div>
                  </div>
                </div>

                {/* EHR Disclaimer */}
                <div style={{
                  marginTop: 16,
                  padding: "12px 16px",
                  background: "rgba(40,65,87,0.04)",
                  border: "1px solid rgba(40,65,87,0.1)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "#666",
                  lineHeight: 1.7,
                }}>
                  <strong style={{ color: BRAND.navy }}>This is a clinical tool, not an EHR.</strong>{" "}
                  CounselorReady generates documentation — it does not store, manage, or secure your client records. Copy this note into your own HIPAA-compliant record-keeping system (EHR, encrypted cloud folder, or secured local storage) immediately after review. Regularly evaluate your practice needs and transition to a full EHR when your caseload requires it.{" "}
                  <a href="/tools/" style={{ color: BRAND.navy, fontWeight: 600, textDecoration: "none" }}>Record-keeping guidance →</a>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ marginBottom: 16 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div style={{ fontSize: 16, marginBottom: 8 }}>No note generated yet</div>
                <div style={{ fontSize: 13 }}>Go to the Compose tab to create your note.</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>
    </div>
  );
}
