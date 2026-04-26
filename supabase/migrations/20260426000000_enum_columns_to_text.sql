-- Convert custom PostgreSQL enum columns to TEXT so Hibernate's
-- @Enumerated(EnumType.STRING) binding works without custom JDBC type handling.
-- Application-level enums enforce the valid values instead.

ALTER TABLE app_users
    ALTER COLUMN role TYPE TEXT USING role::TEXT;

ALTER TABLE notifications
    ALTER COLUMN type        TYPE TEXT USING type::TEXT,
    ALTER COLUMN source_type TYPE TEXT USING source_type::TEXT;
