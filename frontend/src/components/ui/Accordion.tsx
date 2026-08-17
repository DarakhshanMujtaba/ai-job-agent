import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function AccordionItem({
  title,
  subtitle,
  children,
  defaultOpen = false,
  index,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  index?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        {typeof index === "number" && (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-semibold text-amber-400 border border-amber-500/30">
            {index + 1}
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block font-medium text-void-50">{title}</span>
          {subtitle && (
            <span className="block text-xs text-void-300 mt-1">
              {subtitle}
            </span>
          )}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-void-300 mt-1"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className={cn("px-5 pb-5 pt-1 text-sm text-void-200 leading-relaxed", typeof index === "number" && "pl-14")}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
