-- Fix the content/message column issue
-- Run this in your Supabase SQL editor

-- First, let's make content nullable since we're using message now
ALTER TABLE announcements ALTER COLUMN content DROP NOT NULL;

-- Update any existing records to have both content and message
UPDATE announcements 
SET 
  content = COALESCE(content, message, 'Default content'),
  message = COALESCE(message, content, 'Default message')
WHERE content IS NULL OR message IS NULL;

-- For future inserts, let's create a trigger to sync content and message
CREATE OR REPLACE FUNCTION sync_announcement_content()
RETURNS TRIGGER AS $$
BEGIN
  -- If message is provided but content is not, copy message to content
  IF NEW.message IS NOT NULL AND NEW.content IS NULL THEN
    NEW.content := NEW.message;
  END IF;
  
  -- If content is provided but message is not, copy content to message
  IF NEW.content IS NOT NULL AND NEW.message IS NULL THEN
    NEW.message := NEW.content;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run before insert/update
DROP TRIGGER IF EXISTS sync_content_trigger ON announcements;
CREATE TRIGGER sync_content_trigger
  BEFORE INSERT OR UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION sync_announcement_content();
