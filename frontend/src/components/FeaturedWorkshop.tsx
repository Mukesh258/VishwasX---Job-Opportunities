import { Play, Clock, Users, Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import type { FeaturedWorkshop } from "@/lib/learningResources";

interface FeaturedWorkshopProps {
  workshop: FeaturedWorkshop;
}

export default function FeaturedWorkshopComponent({ workshop }: FeaturedWorkshopProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleThumbnailClick = () => {
    window.open(workshop.videoUrl, "_blank");
  };

  const handleLearnMore = () => {
    setShowDetails(!showDetails);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-elevated"
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-accent">
        <Star className="h-4 w-4" />
        Featured This Week
      </div>

      <div className="grid gap-6 md:grid-cols-2 p-6 md:p-8">
        {/* Thumbnail */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="group relative h-64 md:h-80 rounded-xl overflow-hidden cursor-pointer"
          onClick={handleThumbnailClick}
        >
          <img
            src={workshop.thumbnailUrl}
            alt={workshop.title}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
            <Play className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                {workshop.title}
              </h2>
              <p className="text-muted-foreground">{workshop.instructor}</p>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              {workshop.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{workshop.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Live Session</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {workshop.skillsCovered.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-4">
            <a
              href={workshop.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg gradient-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <Play className="h-5 w-5" />
              Join Free Workshop
            </a>
            <button 
              onClick={handleLearnMore}
              className="rounded-lg border-2 border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/5">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
