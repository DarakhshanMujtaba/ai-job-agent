import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, FileEdit, Mic } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { bandForScore, CircularScore } from "@/components/ui/CircularScore";
import type { Application, Job } from "@/types";

export function FitScoreTab({
  application,
  job,
  onTailor,
  onInterviewPrep,
  tailoring,
  preppingInterview,
}: {
  application: Application;
  job?: Job;
  onTailor: () => void;
  onInterviewPrep: () => void;
  tailoring: boolean;
  preppingInterview: boolean;
}) {
  const score = application.fit_score ?? 0;
  const band = bandForScore(score);
  const isLow = score < 40;

  return (
    <div className="space-y-6">
      <Card className="p-8 flex flex-col md:flex-row items-center gap-8">
        <CircularScore score={score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              tone={score < 40 ? "red" : score <= 70 ? "amber" : "green"}
            >
              {band.label}
            </Badge>
            {job && (
              <span className="text-xs text-void-400 truncate">
                for {job.title}{job.company ? ` at ${job.company}` : ""}
              </span>
            )}
          </div>
          <h3 className="font-display text-lg font-semibold text-void-50 mb-2">
            Why this score?
          </h3>
          <p className="text-sm text-void-200 leading-relaxed">
            {application.fit_reasoning || "No reasoning was returned."}
          </p>
        </div>
      </Card>

      {isLow && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/[0.07] px-5 py-4"
        >
          <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-300">
              This is a weak match &mdash; applying may waste your time.
            </p>
            <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
              The agent scored this below 40/100. Read the reasoning above
              before deciding to proceed. We won't sugarcoat it: a low score
              usually means the core requirements don't line up with your
              background.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          icon={<FileEdit size={16} />}
          iconRight={<ArrowRight size={15} />}
          loading={tailoring}
          onClick={onTailor}
          className="flex-1"
        >
          {application.tailored_summary
            ? "Regenerate tailored application"
            : "Generate tailored application"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          icon={<Mic size={16} />}
          loading={preppingInterview}
          onClick={onInterviewPrep}
          className="flex-1"
        >
          {application.interview_prep
            ? "Regenerate interview prep"
            : "Prep for interview"}
        </Button>
      </div>
    </div>
  );
}
