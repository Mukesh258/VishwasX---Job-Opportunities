import { CheckCircle2, Circle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { isItemCompleted, toggleItemCompletion } from "@/lib/progress";

interface ProgressCardProps {
  id: string;
  title: string;
  description?: string;
  onToggle?: () => void;
}

export default function ProgressCard({ id, title, description, onToggle }: ProgressCardProps) {
  const isCompleted = isItemCompleted(id);

  const handleToggle = () => {
    toggleItemCompletion(id);
    onToggle?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-lg border-2 p-4 transition-all cursor-pointer ${
        isCompleted
          ? "border-secondary/50 bg-secondary/5"
          : "border-border bg-card hover:border-primary/50"
      }`}
      onClick={handleToggle}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={false}
          animate={{ scale: isCompleted ? 1.1 : 1 }}
          className="mt-0.5 shrink-0"
        >
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-secondary" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold transition-colors ${
            isCompleted ? "text-muted-foreground line-through" : "text-foreground"
          }`}>
            {title}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="shrink-0"
          >
            <Zap className="h-5 w-5 text-secondary" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
