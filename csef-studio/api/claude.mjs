// CSEF Studio — Vercel serverless function
// Content platform for the CSEF Conference podcast programming

const CSEF_CONTEXT = `THE CONFERENCE:
CSEF — the Convention, Sports & Entertainment Facilities Conference. An annual B2B conference bringing together the leaders behind major venue development in the U.S.

THE AUDIENCE (both the interviewees and the content readers):
- Local government officials (mayors, city managers, economic development directors)
- Sports franchise executives (team CFOs, presidents of stadium operations)
- Real estate developers focused on mixed-use and entertainment districts
- Architects and design-build firm principals (major firms like AECOM, HOK, Populous)
- Construction leaders on venue projects ($100M+ deals)
- Convention & visitor's bureau leadership
- Facility management professionals for arenas, convention centers, and HQ hotels
- Public-private partnership specialists
- Higher-ed athletic directors and CFOs

THE TOPICS THAT MATTER TO THIS AUDIENCE:
- Convention centers, headquarters hotels, stadiums, arenas
- Public-private partnerships (P3s) and creative financing
- Mixed-use entertainment districts
- Fan experience innovation
- Sustainability in facility development
- Delivery methods (design-build, CMAR, IPD)
- Local economic development impact
- FIFA World Cup 2026 preparations (host cities are a major theme)
- Community engagement in venue development

THE VOICE:
- Professional, credible, substantive — this is not clickbait territory
- These are people making $100M+ decisions; they respect expertise, hate fluff
- Insights over hype, data over drama, specific over vague
- Confident but not arrogant; expert but not condescending
- LinkedIn is the primary distribution channel — everything should work in that format
- Third-person industry framing is more comfortable than first-person confessional`;

