import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownWideNarrow, Clock, Sparkles, Kanban } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ApplicationCard } from "@/components/tracker/ApplicationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { extractErrorMessage } from "@/api/client";
import { useData } from "@/context/DataContext";
import type { Application } from "@/types";

type SortMode = "score" | "recent";

const COLUMN_ORDER = ["suggested", "tailored"];

function columnLabel(status: string) {
  if (status === "suggested") return "Suggested";
  if (status === "tailored") return "Tailored";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function ApplicationsTrackerPage() {
  const { applications, jobs, applicationsLoading, refreshApplications, refreshJobs } =
    useData();
  const [sortMode, setSortMode] = useState<SortMode>("score");

  useEffect(() => {
    refreshApplications().catch((err) => toast.error(extractErrorMessage(err)));
    if (jobs.length === 0) refreshJobs().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobById = useMemo(() => {
    const map = new Map(jobs.map((j) => [j.id, j]));
    return map;
  }, [jobs]);

  const columns = useMemo(() => {
    const statuses = new Set<string>(COLUMN_ORDER);
    applications.forEach((a) => statuses.add(a.status));
    const ordered = [
      ...COLUMN_ORDER.filter((s) => statuses.has(s)),
      ...[...statuses].filter((s) => !COLUMN_ORDER.includes(s)),
    ];

    return ordered.map((status) => {
      const items = applications.filter((a) => a.status === status);
      const sorted = [...items].sort((a, b) => {
        if (sortMode === "score") {
          return (b.fit_score ?? 0) - (a.fit_score ?? 0);
        }
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      return { status, items: sorted };
    });
  }, [applications, sortMode]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-void-50">
            Applications
          </h1>
          <p className="text-sm text-void-300 mt-1">
            {applications.length} tracked &middot; grouped by status
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-void-600 bg-void-800/60 p-1">
          <button
            onClick={() => setSortMode("score")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              sortMode === "score"
                ? "bg-amber-500/15 text-amber-400"
                : "text-void-300 hover:text-void-50"
            }`}
          >
            <ArrowDownWideNarrow size={13} /> Fit score
          </button>
          <button
            onClick={() => setSortMode("recent")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              sortMode === "recent"
                ? "bg-amber-500/15 text-amber-400"
                : "text-void-300 hover:text-void-50"
            }`}
          >
            <Clock size={13} /> Most recent
          </button>
        </div>
      </div>

      {applicationsLoading && applications.length === 0 ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<Kanban size={22} />}
          title="No applications yet"
          description="Check the fit for a job on your dashboard to start tracking it here."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 items-start">
          {columns.map(({ status, items }) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <h2 className="font-display text-sm font-semibold text-void-100 uppercase tracking-wide">
                  {columnLabel(status)}
                </h2>
                <span className="rounded-full bg-void-700/70 px-2 py-0.5 text-[11px] text-void-300">
                  {items.length}
                </span>
              </div>
              <div className="rounded-2xl border border-dashed border-void-600/80 min-h-[120px] p-2.5 space-y-2.5">
                <AnimatePresence>
                  {items.length === 0 ? (
                    <p className="text-xs text-void-400 text-center py-8">
                      Nothing here yet
                    </p>
                  ) : (
                    items.map((application: Application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        job={jobById.get(application.job_id)}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {applications.some(
        (a) => (a.fit_score ?? 0) >= 70 && a.status === "suggested"
      ) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center gap-2 text-xs text-void-400"
        >
          <Sparkles size={13} className="text-amber-400" />
          You have strong matches waiting to be tailored.
        </motion.div>
      )}
    </div>
  );
}
