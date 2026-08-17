import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "amber" | "teal" | "red" | "green";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-void-600/60 text-void-200 border-void-500/60",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  teal: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  red: "bg-red-500/10 text-red-400 border-red-500/30",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
