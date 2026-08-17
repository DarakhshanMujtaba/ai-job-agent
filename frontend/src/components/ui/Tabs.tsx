import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

export function Tabs({
  tabs,
  active,
  onChange,
  layoutId = "tab-indicator",
}: {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
  layoutId?: string;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-void-600 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
              isActive ? "text-amber-400" : "text-void-300 hover:text-void-100"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
