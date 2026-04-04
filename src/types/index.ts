// ============ Job ============
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  description: string;
  requirements: string[];
  posted_at: string;
  url?: string;
}

// ============ Response ============
export interface Response {
  id: number;
  job_id: number;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  preferred_contact: 'email' | 'whatsapp' | 'telegram';
  contact_value: string;
  cover_letter?: string;
  status: 'pending' | 'viewed' | 'accepted' | 'rejected';
  created_at: string;
}

export interface ResponseWithJob extends Response {
  jobs: Job;
}

// ============ WorkExperience ============
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
}

// ============ Language ============
export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

// ============ Resume ============
export interface Resume {
  id: number;
  user_id: string;
  title: string;
  position: string;
  experience?: string | null;
  work_experiences?: WorkExperience[];
  education: string | null;
  skills: string[];
  languages: string[];
  file_url: string | null;
  file_name: string | null;
  is_active: boolean;
  views: number;
  last_response_status: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Profile ============
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  preferred_contact: 'email' | 'whatsapp' | 'telegram' | null;
  created_at: string;
  updated_at: string;
}