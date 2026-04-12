# Software Development Plan: AfterClass MVP

This document outlines the step-by-step execution strategy for building the AfterClass platform. It focuses on the "Twitter-style" academic UI, the robust per-course permission system defined in the PRD, and a scalable Next.js + Supabase architecture. It is divided into 8 logical phases.

## Phase 1: Environment Setup & Core Infrastructure

### Sub-task 1.1: Project Initialization & Global Styling
- **Purpose**: Establish the foundational codebase and configure the "Twitter Dim" visual identity.
- **Detailed Steps**:
  1. Initialize a Next.js 14+ project using `npx create-next-app@latest --typescript`.
  2. Install primary dependencies: `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.
  3. Configure `tailwind.config.ts` with the custom primary color palette:
     - Background: `#15202B` (Dim Blue/Grey)
     - Surface: `#1E2732`
     - Primary/Twitter Blue: `#1D9BF0`
     - Text: `#F7F9F9`
     - Verified Gold: `#D4AF37`
  4. Set up the layout structure with a responsive sidebar for desktop and a bottom navigation bar for mobile.
  5. Implement CSS variables for dynamic course accent colors.
- **Required Tools and Technologies**:
  - Framework: Next.js (App Router), Tailwind CSS.
  - IDE: VS Code.
  - Icons: Lucide-React.
- **Expected Output**: A boilerplate application with the dark theme applied and a responsive layout shell.

## Phase 2: Authentication & User Logic

### Sub-task 2.1: Supabase Integration, Google OAuth & AuthContext
- **Purpose**: Set up the backend-as-a-service, enable frictionless sign-in, and manage user sessions globally.
- **Detailed Steps**:
  1. Create a new Supabase project.
  2. Configure Google Provider in Supabase Auth (Client ID and Secret from Google Cloud Console).
  3. Implement a Login page with a "Sign in with Google" button.
  4. Create an `AuthContext` in React to manage the user session, profile data globally, and verify the university domain.
  5. Set up a database trigger to insert a new row into the `users` table upon successful Auth signup.
- **Required Tools and Technologies**:
  - BaaS: Supabase Auth.
  - Auth Provider: Google Cloud Console (OAuth 2.0).
- **Expected Output**: Functional login flow that redirects users to the dashboard and mirrors/stores user profiles in the `users`/`auth.users` tables.

## Phase 3: Database Architecture & Admin Tools

### Sub-task 3.1: Schema Implementation & RLS Policies
- **Purpose**: Build the relational structure to handle courses, enrollments, and roles, and secure data access.
- **Detailed Steps**:
  1. Execute the SQL migration/schema defined in the PRD for tables: `users`, `courses`, `enrollments`, `topics`, and `posts`.
  2. Configure Row Level Security (RLS) in Supabase:
     - Topics: Insert allowed only for users with role IN ('rep', 'lecturer') for that `course_id`.
     - Posts: Update/Delete only allowed for the `user_id` owner who created the post.
  3. Set up a Supabase Storage bucket named `afterclass-notes` with public read access.
  4. Seed the database with mock data for at least two courses (e.g., MAT101 - Blue, PSY200 - Purple).
- **Required Tools and Technologies**:
  - Database: PostgreSQL (Supabase SQL Editor).
- **Expected Output**: A fully structured database with enforced security policies.

### Sub-task 3.2: Developer "God View" Admin Panel
- **Purpose**: Provide the developer with a tool to manage Rep permissions manually for the MVP.
- **Detailed Steps**:
  1. Create a protected route at `/admin` accessible only to the developer UID via middleware.
  2. Build a user search interface to fetch records/users from the `users` table.
  3. Implement a "Promote to Rep" modal/"Role Switcher" that inserts/updates a record in the `enrollments` table for specific `course_id` mappings.
- **Required Tools and Technologies**:
  - Logic: Next.js Server Actions, Next.js Middleware, or Supabase Client.
- **Expected Output**: A functional admin dashboard visible only to the developer UID for manual user promotion.

## Phase 4: Course Lobby & Weekly Timeline

### Sub-task 4.1: Course Lobby & Navigation
- **Purpose**: Provide a central hub for course selection showing a grid of enrolled courses.
- **Detailed Steps**:
  1. Build the `CourseLobby` page and `CourseCard` component displaying the course code, name, and "New Note" status badges.
  2. Fetch enrolled courses via a join query between `enrollments` and `courses`.
- **Required Tools and Technologies**:
  - Tech: Next.js Server Components, Tailwind CSS.
- **Expected Output**: A navigable dashboard/course page showing all courses the user is enrolled in.

### Sub-task 4.2: Weekly Accordion & Topic Banners
- **Purpose**: Organize lectures into a structured, navigable roadmap with a weekly organized view of course materials.
- **Detailed Steps**:
  1. Develop the `WeeklyTimeline` component using an accordion design with Framer Motion (for accordion transitions).
  2. Group topics by `week_number` and highlight the "Current Week" (active week) with the course accent color.
  3. Create the `TopicBanner` featuring the circular facilitator avatar and the Glassmorphism effect (`backdrop-blur-md`).
  4. Integrate Supabase Storage to allow downloading the PDF notes directly from the banner.
  5. Implement the "Jump to Latest" floating action button in the weekly timeline.
