import { ArrowRight, Target, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { CareerPath } from "@/lib/mockData";

interface CareerPathCardProps {
  path: CareerPath;
  index: number;
}

export default function CareerPathCard({ path, index }: CareerPathCardProps) {
  const navigate = useNavigate();
  const matchPercentage = path.matchScore;
  const matchColor = matchPercentage >= 85 ? "text-secondary" : matchPercentage >= 70 ? "text-primary" : "text-accent";

  const handleExplorePath = () => {
    // Store the selected career path in localStorage
    localStorage.setItem("selectedCareerPath", JSON.stringify(path));
    // Navigate to roadmap
    navigate("/roadmap");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">{path.role}</h3>
          <p className="text-sm text-muted-foreground">{path.timeline} months to reach this role</p>
        </div>
        <div className={`text-right ${matchColor}`}>
          <div className="text-2xl font-bold">{path.matchScore}%</div>
          <div className="text-xs font-medium">Match Score</div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span>{path.salaryRange}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{path.timeline} months timeline</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-foreground">Career Steps:</p>
        <div className="space-y-1">
          {path.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowRight className="h-3 w-3 text-primary" />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-foreground">Required Skills:</p>
        <div className="flex flex-wrap gap-2">
          {path.requiredSkills.map((skill) => (
            <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button 
        onClick={handleExplorePath}
        className="w-full rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
        Explore Path
      </button>
    </motion.div>
  );
}
