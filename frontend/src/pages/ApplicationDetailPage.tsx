import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, FileEdit, Gauge, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FitScoreTab } from "@/components/application/FitScoreTab";
import { InterviewPrepTab } from "@/components/application/InterviewPrepTab";
import { TailoredContentTab } from "@/components/application/TailoredContentTab";
import { PageTransition } from "@/components/ui/PageTransition";
import { Tabs } from "@/components/ui/Tabs";
import { extractErrorMessage } from "@/api/client";
import { applicationsApi } from "@/api/endpoints";
import { useData } from "@/context/DataContext";

type TabKey = "fit" | "tailored" | "interview";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, jobs, refreshApplications, refreshJobs, upsertApplication } =
    useData();
  const [tab, setTab] = useState<TabKey>("fit");
  const [loading, setLoading] = useState(true);
  const [tailoring, setTailoring] = useState(false);
  const [preppingInterview, setPreppingInterview] = useState(false);

  const application = applications.find((a) => a.id === id);
  const job = jobs.find((j) => j.id === application?.job_id);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await Promise.all([
          jobs.length === 0 ? refreshJobs() : Promise.resolve(),
          refreshApplications(),
        ]);
      } catch (err) {
        if (!cancelled) toast.error(extractErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTailor = async () => {
    if (!id) return;
    setTailoring(true);
    try {
      const { data } = await applicationsApi.tailor(id);
      upsertApplication(data);
      setTab("tailored");
      toast.success("Tailored application generated");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setTailoring(false);
    }
  };

  const handleInterviewPrep = async () => {
    if (!id) return;
    setPreppingInterview(true);
    try {
      const { data } = await applicationsApi.interviewPrep(id);
      upsertApplication(data);
      setTab("interview");
      toast.success("Interview prep ready");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setPreppingInterview(false);
    }
  };

  if (loading && !application) {
    return (
      <div className="flex items-center justify-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-void-600 border-t-amber-400"
        />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-24">
        <p className="text-void-300">Application not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-amber-400 text-sm hover:underline"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <PageTransition>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-void-300 hover:text-void-50 mb-4 transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-void-50">
          {job?.title ?? "Application"}
        </h1>
        {job?.company && (
          <p className="text-sm text-void-300 mt-1">
            {job.company}
            {job.location ? ` · ${job.location}` : ""}
          </p>
        )}
      </div>

      <Tabs
        tabs={[
          { key: "fit", label: "Fit score", icon: <Gauge size={14} /> },
          { key: "tailored", label: "Tailored content", icon: <FileEdit size={14} /> },
          { key: "interview", label: "Interview prep", icon: <Mic size={14} /> },
        ]}
        active={tab}
        onChange={(k) => setTab(k as TabKey)}
      />

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "fit" && (
              <FitScoreTab
                application={application}
                job={job}
                onTailor={handleTailor}
                onInterviewPrep={handleInterviewPrep}
                tailoring={tailoring}
                preppingInterview={preppingInterview}
              />
            )}
            {tab === "tailored" && (
              <TailoredContentTab
                application={application}
                onTailor={handleTailor}
                tailoring={tailoring}
              />
            )}
            {tab === "interview" && (
              <InterviewPrepTab
                application={application}
                onGenerate={handleInterviewPrep}
                generating={preppingInterview}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
