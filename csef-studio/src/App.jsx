import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2, Sparkles, Copy, Check, AlertCircle, ArrowLeft,
  ClipboardCheck, Search, FileText, LayoutGrid, CalendarClock, SlidersHorizontal,
  ChevronRight, RefreshCw, Lightbulb, Building2
} from 'lucide-react';

const STORAGE_KEY = 'csef-studio-state-v1';

// ─────────── PALETTE (CSEF Luxury Architectural) ───────────
const C = {
  // Backgrounds
  white: '#FFFFFF',
  paper: '#F4F1E9',
  paperWarm: '#EDE8DB',
  paperAlt: '#E8E2D1',
  panel: '#FBFAF6',

  // Glass panels — translucent surfaces
  glass: 'rgba(251, 250, 246, 0.85)',
  glassStrong: 'rgba(255, 255, 255, 0.92)',
  glassHover: 'rgba(255, 255, 255, 0.96)',

  // Text
  ink: '#0A1929',
  inkSoft: '#1F2C3E',
  inkMuted: '#5A6478',
  inkFaded: '#98A0AF',

  // Blues
  blue: '#0069B4',
  blueDark: '#004F87',
  blueDeep: '#002B4E',
  blueBright: '#1E96D2',
  blueSky: '#C3E1F0',
  blueSkySoft: '#E4EEF5',

  // Brass
  brass: '#B8935C',
  brassLight: '#D4B784',
  brassPale: '#F5EFE2',

  // Rules
  rule: '#DDD5C0',
  ruleStrong: '#C6BB9E',
  ruleBlue: '#B5C8DA',

  success: '#059669',

  // Gradients
  gradBlue: 'linear-gradient(135deg, #0069B4 0%, #004F87 50%, #002B4E 100%)',
  gradBlueHover: 'linear-gradient(135deg, #004F87 0%, #002B4E 50%, #001A32 100%)',
  gradPanel: 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(251,250,246,0.85) 100%)',
  gradHeader: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,241,233,0.85) 100%)',
  gradIcon: 'linear-gradient(145deg, #1E96D2 0%, #0069B4 40%, #002B4E 100%)',
  gradIconInset: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, transparent 40%)',

  // Glass-panel shadow system — real floating feel
  shadowSm: '0 1px 2px rgba(10, 25, 41, 0.06), 0 1px 1px rgba(10, 25, 41, 0.03)',
  shadowMd: `
    0 6px 16px rgba(10, 25, 41, 0.06),
    0 3px 6px rgba(10, 25, 41, 0.04),
    0 1px 2px rgba(10, 25, 41, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.9)
  `,
  shadowLg: `
    0 20px 40px rgba(10, 25, 41, 0.10),
    0 10px 20px rgba(0, 43, 78, 0.08),
    0 4px 8px rgba(10, 25, 41, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.95)
  `,
  shadowXl: `
    0 30px 60px rgba(0, 43, 78, 0.14),
    0 16px 32px rgba(0, 43, 78, 0.10),
    0 6px 12px rgba(10, 25, 41, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.95)
  `,
  // Illuminated icon — depth + inner light
  shadowIcon: `
    0 6px 16px rgba(0, 105, 180, 0.35),
    0 2px 6px rgba(0, 43, 78, 0.20),
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -1px 0 rgba(0, 43, 78, 0.30)
  `,
  shadowIconHover: `
    0 10px 24px rgba(0, 105, 180, 0.45),
    0 4px 10px rgba(0, 43, 78, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 43, 78, 0.35)
  `,
  // Button — real illuminated push feel
  shadowButton: `
    0 8px 20px rgba(0, 105, 180, 0.30),
    0 3px 6px rgba(0, 43, 78, 0.20),
    inset 0 1px 0 rgba(255, 255, 255, 0.30),
    inset 0 -2px 0 rgba(0, 43, 78, 0.25)
  `,
  shadowButtonHover: `
    0 12px 28px rgba(0, 105, 180, 0.40),
    0 5px 10px rgba(0, 43, 78, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -2px 0 rgba(0, 43, 78, 0.30)
  `,
};

// ─────────── MARKDOWN RENDERING ───────────

