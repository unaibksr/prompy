import type { Prompt } from '../types';

/**
 * 7 example prompts covering every platform category.
 * These will be available as static data when Supabase is not connected.
 */
export const seedPrompts: Prompt[] = [
  {
    id: 'seed-1',
    title: 'Cyberpunk Cityscape at Night',
    body: 'A neon-soaked cyberpunk cityscape at night, rain-slicked streets reflecting magenta and cyan light, flying vehicles between towering skyscrapers, holographic advertisements in Japanese script, cinematic lighting, ultra-detailed, 8K, trending on ArtStation',
    tags: ['cyberpunk', 'cityscape', 'night', 'neon'],
    platform: 'Chatgpt',
    is_favorite: true,
    use_count: 12,
    created_at: '2026-06-15T10:00:00Z',
    updated_at: '2026-07-01T14:00:00Z',
  },
  {
    id: 'seed-2',
    title: 'React Custom Hook Generator',
    body: 'Write a React custom hook called useLocalStorage that handles reading and writing to localStorage with JSON serialization. It should return [value, setValue, removeValue, isLoading, error]. Include TypeScript types, proper cleanup in useEffect, and handle loading/error states. Add JSDoc comments. Use useCallback and useMemo for performance.',
    tags: ['react', 'hooks', 'typescript', 'custom-hook'],
    platform: 'Chatgpt',
    is_favorite: true,
    use_count: 8,
    created_at: '2026-06-20T08:30:00Z',
    updated_at: '2026-06-28T16:00:00Z',
  },
  {
    id: 'seed-3',
    title: 'Product Launch Email Sequence',
    body: `Write a enthusiastic yet professional email sequence for launching PromptVault Pro aimed at AI enthusiasts and content creators.

Email 1: Teaser / "Coming Soon"
- Subject: Something big is coming...
- Focus on the problem disorganized prompt libraries

Email 2: Launch Day
- Subject: PromptVault Pro is here!
- Feature the top 3 benefits
- Include Start Your Free Trial CTA

Email 3: Social Proof
- Subject: People are loving PromptVault Pro
- Share testimonials and usage stats

Closing: limited-time early adopter discount`,
    tags: ['email', 'launch', 'copywriting', 'sequence'],
    platform: 'Chatgpt',
    is_favorite: false,
    use_count: 5,
    created_at: '2026-06-25T12:00:00Z',
    updated_at: '2026-07-02T09:00:00Z',
  },
  {
    id: 'seed-4',
    title: 'Minimalist Logo Design Brief',
    body: 'Design a minimalist logo for PromptVault, a company in the technology industry. The logo should use modern geometric style with a color palette of deep purple (#7c3aed), dark gray (#1f2937), white. Include a icon-only version, wordmark version, and combination mark. The brand values are innovation, simplicity, reliability. Deliverables: SVG, PNG, and AI files.',
    tags: ['logo', 'branding', 'minimalist', 'design'],
    platform: 'Nanobanana',
    is_favorite: false,
    use_count: 3,
    created_at: '2026-07-01T15:00:00Z',
    updated_at: '2026-07-03T11:00:00Z',
  },
  {
    id: 'seed-5',
    title: 'Blog Post: AI Prompt Best Practices',
    body: `Write a conversational and authoritative blog post titled "10 AI Prompt Engineering Tips That Actually Work" targeting content creators and marketers new to AI.

Outline:
1. Introduction — why prompt quality matters
2. Be Specific: include desired format, length, and style in your prompt
3. Provide Context: provide background information and examples of desired output
4. Use Examples: show the AI what good looks like with sample outputs
5. Iterate and Refine: use the AI output as a starting point, not the final result
6. Conclusion — call to action to start using PromptVault

Word count: ~1500 words
Include: a comparison table, 3 practical examples, and a checklist at the end.`,
    tags: ['blog', 'tutorial', 'ai', 'best-practices', 'content'],
    platform: 'Chatgpt',
    is_favorite: true,
    use_count: 7,
    created_at: '2026-07-02T09:00:00Z',
    updated_at: '2026-07-04T16:00:00Z',
  },
  {
    id: 'seed-6',
    title: 'Active Recall Question Generator',
    body: 'Act as a study coach. Given the following lecture notes, generate 10 active-recall questions that test deep understanding (not just memorisation), sorted from easiest to hardest. For each question, include the answer in a collapsed section and a 1-sentence explanation of which concept it probes. Topic: {{TOPIC}}. Notes: {{NOTES}}',
    tags: ['study', 'learning', 'active-recall', 'questions'],
    platform: 'Study',
    is_favorite: true,
    use_count: 21,
    created_at: '2026-07-05T09:00:00Z',
    updated_at: '2026-07-09T18:00:00Z',
  },
  {
    id: 'seed-7',
    title: 'Feynman Technique Explainer',
    body: 'Explain {{CONCEPT}} as if you were teaching it to a 12-year-old, in under 200 words, using one everyday analogy. After the explanation, list the 3 most common misconceptions learners have about this topic and briefly clarify each. End with a single self-check question the reader can answer to test their understanding.',
    tags: ['study', 'feynman', 'simplify', 'concepts'],
    platform: 'Study',
    is_favorite: false,
    use_count: 4,
    created_at: '2026-07-06T11:30:00Z',
    updated_at: '2026-07-09T20:15:00Z',
  },
];

/**
 * Returns seed prompts formatted for Supabase insert
 * (without id, created_at, updated_at so Supabase generates them)
 */
export function getSeedInserts() {
  return seedPrompts.map((p) => ({
    title: p.title,
    body: p.body,
    tags: p.tags,
    platform: p.platform,
    is_favorite: p.is_favorite,
    use_count: p.use_count,
  }));
}
