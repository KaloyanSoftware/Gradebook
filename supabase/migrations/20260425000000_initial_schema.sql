-- =============================================================
-- Gradebook — Initial Schema Migration
-- Aligned to JPA entities in gradebook-backend/src/main/java/
-- =============================================================

-- ---------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------

CREATE TYPE role_type AS ENUM ('ADMIN', 'PARENT', 'STUDENT');
CREATE TYPE notification_type AS ENUM ('NEW_GRADE', 'NEW_ABSENCE');
CREATE TYPE source_type AS ENUM ('GRADE', 'ABSENCE');

-- ---------------------------------------------------------------
-- app_users
-- Mirrors Supabase auth.users via external_uid (= auth.uid()).
-- ---------------------------------------------------------------

CREATE TABLE app_users (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    external_uid TEXT        NOT NULL UNIQUE,   -- Supabase auth.uid()
    email        TEXT        NOT NULL UNIQUE,
    first_name   TEXT        NOT NULL,
    last_name    TEXT        NOT NULL,
    role         role_type   NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- students
-- One-to-one with app_users (STUDENT role).
-- ---------------------------------------------------------------

CREATE TABLE students (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- parents
-- One-to-one with app_users (PARENT role).
-- ---------------------------------------------------------------

CREATE TABLE parents (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES app_users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- enrollments
-- Links parents to students (one parent → many students).
-- ---------------------------------------------------------------

CREATE TABLE enrollments (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id  UUID        NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    linked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (parent_id, student_id)
);

-- ---------------------------------------------------------------
-- grades
-- Belongs to a student, recorded by admin (created_by).
-- ---------------------------------------------------------------

CREATE TABLE grades (
    id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID           NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_by UUID           NOT NULL REFERENCES app_users(id),
    date       DATE           NOT NULL,
    subject    TEXT           NOT NULL,
    value      NUMERIC(4, 2)  NOT NULL,
    comment    TEXT,
    created_at TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ    NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- absences
-- Belongs to a student, recorded by admin (created_by).
-- ---------------------------------------------------------------

CREATE TABLE absences (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_by UUID        NOT NULL REFERENCES app_users(id),
    date       DATE        NOT NULL,
    reason     TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- notifications
-- Belongs to a parent.
-- ---------------------------------------------------------------

CREATE TABLE notifications (
    id          UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID              NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    type        notification_type NOT NULL,
    message     TEXT              NOT NULL,
    is_read     BOOLEAN           NOT NULL DEFAULT false,
    source_id   UUID              NOT NULL,
    source_type source_type       NOT NULL,
    created_at  TIMESTAMPTZ       NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- updated_at trigger for grades
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER grades_updated_at
    BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===============================================================
-- Row Level Security
-- ===============================================================
-- The Spring Boot backend connects using the SERVICE ROLE key,
-- which bypasses RLS entirely — no admin policies needed.
-- RLS applies only to authenticated end-users (students, parents).
-- ===============================================================

ALTER TABLE app_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE students     ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades       ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper: resolve the app_users.id for the current JWT user
-- auth.uid() returns the Supabase auth UUID stored in external_uid
CREATE OR REPLACE FUNCTION current_app_user_id()
RETURNS UUID AS $$
    SELECT id FROM app_users WHERE external_uid = auth.uid()::text LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: resolve the students.id for the current JWT user (STUDENT role)
CREATE OR REPLACE FUNCTION current_student_id()
RETURNS UUID AS $$
    SELECT s.id FROM students s
    WHERE s.user_id = current_app_user_id() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: resolve the parents.id for the current JWT user (PARENT role)
CREATE OR REPLACE FUNCTION current_parent_id()
RETURNS UUID AS $$
    SELECT p.id FROM parents p
    WHERE p.user_id = current_app_user_id() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------
-- students — student sees only their own row
-- ---------------------------------------------------------------

CREATE POLICY students_select_own
    ON students FOR SELECT
    USING (id = current_student_id());

-- ---------------------------------------------------------------
-- grades — student sees own; parent sees linked students' grades
-- ---------------------------------------------------------------

CREATE POLICY grades_select_student
    ON grades FOR SELECT
    USING (student_id = current_student_id());

CREATE POLICY grades_select_parent
    ON grades FOR SELECT
    USING (
        student_id IN (
            SELECT e.student_id FROM enrollments e
            WHERE e.parent_id = current_parent_id()
        )
    );

-- ---------------------------------------------------------------
-- absences — student sees own; parent sees linked students' absences
-- ---------------------------------------------------------------

CREATE POLICY absences_select_student
    ON absences FOR SELECT
    USING (student_id = current_student_id());

CREATE POLICY absences_select_parent
    ON absences FOR SELECT
    USING (
        student_id IN (
            SELECT e.student_id FROM enrollments e
            WHERE e.parent_id = current_parent_id()
        )
    );

-- ---------------------------------------------------------------
-- notifications — parent sees only their own notifications
-- ---------------------------------------------------------------

CREATE POLICY notifications_select_parent
    ON notifications FOR SELECT
    USING (parent_id = current_parent_id());

-- ---------------------------------------------------------------
-- enrollments — parent sees their own enrollments
-- ---------------------------------------------------------------

CREATE POLICY enrollments_select_parent
    ON enrollments FOR SELECT
    USING (parent_id = current_parent_id());

-- ---------------------------------------------------------------
-- app_users — users can read their own record only
-- ---------------------------------------------------------------

CREATE POLICY app_users_select_own
    ON app_users FOR SELECT
    USING (external_uid = auth.uid()::text);
