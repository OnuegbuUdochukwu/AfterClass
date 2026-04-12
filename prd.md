# Product Requirements Document (PRD): AfterClass

## 1. Product Overview

### 1.1 Vision
AfterClass aims to be the definitive "third space" for university learning—bridging the gap between formal lectures and independent study. By combining structured academic content with the high-engagement UI of modern social platforms (Twitter/X), we aim to eliminate the friction and "noise" associated with traditional academic forums.

### 1.2 Problem Statement
Traditional Learning Management Systems (LMS) and student forums suffer from three primary issues:
- **The "Messy" Thread Problem**: Long, unorganized threads make it impossible for students to find specific answers.
- **Context Disconnect**: Discussion is often divorced from the source material (lecture notes).
- **Engagement Friction**: Professional-grade forums often feel "heavy" and intimidating, leading to low student participation.

### 1.3 Target Personas
- **The Facilitator (Lecturer)**: Needs a low-friction way to distribute notes and verify correct information without managing a chaotic inbox.
- **The Course Rep (Student Admin)**: Responsible for bridging the gap between students and lecturers by organizing materials and moderating discourse.
- **The Student**: Seeks quick access to notes and high-speed answers to specific roadblocks during study sessions.

### 1.4 Core Value Proposition
A "Topic-First" academic hub that organizes course materials into weekly units, fostering high-signal discussions through a familiar, social-media-inspired interface.

## 2. Goals & Success Metrics

### 2.1 Business & Academic Goals
- **Centralization**: Achieve 90% of course-related Q&A within the app rather than external apps (WhatsApp/Telegram).
- **Efficiency**: Reduce the average time a lecturer spends answering repetitive questions by 50% via peer-answering and verification.

### 2.2 KPIs (Key Performance Indicators)
- **Activation**: % of enrolled students who download the first lecture note.
- **Engagement**: Average number of "Quotes" and "Upvotes" per topic.
- **Resolution Rate**: % of questions marked as "Verified" or "Resolved."
- **Retention**: Weekly Active Users (WAU) correlated with the university's lecture schedule.

## 3. User Roles & Permission Hierarchy
*Roles are assigned per course, allowing a user to be a Rep in one course and a Student in another.*

| Role | Capabilities | Primary Flow |
| :--- | :--- | :--- |
| **Developer (Super Admin)** | Global Role Management, Course Creation, "God View" Dashboard. | Promoting Students to Reps via the Admin Panel manually. |
| **Lecturer (Staff)** | Verify content (Gold Check), 1-min Topic Creation, "Gold Star" Answers. | Quality control and official verification of notes. |
| **Course Rep (Moderator)** | Direct Topic Posting, Note Uploads, Thread Moderation (Pin/Merge). | Day-to-day content management for their specific course. |
| **Student (User)** | Ask, Quote, Reply, Upvote, Download. | Active participation and peer-to-peer learning. |

## 4. Functional Requirements

### 4.1 Authentication & Role Management
- **Google OAuth**: One-tap sign-in for frictionless entry.
- **Developer "God View" Dashboard**: A hidden admin panel (`/admin`) where the developer searches for student emails and toggles their status to "Course Rep" or "Lecturer" for specific course IDs.
- **Whitelist Logic**: At login, the app checks the enrollments table to determine the user's role for each specific course context.

### 4.2 Weekly Topic Timeline & Navigation
- **Weekly Units**: The course timeline is organized into expandable "Week" accordions (e.g., Week 1, Week 2).
- **Current Week Highlight**: The active week is automatically expanded and highlighted with a Course Accent Color border/glow.
- **Jump to Latest**: A floating action button to skip instantly to the most recent lecture banner.

### 4.3 Content Creation & "Gold Check" Verification
- **One-Minute Workflow**: Simplified modal for title, facilitator name, and PDF dropzone.
- **Direct Post (Rep Power)**: Course Reps can post topics immediately; these remain "Standard" until verified.
- **Verification Loop**: Lecturers can click "Verify Content" to grant a topic a gold border and a "Lecturer Verified" badge.
- **File Metadata**: Displays file type (PDF) and size (e.g., 2.4MB) next to the download button.

