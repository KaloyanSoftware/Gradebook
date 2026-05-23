-- =============================================================
-- Extend notification_type and source_type enums for remarks/praises
-- =============================================================

ALTER TYPE notification_type ADD VALUE 'NEW_REMARK';
ALTER TYPE notification_type ADD VALUE 'NEW_PRAISE';

ALTER TYPE source_type ADD VALUE 'REMARK';
ALTER TYPE source_type ADD VALUE 'PRAISE';
