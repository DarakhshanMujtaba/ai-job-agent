import { apiClient } from "@/api/client";
import type {
  AuthTokenResponse,
  Application,
  Job,
  Resume,
  User,
} from "@/types";

export const authApi = {
  signup: (email: string, password: string) =>
    apiClient.post<User>("/auth/signup", { email, password }),
  login: (email: string, password: string) =>
    apiClient.post<AuthTokenResponse>("/auth/login", { email, password }),
};

export const resumeApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<Resume>("/resume/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  parse: (resumeId: string) =>
    apiClient.post<Resume>(`/resume/${resumeId}/parse`),
};

export const jobsApi = {
  fetchLive: () => apiClient.post<Job[]>("/jobs/fetch"),
  list: () => apiClient.get<Job[]>("/jobs/"),
};

export const applicationsApi = {
  list: () => apiClient.get<Application[]>("/applications/"),
  fitScore: (resumeId: string, jobId: string) =>
    apiClient.post<Application>("/applications/fit-score", {
      resume_id: resumeId,
      job_id: jobId,
    }),
  tailor: (applicationId: string) =>
    apiClient.post<Application>(`/applications/${applicationId}/tailor`),
  interviewPrep: (applicationId: string) =>
    apiClient.post<Application>(
      `/applications/${applicationId}/interview-prep`
    ),
};
