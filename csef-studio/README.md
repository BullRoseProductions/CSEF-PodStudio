# CSEF Studio

Content platform for the Convention, Sports & Entertainment Facilities Conference (CSEF) podcast programming. Built by BullRose Productions for Access Intelligence / P3C Media.

## Purpose

Serves two user groups within one unified tool:

1. **P3C's marketing/social team** — episode planning, host prep, batch content generation, publishing metadata, promotional content
2. **Sponsors and speakers who purchase podcast interview time at CSEF** — pre-interview prep to show up sharp + post-interview personal-brand content for 8 weeks of rollout

## Modes

**Before the interview:**
- **Interview Prep Sheet** — for guests: story angles, talking points, anticipated Q&A, signature story
- **Host Prep Brief** — for the host: guest research (web search), 10 ranked interview questions, clip-worthy moments

**After the interview:**
- **Content Package** — 10 quotable moments, 5 LinkedIn posts for CSEF, 5 LinkedIn posts for the interviewee, 3 clip concepts, 3 follow-up ideas
- **Show Notes** — episode descriptions, timestamps, guest bio, resources, SEO tags
- **8-Week LinkedIn Playbook** — a week-by-week rollout schedule with full post text for each week
- **Publishing Optimizer** — platform-specific metadata for Apple Podcasts, Spotify, and YouTube with character counts

## Brand

Fully co-branded as CSEF — no BullRose branding visible to users.

- Navy: `#1B2E4A`
- Orange: `#E67629`
- Professional B2B infrastructure aesthetic
- Fraunces (display) + Inter (body) + JetBrains Mono (labels)

## Setup

1. Upload all files to a GitHub repository (files at the ROOT, not nested)
2. Connect Vercel to the repo
3. Set environment variable `ANTHROPIC_API_KEY` in Vercel settings
4. Deploy

## Cost

- Hosting: $20/month Vercel Pro (for extended function timeouts on web search modes)
- Claude API: ~$20-60/month depending on volume

## TODO after logo is provided

Replace the placeholder "C" logo box in `src/App.jsx` (Header component) with the actual CSEF logo image. Grep for `Placeholder logo` in App.jsx to find the spot.
