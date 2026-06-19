import { motion } from "framer-motion";
import { CheckCircle2, Circle, Zap, Target } from "lucide-react";
import { getMilestoneStatus, getMilestoneColor, getMilestoneTextColor } from "@/lib/progress";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  title?: string;
  showConnector?: boolean;
}

export default function MilestoneTracker({
  milestones,
  title,
  showConnector = true,
}: MilestoneTrackerProps) {
  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {title && (
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-semibold text-primary whitespace-nowrap">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Vertical connector line */}
        {showConnector && milestones.length > 1 && (
          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-muted" />
        )}

        {/* Milestones */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const status = getMilestoneStatus(milestone.completed ? 100 : 0);
            const isNext = !milestone.completed && milestones.slice(0, index).every(m => m.completed);

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                {/* Milestone dot */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    animate={isNext ? { scale: [1, 1.2, 1] } : {}}
                    transition={isNext ? { duration: 2, repeat: Infinity } : {}}
                    className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      milestone.completed
                        ? "border-secondary bg-secondary/10"
                        : isNext
                          ? "border-primary bg-primary/10"
                          : "border-muted bg-muted/50"
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-secondary" />
                    ) : isNext ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                        <Zap className="h-6 w-6 text-primary" />
                      </motion.div>
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </motion.div>
                </div>

                {/* Milestone content */}
                <div className="flex-1 pt-1">
                  <div className={`rounded-lg border p-3 transition-all ${
                    milestone.completed
                      ? "border-secondary/30 bg-secondary/5"
                      : isNext
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card"
                  }`}>
                    <h4 className={`font-semibold ${
                      milestone.completed
                        ? "text-muted-foreground line-through"
                        : isNext
                          ? "text-primary"
                          : "text-foreground"
                    }`}>
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    )}
                    {isNext && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
                        <Target className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">Next</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-secondary">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{totalCount - completedCount}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">{progress}%</p>
            <p className="text-xs text-muted-foreground">Progress</p>
          </div>
        </div>
      </div>
    </div>
  );
}
