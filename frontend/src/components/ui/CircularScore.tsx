import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function bandForScore(score: number) {
  if (score < 40)
    return {
      color: "#f2545b",
      glow: "rgba(242, 84, 91, 0.35)",
      label: "Weak match",
    };
  if (score <= 70)
    return {
      color: "#f5a524",
      glow: "rgba(245, 165, 36, 0.35)",
      label: "Moderate match",
    };
  return {
    color: "#3ecf8e",
    glow: "rgba(62, 207, 142, 0.35)",
    label: "Strong match",
  };
}

export function CircularScore({
  score,
  size = 168,
  strokeWidth = 12,
  label,
}: CircularScoreProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const band = bandForScore(clamped);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);
  const dashOffset = useTransform(
    progress,
    (v) => circumference - (v / 100) * circumference
  );

  useEffect(() => {
    const controls = animate(progress, clamped, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.15,
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [clamped, progress]);

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-void-700)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={band.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: dashOffset,
            filter: `drop-shadow(0 0 10px ${band.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl font-bold tabular-nums"
          style={{ color: band.color }}
        >
          {displayValue}
        </motion.span>
        <span className="text-xs text-void-300 mt-0.5">/ 100</span>
      </div>
      {label !== "" && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-3 text-sm font-medium"
          style={{ color: band.color }}
        >
          {label ?? band.label}
        </motion.span>
      )}
    </div>
  );
}

export { bandForScore };
