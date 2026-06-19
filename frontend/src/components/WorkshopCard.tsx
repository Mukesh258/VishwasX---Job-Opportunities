import { Calendar, Clock, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Workshop } from "@/lib/mockData";

interface WorkshopCardProps {
  workshop: Workshop;
  index: number;
}

const levelColors = {
  beginner: "bg-secondary/10 text-secondary",
  intermediate: "bg-primary/10 text-primary",
  advanced: "bg-accent/10 text-accent",
};

export default function WorkshopCard({ workshop, index }: WorkshopCardProps) {
  const spotsLeft = workshop.maxCapacity - workshop.registrations;
  const isFull = spotsLeft === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{workshop.title}</h3>
          <p className="text-xs text-muted-foreground">by {workshop.instructor}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${levelColors[workshop.level]}`}>
          {workshop.level}
        </span>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">{workshop.description}</p>

      <div className="mb-3 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(workshop.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{workshop.duration} hours</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{workshop.registrations}/{workshop.maxCapacity} registered</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Skills Covered</span>
          <span className="text-muted-foreground">{workshop.skills.length} skills</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {workshop.skills.map((skill) => (
            <span key={skill} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        disabled={isFull}
        className="w-full rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        {isFull ? "Workshop Full" : `Register (${spotsLeft} spots left)`}
      </button>
    </motion.div>
  );
}
