# EduNavigator India

# ROLE & APPLICATION OVERVIEW

You are a senior full-stack software architect building "EduSphere India" — a modern, mobile-first Web Application for students and parents in India to search, compare, and discover top colleges and universities across India (B.Tech, MBA, BBA, BA, MCA, Medicine, PhD).

The app must deliver an intuitive, high-converting discovery experience with real-time NIRF rankings, NAAC grades, fee structures, hostel details, campus atmosphere, photo galleries, and location proximity filtering.

---

# TECH STACK & ARCHITECTURE

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, Shadcn UI / Radix Primitives

- Backend & Auth: Supabase (PostgreSQL, Row Level Security, Supabase Auth with Google OAuth)

- State & Data Fetching: React Query / TanStack Query, React Hook Form, Zod validation

- Routing: React Router v6

---

# DESIGN SYSTEM & UI/UX (MOBILE-FIRST)

- Aesthetic: Clean, trustworthy, academic-yet-modern Indian ed-tech visual design.

- Primary Color Palette: Deep Royal Blue (`#1E3A8A`), Warm Emerald Green (`#059669`), Gold accent (`#D97706`), Neutral Slate backgrounds (`#F8FAFC`).

- Mobile-First Requirements:

  - Sticky bottom navigation bar on mobile (Home, Search/Explore, Saved Colleges, Contact/Profile).

  - Collapsible filter drawer for mobile search.

  - Swipeable image carousels for college photo galleries.

  - High-contrast badges for NIRF Ranking (e.g., "#1 NIRF 2024") and NAAC Grading (e.g., "NAAC A++").

---

# DATABASE SCHEMA (SUPABASE POSTGRESQL)

Generate and structure the Supabase database with the following tables and RLS policies:

1. `profiles`

   - `id` (uuid, primary key, references auth.users)

   - `full_name` (text)

   - `email` (text)

   - `phone_number` (text)

   - `avatar_url` (text)

   - `created_at` (timestamp with time zone)

2. `colleges`

   - `id` (uuid, primary key)

   - `name` (text)

   - `slug` (text, unique)

   - `city` (text)

   - `state` (text)

   - `location_coordinates` (jsonb: { lat: number, lng: number })

   - `courses_offered` (text array: e.g. ["B.Tech", "MBA", "BBA", "BA", "MCA", "Medicine", "PhD"])

   - `nirf_rank` (integer)

   - `naac_grade` (text: e.g. "A++", "A+", "A", "B++")

   - `annual_fee_min` (numeric)

   - `annual_fee_max` (numeric)

   - `hostel_available` (boolean)

   - `hostel_fee_annual` (numeric)

   - `environment_highlights` (text array: e.g. ["100-acre Green Campus", "24/7 Library", "Incubation Hub"])

   - `cover_image` (text)

   - `photo_gallery` (text array)

   - `placement_rate_pct` (numeric)

   - `avg_package_lpa` (numeric)

   - `description` (text)

   - `created_at` (timestamp)

3. `enquiries`

   - `id` (uuid, primary key)

   - `user_id` (uuid, nullable, references profiles.id)

   - `college_id` (uuid, references colleges.id)

   - `full_name` (text)

   - `email` (text)

   - `phone_number` (text)

   - `course_interested` (text)

   - `message` (text)

   - `created_at` (timestamp)

4. `saved_colleges`

   - `id` (uuid, primary key)

   - `user_id` (uuid, references profiles.id)

   - `college_id` (uuid, references colleges.id)

   - `created_at` (timestamp)

---

# CORE PAGES & FEATURE SPECIFICATIONS

### 1. Header & Navigation Component

- Logo: "EduSphere India" with a graduation cap icon.

- Mobile: Search bar prompt + Hamburger / User Profile trigger.

- Desktop: Header nav links (Explore, Colleges by Degree, NIRF Top 100, Contact Us) + Google Sign-In button / User Profile Menu.

### 2. Landing Page (Hero + Discovery)

- Hero Banner: "Find Your Dream College in India" with a prominent search bar (Search by College Name, City, or Course: B.Tech, MBA, BBA, BA, MCA, Medicine, PhD).

- Quick Filter Pills: "Nearby Me", "Top NIRF Ranked", "NAAC A++", "Hostel Included", "Under ₹2 Lakhs/Yr".

- Quick Stream Selector: Grid cards for B.Tech, MBA, Medicine, MCA, BBA, BA, PhD.

- Featured Colleges Grid: Responsive cards featuring top Indian colleges.

- Value Proposition Section: Why parents & students trust EduSphere (Verified NIRF data, real fees, direct college connect).

### 3. Search & Explore Directory Page (`/colleges`)

