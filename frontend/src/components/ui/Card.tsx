import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode, forwardRef } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLMotionProps<"div"> {
  children?: ReactNode;
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hoverable = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass-panel rounded-2xl shadow-panel",
          hoverable &&
            "transition-all duration-200 hover:border-amber-500/30 hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";
