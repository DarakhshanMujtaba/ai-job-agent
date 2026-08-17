import { Mic, RefreshCw } from "lucide-react";
import { AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Application } from "@/types";

export function InterviewPrepTab({
  application,
  onGenerate,
  generating,
}: {
  application: Application;
  onGenerate: () => void;
  generating: boolean;
}) {
  const questions = application.interview_prep?.questions ?? [];

  if (questions.length === 0) {
    return (
      <Card className="p-2">
        <EmptyState
          icon={<Mic size={22} />}
          title="No interview prep yet"
          description="Generate likely interview questions with STAR-format answer drafts based on your actual resume."
          action={
            <Button variant="primary" loading={generating} onClick={onGenerate}>
              Generate interview prep
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-void-50">
          Likely interview questions
        </h2>
        <Button
          size="sm"
          variant="outline"
          icon={<RefreshCw size={13} />}
          loading={generating}
          onClick={onGenerate}
        >
          Regenerate
        </Button>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <AccordionItem
            key={i}
            index={i}
            title={q.question}
            subtitle={q.why_asked}
            defaultOpen={i === 0}
          >
            <div className="rounded-xl bg-void-800/70 border border-void-600 p-4">
              <p className="text-xs font-medium text-teal-400 mb-1.5 uppercase tracking-wide">
                Answer draft
              </p>
              <p className="whitespace-pre-wrap">{q.answer_draft}</p>
            </div>
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}
