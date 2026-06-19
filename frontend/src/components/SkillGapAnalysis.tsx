import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { SkillGap } from "@/lib/mockData";

const SkillGapAnalysis = ({ data }: { data: SkillGap }) => (
  <div className="grid gap-4 sm:grid-cols-3">
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-secondary">
        <CheckCircle2 className="h-5 w-5" />
        <h3 className="font-display text-lg font-semibold">Skills You Have</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.currentSkills.map(s => (
          <span key={s} className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">{s}</span>
        ))}
      </div>
    </div>
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-destructive">
        <XCircle className="h-5 w-5" />
        <h3 className="font-display text-lg font-semibold">Skills You Need</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.missingSkills.map(s => (
          <span key={s} className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">{s}</span>
        ))}
      </div>
    </div>
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-accent-foreground">
        <Lightbulb className="h-5 w-5 text-accent" />
        <h3 className="font-display text-lg font-semibold">Recommended</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.recommendedSkills.map(s => (
          <span key={s} className="rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent-foreground">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

export default SkillGapAnalysis;
