# Gradebook — Project Rules & Conventions

This file is committed to git and applies to **all contributors and all Claude workers** on this project. Read it before touching any code.

---

## Project Overview

A digital gradebook system for the **Princeps** Bulgarian Language and Literature private mentorship programme, run by Димитър Кацаров. Three roles: **Admin** (teacher/mentor), **Parent**, and **Student**.

MVP features: grade management, absence tracking, notifications, role-based access control.

---

## Repository Layout

```
Gradebook/
├── gradebook-backend/      # Spring Boot Java API
├── gradebook-frontend/     # React + TypeScript + Vite SPA
├── supabase/
│   └── migrations/         # SQL migration scripts (run in Supabase)
└── .claude/
    └── tasks/              # Per-feature task tracking files (committed)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21 + Spring Boot 4.x + Gradle |
| Frontend | React 19 + TypeScript + Vite |
| Database | PostgreSQL (hosted on Supabase) |
| Auth — Identity | Supabase Auth (JWT issuer) |
| Auth — Authorization | Spring Security OAuth2 Resource Server |
| Backend deployment | Render |
| Frontend deployment | Vercel |

---

## Architecture — Backend

Strict layered architecture. **No layer may skip another.**

```
Controller → Service → Repository → Entity
```

- **Controller**: thin — validates input, maps to/from DTOs, delegates to service. No business logic.
- **Service**: owns all business logic. Calls repositories, never touches HTTP.
- **Repository**: Spring Data JPA interface only. No custom SQL unless unavoidable.
- **Entity**: JPA-annotated domain objects. Never returned from controllers directly.
- **DTO**: one record/class per endpoint concern. Live in `dto/` package. Always used in controller responses.

---

## Architecture — Frontend

```
Page → Component → Hook → <feature>/api/<name>.api.ts → Backend (via axiosClient)
```

- All API calls go through feature-scoped `api.ts` files (e.g. `features/grades/api/grades.api.ts`). No raw `fetch` or `axios` calls outside these files.
- HTTP is made via `src/api/axiosClient.ts` — the single Axios instance that attaches the Supabase JWT. All feature API files import from here.
- Auth state lives in `AuthContext` only — components consume it, never manage tokens themselves.
- `ProtectedRoute` wraps every authenticated page.
- TypeScript interfaces for all API response shapes live in `src/features/<domain>/types/`.
- Functional components + hooks only — no class components.
- Feature folder structure: `features/<domain>/{api, components, hooks, pages, types}`

---

## REST Principles

- Resource-oriented URLs: `/api/students`, `/api/students/{id}/grades`
- Correct HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- No verbs in paths — `/api/students` not `/api/getStudents`
- Meaningful status codes: 200, 201, 400, 401, 403, 404, 409, 500
- Response body always uses DTOs, never entities

---

## SOLID Principles (Backend)

| Principle | How it applies here |
|---|---|
| **S**ingle Responsibility | Controller routes, Service logic, Repository data access — each class does one thing |
| **O**pen/Closed | Extend via interfaces; do not modify working classes to add behavior |
| **L**iskov Substitution | Service implementations are drop-in replacements for their interfaces |
| **I**nterface Segregation | Narrow, focused interfaces per concern — no fat interfaces |
| **D**ependency Inversion | Depend on abstractions; inject via Spring constructor injection (preferred over `@Autowired` on fields) |

---

## Auth Conventions

- **Identity**: Supabase Auth issues JWTs. Users are created/managed through Supabase Auth.
- **Authorization**: Spring Security OAuth2 Resource Server validates JWTs on every request.
- **Frontend**: `api.ts` attaches `Authorization: Bearer <token>` to all requests. No other file does this.
- **Never** store tokens in `localStorage` manually — the Supabase JS client handles token storage and refresh.
- **`external_uid`** on `AppUser` entity = `auth.uid()` from Supabase — the bridge between auth and app data.

---

## Backend Conventions

- DTOs use Java `record` types where possible.
- Audit timestamps (`created_at`, `updated_at`) are set via `@PrePersist` / `@PreUpdate` — never set manually in service code.
- Column names are `snake_case` — always use `@Column(name = "...")` explicitly.
- Enum values stored as `STRING` — annotate with `@Enumerated(EnumType.STRING)`.
- Profile separation:
  - `application-dev.properties` — local PostgreSQL via Docker Compose
  - `application-prod.properties` — Supabase PostgreSQL via `DATABASE_URL`
- Constructor injection is preferred over field injection:
  ```java
  // Preferred
  private final StudentRepository studentRepository;
  public StudentService(StudentRepository studentRepository) {
      this.studentRepository = studentRepository;
  }
  ```

---

## Frontend Conventions

- All data shapes typed as TypeScript interfaces in `src/features/<domain>/types/`.
- API functions in feature `api.ts` files return typed responses.
- No inline styles — use SCSS Modules (project standard). CSS custom properties (`var(--name)`) are allowed for dynamic per-element values (e.g. grade colours).
- `AuthContext` exposes: `session`, `user`, `role`, `signOut()`.
- SCSS variables live in `src/styles/_variables.scss` and are injected globally via Vite `additionalData` — import them in any `.module.scss` without an explicit `@use`.
- All user-facing text must be in **Bulgarian**.

### Grade UX Pattern

Grades are managed **inline** in the student roster — no separate pages or modals.

- Clicking a student row in `StudentsListPage` expands an accordion panel (`StudentGradesPanel`) rendered as a `<tr colSpan={5}>` directly below.
- `StudentGradesPanel` shows a mini grade table with inline edit/delete/add — no navigation required.
- Grade value input uses `GradePicker` (`features/grades/components/GradePicker`) — 9 coloured circle buttons for values 2–6 in 0.5 increments. Colour is passed via CSS custom property `--gc` so a single component handles all grades.
- Subject enum values: `BULGARIAN` → "Български език", `LITERATURE` → "Литература".

---

## Princeps Design System

The frontend uses the **Princeps** warm editorial brand identity. All visual decisions must align with these tokens. The source of truth is `gradebook-frontend/src/styles/_variables.scss` and `gradebook-frontend/src/theme/muiTheme.ts`.

### Typography

Three font families are loaded via Google Fonts in `index.html`:

| SCSS variable | Family | Use |
|---|---|---|
| `$font-family-serif` | Cormorant Garamond | Page titles, stat values, brand wordmark, modal headings |
| `$font-family-sans` | Manrope | All body text, labels, buttons, inputs — the global default (`$font-family`) |
| `$font-family-mono` | JetBrains Mono | Dates, timestamps, monospaced metadata |

Rules:
- Page/section titles: `$font-family-serif`, ~32–36px, `font-weight: 500`.
- Section labels (sidebar, card headers): `$font-family-sans`, 9–10px, `font-weight: 700`, `letter-spacing: 0.14–0.18em`, `text-transform: uppercase`.
- Buttons: `text-transform: uppercase`, `letter-spacing: 0.12em`, `font-size: 11px`, `font-weight: 700`.

### Colour Palette

#### Surfaces
| SCSS token | Hex | Use |
|---|---|---|
| `$color-background` | `#F1E7DA` | App page background |
| `$color-cream` | `#F8F2EA` | Sidebar, topbars, softer surfaces |
| `$color-surface` | `#FFFFFF` | Cards, modals, table rows |
| `$color-elevated` | `#FBF6EF` | Table headers, card sub-headers |

