import { motion } from "framer-motion";
import { Briefcase, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { JobCard } from "@/components/dashboard/JobCard";
import { ResumeUpload } from "@/components/dashboard/ResumeUpload";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { extractErrorMessage } from "@/api/client";
import { useData } from "@/context/DataContext";

export default function DashboardPage() {
  const { jobs, jobsLoading, refreshJobs, fetchLiveJobs, refreshApplications } =
    useData();
  const [fetchingLive, setFetchingLive] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    refreshJobs().catch((err) => toast.error(extractErrorMessage(err)));
    refreshApplications().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchLive = async () => {
    setFetchingLive(true);
    try {
      const fetched = await fetchLiveJobs();
      toast.success(`Fetched ${fetched.length} live listings`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setFetchingLive(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const q = query.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
      <div className="lg:sticky lg:top-24 space-y-6">
        <ResumeUpload />
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-void-50">
              Live job feed
            </h1>
            <p className="text-sm text-void-300 mt-1">
              {jobs.length > 0
                ? `${jobs.length} listings saved`
                : "Fetch listings to get started"}
            </p>
          </div>
          <Button
            onClick={handleFetchLive}
            loading={fetchingLive}
            icon={!fetchingLive && <RefreshCw size={15} />}
          >
            Fetch new jobs
          </Button>
        </div>

        {jobs.length > 0 && (
          <div className="relative mb-5">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-void-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, company, or location..."
              className="w-full rounded-xl border border-void-500 bg-void-800/60 py-2.5 pl-10 pr-4 text-sm text-void-100 placeholder:text-void-400 outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/15"
            />
          </div>
        )}

        {jobsLoading && jobs.length === 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={22} />}
            title={jobs.length === 0 ? "No jobs yet" : "No matches"}
            description={
              jobs.length === 0
                ? "Fetch live listings to start scoring your fit against real openings."
                : "Try a different search term."
            }
            action={
              jobs.length === 0 && (
                <Button onClick={handleFetchLive} loading={fetchingLive}>
                  Fetch new jobs
                </Button>
              )
            }
          />
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 gap-4"
          >
            {filteredJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
