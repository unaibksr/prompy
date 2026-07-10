-- PromptVault Supabase Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  platform TEXT DEFAULT '',
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompts_platform ON prompts(platform);
CREATE INDEX IF NOT EXISTS idx_prompts_is_favorite ON prompts(is_favorite);
CREATE INDEX IF NOT EXISTS idx_prompts_updated_at ON prompts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON prompts USING GIN(tags);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment use_count
CREATE OR REPLACE FUNCTION increment_use_count(prompt_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE prompts
  SET use_count = use_count + 1
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users"
  ON prompts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow read-only for anonymous users (if you want public access)
CREATE POLICY "Allow read for anonymous"
  ON prompts
  FOR SELECT
  TO anon
  USING (true);

-- Insert seed data
INSERT INTO prompts (title, body, tags, platform, is_favorite, use_count) VALUES
(
  'Cyberpunk Cityscape at Night',
  'A neon-soaked cyberpunk cityscape at night, rain-slicked streets reflecting magenta and cyan light, flying vehicles between towering skyscrapers, holographic advertisements in Japanese script, cinematic lighting, ultra-detailed, 8K, trending on ArtStation',
  ARRAY['cyberpunk', 'cityscape', 'night', 'neon'],
  'Chatgpt',
  true,
  12
),
(
  'React Custom Hook Generator',
  'Write a React custom hook called useLocalStorage that handles reading and writing to localStorage with JSON serialization. It should return [value, setValue, removeValue, isLoading, error]. Include TypeScript types, proper cleanup in useEffect, and handle loading/error states. Add JSDoc comments. Use useCallback and useMemo for performance.',
  ARRAY['react', 'hooks', 'typescript', 'custom-hook'],
  'Chatgpt',
  true,
  8
),
(
  'Product Launch Email Sequence',
  'Write a enthusiastic yet professional email sequence for launching PromptVault Pro aimed at AI enthusiasts and content creators.

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

Closing: limited-time early adopter discount',
  ARRAY['email', 'launch', 'copywriting', 'sequence'],
  'Chatgpt',
  false,
  5
),
(
  'Minimalist Logo Design Brief',
  'Design a minimalist logo for PromptVault, a company in the technology industry. The logo should use modern geometric style with a color palette of deep purple (#7c3aed), dark gray (#1f2937), white. Include a icon-only version, wordmark version, and combination mark. The brand values are innovation, simplicity, reliability. Deliverables: SVG, PNG, and AI files.',
  ARRAY['logo', 'branding', 'minimalist', 'design'],
  'Nanobanana',
  false,
  3
),
(
  'Blog Post: AI Prompt Best Practices',
  'Write a conversational and authoritative blog post titled "10 AI Prompt Engineering Tips That Actually Work" targeting content creators and marketers new to AI.

Outline:
1. Introduction — why prompt quality matters
2. Be Specific: include desired format, length, and style in your prompt
3. Provide Context: provide background information and examples of desired output
4. Use Examples: show the AI what good looks like with sample outputs
5. Iterate and Refine: use the AI output as a starting point, not the final result
6. Conclusion — call to action to start using PromptVault

Word count: ~1500 words
Include: a comparison table, 3 practical examples, and a checklist at the end.',
  ARRAY['blog', 'tutorial', 'ai', 'best-practices', 'content'],
  'Chatgpt',
  true,
  7
);