#### Ink (text)
| SCSS token | Hex | Use |
|---|---|---|
| `$color-text-primary` | `#2A2520` | Primary text; also sidebar active item background |
| `$color-text-secondary` | `#5C5046` | Secondary text, sidebar nav items |
| `$color-text-muted` | `#8A7C6E` | Tertiary text, section labels, captions |
| `$color-text-faint` | `#B5A89A` | Disabled states, placeholder text |

#### Strokes
| SCSS token | Hex | Use |
|---|---|---|
| `$color-border` | `#E2D3C0` | Default borders |
| `$color-border-soft` | `#ECDFCF` | Dividers, subtle separators |
| `$color-border-strong` | `#C7B49C` | Emphasized borders, hover states |

#### Brand accents (gold)
| SCSS token | Hex | Use |
|---|---|---|
| `$color-primary` | `#C9A24E` | Gold — primary accent, active nav indicator |
| `$color-primary-dark` | `#A8842F` | Gold hover state |
| `$color-primary-light` | `#E8D29A` | Gold soft tints |
| `$color-primary-tint` | `#F4E7C4` | Gold background tints, unread notification bg |

#### Beige accents
| SCSS token | Hex | Use |
|---|---|---|
| `$color-beige` | `#DCC5AC` | Decorative corner, avatar backgrounds |
| `$color-beige-deep` | `#C9AE91` | Deeper beige tones |
| `$color-taupe` | `#B89B7B` | Taupe accents |

