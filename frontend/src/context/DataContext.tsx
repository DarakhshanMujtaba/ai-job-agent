import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applicationsApi, jobsApi, resumeApi } from "@/api/endpoints";
import type { Application, Job, Resume } from "@/types";

interface DataContextValue {
  resume: Resume | null;
  jobs: Job[];
  applications: Application[];
  jobsLoading: boolean;
  applicationsLoading: boolean;
  uploadResume: (file: File) => Promise<Resume>;
  parseResume: () => Promise<Resume>;
  fetchLiveJobs: () => Promise<Job[]>;
  refreshJobs: () => Promise<Job[]>;
  refreshApplications: () => Promise<Application[]>;
  applicationForJob: (jobId: string) => Application | undefined;
  upsertApplication: (application: Application) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const uploadResume = useCallback(async (file: File) => {
    const { data } = await resumeApi.upload(file);
    setResume(data);
    return data;
  }, []);

  const parseResume = useCallback(async () => {
    if (!resume) throw new Error("Upload a resume first.");
    const { data } = await resumeApi.parse(resume.id);
    setResume(data);
    return data;
  }, [resume]);

  const refreshJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const { data } = await jobsApi.list();
      setJobs(data);
      return data;
    } finally {
      setJobsLoading(false);
    }
  }, []);

  const fetchLiveJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const { data } = await jobsApi.fetchLive();
      setJobs(data);
      return data;
    } finally {
      setJobsLoading(false);
    }
  }, []);

  const refreshApplications = useCallback(async () => {
    setApplicationsLoading(true);
    try {
      const { data } = await applicationsApi.list();
      setApplications(data);
      return data;
    } finally {
      setApplicationsLoading(false);
    }
  }, []);

  const applicationForJob = useCallback(
    (jobId: string) => applications.find((a) => a.job_id === jobId),
    [applications]
  );

  const upsertApplication = useCallback((application: Application) => {
    setApplications((prev) => {
      const idx = prev.findIndex((a) => a.id === application.id);
      if (idx === -1) return [application, ...prev];
      const next = [...prev];
      next[idx] = application;
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      resume,
      jobs,
      applications,
      jobsLoading,
      applicationsLoading,
      uploadResume,
      parseResume,
      fetchLiveJobs,
      refreshJobs,
      refreshApplications,
      applicationForJob,
      upsertApplication,
    }),
    [
      resume,
      jobs,
      applications,
      jobsLoading,
      applicationsLoading,
      uploadResume,
      parseResume,
      fetchLiveJobs,
      refreshJobs,
      refreshApplications,
      applicationForJob,
      upsertApplication,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
