-- =============================================================
-- Add remarks table
-- Remarks (забележки) are recorded by an admin for a student.
-- =============================================================

CREATE TABLE remarks (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    created_by UUID        REFERENCES app_users(id),
    date       DATE        NOT NULL,
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------

ALTER TABLE remarks ENABLE ROW LEVEL SECURITY;

-- Student sees only their own remarks
CREATE POLICY remarks_select_student
    ON remarks FOR SELECT
    USING (student_id = current_student_id());

-- Parent sees remarks for their linked children
CREATE POLICY remarks_select_parent
    ON remarks FOR SELECT
    USING (
        student_id IN (
            SELECT e.student_id FROM enrollments e
            WHERE e.parent_id = current_parent_id()
        )
    );
