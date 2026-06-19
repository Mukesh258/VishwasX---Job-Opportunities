import { useState, useEffect } from "react";
import { BookOpen, ExternalLink, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import type { RoadmapMonth } from "@/lib/mockData";
import { isItemCompleted, toggleItemCompletion, calculateProgress } from "@/lib/progress";
import ProgressBar from "./ProgressBar";

interface LearningTimelineWithProgressProps {
  roadmap: RoadmapMonth[];
}

export default function LearningTimelineWithProgress({ roadmap }: LearningTimelineWithProgressProps) {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(roadmap[0]?.month?.toString() || null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate overall progress
  const totalTasks = roadmap.reduce((sum, month) => sum + month.tasks.length, 0);
  const completedTasks = roadmap.reduce((sum, month) => {
    return sum + month.tasks.filter((task, idx) => isItemCompleted(`${month.month}-${idx}`)).length;
  }, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskToggle = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Learning Progress</h3>
          <span className="text-sm font-semibold text-primary">{completedTasks}/{totalTasks} tasks</span>
        </div>
        <ProgressBar progress={overallProgress} showPercentage={true} size="lg" />
        
        {/* Progress milestones */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map(milestone => (
            <div
              key={milestone}
              className={`rounded-lg p-2 text-center text-xs font-medium transition-all ${
                overallProgress >= milestone
                  ? "bg-secondary/20 text-secondary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {milestone}%
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative space-y-4 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:to-muted">
        {roadmap.map((month, monthIdx) => {
          const monthTasks = month.tasks;
          const completedMonthTasks = monthTasks.filter((_, idx) => 
            isItemCompleted(`${month.month}-${idx}`)
          ).length;
          const monthProgress = monthTasks.length > 0 
            ? Math.round((completedMonthTasks / monthTasks.length) * 100)
            : 0;
          const isExpanded = expandedMonth === month.month.toString();

          return (
            <motion.div
              key={month.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: monthIdx * 0.1 }}
              className="relative"
            >
              {/* Month dot */}
              <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full gradient-primary">
                <span className="text-xs font-bold text-primary-foreground">{month.month}</span>
              </div>

              {/* Month card */}
              <motion.div
                className={`rounded-xl border-2 transition-all cursor-pointer ${
                  isExpanded
                    ? "border-primary/50 bg-primary/5"
                    : monthProgress === 100
                      ? "border-secondary/50 bg-secondary/5"
                      : "border-border bg-card hover:border-primary/30"
                }`}
                onClick={() => setExpandedMonth(isExpanded ? null : month.month.toString())}
              >
                {/* Month header */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-semibold text-foreground">
                        Month {month.month}: {month.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{monthTasks.length} tasks</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{monthProgress}%</div>
                      <div className="text-xs text-muted-foreground">{completedMonthTasks}/{monthTasks.length}</div>
                    </div>
                  </div>

                  {/* Month progress bar */}
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full gradient-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${monthProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border px-4 py-4 space-y-3"
                  >
                    {/* Tasks */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-semibold text-foreground">Tasks</h5>
                      {monthTasks.map((task, taskIdx) => {
                        const taskId = `${month.month}-${taskIdx}`;
                        const isCompleted = isItemCompleted(taskId);

                        return (
                          <motion.div
                            key={taskIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                              isCompleted
                                ? "bg-secondary/10"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleItemCompletion(taskId);
                              handleTaskToggle();
                            }}
                          >
                            <motion.div
                              animate={{ scale: isCompleted ? 1.1 : 1 }}
                              className="mt-0.5 shrink-0"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-secondary" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </motion.div>
                            <span className={`text-sm flex-1 ${
                              isCompleted
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            }`}>
                              {task}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Resources */}
                    {month.resources.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <h5 className="text-sm font-semibold text-foreground">Resources</h5>
                        <div className="flex flex-wrap gap-2">
                          {month.resources.map((r, i) => (
                            <a
                              key={i}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              {r.name} <span className="text-primary">({r.platform})</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion message */}
      {overallProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border-2 border-secondary/50 bg-secondary/10 p-4 text-center"
        >
          <p className="font-semibold text-secondary">🎉 Congratulations! You've completed your learning roadmap!</p>
          <p className="text-sm text-muted-foreground mt-1">You're ready for your next career step.</p>
        </motion.div>
      )}
    </div>
  );
}