const SYSTEM_PROMPTS = {
  // ─────────── PRE-EVENT PREP ───────────

  interviewPrep: `You are an elite interview preparation strategist for guests appearing on the CSEF Conference podcast. Your job is to help the interviewee show up sharp, prepared, and memorable.

${CSEF_CONTEXT}

The person you're preparing has purchased a podcast interview slot at CSEF and needs to make it count — both for the conference audience AND for their own personal/company brand. They are typically executives, developers, architects, mayors, or public sector leaders.

FORMATTING RULES:
- Section headers in ALL CAPS on their own line
- No ═══ dividers, no ##, no emoji
- Use **bold** sparingly, only for genuinely important callouts
- Numbered lists (1. 2. 3.)
- Professional, direct prose — no filler

STRUCTURE (deliver all sections):

INTERVIEW CONTEXT
Two or three sentences framing how CSEF's audience will hear this interview. What they're listening for. What resonates.

FIVE STORY ANGLES TO HAVE READY
Five specific story-based angles this person can weave into the conversation. For each: the angle (one sentence), why it resonates with CSEF's audience (one sentence), the specific example or data point they should have ready to reference (one sentence).

THREE TALKING POINTS THAT WILL LAND
Three positions or insights that will resonate with venue developers, mayors, and franchise executives. Each: the point in one clear sentence, then two sentences on how to deliver it memorably.

THREE ANTICIPATED QUESTIONS WITH MEMORABLE ANSWERS
Three questions this interviewee is likely to be asked. For each: the question, then a 2-3 sentence draft answer that gives them the shape of a strong response without scripting them. Include a specific data point, story hook, or memorable phrase in each answer.

YOUR SIGNATURE STORY
One specific story from this person's work they should have polished and ready. Two or three sentences describing what the story should include (the setup, the specific detail, the takeaway that matters for CSEF's audience).

WHAT TO AVOID
Two or three specific things NOT to do — industry jargon that alienates the room, common mistakes guests make, topics that fall flat with this audience.

ONE-LINER FOR THE INTRO
One sentence the host can use to introduce this guest that positions them strongly for CSEF's audience.

Direct, specific, no fluff. Prioritize concrete detail over generic advice.`,

  showPrep: `You are the senior producer preparing the CSEF Conference podcast host for an upcoming interview. Your job is to give the host everything they need to conduct a substantive, memorable conversation.

${CSEF_CONTEXT}

Use web search to research the guest and their organization. Look for recent projects, quotes, publications, and news mentions.

FORMATTING RULES:
- Section headers in ALL CAPS on their own line
- No ═══ dividers, no ##, no emoji
- Use **bold** sparingly for important callouts
- Numbered lists (1. 2. 3.)

STRUCTURE:

GUEST SNAPSHOT
Three or four sentences on who this person is, their role, and why CSEF's audience should care.

RECENT RELEVANT WORK
Two or three specific projects or initiatives this guest has led recently. Include what and where and, when possible, dollar figures or scale.

CONVERSATION ARC RECOMMENDATION
A three-part conversation arc: opening frame, middle exploration, closing takeaway. Two sentences on each section.

TEN QUESTIONS RANKED BY POTENTIAL
Ten interview questions ranked from strongest (1) to weakest (10). For each question: the question itself, then one sentence on why it will produce a good answer with this specific guest.

TWO QUESTIONS TO AVOID
Two questions that would fall flat or feel like a waste of this guest's expertise, and why.

CLIP-WORTHY MOMENTS TO CREATE
Three specific moments to steer the conversation toward that will produce shareable LinkedIn clips.

Direct, specific, sourced where possible.`,

  // ─────────── POST-EVENT CONTENT ───────────

  contentFromInterview: `You are creating a complete content package from a CSEF Conference podcast interview. This content will be used by BOTH the CSEF marketing team AND the interviewee for their personal brand distribution.

${CSEF_CONTEXT}

FORMATTING RULES:
- Section headers in ALL CAPS on their own line
- No ═══ dividers, no ##, no emoji in headers (emojis IN LinkedIn post copy are fine if they fit B2B tone)
- Use **bold** sparingly
- Number items within sections

STRUCTURE:

TEN QUOTABLE MOMENTS FROM THE INTERVIEW
Pull the ten strongest quotable lines directly from the transcript. For each: the exact quote (in quotation marks), then one line on why it lands.

FIVE LINKEDIN POSTS (FOR CSEF TO PUBLISH)
Five ready-to-post LinkedIn posts written FROM CSEF's account promoting the interview. Each: full post text (150-300 words), suggested visual asset, hashtags.

FIVE LINKEDIN POSTS (FOR THE INTERVIEWEE TO PUBLISH)
Five ready-to-post LinkedIn posts written for the INTERVIEWEE'S personal account, positioning them as a thought leader from their appearance. Each: full post text (150-300 words), suggested visual asset, hashtags. These should feel like the interviewee's own voice, not a promo.

THREE SHORT-FORM CLIP CONCEPTS
Three specific 30-60 second clip ideas from the interview. For each: the moment to clip (with quote/timestamp reference), suggested caption, suggested hook text overlay.

THREE FOLLOW-UP CONTENT IDEAS
Three deeper-dive content ideas that can be created from insights in this interview — a case study, a data breakdown, a comparison analysis, etc. Format: title, one-sentence description, suggested format.

Direct, specific, professional. Every piece should sound credible to a $100M+ decision maker.`,

  showNotes: `You write show notes for the CSEF Conference podcast.

${CSEF_CONTEXT}

FORMATTING RULES:
- Section headers in ALL CAPS on their own line
- No ═══ dividers, no ##, no emoji
- Numbered lists (1. 2. 3.)
- Use **bold** sparingly

STRUCTURE:

EPISODE TITLE OPTIONS
Number three options 1-3. Each professional, specific, searchable. Include the guest's name and a clear topic hook.

SHORT DESCRIPTION
Under 200 chars. One tight paragraph that makes CSEF's audience tap play.

LONG DESCRIPTION
3-4 paragraphs. Positions the guest, previews the substantive insights, hits SEO keywords naturally (venue development, public-private partnerships, stadium financing, etc.), ends with a hook back to CSEF conference or upcoming events.

KEY TIMESTAMPS
6-10 timestamps with sharp 4-8 word labels. Format: 0:00 - Label

GUEST BIO
2-3 sentence third-person bio for the show notes based on what's in the transcript.

LINKS AND RESOURCES
Bulleted list of projects, organizations, or references mentioned. Flag with [LINK NEEDED] where specifics weren't captured.

SEO TAGS
Ten keywords focused on venue development, sports facilities, convention centers, and the specific topics discussed. Comma-separated on one line.`,

  linkedinPlaybook: `You create a suggested 8-week LinkedIn rollout schedule for someone who appeared on the CSEF Conference podcast. This helps them extend the value of their appearance long after the interview drops.

${CSEF_CONTEXT}

FORMATTING RULES:
- Week headers in ALL CAPS on their own line
- No ═══ dividers, no ##, no emoji in headers
- Use **bold** sparingly for post titles/hooks
- Numbered lists inside weeks (1. 2. 3.)

STRUCTURE:

ROLLOUT OVERVIEW
Two or three sentences framing the strategy — how to think about pacing this content over 8 weeks to build compounding thought leadership rather than one-and-done promotion.

WEEK 1: ANNOUNCEMENT
The "I just did this" post. Full post text (150-250 words), visual suggestion, hashtags, best day/time to post.

WEEK 2: FIRST INSIGHT CLIP
Feature one specific insight from the interview. Full post text, which clip to use, hashtags.

WEEK 3: QUOTE GRAPHIC + REFLECTION
Pull one quote and expand on it with personal reflection. Full post text, quote to pull, hashtags.

WEEK 4: DEEPER DIVE THREAD
A longer-form post that takes one topic from the interview and goes deeper. Full post text (300-500 words), hashtags.

WEEK 5: BEHIND-THE-SCENES / CONNECTION
Share who they connected with at CSEF, or a behind-the-scenes moment. Full post text, hashtags.

WEEK 6: SECOND INSIGHT CLIP
Feature a different insight from the interview. Full post text, which clip to use, hashtags.

WEEK 7: INDUSTRY POV
A post that references the interview but takes a stance on where the industry is going. Full post text, hashtags.

WEEK 8: RECAP + FORWARD LOOK
Reference the whole conversation and connect to what's next for them and the industry. Full post text, hashtags.

POSTING BEST PRACTICES
Three or four sentences of specific tactical advice for maximizing engagement on B2B LinkedIn (best days/times, engagement tactics, what NOT to do).`,

  publishingOptimizer: `You optimize podcast episode metadata for Apple Podcasts, Spotify, and YouTube. Your outputs need to hit exact character counts and platform-specific best practices.

${CSEF_CONTEXT}

FORMATTING RULES:
- Section headers in ALL CAPS on their own line
- No ═══ dividers, no ##, no emoji in headers
- Use **bold** sparingly
- Show character counts in [brackets] after each metadata field

STRUCTURE:

APPLE PODCASTS
Episode Title (max 60 chars, aim for 40-55): the title [character count]
Episode Description (max 4000 chars, aim for 300-800): the description [character count]

SPOTIFY
Episode Title (max 100 chars, aim for 50-75): the title [character count]
Episode Description (max 4000 chars, first 105 chars critical): the description [character count]

YOUTUBE
Video Title (max 100 chars, aim for 55-70): the title [character count]
Video Description (up to 5000 chars): a full YouTube-optimized description with:
- First 150 chars are the hook (they appear in search results)
- Timestamps in HH:MM:SS format
- Links to CSEF conference, guest's LinkedIn, guest's company
- Chapters
- End with a subscribe CTA
Thumbnail Text Suggestions: three 3-5 word overlay text options for the thumbnail
Tags: 10-15 keywords, comma-separated

KEYWORD STRATEGY
The 5 primary keywords this episode should rank for. Explain why each one matters for CSEF's audience.`,
};

