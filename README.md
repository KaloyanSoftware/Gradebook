# Gradebook

A digital gradebook system for a private Bulgarian Language and Literature mentorship programme. Three user roles — **Admin** (teacher), **Parent**, and **Student** — each with a tailored interface for managing and viewing academic records.

---

## Features

### Admin
- **Student roster** — manage all enrolled students; expand any student row to view and edit their full academic record inline
- **Grade management** — add, edit, and delete grades with a colour-coded picker (values 2–6 in 0.5 increments) per subject (Bulgarian / Literature)
- **Absence tracking** — record, edit, and delete absences with an optional reason
- **Remarks** (забележки) — create, edit, and delete written remarks per student
- **Praises** (похвали) — create, edit, and delete written praises per student
- **Parent management** — create parent accounts and link them to one or more students

### Parent
- **Children's gradebook** — read-only view of each linked child's grades, absences, remarks, and praises
- **In-app notifications** — real-time bell with unread badge; notified on every new grade, absence, remark, and praise recorded for their child

### Student
- **Personal gradebook** — read-only view of own grades (with coloured pills and subject average), absences, remarks, and praises
- **In-app notifications** — notified on every new grade recorded for them

### All users
- **Settings** — change email address (confirmed via Supabase email flow)
- **Secure auth** — Supabase-issued JWTs; protected routes per role

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21 · Spring Boot 4 · Gradle |
| Frontend | React 19 · TypeScript · Vite |
| Database | PostgreSQL (Supabase) |
| Auth — Identity | Supabase Auth |
| Auth — Authorisation | Spring Security OAuth2 Resource Server |
| UI Components | MUI v5 · SCSS Modules |
| Data Fetching | TanStack Query v5 |
| Backend deployment | Render (Docker) |
| Frontend deployment | Vercel |

---

## Repository Layout

```
Gradebook/
├── gradebook-backend/          # Spring Boot API
│   ├── src/main/java/
│   │   └── application/gradebookbackend/
│   │       ├── config/         # Security, CORS, CORS filter
│   │       ├── controller/     # REST controllers (thin — no business logic)
│   │       ├── domain/         # JPA entities + enums
│   │       ├── dto/            # Request/response records
│   │       ├── exception/      # ResourceNotFoundException + global handler
│   │       ├── repository/     # Spring Data JPA interfaces
│   │       └── service/        # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties           # Active profiles: dev,supabase
│   │   ├── application-local.properties     # Docker Compose datasource + ddl-auto=update
│   │   ├── application-dev.properties       # SQL logging, CORS for localhost:5173
│   │   ├── application-supabase.properties  # Supabase JWT validation
│   │   └── application-prod.properties      # Render env vars, ddl-auto=validate
│   └── Dockerfile
├── gradebook-frontend/         # React + TypeScript SPA
│   └── src/
│       ├── api/                # axiosClient (single Axios instance with JWT)
│       ├── context/            # AuthContext (session, user, role, signOut)
│       ├── features/           # Feature folders: {api, components, hooks, pages, types}
│       │   ├── absences/
│       │   ├── grades/
│       │   ├── gradebook/
│       │   ├── notifications/
│       │   ├── parents/
│       │   ├── praises/
│       │   ├── remarks/
│       │   └── students/
│       ├── pages/              # Top-level pages (Login, Dashboard, Settings…)
│       └── styles/             # Global SCSS variables (injected via Vite)
├── supabase/
│   └── migrations/             # SQL migration history (reference only — applied manually)
└── render.yaml                 # Render deployment config
```

---

## Local Development

### Prerequisites

| Tool | Version |
|---|---|
| Java | 21 |
| Node.js | 20+ |
| Docker Desktop | any recent |
| Supabase project | (free tier works) |

---

### 1 — Clone the repo

```bash
git clone https://github.com/KaloyanSoftware/Gradebook.git
cd Gradebook
```

---

### 2 — Backend setup

Copy the example env file and fill in your values:

```bash
cp gradebook-backend/.env.example gradebook-backend/.env
```

