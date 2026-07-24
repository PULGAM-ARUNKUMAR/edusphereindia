ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS highest_qualification text,
  ADD COLUMN IF NOT EXISTS board_university text,
  ADD COLUMN IF NOT EXISTS year_of_passing integer,
  ADD COLUMN IF NOT EXISTS percentage_cgpa text;