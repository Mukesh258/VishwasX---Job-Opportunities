import { useState, useEffect } from "react";
import { BookOpen, Filter, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { LearningResource } from "@/lib/learningResources";
import { getLearningResources, getResourcesBySkill, getAllSkills, featuredWorkshop } from "@/lib/learningResources";
import LearningResourceCard from "./LearningResourceCard";
import FeaturedWorkshopComponent from "./FeaturedWorkshop";

interface LearningResourcesSectionProps {
  desiredRole: string;
}

export default function LearningResourcesSection({ desiredRole }: LearningResourcesSectionProps) {
  const navigate = useNavigate();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<LearningResource[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load resources for the user's desired role
    const roleResources = getLearningResources(desiredRole);
    setResources(roleResources);
    setFilteredResources(roleResources);

    // Load all available skills
    setAllSkills(getAllSkills());

    // Load saved resources from localStorage
    const saved = localStorage.getItem("savedLearningResources");
    if (saved) {
      setSavedResources(JSON.parse(saved));
    }
  }, [desiredRole]);

  // Filter resources based on selected skills
  useEffect(() => {
    if (selectedSkills.length === 0) {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter((resource) =>
        selectedSkills.some((skill) =>
          resource.skillsCovered.some((s) => s.toLowerCase() === skill.toLowerCase())
        )
      );
      setFilteredResources(filtered);
    }
  }, [selectedSkills, resources]);

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSaveResource = (resource: LearningResource) => {
    setSavedResources((prev) => {
      const updated = prev.includes(resource.id)
        ? prev.filter((id) => id !== resource.id)
        : [...prev, resource.id];
      localStorage.setItem("savedLearningResources", JSON.stringify(updated));
      return updated;
    });
  };

  const clearFilters = () => {
    setSelectedSkills([]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="font-display text-2xl font-semibold text-foreground">Learning Resources Hub</h2>
      </div>

      {/* Featured Workshop */}
      <FeaturedWorkshopComponent workshop={featuredWorkshop} />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Filter by Skills</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedSkills.includes(skill)
                        ? "gradient-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {selectedSkills.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""} for{" "}
          <span className="font-semibold text-foreground">{desiredRole}</span>
          {selectedSkills.length > 0 && (
            <>
              {" "}
              in <span className="font-semibold text-foreground">{selectedSkills.join(", ")}</span>
            </>
          )}
        </p>
        {savedResources.length > 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {savedResources.length} Saved
          </span>
        )}
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource, idx) => (
            <LearningResourceCard
              key={resource.id}
              resource={resource}
              index={idx}
              isSaved={savedResources.includes(resource.id)}
              onSave={handleSaveResource}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-border bg-card p-12 text-center"
        >
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No resources found for the selected filters.</p>
          <button
            onClick={clearFilters}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Clear filters and try again
          </button>
        </motion.div>
      )}

      {/* Saved Resources Section */}
      {savedResources.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 space-y-4">
          <h3 className="font-semibold text-foreground">📚 Your Learning Plan</h3>
          <p className="text-sm text-muted-foreground">
            You have {savedResources.length} resource{savedResources.length !== 1 ? "s" : ""} saved to your learning plan.
          </p>
          <button 
            onClick={() => navigate("/roadmap")}
            className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
            View Learning Plan
          </button>
        </div>
      )}
    </div>
  );
}
