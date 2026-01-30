-- ============================================
-- Blog CMS Database Schema for Supabase
-- Run this in your Supabase SQL Editor
-- ============================================

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Mayank',
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(article_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET view_count = view_count + 1 
  WHERE slug = article_slug AND published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles only
DROP POLICY IF EXISTS "Public read published articles" ON articles;
CREATE POLICY "Public read published articles" ON articles
  FOR SELECT 
  USING (published = true);

-- Service role (used by admin API) has full access
-- Note: Service role key bypasses RLS by default

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON articles TO anon;
GRANT ALL ON articles TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count TO anon, authenticated;

-- ============================================
-- Optional: Sample article for testing
-- ============================================

-- INSERT INTO articles (title, slug, content, excerpt, tags, published, published_at)
-- VALUES (
--   'Welcome to My Tech Blog',
--   'welcome-to-my-tech-blog',
--   '# Welcome to My Tech Blog

-- This is my first article on the new blog platform!

-- ## Features

-- - **Rich Markdown Support** - Write in markdown with full formatting
-- - **Live Code Playgrounds** - Interactive code examples
-- - **Syntax Highlighting** - Beautiful code blocks
-- - **Dynamic Content** - No redeployment needed

-- ```javascript
-- console.log("Hello, World!");
-- ```

-- Stay tuned for more content!',
--   'This is my first article on the new blog platform with rich markdown support.',
--   ARRAY['welcome', 'blog', 'introduction'],
--   true,
--   now()
-- );
