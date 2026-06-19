import { useState } from "react";
import { ChevronDown, ChevronRight, CheckSquare, MessageSquare, FileText, Heart } from "lucide-react";
import { interviewQuestions, technicalTopics, resumeTips, confidenceTips } from "@/lib/mockData";

const Section = ({ title, icon: Icon, items, color }: { title: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; items: string[]; color: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" style={{ color }} />
          <span className="font-display text-base font-semibold text-foreground">{title}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-2">
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckSquare className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const InterviewPrep = () => (
  <div className="space-y-3">
    <Section title="Top Interview Questions" icon={MessageSquare} items={interviewQuestions} color="hsl(var(--primary))" />
    <Section title="Technical Topics to Revise" icon={FileText} items={technicalTopics} color="hsl(var(--secondary))" />
    <Section title="Resume Improvement Tips" icon={FileText} items={resumeTips} color="hsl(var(--accent))" />
    <Section title="Confidence Tips" icon={Heart} items={confidenceTips} color="hsl(var(--primary))" />
  </div>
);

export default InterviewPrep;
