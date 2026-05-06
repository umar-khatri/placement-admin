import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'student' | 'coordinator' | 'alumni' | 'admin';
export type UserStatus = 'active' | 'blocked';
export type JobStatus = 'pending' | 'approved' | 'rejected';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'hired';
export type ReportStatus = 'pending' | 'resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  cgpa?: number;
  skills?: string[];
  branch?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  status: JobStatus;
  created_by: string | null;
  created_at: string;
  min_cgpa?: number;
  required_skills?: string[];
  eligible_branches?: string[];
  users?: { name: string } | any;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  created_at: string;
}

export interface Report {
  id: string;
  reported_by: string | null;
  reported_user_id: string | null;
  reported_job_id: string | null;
  reason: string;
  status: ReportStatus;
  created_at: string;
}
