import { UserPlus, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Connection } from "@/lib/mockData";

const ConnectionCard = ({ connection }: { connection: Connection }) => {
  const handleConnect = () => {
    toast({ title: "Connection Sent!", description: `Your connection request to ${connection.name} has been sent.` });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
          {connection.avatar}
        </div>
        <div>
          <h4 className="font-display text-base font-semibold text-foreground">{connection.name}</h4>
          <p className="text-xs text-muted-foreground">Previously: {connection.previousRole}</p>
        </div>
      </div>
      <div className="mb-2 space-y-1 text-sm text-muted-foreground">
        <p>Career Break: <span className="font-medium text-foreground">{connection.careerBreak}</span></p>
        <p>Goal: <span className="font-medium text-foreground">{connection.desiredRole}</span></p>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {connection.skills.map(s => (
          <span key={s} className="rounded-md bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">{s}</span>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1.5 text-xs text-accent-foreground">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        Matched: {connection.matchReason}
      </div>
      <button
        onClick={handleConnect}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <UserPlus className="h-4 w-4" />
        Connect
      </button>
    </div>
  );
};

export default ConnectionCard;
