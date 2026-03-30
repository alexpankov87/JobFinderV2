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