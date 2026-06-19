import { Lightbulb, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { AIInsight } from "@/lib/mockData";

interface AIInsightsSectionProps {
  insights: AIInsight[];
}

const priorityColors = {
  high: "border-accent bg-accent/5",
  medium: "border-primary/30 bg-primary/5",
  low: "border-secondary/30 bg-secondary/5",
};

const categoryIcons = {
  skill: Zap,
  industry: TrendingUp,
  trend: TrendingUp,
  opportunity: Lightbulb,
};

export default function AIInsightsSection({ insights }: AIInsightsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold text-foreground">AI Career Insights</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, idx) => {
          const Icon = categoryIcons[insight.category];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-xl border-2 p-4 ${priorityColors[insight.priority]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{insight.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                  {insight.actionable && (
                    <div className="mt-3 rounded-lg bg-background/50 p-2">
                      <p className="text-xs font-medium text-primary">💡 {insight.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
