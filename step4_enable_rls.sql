-- Step 4: Enable RLS
-- Run this after step 3 succeeds

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;
