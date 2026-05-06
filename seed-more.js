const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.rlfvcgrvmijjkbvddank:QSY2eITEfte4GmT8@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
});

const sql = `
-- Insert more users
INSERT INTO users (id, name, email, role, status) VALUES
(gen_random_uuid(), 'Alex Johnson', 'alex.student@example.com', 'student', 'active'),
(gen_random_uuid(), 'Sarah Williams', 'sarah.student@example.com', 'student', 'active'),
(gen_random_uuid(), 'Michael Brown', 'michael.student@example.com', 'student', 'active'),
(gen_random_uuid(), 'Emily Davis', 'emily.student@example.com', 'student', 'active'),
(gen_random_uuid(), 'David Miller', 'david.student@example.com', 'student', 'blocked'),
(gen_random_uuid(), 'Jessica Wilson', 'jessica.student@example.com', 'student', 'active'),
(gen_random_uuid(), 'Dr. Robert Taylor', 'robert.coord@example.com', 'coordinator', 'active'),
(gen_random_uuid(), 'Prof. Linda Anderson', 'linda.coord@example.com', 'coordinator', 'active'),
(gen_random_uuid(), 'William Thomas', 'william.alumni@example.com', 'alumni', 'active'),
(gen_random_uuid(), 'Richard Jackson', 'richard.alumni@example.com', 'alumni', 'active'),
(gen_random_uuid(), 'Charles White', 'charles.alumni@example.com', 'alumni', 'active');

-- Insert more jobs
INSERT INTO jobs (id, title, company, description, status, created_by) VALUES
(gen_random_uuid(), 'Backend Engineer', 'Amazon', 'Java and AWS expertise required.', 'approved', (SELECT id FROM users WHERE role='coordinator' LIMIT 1)),
(gen_random_uuid(), 'Product Manager', 'Microsoft', 'Seeking experienced PM.', 'approved', (SELECT id FROM users WHERE role='alumni' LIMIT 1)),
(gen_random_uuid(), 'UX Designer', 'Apple', 'UI/UX for new projects.', 'pending', (SELECT id FROM users WHERE role='coordinator' OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'DevOps Engineer', 'Netflix', 'Kubernetes and CI/CD.', 'approved', (SELECT id FROM users WHERE role='coordinator' LIMIT 1)),
(gen_random_uuid(), 'Data Analyst', 'Spotify', 'SQL and Python skills.', 'pending', (SELECT id FROM users WHERE role='alumni' OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'Security Analyst', 'CrowdStrike', 'Cybersecurity roles.', 'rejected', (SELECT id FROM users WHERE role='coordinator' OFFSET 1 LIMIT 1)),
(gen_random_uuid(), 'Full Stack Developer', 'Stripe', 'React and Node.js.', 'approved', (SELECT id FROM users WHERE role='coordinator' LIMIT 1)),
(gen_random_uuid(), 'Machine Learning Engineer', 'OpenAI', 'AI models development.', 'pending', (SELECT id FROM users WHERE role='alumni' LIMIT 1));

-- Insert more applications
INSERT INTO applications (job_id, user_id, status)
SELECT j.id, u.id, 'applied' 
FROM jobs j, users u 
WHERE u.role = 'student' 
ORDER BY random() 
LIMIT 15;

UPDATE applications SET status = 'shortlisted' WHERE id IN (SELECT id FROM applications ORDER BY random() LIMIT 5);
UPDATE applications SET status = 'rejected' WHERE id IN (SELECT id FROM applications WHERE status = 'applied' ORDER BY random() LIMIT 4);
UPDATE applications SET status = 'hired' WHERE id IN (SELECT id FROM applications WHERE status = 'shortlisted' ORDER BY random() LIMIT 2);

-- Insert more reports
INSERT INTO reports (reported_by, reported_user_id, reported_job_id, reason, status) VALUES
((SELECT id FROM users WHERE role='student' LIMIT 1), (SELECT id FROM users WHERE role='alumni' LIMIT 1), NULL, 'Spam messages', 'pending'),
((SELECT id FROM users WHERE role='coordinator' LIMIT 1), NULL, (SELECT id FROM jobs WHERE status='pending' LIMIT 1), 'Duplicate job posting', 'pending'),
((SELECT id FROM users WHERE role='student' OFFSET 1 LIMIT 1), NULL, (SELECT id FROM jobs WHERE status='approved' LIMIT 1), 'Company seems fake', 'resolved');
`;

async function run() {
  try {
    await client.connect();
    await client.query(sql);
    console.log('More mock data seeded successfully!');
  } catch (err) {
    console.error('Error seeding data', err);
  } finally {
    await client.end();
  }
}

run();
