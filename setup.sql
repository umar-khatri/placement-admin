-- Drop tables if they exist
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'coordinator', 'alumni', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'hired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert mock data
INSERT INTO users (id, name, email, role, status) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admin User', 'admin@example.com', 'admin', 'active'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'John Doe', 'john.student@example.com', 'student', 'active'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Jane Smith', 'jane.student@example.com', 'student', 'blocked'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Prof. Alan', 'alan.coord@example.com', 'coordinator', 'active'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Mike Alumni', 'mike.alumni@example.com', 'alumni', 'active');

INSERT INTO jobs (id, title, company, description, status, created_by) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Software Engineer', 'Google', 'Looking for a full stack engineer.', 'approved', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Data Scientist', 'Meta', 'Data analysis and ML role.', 'pending', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Frontend Developer', 'Netflix', 'React and UI experts needed.', 'rejected', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15');

INSERT INTO applications (id, job_id, user_id, status) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'shortlisted'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'applied'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'rejected');

INSERT INTO reports (id, reported_by, reported_user_id, reported_job_id, reason, status) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NULL, 'Inappropriate behavior in forums.', 'resolved'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NULL, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Job posting seems like a scam.', 'pending');
