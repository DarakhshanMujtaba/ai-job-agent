export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

export interface ParsedResumeExperience {
  title?: string;
  company?: string;
  duration?: string;
  description?: string;
}

export interface ParsedResumeEducation {
  degree?: string;
  institution?: string;
  year?: string;
}

export interface ParsedResume {
  full_name?: string;
  email?: string;
  skills?: string[];
  experience?: ParsedResumeExperience[];
  education?: ParsedResumeEducation[];
  summary?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  raw_text: string;
  parsed_json?: ParsedResume | null;
  uploaded_at: string;
}

export interface Job {
  id: string;
  title: string;
  company?: string | null;
  location?: string | null;
  description?: string | null;
  source_url?: string | null;
  source?: string | null;
  fetched_at: string;
}

export interface InjectionCheck {
  is_suspicious: boolean;
  matched_patterns: string[];
  note: string;
}

export interface AuthenticityReport {
  flagged_phrases: string[];
  verdict: string;
  injection_check?: InjectionCheck;
}

export interface InterviewQuestion {
  question: string;
  why_asked: string;
  answer_draft: string;
}

export interface InterviewPrep {
  questions: InterviewQuestion[];
}

export type ApplicationStatus = "suggested" | "tailored" | string;

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  resume_id: string;
  fit_score?: number | null;
  fit_reasoning?: string | null;
  tailored_summary?: string | null;
  cover_letter?: string | null;
  authenticity_report?: AuthenticityReport | null;
  interview_prep?: InterviewPrep | null;
  status: ApplicationStatus;
  created_at: string;
}

export interface ApiErrorPayload {
  detail?: string | { msg: string; loc?: (string | number)[] }[];
}
