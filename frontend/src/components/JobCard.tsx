import { Briefcase, ShieldCheck, Zap } from "lucide-react";
import { getMatchTextColor } from "@/lib/skillMatcher";

const typeLabels: Record<string, { label: string; className: string }> = {
  "Full-time": { label: "Full-time", className: "bg-secondary/10 text-secondary" },
  Returnship: { label: "Returnship", className: "bg-primary/10 text-primary" },
  Internship: { label: "Internship", className: "bg-accent/20 text-accent-foreground" },
};

interface JobCardProps {
  job: any;
  onApply?: (job: any) => void;
  isApplied?: boolean;
  skillMatchPercentage?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

const JobCard = ({ 
  job, 
  onApply, 
  isApplied,
  skillMatchPercentage,
  matchedSkills = [],
  missingSkills = []
}: JobCardProps) => {
  const badge = typeLabels[job.type] || { label: job.type, className: "bg-muted text-muted-foreground" };
  const hasSkillMatch = typeof skillMatchPercentage === "number";
  
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-lg font-semibold text-foreground">{job.title}</h4>
            {job.isVerifiedCompany && (
               <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                 <ShieldCheck className="h-3 w-3" /> VERIFIED
               </div>
            )}
            {hasSkillMatch && (
              <div className={`flex items-center gap-1 ${getMatchTextColor(skillMatchPercentage)} px-2 py-0.5 rounded-lg text-xs font-bold bg-opacity-10`}>
                <Zap className="h-3 w-3" />
                {skillMatchPercentage}% Match
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{job.description}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badge.className}`}>{badge.label}</span>
      </div>
      
      <div className="mb-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {job.skills?.map((s: string) => {
            const isMatched = matchedSkills.some(ms => ms.toLowerCase() === s.toLowerCase());
            return (
              <span 
                key={s} 
                className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors ${
                  isMatched
                    ? "bg-green-500/20 text-green-700 border border-green-500/30"
                    : "bg-muted px-2 py-0.5 text-muted-foreground"
                }`}
              >
                {s}
              </span>
            );
          })}
        </div>
        {hasSkillMatch && missingSkills.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Missing: {missingSkills.slice(0, 2).join(", ")}{missingSkills.length > 2 ? `+${missingSkills.length - 2}` : ""}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          {job.companyName}
        </div>
        <button 
          onClick={() => !isApplied && onApply && onApply(job)}
          disabled={isApplied}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-all shadow-sm ${
            isApplied 
              ? "bg-secondary/10 text-secondary border border-secondary/20 cursor-default" 
              : "gradient-primary text-primary-foreground hover:scale-105"
          }`}
        >
          {isApplied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
