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

export interface Response {
  id: number;
  job_id: number;
  user_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  preferred_contact: 'email' | 'whatsapp' | 'telegram';
  contact_value: string;
  cover_letter?: string;
  status: 'pending' | 'viewed' | 'accepted' | 'rejected';
  created_at: string;
}