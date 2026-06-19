import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  size = "md",
  animated = true,
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const containerHeight = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  return (
    <div className={`w-full ${containerHeight[size]}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-primary">{progress}%</span>
          )}
        </div>
      )}

      <div className={`w-full rounded-full bg-muted overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className="h-full rounded-full gradient-primary"
          initial={animated ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { duration: 1, ease: "easeOut" } : { duration: 0.3 }}
        />
      </div>
    </div>
  );
}
