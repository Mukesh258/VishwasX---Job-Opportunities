import { motion } from "framer-motion";
import { Zap, Target, BookOpen, MessageSquare } from "lucide-react";

interface Scores {
  skillReadiness: number;
  industryAlignment: number;
  interviewReadiness: number;
  overall: number;
}

const circumference = 2 * Math.PI * 54; // radius = 54

const ScoreMetric = ({ 
  label, value, icon: Icon, color, delay 
}: { 
  label: string; value: number; icon: any; color: string; delay: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border hover:border-primary/20 transition-colors"
  >
    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
      <Icon className="h-4.5 w-4.5" style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">{label}</span>
        <span className="text-sm font-black" style={{ color }}>{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  </motion.div>
);

const getScoreGrade = (score: number) => {
  if (score >= 80) return { label: "Excellent", color: "#22c55e" };
  if (score >= 60) return { label: "Good", color: "#eab308" };
  if (score >= 40) return { label: "Average", color: "#f97316" };
  return { label: "Needs Work", color: "#ef4444" };
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#a855f7";
  if (score >= 40) return "#f97316";
  return "#ef4444";
};

const CareerReadinessScore = ({ scores }: { scores: Scores }) => {
  const grade = getScoreGrade(scores.overall);
  const strokeColor = getScoreColor(scores.overall);
  const dashOffset = circumference - (scores.overall / 100) * circumference;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Target className="h-4 w-4" />
        </div>
        <h3 className="font-display text-lg font-black text-foreground">ATS Score</h3>
      </div>

      {/* Circular Gauge */}
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            {/* Score arc */}
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              transform="rotate(-90 60 60)"
              style={{ filter: `drop-shadow(0 0 6px ${strokeColor}40)` }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-black"
              style={{ color: strokeColor }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            >
              {scores.overall}
            </motion.span>
            <motion.span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-0.5"
              style={{ color: grade.color, background: `${grade.color}15` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              {grade.label}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Metric Bars */}
      <div className="space-y-2 mt-4">
        <ScoreMetric label="Skills" value={scores.skillReadiness} icon={Zap} color="#a855f7" delay={0.4} />
        <ScoreMetric label="Industry" value={scores.industryAlignment} icon={BookOpen} color="#f97316" delay={0.6} />
        <ScoreMetric label="Interview" value={scores.interviewReadiness} icon={MessageSquare} color="#eab308" delay={0.8} />
      </div>
    </div>
  );
};

export default CareerReadinessScore;
