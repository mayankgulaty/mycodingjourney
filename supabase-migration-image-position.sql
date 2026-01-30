-- Add cover_image_position column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS cover_image_position TEXT DEFAULT '50% 50%';

-- Update any existing articles that might have NULL
UPDATE articles 
SET cover_image_position = '50% 50%' 
WHERE cover_image_position IS NULL;
