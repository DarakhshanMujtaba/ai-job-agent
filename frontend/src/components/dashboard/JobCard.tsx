import { motion } from "framer-motion";
import { Building2, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { bandForScore } from "@/components/ui/CircularScore";
import { extractErrorMessage } from "@/api/client";
import { applicationsApi } from "@/api/endpoints";
import { useData } from "@/context/DataContext";
import { stripHtml } from "@/lib/text";
import type { Job } from "@/types";

export function JobCard({ job, index }: { job: Job; index: number }) {
  const { resume, applicationForJob, upsertApplication } = useData();
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();
  const existing = applicationForJob(job.id);
  const canCheckFit = !!resume?.parsed_json;

  const handleCheckFit = async () => {
    if (!resume?.parsed_json) {
      toast.error("Upload and parse your resume first.");
      return;
    }
    setChecking(true);
    try {
      const { data } = await applicationsApi.fitScore(resume.id, job.id);
      upsertApplication(data);
      navigate(`/applications/${data.id}`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setChecking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35 }}
    >
      <Card hoverable className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-void-50 truncate">
              {job.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-void-300">
              {job.company && (
                <span className="flex items-center gap-1">
                  <Building2 size={12} /> {job.company}
                </span>
              )}
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {job.location}
                </span>
              )}
            </div>
          </div>
          {job.source_url && (
            <a
              href={job.source_url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border border-void-500 text-void-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
              title="View original posting"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {job.description && (
          <p className="mt-3 text-sm text-void-300 leading-relaxed line-clamp-3 flex-1">
            {stripHtml(job.description)}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          {job.source && (
            <Badge tone="neutral" className="capitalize">
              {job.source}
            </Badge>
          )}

          {existing ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/applications/${existing.id}`)}
              className="ml-auto"
              style={
                existing.fit_score != null
                  ? {
                      borderColor: `${bandForScore(existing.fit_score).color}55`,
                      color: bandForScore(existing.fit_score).color,
                    }
                  : undefined
              }
            >
              {existing.fit_score != null ? `${existing.fit_score} / 100` : "View"}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              loading={checking}
              disabled={!canCheckFit}
              icon={!checking && <Sparkles size={13} />}
              onClick={handleCheckFit}
              className="ml-auto"
              title={!canCheckFit ? "Parse your resume first" : undefined}
            >
              Check fit
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
