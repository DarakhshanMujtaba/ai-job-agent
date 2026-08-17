import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { extractErrorMessage } from "@/api/client";
import { useData } from "@/context/DataContext";

export function ResumeUpload() {
  const { resume, uploadResume, parseResume } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isParsed = !!resume?.parsed_json;
  const skills = resume?.parsed_json?.skills ?? [];

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      await uploadResume(file);
      toast.success(`${file.name} uploaded`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleParse = async () => {
    setParsing(true);
    try {
      await parseResume();
      toast.success("Resume parsed successfully");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setParsing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/25">
          <FileText size={15} />
        </div>
        <h2 className="font-display text-base font-semibold text-void-50">
          Your resume
        </h2>
      </div>
      <p className="text-xs text-void-300 mb-4 ml-[42px]">
        Upload once, then parse so the agent can score jobs against it.
      </p>

      <AnimatePresence mode="wait">
        {!resume ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-amber-500/60 bg-amber-500/5"
                : "border-void-500 hover:border-void-400 hover:bg-void-800/40"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            {uploading ? (
              <Loader2 className="animate-spin text-amber-400" size={26} />
            ) : (
              <UploadCloud className="text-void-300" size={26} />
            )}
            <p className="text-sm font-medium text-void-100">
              {uploading ? "Uploading..." : "Drop your resume here"}
            </p>
            <p className="text-xs text-void-400">PDF or DOCX &middot; click to browse</p>
          </motion.div>
        ) : (
          <motion.div
            key="uploaded"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between rounded-xl border border-void-600 bg-void-800/60 px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-sm text-void-100 truncate">
                  {resume.parsed_json?.full_name || "Resume uploaded"}
                </span>
              </div>
              {!isParsed && (
                <Button
                  size="sm"
                  variant="primary"
                  loading={parsing}
                  icon={!parsing && <Sparkles size={13} />}
                  onClick={handleParse}
                >
                  Parse
                </Button>
              )}
            </div>

            {isParsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                {resume.parsed_json?.summary && (
                  <p className="text-xs text-void-300 leading-relaxed line-clamp-3">
                    {resume.parsed_json.summary}
                  </p>
                )}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 8).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-void-700/70 border border-void-500/60 px-2.5 py-0.5 text-[11px] text-void-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 8 && (
                      <span className="rounded-full px-2.5 py-0.5 text-[11px] text-void-400">
                        +{skills.length - 8} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            <button
              onClick={() => inputRef.current?.click()}
              className="text-xs text-void-400 hover:text-amber-400 transition-colors"
            >
              Replace resume
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
