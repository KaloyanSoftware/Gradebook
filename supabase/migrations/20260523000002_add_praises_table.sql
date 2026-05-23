-- =============================================================
-- Add praises table
-- Praises (похвали) are recorded by an admin for a student.
-- =============================================================

CREATE TABLE praises (
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

ALTER TABLE praises ENABLE ROW LEVEL SECURITY;

-- Student sees only their own praises
CREATE POLICY praises_select_student
    ON praises FOR SELECT
    USING (student_id = current_student_id());

-- Parent sees praises for their linked children
CREATE POLICY praises_select_parent
    ON praises FOR SELECT
    USING (
        student_id IN (
            SELECT e.student_id FROM enrollments e
            WHERE e.parent_id = current_parent_id()
        )
    );
