import { BookOpen, ExternalLink } from "lucide-react";
import type { RoadmapMonth } from "@/lib/mockData";

const LearningTimeline = ({ roadmap }: { roadmap: RoadmapMonth[] }) => (
  <div className="relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-border">
    {roadmap.map((month) => (
      <div key={month.month} className="relative">
        <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full gradient-primary">
          <span className="text-xs font-bold text-primary-foreground">{month.month}</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h4 className="mb-1 font-display text-lg font-semibold text-foreground">Month {month.month}: {month.title}</h4>
          <ul className="mb-4 space-y-1.5">
            {month.tasks.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                {t}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            {month.resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {r.name} <span className="text-primary">({r.platform})</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LearningTimeline;