- **Required Tools and Technologies**:
  - Animations: Framer Motion.
  - Styling: Tailwind CSS.
  - Storage: Supabase Storage API.
- **Expected Output**: A vertical timeline grouped by week with downloadable notes.

## Phase 5: Content Management (Facilitator Tools)

### Sub-task 5.1: "One-Minute" Topic Creation & Upload Workflow
- **Purpose**: Allow Reps and Lecturers to upload materials and new topics quickly.
- **Detailed Steps**:
  1. Build an `UploadModal` visible only to Admins/Reps, with a drag-and-drop file zone.
  2. Implement file handling to calculate file size and type before uploading to Supabase Storage.
  3. Save the resulting URL and metadata to the `topics` table.
- **Required Tools and Technologies**:
  - Storage: Supabase Storage API.
  - Forms/Library: React Hook Form, `browser-image-compression` (if applicable) or standard File API.
- **Expected Output**: A functional upload system/tool that populates the timeline in real-time.

### Sub-task 5.2: Content Verification (Gold Check)
- **Purpose**: Allow Lecturers to officially endorse notes or answers and verify notes.
- **Detailed Steps**:
  1. Create an `updateTopicVerification` server action.
  2. Add a toggle/button for Lecturers on Topic Banners to set `is_verified = true` (the "Gold Check" verification button).
  3. Apply the gold border and badge via conditional Tailwind classes.
- **Required Tools and Technologies**:
  - Logic: Next.js Server Actions.
- **Expected Output**: Lecturers can mark topics as verified, updating the UI for all students.

## Phase 6: Discussion Engine (Twitter Logic)

### Sub-task 6.1: The Threaded Feed (Layer 1 & 2)
- **Purpose**: Build the core social engagement engine using the Twitter UI pattern.
- **Detailed Steps**:
  1. Build `PostCard` to display questions with the stats footer (count of Replies, Quotes, Upvotes).
  2. Implement "Layer 1": A scannable vertical list of questions for a specific topic.
  3. Implement "Layer 2": A drill-down view using a dynamic route `/[courseId]/[topicId]/[postId]`.
  4. Build the `ReplyBox` fixed at the bottom of the Layer 2 view.
  5. Use Zustand to manage optimistic UI updates for upvotes ("Me Too" clicks).
- **Required Tools and Technologies**:
  - State Management: Zustand.
  - Animations/UI: Framer Motion.
- **Expected Output**: A functional "click-to-expand" discussion thread with real-time upvotes.

## Phase 7: Search & Quoting Logic

### Sub-task 7.1: "Flat-but-Linked" Quoting
- **Purpose**: Enable follow-up questions without cluttering the main feed and provide quick UI linkage.
- **Detailed Steps**:
  1. Update `PostCard` to detect a `quoted_id`.
  2. If present, render a nested, darker `QuoteBox` with the course accent border.
  3. Enforce the "One-Level Nesting" rule in the frontend rendering logic to avoid UI clutter.
- **Required Tools and Technologies**:
  - UI: React, Lucide-React.
- **Expected Output**: Clean, contextual quoting that links back to original questions.

### Sub-task 7.2: Ranked Search Implementation
- **Purpose**: Provide a relevance-ranked search engine for quick data retrieval across the entire course.
- **Detailed Steps**:
  1. Write a PostgreSQL RPC or use the `ilike` operator to perform full-text search across `topics` and `posts`.
  2. Apply ranking weights and order search results: Topics (Weight A) > Questions (Weight B) > Replies (Weight C).
  3. Implement the "Search-as-you-type" dropdown with a 300ms debounce.
- **Required Tools and Technologies**:
  - DB Search: PostgreSQL `tsvector`, `tsquery`, Supabase RPC.
- **Expected Output**: Fast search results prioritized by academic context, allowing users to search keywords across the course.

## Phase 8: Optimization & Deployment

### Sub-task 8.1: Performance & Polish
- **Purpose**: Ensure the app is fast, feels like a premium social experience, and has high-speed user experience.
- **Detailed Steps**:
  1. Implement "Infinite Scroll" for the topic feed to prevent slow loading using `react-intersection-observer`.
  2. Add `Loading.tsx` skeletons for all major data-fetching views.
  3. Conduct a "Dark Mode" audit to ensure all text meets WCAG contrast standards.
- **Required Tools and Technologies**:
  - Utility: `react-intersection-observer` for infinite scrolling.
  - Deployment: Vercel.
- **Expected Output**: Optimized frontend performance with sub-second, smooth page transitions.

### Sub-task 8.2: Production Deployment
- **Purpose**: Push the application live for student use.
- **Detailed Steps**:
  1. Connect the GitHub repository to Vercel.
  2. Configure environment variables (Supabase URL, Anon Key, Service Role Key).
  3. Run final E2E tests on the staging environment/branch.
  4. Point the custom domain to Vercel and execute the final production build / go live.
- **Required Tools and Technologies**:
  - CI/CD: Vercel Integration.
  - Testing: Playwright or Cypress for E2E tests.
- **Expected Output**: A live, secure URL (e.g., afterclass.vercel.app) ready for student login.
