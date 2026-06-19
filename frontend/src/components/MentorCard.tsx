import { MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Mentor } from "@/lib/mockData";

const MentorCard = ({ mentor }: { mentor: Mentor }) => {
  const handleRequest = () => {
    toast({ title: "Request Sent!", description: `Your guidance request to ${mentor.name} has been sent.` });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-secondary text-sm font-bold text-secondary-foreground">
          {mentor.avatar}
        </div>
        <div>
          <h4 className="font-display text-base font-semibold text-foreground">{mentor.name}</h4>
          <p className="text-xs text-muted-foreground">{mentor.currentRole}</p>
        </div>
      </div>
      <p className="mb-2 text-sm text-muted-foreground">{mentor.yearsExperience} years experience</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {mentor.skills.map(s => (
          <span key={s} className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">{s}</span>
        ))}
      </div>
      <button
        onClick={handleRequest}
        className="flex w-full items-center justify-center gap-2 rounded-lg gradient-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-transform hover:scale-105"
      >
        <MessageCircle className="h-4 w-4" />
        Request Guidance
      </button>
    </div>
  );
};

export default MentorCard;
