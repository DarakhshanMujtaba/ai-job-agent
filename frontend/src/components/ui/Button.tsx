import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-amber-400 to-amber-600 text-void-950 font-semibold shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_8px_20px_-6px_rgba(245,165,36,0.5)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-void-700 text-void-50 border border-void-500 hover:bg-void-600 hover:border-void-400 disabled:opacity-50",
  outline:
    "bg-transparent border border-void-500 text-void-100 hover:border-amber-500 hover:text-amber-400 disabled:opacity-50",
  ghost:
    "bg-transparent text-void-200 hover:bg-void-700 hover:text-void-50 disabled:opacity-50",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
  md: "text-sm px-4 py-2.5 gap-2 rounded-xl",
  lg: "text-base px-6 py-3.5 gap-2.5 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : { scale: 1.02, y: -1 }}
        whileTap={disabled || loading ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-colors duration-150 select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />
        ) : (
          icon
        )}
        {children}
        {!loading && iconRight}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
