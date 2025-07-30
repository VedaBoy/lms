
-- supabase/migrations/20250730123000_add_test_student.sql

INSERT INTO profiles (email, first_name, last_name, role) VALUES
('student@test.com', 'Test', 'Student', 'student');