#### Sidebar tokens
| SCSS token | Value | Notes |
|---|---|---|
| `$color-sidebar-bg` | `#F8F2EA` | Same as `$color-cream` |
| `$color-sidebar-active` | `#2A2520` | Dark ink — active nav item fill |
| `$color-sidebar-text` | `#5C5046` | Inactive nav item text |
| `$color-sidebar-text-active` | `#F8F2EA` | Cream text on dark active item |
| `$color-sidebar-section` | `#8A7C6E` | Section label colour |

#### Grade value colours
| Grade | SCSS token | Hex |
|---|---|---|
| 2 — Слаб | `$color-grade-val-2` | `#B23A2A` |
| 2.5 | `$color-grade-val-2h` | `#D04535` |
| 3 — Среден | `$color-grade-val-3` | `#C76A2E` |
| 3.5 | `$color-grade-val-3h` | `#E0803A` |
| 4 — Добър | `$color-grade-val-4` | `#C99431` |
| 4.5 | `$color-grade-val-4h` | `#E0AE40` |
| 5 — Мн. добър | `$color-grade-val-5` | `#7A8E3F` |
| 5.5 | `$color-grade-val-5h` | `#95AB4E` |
| 6 — Отличен | `$color-grade-val-6` | `#4E6B3A` |

### Spacing & Shape

| SCSS token | Value | Use |
|---|---|---|
| `$radius-sm` | `6px` | Buttons, inputs, chips |
| `$radius-md` | `10px` | Cards, panels |
| `$radius-lg` | `16px` | Large modals |
| `$sidebar-width` | `248px` | Fixed sidebar width |
| `$shadow-card` | warm brown shadow | All card surfaces |
| `$shadow-pop` | warm brown shadow | Modals, dropdowns |

### Sidebar Design Rules

- Background: `$color-cream` with `border-right: 1px solid $color-border`.
- Decorative diagonal corner via `::before` (`$color-beige`, `clip-path: polygon(0 0, 100% 0, 0 100%)`).
- Active nav item: `$color-sidebar-active` background + 3px `$color-primary` left accent bar via `::before`.
- Nav items: `border-radius: $radius-sm`, hover `rgba(42, 37, 32, 0.06)`.
- Section labels: `$font-family-sans`, 9px, `letter-spacing: 0.18em`, uppercase.

### PrincepsLogo Component

Located at `src/components/PrincepsLogo/PrincepsLogo.tsx`. Always use this component for the brand wordmark — never write "Princeps" or "Дневник" as plain text in headers.

| `variant` prop | Renders | Where to use |
|---|---|---|
| `text-dark` (default) | SVG crown + Cormorant Garamond, dark ink | Sidebar, mobile topbars (light backgrounds) |
| `text-light` | SVG crown + Cormorant Garamond, cream | Any dark background |
| `image` | Real PNG brand photo (`/princeps-logo.png`) | Login page brand panel **only** |