| Variable | Where to find it |
|---|---|
| `POSTGRES_USER` | Choose any value (e.g. `gradebook`) |
| `POSTGRES_PASSWORD` | Choose any value |
| `POSTGRES_DB` | Choose any value (e.g. `gradebook`) |
| `SUPABASE_JWKS_URI` | Supabase Dashboard → Project Settings → API → JWT Settings → JWKS URI |

The `local` Spring profile uses **Docker Compose** to spin up a PostgreSQL container automatically — no manual `docker run` needed. Spring Boot reads `docker-compose.yml` from the backend root on startup.

Run the backend:

```bash
cd gradebook-backend
./gradlew bootRun
```

The API starts on **http://localhost:8080**. Hibernate is set to `ddl-auto=update` locally, so tables are created automatically on first run.

> **Windows:** use `gradlew.bat bootRun` instead.

---

### 3 — Frontend setup

Copy the example env file and fill in your values:

```bash
cp gradebook-frontend/.env.example gradebook-frontend/.env.local
```

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → anon / public key |
| `VITE_API_URL` | `http://localhost:8080` (backend local URL) |

Install dependencies and start the dev server:

```bash
cd gradebook-frontend
npm install
npm run dev
```

The app is available at **http://localhost:5173**.

---

### 4 — Supabase database setup

The production database schema is managed through SQL scripts that must be applied manually in the **Supabase SQL Editor** (the backend uses `ddl-auto=none` / `validate` against Supabase, so Hibernate never touches the schema there).

Apply the scripts in this order from the `supabase/migrations/` directory:

| File | Description |
|---|---|
| `20260425000000_initial_schema.sql` | Core tables, enums, RLS policies, helper functions |
| `20260426000000_enum_columns_to_text.sql` | Converts PG enum columns to TEXT for Hibernate compatibility |
| `20260426000001_custom_access_token_hook.sql` | Supabase hook that injects `user_role` into the JWT |
| `20260523000001_add_remarks_table.sql` | `remarks` table with RLS |
| `20260523000002_add_praises_table.sql` | `praises` table with RLS |
| `20260523000003_extend_notification_enums.sql` | No-op (columns are already TEXT) — safe to skip |

Then apply the manual DDL statements documented in `CLAUDE.md → Supabase SQL Changelog` (column nullability changes and the `student_id` addition to `notifications` that were applied outside of migration files).

---

### 5 — Supabase Auth setup

1. Enable **Email** provider in Supabase Dashboard → Authentication → Providers.
2. Add `http://localhost:5173/**` to the redirect URL allowlist (Authentication → URL Configuration).
3. Create the custom access token hook (applied via `20260426000001_custom_access_token_hook.sql`) so that the JWT `app_metadata.user_role` claim is populated — the backend reads this claim to enforce role-based access control.

---

## Deployment

### Backend — Render

The backend is deployed on Render using the `Dockerfile` at `gradebook-backend/Dockerfile`. The `render.yaml` at the repo root configures the service.

Set the following environment variables in the Render dashboard:

| Variable | Description |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | Supabase JDBC URL (`jdbc:postgresql://…`) |
| `DB_USERNAME` | Supabase DB username |
| `DB_PASSWORD` | Supabase DB password |
| `SUPABASE_JWKS_URI` | Supabase JWKS endpoint |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (bypasses RLS) |
| `CORS_ALLOWED_ORIGINS` | Vercel frontend URL (e.g. `https://your-app.vercel.app`) |

### Frontend — Vercel

Connect the repository to Vercel and set the build settings:

- **Framework preset:** Vite
- **Root directory:** `gradebook-frontend`
- **Build command:** `npm run build`
- **Output directory:** `dist`

