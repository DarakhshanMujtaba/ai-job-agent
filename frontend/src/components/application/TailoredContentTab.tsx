import { motion } from "framer-motion";
import {
  Check,
  Copy,
  FileEdit,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Application } from "@/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 rounded-lg border border-void-500 px-2.5 py-1.5 text-xs text-void-300 hover:text-void-50 hover:border-void-400 transition-colors"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function TailoredContentTab({
  application,
  onTailor,
  tailoring,
}: {
  application: Application;
  onTailor: () => void;
  tailoring: boolean;
}) {
  if (!application.tailored_summary && !application.cover_letter) {
    return (
      <Card className="p-2">
        <EmptyState
          icon={<FileEdit size={22} />}
          title="No tailored content yet"
          description="Generate a resume summary and cover letter written from your real experience &mdash; not invented."
          action={
            <Button variant="primary" loading={tailoring} icon={<Sparkles size={15} />} onClick={onTailor}>
              Generate tailored application
            </Button>
          }
        />
      </Card>
    );
  }

  const report = application.authenticity_report;
  const injection = report?.injection_check;

  return (
    <div className="space-y-6">
      {injection?.is_suspicious && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-red-500/50 bg-red-500/10 p-5"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-red-300">
                Possible prompt injection detected
              </h3>
              <p className="text-sm text-red-200/90 mt-1.5 leading-relaxed">
                {injection.note} The job posting may contain hidden text
                trying to manipulate this AI's output. Review the generated
                content carefully before using it.
              </p>
              {injection.matched_patterns.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {injection.matched_patterns.map((pattern, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-red-500/15 border border-red-500/30 px-2 py-1 font-mono text-[11px] text-red-200"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-void-50">
          Tailored application
        </h2>
        <Button
          size="sm"
          variant="outline"
          icon={<RefreshCw size={13} />}
          loading={tailoring}
          onClick={onTailor}
        >
          Regenerate
        </Button>
      </div>

      {application.tailored_summary && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
              Resume summary
            </h3>
            <CopyButton text={application.tailored_summary} />
          </div>
          <p className="text-sm text-void-100 leading-relaxed">
            {application.tailored_summary}
          </p>
        </Card>
      )}

      {application.cover_letter && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">
              Cover letter
            </h3>
            <CopyButton text={application.cover_letter} />
          </div>
          <p className="text-sm text-void-100 leading-relaxed whitespace-pre-wrap">
            {application.cover_letter}
          </p>
        </Card>
      )}

      {report && (
        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-3">
            {report.flagged_phrases.length === 0 ? (
              <ShieldCheck size={16} className="text-emerald-400" />
            ) : (
              <ShieldAlert size={16} className="text-amber-400" />
            )}
            <h3 className="text-sm font-semibold text-void-50">
              Authenticity check
            </h3>
          </div>
          <p className="text-sm text-void-300 leading-relaxed">
            {report.verdict}
          </p>
          {report.flagged_phrases.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {report.flagged_phrases.map((phrase, i) => (
                <Badge key={i} tone="amber">
                  {phrase}
                </Badge>
              ))}
            </div>
          )}
          {!injection?.is_suspicious && injection && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400/90">
              <ShieldCheck size={12} /> {injection.note}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