### 4.4 Ranked Search Logic
Search bar returns results grouped and prioritized by relevance:
- **Tier 1: Topics**: Matches in lecture titles (shown as mini-banners).
- **Tier 2: Questions**: Matches in student posts (original queries).
- **Tier 3: Replies**: Matches in specific answers or quotes.
- **Search-as-you-type**: Top 3 topic matches appear in a dropdown for instant navigation.

### 4.5 Discussion Engine: "Flat-but-Linked" Quotes
- **One-Level Nesting**: Quotes only show the immediate parent to maintain UI cleanliness and mobile readability.
- **Visual Distinction**: Vertical accent lines (Course Color) and a darker background for quoted blocks.
- **Context Linking**: Clicking a quote box auto-scrolls the user back to the original source thread.
- **Double Notification**: Both the Lecturer and the Original Poster (OP) are notified when a question is quoted.

## 5. User Experience (UX) & Design

### 5.1 Visual Theme: "Twitter Dim" Dark Mode
- **Primary Background**: `#15202B` (Twitter "Dim" blue/grey to reduce eye strain).
- **Surface/Cards**: `#1E2732` (Slightly lighter to create visual depth).
- **Primary Action Color**: `#1D9BF0` (Classic Twitter Blue for primary buttons).
- **Primary Text**: `#F7F9F9` (Off-white for high contrast without glare).
- **Secondary Text**: `#8B98A5` (Muted grey for timestamps and stats).

### 5.2 Interactive Elements
- **Glassmorphism**: The Pinned Note header at the top of a topic feed uses a translucent blur effect, allowing questions to scroll underneath while the "anchor" remains visible.
- **Lecturer Presence**: A green "Online" dot appears next to the lecturer's avatar on banners when they are active.
- **Verified Badge**: Lecturer-approved answers use Gold (`#D4AF37`) or Emerald Green (`#00BA7C`).
- **"Search First" Prompt**: UI intervention that suggests existing similar threads before a student completes a new post.

## 6. Technical Requirements & Architecture
- **Frontend**: Next.js 14+ (App Router) + Tailwind CSS.
- **Backend/BaaS**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **State Management**: Zustand or React Context for course-level state.
- **Animations**: Framer Motion for thread expansions and layout transitions.
- **Storage**: Supabase S3 buckets organized by `course_id`.

## 7. Database Design (PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Courses Table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL, 
  name text NOT NULL,
  accent_color text DEFAULT '#1D9BF0',
  lecturer_id uuid REFERENCES users(id)
);

-- Enrollments (Role Management per Course)
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  course_id uuid REFERENCES courses(id),
  role text DEFAULT 'student' CHECK (role IN ('student', 'rep', 'lecturer')),
  UNIQUE(user_id, course_id)
);

-- Topics (The Weekly Banners)
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id uuid REFERENCES courses(id),
  week_number int NOT NULL,
  title text NOT NULL,
  note_url text,
  file_size text,
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES users(id)
);

-- Posts (Self-referencing for Twitter-style threads)
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id uuid REFERENCES topics(id),
  user_id uuid REFERENCES users(id),
  content text NOT NULL,
  parent_id uuid REFERENCES posts(id), -- For Replies
  quoted_id uuid REFERENCES posts(id), -- For Quotes
  upvote_count int DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
```

## 8. Future Roadmap (Post-MVP)
- **Lecture Timestamps**: Optional "Slide #" or "Timestamp" badges for questions.
- **"Cite the Note" Tool**: Quick-tagging specific document sections in replies.
- **LaTeX/Code Rendering**: Advanced formatting for STEM courses.
- **Merge Tool**: Admin feature to link identical questions into one thread.
- **Automated Rep Requests**: UI flow for students to request moderator status for developer approval.

---
**Project Name**: AfterClass  
**Combined & Finalized**: April 2026
