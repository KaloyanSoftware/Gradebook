-- Insert test AppUsers (Teachers/Admin)
INSERT INTO app_users (id, external_uid, email, first_name, last_name, role, created_at)
VALUES
('550e8400-e29b-41d4-a716-446655440001', 'teacher-001', 'mr.smith@school.com', 'John', 'Smith', 'ADMIN', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'teacher-002', 'ms.johnson@school.com', 'Jane', 'Johnson', 'ADMIN', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'teacher-003', 'mr.williams@school.com', 'Robert', 'Williams', 'ADMIN', NOW());

-- Insert test AppUsers (Students)
INSERT INTO app_users (id, external_uid, email, first_name, last_name, role, created_at)
VALUES
('550e8400-e29b-41d4-a716-446655440010', 'student-001', 'alice@school.com', 'Alice', 'Anderson', 'STUDENT', NOW()),
('550e8400-e29b-41d4-a716-446655440011', 'student-002', 'bob@school.com', 'Bob', 'Brown', 'STUDENT', NOW()),
('550e8400-e29b-41d4-a716-446655440012', 'student-003', 'charlie@school.com', 'Charlie', 'Clark', 'STUDENT', NOW()),
('550e8400-e29b-41d4-a716-446655440013', 'student-004', 'diana@school.com', 'Diana', 'Davis', 'STUDENT', NOW()),
('550e8400-e29b-41d4-a716-446655440014', 'student-005', 'evan@school.com', 'Evan', 'Evans', 'STUDENT', NOW());

-- Insert test Students (linking to student AppUsers)
INSERT INTO students (id, user_id, enrolled_at)
VALUES
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440010', NOW()),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440011', NOW()),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440012', NOW()),
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440013', NOW()),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440014', NOW());