Sizes: `sm` (100px), `md` (140px), `lg` (200px). Optional `subtitle` prop adds italic *"дневник"* beneath.

**Important:** Do not use `variant="image"` inside the authenticated app. The JPG has a cream background that produces a visible box on any surface. Use `text-dark` or `text-light` instead.

### Login Page Layout

Split two-column layout (hidden on mobile, stacks vertically):

- **Left panel** — dark ink (`$color-text-primary`) with decorative corner accents. Contains `<PrincepsLogo size="lg" variant="image" />`, tagline, and description.
- **Right panel** — `$color-background` warm page colour. Contains the sign-in form with uppercase field labels, ink submit button, and forgot-password link.

### MUI Theme Overrides

Defined in `src/theme/muiTheme.ts`. Key values:

- `palette.primary.main`: `#C9A24E` (gold)
- `palette.background.default`: `#F1E7DA`
- `typography.fontFamily`: Manrope
- `typography.h1–h6.fontFamily`: Cormorant Garamond
- Contained primary `MuiButton`: dark ink background (`#2A2520`), not gold
- `MuiOutlinedInput`: warm border colours, gold `box-shadow` focus ring

---

## Naming Conventions

| Context | Convention |
|---|---|
| Java classes | PascalCase |
| Java fields | camelCase |
| Java constants | SCREAMING_SNAKE_CASE |
| DB column names | snake_case |
| DB table names | snake_case, plural |
| TypeScript components/interfaces | PascalCase |
| TypeScript functions/variables | camelCase |
| API paths | `/api/{resource}` — kebab-case, plural nouns |

---

## Environment Variables

**Never commit `.env` or `.env.local` files. Only `.env.example` is committed.**

### Backend (`gradebook-backend/.env`)
```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=                    # Supabase JDBC URL (prod)
SUPABASE_JWT_ISSUER_URI=         # https://<ref>.supabase.co/auth/v1
```

### Frontend (`gradebook-frontend/.env.local`)
```
VITE_SUPABASE_URL=               # https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=          # public anon key from Supabase dashboard
```

---

## Feature Task Tracking

When starting any non-trivial feature:

1. Create `.claude/tasks/<feature-name>.md` in the repo.
2. List all sub-tasks with checkboxes.
3. Check off (`- [x]`) each sub-task immediately after it is done and verified.
4. Work **one sub-task at a time** — do not move to the next until the current is complete.
5. Commit this file so all collaborators can see progress.

Example:
```markdown
# Task: Add grade creation endpoint

- [x] Create GradeRequestDto
- [x] Add POST /api/grades to GradeController
- [ ] Implement GradeService.createGrade()
- [ ] Add GradeRepository.save() call
- [ ] Write integration test
```

---

## Database Schema

Tables live in Supabase PostgreSQL. Migrations are in `supabase/migrations/`.

| Entity | Table | Notes |
|---|---|---|
| `AppUser` | `app_users` | Mirrors Supabase `auth.users` via `external_uid` |
| `Student` | `students` | One-to-one with `app_users` |
| `Parent` | `parents` | One-to-one with `app_users` |
| `Enrollment` | `enrollments` | Links parents to students |
| `Grade` | `grades` | Belongs to student, created by admin |
| `Absence` | `absences` | Belongs to student, created by admin |
| `Notification` | `notifications` | Belongs to parent |

RLS is enabled on all tables. The service role (backend) bypasses RLS. Authenticated users access only their own data via policies.

---

## Known Temporary Workarounds

| Issue | Workaround | Ticket to fix |
|---|---|---|
| `grades.created_by` is NOT NULL in DB | Column made nullable via `ALTER TABLE grades ALTER COLUMN created_by DROP NOT NULL` in Supabase. JPA field annotated `nullable = true`. Will be wired up once auth principal is available in the service layer. | #11 / auth integration |

---

## Git Commits

**Never include Claude or any AI attribution in git commits. Remain anonymous at all times. Do not use `Co-Authored-By` tags or any other form of attribution.**
