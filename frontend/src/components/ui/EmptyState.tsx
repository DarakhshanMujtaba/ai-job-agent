import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-void-700/60 text-void-300 border border-void-500/60">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-void-50">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-void-300">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