Set these environment variables in the Vercel dashboard:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_API_URL` | Render backend URL |

Also add the Vercel deployment URL to the Supabase redirect URL allowlist (Authentication → URL Configuration).

---

## Architecture

### Backend

Strict layered architecture — no layer may skip another:

```
Controller → Service → Repository → Entity
```

- **Controllers** are thin: validate input, map DTOs, delegate to services. No business logic.
- **Services** own all business logic and orchestrate repository calls.
- **Repositories** are Spring Data JPA interfaces.
- **Entities** are never returned from controllers — always mapped to DTOs first.

Spring Security validates every request's JWT using the Supabase JWKS endpoint. Role claims in the token are mapped to Spring `GrantedAuthority` values (`ROLE_ADMIN`, `ROLE_PARENT`, `ROLE_STUDENT`), and `@PreAuthorize` annotations on controllers enforce access.

### Frontend

```
Page → Component → Hook → feature/api/*.api.ts → Backend
```

- All HTTP calls go through a single `axiosClient` instance that attaches the Supabase JWT automatically.
- `AuthContext` is the single source of truth for session state — no component manages tokens directly.
- `ProtectedRoute` wraps every authenticated page and redirects unauthenticated users to login.
- Data fetching and mutation use **TanStack Query** throughout; cache is invalidated on every mutation.

---

## API Overview

### Admin endpoints (`/admin/**` — role: ADMIN)

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/students` | List all students |
| `GET` | `/admin/students/{id}/grades` | Grades for a student |
| `GET` | `/admin/students/{id}/absences` | Absences for a student |
| `GET` | `/admin/students/{id}/remarks` | Remarks for a student |
| `GET` | `/admin/students/{id}/praises` | Praises for a student |
| `POST` | `/admin/grades` | Create grade |
| `PUT` | `/admin/grades/{id}` | Update grade |
| `DELETE` | `/admin/grades/{id}` | Delete grade |
| `POST` | `/admin/absences` | Create absence |
| `PUT` | `/admin/absences/{id}` | Update absence |
| `DELETE` | `/admin/absences/{id}` | Delete absence |
| `POST` | `/admin/remarks` | Create remark |
| `PUT` | `/admin/remarks/{id}` | Update remark |
| `DELETE` | `/admin/remarks/{id}` | Delete remark |
| `POST` | `/admin/praises` | Create praise |
| `PUT` | `/admin/praises/{id}` | Update praise |
| `DELETE` | `/admin/praises/{id}` | Delete praise |
| `GET` | `/admin/parents` | List all parents |
| `POST` | `/admin/parents` | Create parent |

### Parent endpoints (`/parent/**` — role: PARENT)

| Method | Path | Description |
|---|---|---|
| `GET` | `/parent/me/children` | Linked children |
| `GET` | `/parent/me/children/{id}/grades` | Child's grades |
| `GET` | `/parent/me/children/{id}/absences` | Child's absences |
| `GET` | `/parent/me/children/{id}/remarks` | Child's remarks |
| `GET` | `/parent/me/children/{id}/praises` | Child's praises |
| `GET` | `/parent/notifications` | All notifications |
| `GET` | `/parent/notifications/unread-count` | Unread count |
| `PATCH` | `/parent/notifications/read-all` | Mark all read |
| `PATCH` | `/parent/notifications/{id}/read` | Mark one read |

### Student endpoints (`/student/**` — role: STUDENT)

| Method | Path | Description |
|---|---|---|
| `GET` | `/student/me/grades` | Own grades |
| `GET` | `/student/me/absences` | Own absences |
| `GET` | `/student/me/remarks` | Own remarks |
| `GET` | `/student/me/praises` | Own praises |
| `GET` | `/student/me/notifications` | All notifications |
| `GET` | `/student/me/notifications/unread-count` | Unread count |
| `PATCH` | `/student/me/notifications/read-all` | Mark all read |
| `PATCH` | `/student/me/notifications/{id}/read` | Mark one read |

---

## Database Schema

| Entity | Table | Notes |
|---|---|---|
| `AppUser` | `app_users` | Mirrors Supabase `auth.users` via `external_uid` |
| `Student` | `students` | One-to-one with `app_users` |
| `Parent` | `parents` | One-to-one with `app_users` |
| `Enrollment` | `enrollments` | Links parents to students (many-to-many) |
| `Grade` | `grades` | Belongs to student; subject stored as TEXT |
| `Absence` | `absences` | Belongs to student |
| `Remark` | `remarks` | Belongs to student |
| `Praise` | `praises` | Belongs to student |
| `Notification` | `notifications` | Belongs to a parent **or** a student |

Row Level Security is enabled on all tables. The backend connects with the Supabase **service role key**, which bypasses RLS. Authenticated end-users (students, parents) access only their own data via RLS policies.