- Dual Layout: Grid view & List view toggle.

- Advanced Sidebar/Drawer Filters:

  - Degree Stream (Checkboxes for B.Tech, MBA, BBA, BA, MCA, Medicine, PhD)

  - Location / State / City search

  - Max Annual Fee Slider (₹50,000 to ₹10,00,000+)

  - NIRF Ranking Range (Top 10, Top 50, Top 100, All)

  - NAAC Grade Filter (A++, A+, A, B++)

  - Hostel Available Toggle (Yes/No)

- College Card Details:

  - High-res cover image with swipeable gallery preview

  - Badges: NIRF Rank badge, NAAC Grade badge

  - City & State location indicator

  - Courses tag list

  - Fee range indicator (e.g. "₹1.8L - ₹3.2L / year")

  - Hostel status pill

  - Buttons: "View Details" and "Bookmark/Save"

### 4. College Detail Page (`/college/:slug`)

- Hero Header: Cover photo, college name, city/state, NIRF badge, NAAC grade.

- Tabbed Navigation Section:

  - **Overview**: Description, environment highlights, campus size, placement rate & average package.

  - **Courses & Fees**: Table layout displaying Degree, Eligibility, Annual Fee, and Duration.

  - **Hostel & Amenities**: Hostel availability, fees, mess quality, occupancy types (Single/Shared), Wi-Fi, sports.

  - **Campus Gallery**: Responsive masonry or carousel grid of campus photos.

  - **Location & Map**: Address details and embedded visual map card.

- Sticky Call-To-Action (CTA) Footer/Sidebar:

  - "Apply / Enquire Now" button that opens the Contact Modal.

### 5. Contact & Enquiry Modal / Form

- Form fields:

  - Full Name (Pre-filled if logged in via Google)

  - Phone Number (Required, with Indian +91 validation)

  - Email Address (Pre-filled if logged in)

  - Select Course Interested (Dropdown: B.Tech, MBA, BBA, BA, MCA, Medicine, PhD)

  - Message / Query box

- Google Auth Direct Trigger:

  - If user is NOT signed in, prompt "Sign in with Google to Auto-fill and Send Message".

  - Collect and store user's Google profile (name, email, avatar) + phone number + query message into the Supabase `profiles` and `enquiries` table simultaneously.

- Toast Notification: Success confirmation ("Enquiry sent! The college admissions office will contact you shortly.").

### 6. User Profile & Saved Colleges (`/profile`)

- User avatar, name, email, phone number update section.

- Saved Colleges list card display with quick remove option.

- Enquiry history log (showing past sent messages).

---

# MOCK SEED DATA (Include initial dataset for preview)

Pre-populate the UI state with at least 6 realistic Indian college records so the preview works instantly:

1. **IIT Bombay (Indian Institute of Technology)** - Mumbai, Maharashtra | Courses: B.Tech, MCA, PhD | NIRF: #3 | NAAC: A++ | Fee: ₹2.2L/yr | Hostel: Yes

2. **IIM Ahmedabad** - Ahmedabad, Gujarat | Courses: MBA, PhD | NIRF: #1 | NAAC: A++ | Fee: ₹12L/yr | Hostel: Yes

3. **AIIMS New Delhi** - New Delhi | Courses: Medicine, PhD | NIRF: #1 | NAAC: A++ | Fee: ₹1.6K/yr | Hostel: Yes

4. **St. Xavier's College** - Mumbai, Maharashtra | Courses: BA, BBA, MCA | NIRF: #14 | NAAC: A+ | Fee: ₹45K/yr | Hostel: No

5. **Christ University** - Bengaluru, Karnataka | Courses: BBA, MBA, BA, MCA | NIRF: #60 | NAAC: A+ | Fee: ₹1.9L/yr | Hostel: Yes

6. **Vellore Institute of Technology (VIT)** - Vellore, Tamil Nadu | Courses: B.Tech, MCA, BBA, PhD | NIRF: #11 | NAAC: A++ | Fee: ₹1.98L/yr | Hostel: Yes

---

# INSTRUCTIONS FOR LOVABLE

1. Build the frontend components first with realistic state and mock data so all features can be tested in the interactive preview.

2. Implement clean responsive Tailwind CSS for mobile (375px+), tablet, and desktop viewports.

3. Add Supabase Client config (`supabase.ts`) with OAuth Google Sign-In helper functions and database queries for fetching colleges, submitting enquiries, and bookmarking.

4. Use Shadcn UI toast notifications, dialogs, sliders, tabs, and sheet drawer components.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://edusphereindia.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f867fc9f-077d-4b9c-aa59-dd7548350a83).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