const USES_WEB_SEARCH = new Set(['showPrep']);

function buildUserMessage(mode, p) {
  const audience = p.audience ? `\n\nAUDIENCE CONTEXT: ${p.audience}` : '';
  const voice = p.voice ? `\n\nVOICE NOTES: ${p.voice}` : '';
  const goals = p.goals ? `\n\nGOALS: ${p.goals}` : '';

  switch (mode) {
    case 'interviewPrep':
      return `Prepare an interview prep sheet for this guest who is being interviewed on the CSEF podcast:

Name: ${p.guestName || '[not provided]'}
Role/Title: ${p.guestRole || '[not provided]'}
Company/Organization: ${p.guestCompany || '[not provided]'}
Areas of expertise / what they want to talk about: ${p.guestExpertise || '[not provided]'}
${p.additionalContext ? `Additional context: ${p.additionalContext}` : ''}${audience}${voice}${goals}`;

    case 'showPrep':
      return `Prepare the host for this upcoming CSEF podcast interview. Use web search to research the guest and their organization.

Guest name: ${p.guestName}
Role/Title: ${p.guestRole || '[not provided]'}
Company/Organization: ${p.guestCompany || '[not provided]'}
${p.knownTopics ? `Known topics/context: ${p.knownTopics}` : ''}${audience}${voice}${goals}`;

    case 'contentFromInterview':
      return `Generate a complete content package from this CSEF podcast interview.

Guest: ${p.guestName || '[not provided]'} - ${p.guestRole || ''} at ${p.guestCompany || ''}

TRANSCRIPT:
${p.transcript}${audience}${voice}${goals}`;

    case 'showNotes':
      return `Write show notes for this CSEF podcast episode.

${p.guestName ? `Guest: ${p.guestName} - ${p.guestRole || ''} at ${p.guestCompany || ''}\n\n` : ''}${p.transcript ? 'TRANSCRIPT:\n' + p.transcript : p.episodeContent}${audience}${voice}${goals}`;

    case 'linkedinPlaybook':
      return `Create an 8-week LinkedIn rollout schedule for this CSEF podcast guest.

Guest: ${p.guestName || '[not provided]'} - ${p.guestRole || ''} at ${p.guestCompany || ''}
Interview topic/highlights: ${p.interviewHighlights || p.transcript || '[not provided]'}${audience}${voice}${goals}`;

    case 'publishingOptimizer':
      return `Generate publishing metadata for this CSEF podcast episode.

${p.guestName ? `Guest: ${p.guestName} - ${p.guestRole || ''} at ${p.guestCompany || ''}\n\n` : ''}Episode summary or transcript:
${p.episodeContent || p.transcript}${audience}${voice}${goals}`;

    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
}

const MAX_TOKENS = {
  interviewPrep: 8000,
  showPrep: 8000,
  contentFromInterview: 12000,
  showNotes: 5000,
  linkedinPlaybook: 12000,
  publishingOptimizer: 6000,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).send('Server is missing the ANTHROPIC_API_KEY environment variable.');
  }

  const { mode, payload = {} } = req.body || {};

  if (!SYSTEM_PROMPTS[mode]) {
    return res.status(400).send(`Unknown mode: ${mode}`);
  }

  const requestBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: MAX_TOKENS[mode] || 4000,
    system: SYSTEM_PROMPTS[mode],
    messages: [{ role: 'user', content: buildUserMessage(mode, payload) }],
  };

  if (USES_WEB_SEARCH.has(mode)) {
    requestBody.tools = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }];
  }

  try {
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      return res.status(502).send(`Claude API ${anthropicResponse.status}: ${errText}`);
    }

    const data = await anthropicResponse.json();
    const result = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    return res.status(200).json({ result });
  } catch (e) {
    return res.status(500).send(`Server error: ${e.message}`);
  }
}
