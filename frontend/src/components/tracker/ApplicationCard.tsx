import { motion } from "framer-motion";
import { FileEdit, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { bandForScore } from "@/components/ui/CircularScore";
import type { Application, Job } from "@/types";

export function ApplicationCard({
  application,
  job,
}: {
  application: Application;
  job?: Job;
}) {
  const navigate = useNavigate();
  const score = application.fit_score ?? 0;
  const band = bandForScore(score);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/applications/${application.id}`)}
      className="cursor-pointer"
    >
      <Card className="p-4 space-y-3" hoverable>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-void-50 truncate">
              {job?.title ?? "Untitled role"}
            </p>
            {job?.company && (
              <p className="text-xs text-void-300 truncate mt-0.5">
                {job.company}
              </p>
            )}
          </div>
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums"
            style={{
              color: band.color,
              background: `${band.color}1a`,
              border: `1px solid ${band.color}40`,
            }}
          >
            {score}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {application.tailored_summary && (
            <span className="flex items-center gap-1 rounded-md bg-void-700/60 px-1.5 py-0.5 text-[10px] text-void-300">
              <FileEdit size={10} /> Tailored
            </span>
          )}
          {application.interview_prep && (
            <span className="flex items-center gap-1 rounded-md bg-void-700/60 px-1.5 py-0.5 text-[10px] text-void-300">
              <Mic size={10} /> Prepped
            </span>
          )}
          {application.authenticity_report?.injection_check?.is_suspicious && (
            <span className="flex items-center gap-1 rounded-md bg-red-500/15 border border-red-500/30 px-1.5 py-0.5 text-[10px] text-red-300">
              Flagged
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
