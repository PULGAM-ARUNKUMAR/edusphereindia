
-- Helper: updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- profiles
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  preferred_stream TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- colleges (public catalog)
-- =========================
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_name TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  stream TEXT NOT NULL,
  type TEXT,
  established INTEGER,
  nirf_rank INTEGER,
  naac_grade TEXT,
  annual_fee_inr INTEGER,
  hostel_available BOOLEAN NOT NULL DEFAULT false,
  hostel_fee_inr INTEGER,
  description TEXT,
  cover_image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  latitude NUMERIC,
  longitude NUMERIC,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.colleges TO anon;
GRANT SELECT ON public.colleges TO authenticated;
GRANT ALL ON public.colleges TO service_role;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view colleges" ON public.colleges
  FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX idx_colleges_stream ON public.colleges (stream);
CREATE INDEX idx_colleges_state ON public.colleges (state);
CREATE INDEX idx_colleges_nirf_rank ON public.colleges (nirf_rank);

CREATE TRIGGER update_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- enquiries
-- =========================
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_interest TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enquiries" ON public.enquiries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own enquiries" ON public.enquiries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enquiries" ON public.enquiries
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own enquiries" ON public.enquiries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_enquiries_user_id ON public.enquiries (user_id);
CREATE INDEX idx_enquiries_college_id ON public.enquiries (college_id);

CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- saved_colleges (bookmarks)
-- =========================
CREATE TABLE public.saved_colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, college_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_colleges TO authenticated;
GRANT ALL ON public.saved_colleges TO service_role;
ALTER TABLE public.saved_colleges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks" ON public.saved_colleges
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON public.saved_colleges
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.saved_colleges
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_saved_colleges_user_id ON public.saved_colleges (user_id);
