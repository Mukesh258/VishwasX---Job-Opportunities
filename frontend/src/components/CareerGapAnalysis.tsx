import { TrendingUp, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { CareerGapAnalysis } from "@/lib/mockData";
import ExportButton from "@/components/ExportButton";

interface CareerGapAnalysisProps {
  analysis: CareerGapAnalysis;
}

export default function CareerGapAnalysisComponent({ analysis }: CareerGapAnalysisProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-semibold text-foreground">Career Gap Impact Analysis</h2>
        </div>
        <ExportButton type="career-analysis" label="Export Analysis" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Old Skills Relevance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-secondary" />
            <h3 className="font-semibold text-foreground">Your Previous Skills Relevance</h3>
          </div>
          <div className="mb-3 flex items-end gap-2">
            <div className="text-3xl font-bold text-secondary">{analysis.oldSkillsRelevance}%</div>
            <span className="text-sm text-muted-foreground">still relevant</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full gradient-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${analysis.oldSkillsRelevance}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Your foundational skills remain valuable. Focus on updating them with modern practices.
          </p>
        </motion.div>

        {/* Transferable Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">Transferable Skills</h3>
          </div>
          <div className="space-y-2">
            {analysis.transferableSkills.length > 0 ? (
              analysis.transferableSkills.map((skill) => (
                <div key={skill} className="flex items-center gap-2 rounded-lg bg-accent/5 px-3 py-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">{skill}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Develop soft skills like communication and leadership.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Industry Evolution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-5 shadow-card"
      >
        <div className="mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Industry Evolution</h3>
        </div>
        <div className="space-y-2">
          {analysis.industryEvolution.map((evolution, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">{evolution}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills to Update */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-accent/30 bg-accent/5 p-5"
        >
          <h3 className="mb-3 font-semibold text-foreground">Priority Skills to Update</h3>
          <div className="space-y-2">
            {analysis.skillsToUpdate.map((skill) => (
              <div key={skill} className="flex items-center gap-2 rounded-lg bg-background px-3 py-2">
                <AlertCircle className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground">{skill}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-primary/30 bg-primary/5 p-5"
        >
          <h3 className="mb-3 font-semibold text-foreground">New Trends to Learn</h3>
          <div className="space-y-2">
            {analysis.newTrendsToLearn.map((trend) => (
              <div key={trend} className="flex items-center gap-2 rounded-lg bg-background px-3 py-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{trend}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