function markdownToPlainText(md) {
  if (!md) return '';
  return md
    .replace(/═+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/^[\s]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function InlineBold({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ fontWeight: 600, color: C.ink }}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function MarkdownOutput({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const blocks = [];
  let currentList = null;
  let currentQuote = null;

  const flushList = () => {
    if (currentList) {
      blocks.push({ type: currentList.type, items: currentList.items });
      currentList = null;
    }
  };
  const flushQuote = () => {
    if (currentQuote) {
      blocks.push({ type: 'quote', lines: currentQuote });
      currentQuote = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // ═══ SECTION HEADER ═══ (legacy support)
    if (/^═+/.test(trimmed) && /═+$/.test(trimmed)) {
      flushList(); flushQuote();
      const label = trimmed.replace(/═+/g, '').trim();
      if (label) blocks.push({ type: 'section', text: label });
      continue;
    }

    // ## Headings
    const headingMatch = /^(#{1,4})\s+(.+)/.exec(trimmed);
    if (headingMatch) {
      flushList(); flushQuote();
      const level = headingMatch[1].length;
      const cleanText = headingMatch[2]
        .replace(/^═+\s*/, '').replace(/\s*═+$/, '')
        .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+\s*/u, '')
        .trim();
      if (level <= 2) {
        blocks.push({ type: 'section', text: cleanText });
      } else {
        blocks.push({ type: 'heading', level, text: cleanText });
      }
      continue;
    }

    // Bare ALL CAPS line = section header
    if (
      trimmed.length > 0 &&
      trimmed.length < 90 &&
      /^[A-Z][A-Z0-9\s\-—/&(),':.]+$/.test(trimmed) &&
      /[A-Z]{3}/.test(trimmed) &&
      !trimmed.endsWith(':') &&
      !trimmed.endsWith('.')
    ) {
      flushList(); flushQuote();
      blocks.push({ type: 'section', text: trimmed });
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushList();
      if (!currentQuote) currentQuote = [];
      currentQuote.push(trimmed.replace(/^>\s?/, ''));
      continue;
    }
    flushQuote();

    if (/^[-•]\s+/.test(trimmed)) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(trimmed.replace(/^[-•]\s+/, ''));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(trimmed.replace(/^\d+\.\s+/, ''));
      continue;
    }
    flushList();

    if (trimmed === '') {
      blocks.push({ type: 'break' });
      continue;
    }

    blocks.push({ type: 'paragraph', text: trimmed });
  }
  flushList(); flushQuote();

  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'section':
            return (
              <div key={i} style={{
                marginTop: i === 0 ? 0 : 32, marginBottom: 16,
                paddingTop: 20, paddingBottom: 8,
              }}>
                <div style={{
                  height: 1,
                  background: `linear-gradient(90deg, ${C.blueDeep} 0%, ${C.blue} 40%, ${C.rule} 100%)`,
                  marginBottom: 12,
                }} />
                <div className="mono" style={{
                  fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
                  color: C.brass, fontWeight: 700, marginBottom: 2,
                }}>Section</div>
                <div className="display-heavy" style={{
                  fontSize: 18, color: C.blueDeep, letterSpacing: '-0.015em',
                }}>{block.text}</div>
              </div>
            );
          case 'heading':
            return (
              <div key={i} className="display" style={{
                fontSize: block.level === 1 ? 22 : block.level === 2 ? 19 : 17,
                color: C.ink, marginTop: 20, marginBottom: 10, lineHeight: 1.25, fontWeight: 500,
              }}>
                <InlineBold text={block.text} />
              </div>
            );
          case 'paragraph':
            return (
              <p key={i} style={{ margin: '0 0 14px', lineHeight: 1.7, color: C.inkSoft, fontSize: 15 }}>
                <InlineBold text={block.text} />
              </p>
            );
          case 'ul':
            return (
              <ul key={i} style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.6 }}>
                {block.items.map((it, j) => (
                  <li key={j} style={{ marginBottom: 6, color: C.inkSoft, fontSize: 15 }}>
                    <InlineBold text={it} />
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} style={{ margin: '0 0 16px', paddingLeft: 22, lineHeight: 1.6 }}>
                {block.items.map((it, j) => (
                  <li key={j} style={{ marginBottom: 6, color: C.inkSoft, fontSize: 15 }}>
                    <InlineBold text={it} />
                  </li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={i} style={{
                margin: '12px 0 16px', padding: '10px 16px',
                borderLeft: `3px solid ${C.blue}`, background: C.blueSkySoft,
                fontStyle: 'italic', color: C.inkSoft, lineHeight: 1.6,
              }}>
                {block.lines.map((l, j) => (
                  <div key={j} style={{ marginBottom: j < block.lines.length - 1 ? 6 : 0 }}>
                    <InlineBold text={l} />
                  </div>
                ))}
              </blockquote>
            );
          case 'break':
            return <div key={i} style={{ height: 8 }} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// ─────────── PERSISTENCE ───────────

const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return {};
};

const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
};

// ─────────── MODES ───────────

const MODES = {
  interviewPrep: {
    id: 'interviewPrep',
    category: 'pre-event',
    icon: ClipboardCheck,
    title: 'Interview Prep Sheet',
    tagline: 'Show up sharp and memorable',
    description: 'For guests being interviewed on the CSEF podcast. Generate story angles, talking points, anticipated questions with draft answers, and a signature story to have ready.',
    buttonLabel: 'Build my prep sheet',
    inputs: [
      { key: 'guestName', label: 'Guest name', placeholder: 'e.g., Alex Lasry', required: true },
      { key: 'guestRole', label: 'Role / title', placeholder: 'e.g., CEO' },
      { key: 'guestCompany', label: 'Company / organization', placeholder: 'e.g., FIFA World Cup 26 NYNJ Host Committee' },
      { key: 'guestExpertise', label: 'Areas of expertise / topics to cover', placeholder: 'What are they known for? What do they want to talk about?', multiline: true, rows: 4 },
      { key: 'additionalContext', label: 'Anything else worth knowing (optional)', placeholder: 'Recent projects, upcoming initiatives, unique angles...', multiline: true, rows: 3 },
    ],
  },
  showPrep: {
    id: 'showPrep',
    category: 'pre-event',
    icon: Search,
    title: 'Host Prep Brief',
    tagline: 'Research the guest, plan the arc',
    description: 'For the CSEF podcast host. AI researches the guest online and delivers a snapshot, recent work, 10 ranked interview questions, questions to avoid, and clip-worthy moments to steer toward.',
    buttonLabel: 'Research and prep',
    hasWebSearch: true,
    inputs: [
      { key: 'guestName', label: 'Guest name', placeholder: 'e.g., Meg Kane', required: true },
      { key: 'guestRole', label: 'Role / title', placeholder: 'e.g., Host City Executive' },
      { key: 'guestCompany', label: 'Company / organization', placeholder: 'e.g., Philadelphia Soccer 2026' },
      { key: 'knownTopics', label: 'Anything you already know we should focus on (optional)', placeholder: 'Recent news, specific projects, angles you want to cover...', multiline: true, rows: 3 },
    ],
  },
  contentFromInterview: {
    id: 'contentFromInterview',
    category: 'post-event',
    icon: LayoutGrid,
    title: 'Content Package',
    tagline: 'Complete post-interview kit',
    description: 'Full content package from a completed interview: 10 quotable moments, 5 LinkedIn posts for CSEF, 5 LinkedIn posts for the interviewee, 3 clip concepts, 3 follow-up content ideas.',
    buttonLabel: 'Generate content package',
    inputs: [
      { key: 'guestName', label: 'Guest name', placeholder: 'e.g., Kellen DeCoursey' },
      { key: 'guestRole', label: 'Role / title', placeholder: 'e.g., Project Executive' },
      { key: 'guestCompany', label: 'Company / organization', placeholder: 'e.g., Tennessee Titans' },
      { key: 'transcript', label: 'Interview transcript', placeholder: 'Paste the full transcript here...', multiline: true, rows: 12, required: true },
    ],
  },
  showNotes: {
    id: 'showNotes',
    category: 'post-event',
    icon: FileText,
    title: 'Show Notes',
    tagline: 'Episode descriptions and metadata',
    description: 'Professional show notes for Apple Podcasts, Spotify, and other platforms. Includes 3 title options, short/long descriptions, timestamps, guest bio, resources, and SEO tags.',
    buttonLabel: 'Write show notes',
    inputs: [
      { key: 'guestName', label: 'Guest name', placeholder: 'e.g., Monica Paul' },
      { key: 'guestRole', label: 'Role / title', placeholder: 'e.g., Executive Director' },
      { key: 'guestCompany', label: 'Company / organization', placeholder: 'e.g., Dallas Sports Commission' },
      { key: 'transcript', label: 'Transcript OR episode summary', placeholder: 'Paste the full transcript or a summary of what was covered...', multiline: true, rows: 10, required: true },
    ],
  },
  linkedinPlaybook: {
    id: 'linkedinPlaybook',
    category: 'post-event',
    icon: CalendarClock,
    title: '8-Week LinkedIn Playbook',
    tagline: 'Personal-brand rollout for interviewees',
    description: 'A suggested 8-week LinkedIn rollout schedule for someone who appeared on the podcast. Each week gets a specific post with full text, visual guidance, hashtags, and timing.',
    buttonLabel: 'Build my rollout',
    inputs: [
      { key: 'guestName', label: 'Your name', placeholder: 'e.g., Travis Goff', required: true },
      { key: 'guestRole', label: 'Your role / title', placeholder: 'e.g., Director of Athletics / Vice Chancellor' },
      { key: 'guestCompany', label: 'Your organization', placeholder: 'e.g., University of Kansas' },
      { key: 'interviewHighlights', label: 'Interview highlights or transcript', placeholder: 'Paste the transcript OR summarize the key topics you covered in the interview...', multiline: true, rows: 10, required: true },
    ],
  },
  publishingOptimizer: {
    id: 'publishingOptimizer',
    category: 'post-event',
    icon: SlidersHorizontal,
    title: 'Publishing Optimizer',
    tagline: 'Platform-tuned metadata',
    description: 'Titles, descriptions, and metadata optimized for Apple Podcasts, Spotify, and YouTube. Includes exact character counts, YouTube chapters, thumbnail text ideas, and keyword strategy.',
    buttonLabel: 'Optimize for platforms',
    inputs: [
      { key: 'guestName', label: 'Guest name' },
      { key: 'guestRole', label: 'Role / title' },
      { key: 'guestCompany', label: 'Company / organization' },
      { key: 'episodeContent', label: 'Episode summary or transcript', placeholder: 'Paste transcript OR a good summary of what was covered...', multiline: true, rows: 10, required: true },
    ],
  },
};

const MODE_ORDER = ['interviewPrep', 'showPrep', 'contentFromInterview', 'showNotes', 'linkedinPlaybook', 'publishingOptimizer'];

// ─────────── MAIN APP ───────────

export default function App() {
  const [screen, setScreen] = useState('home'); // home | mode
  const [currentModeId, setCurrentModeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const [state, setState] = useState(() => {
    const stored = loadState();
    return {
      // Global context — used across every generation
      audience: stored.audience || '',
      voice: stored.voice || '',
      goals: stored.goals || '',
      // Per-mode inputs
      inputs: stored.inputs || {},
      // Per-mode outputs
      outputs: stored.outputs || {},
    };
  });

  useEffect(() => { saveState(state); }, [state]);

  const currentMode = currentModeId ? MODES[currentModeId] : null;

  const updateInput = useCallback((modeId, key, value) => {
    setState(prev => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [modeId]: { ...(prev.inputs[modeId] || {}), [key]: value },
      },
    }));
  }, []);

  const updateContext = useCallback((key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const callBackend = async (mode, payload) => {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, payload }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Try again in a moment.');
    }
    const data = await response.json();
    return data.result;
  };

  const handleGenerate = async () => {
    if (!currentMode) return;
    const modeInputs = state.inputs[currentMode.id] || {};

    // Validate required fields
    for (const inp of currentMode.inputs) {
      if (inp.required && !((modeInputs[inp.key] || '').trim())) {
        setError(`"${inp.label}" is required.`);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setState(prev => ({
      ...prev,
      outputs: { ...prev.outputs, [currentMode.id]: '' },
    }));

    try {
      const payload = {
        ...modeInputs,
        audience: state.audience,
        voice: state.voice,
        goals: state.goals,
      };
      const result = await callBackend(currentMode.id, payload);
      setState(prev => ({
        ...prev,
        outputs: { ...prev.outputs, [currentMode.id]: result },
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const enterMode = (modeId) => {
    setCurrentModeId(modeId);
    setScreen('mode');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setScreen('home');
    setCurrentModeId(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyOutput = async () => {
    const output = state.outputs[currentMode?.id];
    if (!output) return;
    await navigator.clipboard.writeText(markdownToPlainText(output));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearInput = (key) => {
    if (confirm('Clear this field?')) {
      updateInput(currentMode.id, key, '');
    }
  };

  return (
    <div className="min-h-screen">
      <Header onHome={goHome} />

      {screen === 'home' && (
        <HomeView onEnterMode={enterMode} state={state} updateContext={updateContext} />
      )}

      {screen === 'mode' && currentMode && (
        <ModeView
          mode={currentMode}
          inputs={state.inputs[currentMode.id] || {}}
          output={state.outputs[currentMode.id] || ''}
          loading={loading}
          error={error}
          copied={copied}
          onUpdateInput={(k, v) => updateInput(currentMode.id, k, v)}
          onClearInput={clearInput}
          onGenerate={handleGenerate}
          onCopy={copyOutput}
          onHome={goHome}
        />
      )}
    </div>
  );
}

// ─────────── HEADER ───────────

function Header({ onHome }) {
  return (
    <header style={{
      background: C.gradHeader,
      backdropFilter: 'blur(20px) saturate(1.1)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.1)',
      borderBottom: `1px solid ${C.rule}`,
      boxShadow: `
        0 12px 32px rgba(10, 25, 41, 0.08),
        0 4px 12px rgba(0, 43, 78, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.9),
        inset 0 -1px 0 rgba(0, 43, 78, 0.02)
      `,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Illuminated brass hairline */}
      <div style={{
        position: 'absolute',
        bottom: -1,
        left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent 0%, ${C.brass} 25%, ${C.brassLight} 50%, ${C.brass} 75%, transparent 100%)`,
        opacity: 0.7,
        boxShadow: '0 0 12px rgba(184, 147, 92, 0.3)',
      }} />
      {/* Corner brackets — architectural drawing callout style */}
      <div style={{
        position: 'absolute', top: 8, left: 8,
        width: 10, height: 10,
        borderTop: `1px solid ${C.brass}`, borderLeft: `1px solid ${C.brass}`,
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute', top: 8, right: 8,
        width: 10, height: 10,
        borderTop: `1px solid ${C.brass}`, borderRight: `1px solid ${C.brass}`,
        opacity: 0.5,
      }} />

      <div className="max-w-5xl mx-auto px-6 py-5">
        <button onClick={onHome} className="flex items-center gap-5 group" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <img
            src="/csef-logo.png"
            alt="CSEF — Convention, Sports & Entertainment Facilities Conference"
            style={{
              height: 60, width: 'auto', display: 'block',
              filter: 'drop-shadow(0 2px 4px rgba(0, 43, 78, 0.15))',
            }}
          />
          <div style={{
            borderLeft: `1px solid ${C.ruleStrong}`,
            paddingLeft: 20,
            textAlign: 'left',
          }}>
            <div className="mono" style={{
              fontSize: 10,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: C.brass,
              marginBottom: 4,
              fontWeight: 700,
            }}>
              Content Studio
            </div>
            <div className="display" style={{
              color: C.blueDeep,
              fontSize: 19,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}>
              Podcast Programming Platform
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}

// ─────────── HOME ───────────

function HomeView({ onEnterMode, state, updateContext }) {
  const [showContext, setShowContext] = useState(false);
  const preEventModes = MODE_ORDER.filter(id => MODES[id].category === 'pre-event');
  const postEventModes = MODE_ORDER.filter(id => MODES[id].category === 'post-event');

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 fade-up">
      {/* Hero */}
      <div className="mb-12">
        <div className="mono" style={{
          fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: C.brass, marginBottom: 16, fontWeight: 600,
        }}>
          <span style={{ color: C.inkFaded }}>01 &nbsp;/&nbsp; </span>The Convention, Sports &amp; Entertainment Facilities Conference
        </div>
        <h1 className="display-heavy" style={{
          fontSize: 52, color: C.ink, marginBottom: 20,
          lineHeight: 1.02, maxWidth: 780,
        }}>
          A content platform<br />
          <span style={{ color: C.blueDeep, fontStyle: 'italic', fontWeight: 400 }}>for the CSEF podcast.</span>
        </h1>
        <p style={{ fontSize: 18, color: C.inkMuted, lineHeight: 1.6, maxWidth: 680, fontWeight: 400 }}>
          Prep for your interview, generate post-event content, and build an 8-week LinkedIn rollout — all in one considered environment. Built for CSEF sponsors, interviewees, and the P3C content team.
        </p>
      </div>

      {/* Global context (collapsible) */}
      <div style={{
        border: `1px solid ${C.rule}`,
        background: C.glass,
        backdropFilter: 'blur(12px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.05)',
        marginBottom: 48,
        boxShadow: C.shadowMd,
        position: 'relative',
      }}>
        {/* Corner brackets */}
        <div style={{
          position: 'absolute', top: 6, left: 6, width: 10, height: 10,
          borderTop: `1px solid ${C.brassLight}`, borderLeft: `1px solid ${C.brassLight}`,
          opacity: 0.5,
        }} />
        <div style={{
          position: 'absolute', top: 6, right: 6, width: 10, height: 10,
          borderTop: `1px solid ${C.brassLight}`, borderRight: `1px solid ${C.brassLight}`,
          opacity: 0.5,
        }} />

        <button
          onClick={() => setShowContext(!showContext)}
          className="w-full flex items-center justify-between"
          style={{ padding: '20px 26px', background: 'transparent', border: 'none' }}
        >
          <div className="flex items-center gap-4">
            <div style={{
              width: 36, height: 36,
              background: C.brassPale,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(184, 147, 92, 0.15)`,
            }}>
              <Building2 size={15} style={{ color: C.brass }} strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, letterSpacing: '-0.005em' }}>
                Session context
              </div>
              <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 3 }}>
                {state.audience || state.voice || state.goals
                  ? 'Custom context is being applied to all generations'
                  : 'Optional — add specifics that apply across every tool'}
              </div>
            </div>
          </div>
          <ChevronRight size={16} style={{
            color: C.inkMuted,
            transform: showContext ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </button>
        {showContext && (
          <div style={{ padding: '4px 26px 24px', borderTop: `1px solid ${C.rule}` }}>
            <ContextField
              label="Audience refinement"
              hint="Anything specific about who's being reached — e.g., 'FIFA World Cup host city officials specifically' or 'Kansas City delegation'"
              value={state.audience}
              onChange={v => updateContext('audience', v)}
            />
            <ContextField
              label="Voice notes"
              hint="Tone adjustments beyond the default — e.g., 'Skew more data-driven than narrative' or 'Emphasize public-sector angle'"
              value={state.voice}
              onChange={v => updateContext('voice', v)}
            />
            <ContextField
              label="Content goals"
              hint="What we're optimizing for — e.g., 'Drive sponsor lead generation' or 'Build attendee retention for 2027'"
              value={state.goals}
              onChange={v => updateContext('goals', v)}
            />
          </div>
        )}
      </div>

      {/* Pre-event section */}
      <div className="mb-14">
        <SectionHeader
          number="02"
          eyebrow="Before The Interview"
          title="Show up prepared"
          description="Whether you're the guest getting interviewed or the host preparing to conduct the conversation, walk in ready."
        />
        <div className="grid md:grid-cols-2 gap-5">
          {preEventModes.map(id => (
            <ModeCard key={id} mode={MODES[id]} onClick={() => onEnterMode(id)} hasOutput={!!state.outputs[id]} />
          ))}
        </div>
      </div>

      {/* Post-event section */}
      <div className="mb-14">
        <SectionHeader
          number="03"
          eyebrow="After The Interview"
          title="Turn one conversation into 8 weeks of content"
          description="Post-interview content generation for CSEF's marketing, the interviewee's personal brand, and every publishing platform."
        />
        <div className="grid md:grid-cols-2 gap-5">
          {postEventModes.map(id => (
            <ModeCard key={id} mode={MODES[id]} onClick={() => onEnterMode(id)} hasOutput={!!state.outputs[id]} />
          ))}
        </div>
      </div>

      {/* First-time tip */}
      <div style={{
        background: `rgba(245, 239, 226, 0.7)`,
        backdropFilter: 'blur(12px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.05)',
        border: `1px solid ${C.brassLight}`,
        borderLeft: `3px solid ${C.brass}`,
        padding: '22px 26px',
        marginTop: 32,
        boxShadow: C.shadowMd,
        position: 'relative',
      }}>
        {/* Corner brackets */}
        <div style={{
          position: 'absolute', top: 6, right: 6, width: 10, height: 10,
          borderTop: `1px solid ${C.brass}`, borderRight: `1px solid ${C.brass}`,
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', bottom: 6, right: 6, width: 10, height: 10,
          borderBottom: `1px solid ${C.brass}`, borderRight: `1px solid ${C.brass}`,
          opacity: 0.6,
        }} />

        <div className="flex items-start gap-4">
          <Lightbulb size={18} style={{ color: C.brass }} className="flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <div className="mono" style={{
              fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
              color: C.brass, fontWeight: 700, marginBottom: 8,
            }}>
              First time using this
            </div>
            <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.65 }}>
              If you're a sponsor or speaker being interviewed, start with <strong style={{ color: C.blueDeep }}>Interview Prep Sheet</strong>. After your interview, use <strong style={{ color: C.blueDeep }}>Content Package</strong> and then <strong style={{ color: C.blueDeep }}>8-Week LinkedIn Playbook</strong> to extend the value of your appearance. Your inputs auto-save as you type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, number }) {
  return (
    <div className="mb-6">
      <div className="mono" style={{
        fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
        color: C.brass, fontWeight: 600, marginBottom: 10,
      }}>
        {number && <span style={{ color: C.inkFaded }}>{number} &nbsp;/&nbsp; </span>}{eyebrow}
      </div>
      <h2 className="display-heavy" style={{
        fontSize: 32, color: C.ink, marginBottom: 8, lineHeight: 1.1,
      }}>
        {title}
      </h2>
      <p style={{ fontSize: 16, color: C.inkMuted, lineHeight: 1.6, maxWidth: 640 }}>
        {description}
      </p>
    </div>
  );
}

function ModeCard({ mode, onClick, hasOutput }) {
  const Icon = mode.icon;
  const [isHover, setIsHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="text-left group"
      style={{
        border: `1px solid ${isHover ? C.blueDeep : C.rule}`,
        background: isHover ? C.glassHover : C.glass,
        backdropFilter: 'blur(16px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
        padding: '26px 24px',
        boxShadow: isHover ? C.shadowXl : C.shadowMd,
        transform: isHover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
      }}
    >
      {/* Corner brackets — architectural drawing marks */}
      <div style={{
        position: 'absolute', top: 6, left: 6,
        width: 10, height: 10,
        borderTop: `1px solid ${isHover ? C.brass : C.brassLight}`,
        borderLeft: `1px solid ${isHover ? C.brass : C.brassLight}`,
        opacity: isHover ? 0.9 : 0.5,
        transition: 'opacity 320ms ease',
      }} />
      <div style={{
        position: 'absolute', top: 6, right: 6,
        width: 10, height: 10,
        borderTop: `1px solid ${isHover ? C.brass : C.brassLight}`,
        borderRight: `1px solid ${isHover ? C.brass : C.brassLight}`,
        opacity: isHover ? 0.9 : 0.5,
        transition: 'opacity 320ms ease',
      }} />
      <div style={{
        position: 'absolute', bottom: 6, left: 6,
        width: 10, height: 10,
        borderBottom: `1px solid ${isHover ? C.brass : C.brassLight}`,
        borderLeft: `1px solid ${isHover ? C.brass : C.brassLight}`,
        opacity: isHover ? 0.9 : 0.5,
        transition: 'opacity 320ms ease',
      }} />
      <div style={{
        position: 'absolute', bottom: 6, right: 6,
        width: 10, height: 10,
        borderBottom: `1px solid ${isHover ? C.brass : C.brassLight}`,
        borderRight: `1px solid ${isHover ? C.brass : C.brassLight}`,
        opacity: isHover ? 0.9 : 0.5,
        transition: 'opacity 320ms ease',
      }} />

      <div className="flex items-start gap-5" style={{ position: 'relative' }}>
        {/* Illuminated icon panel */}
        <div style={{
          width: 48, height: 48,
          background: C.gradIcon,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isHover ? C.shadowIconHover : C.shadowIcon,
          position: 'relative',
          transition: 'all 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Inner light highlight — top-left specular */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: C.gradIconInset,
            pointerEvents: 'none',
          }} />
          <Icon size={22} style={{ color: C.white, position: 'relative', zIndex: 1 }} strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="display" style={{
              fontSize: 19, fontWeight: 500, color: C.ink, lineHeight: 1.2,
              letterSpacing: '-0.015em',
            }}>
              {mode.title}
            </div>
            {hasOutput && (
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: C.success,
                boxShadow: `0 0 0 3px rgba(5, 150, 105, 0.15), 0 0 8px rgba(5, 150, 105, 0.4)`,
              }} title="Has saved output" />
            )}
          </div>
          <div className="mono" style={{
            fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: C.brass, marginBottom: 10, fontWeight: 700,
          }}>
            {mode.tagline}
          </div>
          <p style={{ fontSize: 13.5, color: C.inkMuted, lineHeight: 1.6, marginBottom: 0 }}>
            {mode.description}
          </p>
        </div>
      </div>
    </button>
  );
}

function ContextField({ label, hint, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 4,
      }}>
        {label}
      </label>
      <div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 6 }}>{hint}</div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Optional"
        style={{
          width: '100%', padding: '8px 12px', border: `1px solid ${C.rule}`,
          background: C.paper, color: C.ink, fontSize: 14,
        }}
      />
    </div>
  );
}

// ─────────── MODE VIEW ───────────

function ModeView({ mode, inputs, output, loading, error, copied, onUpdateInput, onClearInput, onGenerate, onCopy, onHome }) {
  const Icon = mode.icon;
  return (
    <div className="max-w-4xl mx-auto px-6 py-6 fade-up">
      {/* Breadcrumb */}
      <button onClick={onHome} className="mono flex items-center gap-2 mb-6 transition-colors"
        style={{
          fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: C.inkMuted, fontWeight: 500,
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.blue}
        onMouseLeave={e => e.currentTarget.style.color = C.inkMuted}>
        <ArrowLeft size={13} /> All tools
      </button>

      {/* Title */}
      <div className="flex items-start gap-5 mb-10">
        <div style={{
          width: 60, height: 60,
          background: C.gradIcon,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: C.shadowIconHover,
          position: 'relative',
        }}>
          {/* Inner light highlight */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: C.gradIconInset,
            pointerEvents: 'none',
          }} />
          <Icon size={26} style={{ color: C.white, position: 'relative', zIndex: 1 }} strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <div className="mono" style={{
            fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: C.brass, marginBottom: 6, fontWeight: 700,
          }}>
            {mode.tagline}
          </div>
          <h1 className="display-heavy" style={{
            fontSize: 42, color: C.ink, lineHeight: 1.02,
            marginBottom: 12,
          }}>
            {mode.title}
          </h1>
          <p style={{ fontSize: 16, color: C.inkMuted, lineHeight: 1.6, maxWidth: 600 }}>
            {mode.description}
          </p>
        </div>
      </div>

      {mode.hasWebSearch && (
        <div style={{
          border: `1px solid ${C.brassLight}`,
          background: C.brassPale,
          padding: '12px 18px',
          marginBottom: 24,
          fontSize: 13,
          color: C.inkSoft,
          boxShadow: C.shadowSm,
        }}>
          <span className="mono" style={{
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: C.brass, fontWeight: 700,
          }}>
            Uses Web Search
          </span>
          <span style={{ color: C.inkMuted }}>{' — '}This tool researches your guest online. Takes 30-90 seconds.</span>
        </div>
      )}

      {/* Inputs */}
      <div style={{
        border: `1px solid ${C.rule}`,
        background: C.glassStrong,
        backdropFilter: 'blur(16px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.05)',
        padding: 32, marginBottom: 24,
        boxShadow: C.shadowLg,
        position: 'relative',
      }}>
        {/* Corner brackets */}
        <div style={{
          position: 'absolute', top: 8, left: 8, width: 12, height: 12,
          borderTop: `1px solid ${C.brass}`, borderLeft: `1px solid ${C.brass}`,
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', top: 8, right: 8, width: 12, height: 12,
          borderTop: `1px solid ${C.brass}`, borderRight: `1px solid ${C.brass}`,
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', bottom: 8, left: 8, width: 12, height: 12,
          borderBottom: `1px solid ${C.brass}`, borderLeft: `1px solid ${C.brass}`,
          opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', bottom: 8, right: 8, width: 12, height: 12,
          borderBottom: `1px solid ${C.brass}`, borderRight: `1px solid ${C.brass}`,
          opacity: 0.6,
        }} />
        {/* Illuminated brass top hairline */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${C.brassLight} 30%, ${C.brassLight} 70%, transparent 100%)`,
          opacity: 0.6,
        }} />

        {mode.inputs.map(inp => (
          <InputField
            key={inp.key}
            input={inp}
            value={inputs[inp.key] || ''}
            onChange={v => onUpdateInput(inp.key, v)}
            onClear={() => onClearInput(inp.key)}
          />
        ))}

        <button
          onClick={onGenerate}
          disabled={loading}
          style={{
            width: '100%', padding: '18px', marginTop: 16,
            background: loading ? C.inkFaded : C.gradBlue,
            color: C.white, border: 'none',
            fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            boxShadow: loading ? 'none' : C.shadowButton,
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.background = C.gradBlueHover;
              e.currentTarget.style.boxShadow = C.shadowButtonHover;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              e.currentTarget.style.background = C.gradBlue;
              e.currentTarget.style.boxShadow = C.shadowButton;
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {/* Specular top highlight on button */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Working on it</>
            : <><Sparkles size={14} strokeWidth={1.8} /> {mode.buttonLabel}</>}
        </button>

        {loading && (
          <p style={{
            marginTop: 12, textAlign: 'center', fontSize: 12,
            color: C.inkMuted, fontStyle: 'italic',
          }}>
            Usually 15-60 seconds. Web search modes can take longer.
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          border: `1px solid ${C.blueDark}`, background: C.blueSkySoft,
          padding: 16, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <AlertCircle size={18} style={{ color: C.blueDark, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div className="mono" style={{
              fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: C.blueDark, fontWeight: 600, marginBottom: 4,
            }}>
              Heads up
            </div>
            <div style={{ fontSize: 14, color: C.ink }}>{error}</div>
          </div>
        </div>
      )}

      {/* Output */}
      {output && (
        <div style={{
          border: `1px solid ${C.rule}`,
          background: C.glassStrong,
          backdropFilter: 'blur(20px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.1)',
          marginBottom: 24,
          boxShadow: C.shadowXl,
          position: 'relative',
        }}>
          {/* Top illuminated blue accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${C.blueDeep} 0%, ${C.blue} 50%, ${C.blueBright} 100%)`,
            boxShadow: '0 0 12px rgba(0, 105, 180, 0.4)',
          }} />
          {/* Corner brackets */}
          <div style={{
            position: 'absolute', top: 10, left: 10, width: 12, height: 12,
            borderTop: `1px solid ${C.brass}`, borderLeft: `1px solid ${C.brass}`,
            opacity: 0.6,
          }} />
          <div style={{
            position: 'absolute', top: 10, right: 10, width: 12, height: 12,
            borderTop: `1px solid ${C.brass}`, borderRight: `1px solid ${C.brass}`,
            opacity: 0.6,
          }} />
          <div style={{
            position: 'absolute', bottom: 10, left: 10, width: 12, height: 12,
            borderBottom: `1px solid ${C.brass}`, borderLeft: `1px solid ${C.brass}`,
            opacity: 0.6,
          }} />
          <div style={{
            position: 'absolute', bottom: 10, right: 10, width: 12, height: 12,
            borderBottom: `1px solid ${C.brass}`, borderRight: `1px solid ${C.brass}`,
            opacity: 0.6,
          }} />

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '22px 30px',
            background: C.gradPanel,
            borderBottom: `1px solid ${C.rule}`,
          }}>
            <div>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
                color: C.brass, fontWeight: 700, marginBottom: 4,
              }}>
                Output
              </div>
              <div className="display" style={{ fontSize: 20, fontWeight: 500, color: C.ink, letterSpacing: '-0.015em' }}>
                Your Result
              </div>
            </div>
            <button
              onClick={onCopy}
              style={{
                padding: '11px 18px',
                border: `1px solid ${copied ? C.success : C.ruleStrong}`,
                background: copied ? C.success : C.white,
                color: copied ? C.white : C.inkSoft,
                fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: C.shadowSm,
              }}
            >
              {copied ? <><Check size={12} strokeWidth={2.5} /> Copied</> : <><Copy size={12} strokeWidth={1.8} /> Copy All</>}
            </button>
          </div>
          <div style={{ padding: '32px 36px' }}>
            <MarkdownOutput text={output} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.rule}`,
        textAlign: 'center',
      }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
          color: C.inkFaded, fontWeight: 500,
        }}>
          CSEF Content Studio · Your inputs auto-save
        </div>
      </div>
    </div>
  );
}

function InputField({ input, value, onChange, onClear }) {
  const hasValue = value && value.length > 0;
  return (
    <div style={{ marginBottom: 18, position: 'relative' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
          {input.label}
          {input.required && <span style={{ color: C.blue, marginLeft: 4 }}>*</span>}
        </label>
        {hasValue && (
          <button
            onClick={onClear}
            className="mono flex items-center gap-1 transition-colors"
            style={{
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.inkFaded, padding: '2px 6px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.blue}
            onMouseLeave={e => e.currentTarget.style.color = C.inkFaded}
          >
            <RefreshCw size={10} /> Clear
          </button>
        )}
      </div>
      {input.multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={input.placeholder}
          rows={input.rows || 4}
          style={{
            width: '100%', padding: '10px 14px', border: `1px solid ${C.rule}`,
            background: C.paper, color: C.ink, fontSize: 15, resize: 'vertical',
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={input.placeholder}
          style={{
            width: '100%', padding: '10px 14px', border: `1px solid ${C.rule}`,
            background: C.paper, color: C.ink, fontSize: 15,
          }}
        />
      )}
    </div>
  );
}
