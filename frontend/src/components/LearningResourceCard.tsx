import { Play, Clock, BookmarkPlus, Bookmark, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { LearningResource } from "@/lib/learningResources";
import { useState } from "react";

interface LearningResourceCardProps {
  resource: LearningResource;
  index: number;
  isSaved?: boolean;
  onSave?: (resource: LearningResource) => void;
}

const platformColors = {
  YouTube: "bg-red-100 text-red-700",
  Coursera: "bg-blue-100 text-blue-700",
  Udemy: "bg-purple-100 text-purple-700",
  Google: "bg-yellow-100 text-yellow-700",
  "LinkedIn Learning": "bg-cyan-100 text-cyan-700",
};

export default function LearningResourceCard({
  resource,
  index,
  isSaved = false,
  onSave,
}: LearningResourceCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(resource);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group rounded-xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      <div 
        className="relative h-40 overflow-hidden bg-muted cursor-pointer"
        onClick={() => window.open(resource.videoUrl, "_blank")}
      >
        <img
          src={resource.thumbnailUrl}
          alt={resource.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute top-2 right-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${platformColors[resource.platform]}`}>
            {resource.platform}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          {resource.instructor && (
            <p className="text-xs text-muted-foreground mt-1">{resource.instructor}</p>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

        {/* Duration & Level */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{resource.duration}</span>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{resource.level}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {resource.skillsCovered.slice(0, 2).map((skill) => (
            <span key={skill} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {skill}
            </span>
          ))}
          {resource.skillsCovered.length > 2 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              +{resource.skillsCovered.length - 2}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <a
            href={resource.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-lg gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            <Play className="h-4 w-4" />
            Watch Now
          </a>
          <button
            onClick={handleSave}
            className={`rounded-lg px-3 py-2 transition-colors ${
              saved
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            title={saved ? "Remove from learning plan" : "Save to learning plan"}
          >
            {saved ? <Bookmark className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
