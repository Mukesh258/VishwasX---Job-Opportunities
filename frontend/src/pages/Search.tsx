import { useState, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { sampleJobs, sampleMentors } from "@/lib/mockData";
import { learningResources } from "@/lib/learningResources";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import { GirlIllustration1, GirlIllustration2 } from "@/components/BackgroundIllustrations";

export type SearchCategory = "all" | "jobs" | "resources" | "mentors";

export interface SearchResult {
  id: string;
  type: "job" | "resource" | "mentor";
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  relevance: number;
}

const normalizeText = (text: string): string => text.toLowerCase().trim();

const calculateRelevance = (query: string, text: string, title: string): number => {
  const nq = normalizeText(query);
  const nt = normalizeText(text);
  const ntitle = normalizeText(title);
  if (ntitle === nq) return 100;
  if (ntitle.startsWith(nq)) return 90;
  if (ntitle.includes(nq)) return 80;
  if (nt.includes(nq)) return 50;
  if (nq.split(" ").some(w => nt.includes(w))) return 30;
  return 0;
};

const globalSearch = (query: string, category: SearchCategory = "all"): SearchResult[] => {
  if (!query.trim()) return [];
  let results: SearchResult[] = [];

  if (category === "all" || category === "jobs") {
    results = [...results, ...sampleJobs
      .map(job => ({
        id: job.id,
        type: "job" as const,
        title: job.title,
        description: job.description,
        metadata: { companies: job.companies, type: job.type, skills: job.requiredSkills },
        relevance: calculateRelevance(query, `${job.title} ${job.description} ${job.companies.join(" ")}`, job.title),
      }))
      .filter(r => r.relevance > 0)
    ];
  }

  if (category === "all" || category === "resources") {
    const allResources = Object.values(learningResources).flat();
    results = [...results, ...allResources
      .map(resource => ({
        id: resource.id,
        type: "resource" as const,
        title: resource.title,
        description: `${resource.platform} • ${resource.duration}`,
        metadata: { platform: resource.platform, duration: resource.duration, level: resource.level, skills: resource.skillsCovered, instructor: resource.instructor },
        relevance: calculateRelevance(query, `${resource.title} ${resource.skillsCovered.join(" ")}`, resource.title),
      }))
      .filter(r => r.relevance > 0)
    ];
  }

  if (category === "all" || category === "mentors") {
    results = [...results, ...sampleMentors
      .map(mentor => ({
        id: mentor.id,
        type: "mentor" as const,
        title: mentor.name,
        description: `${mentor.currentRole} • ${mentor.yearsExperience} years experience`,
        metadata: { role: mentor.currentRole, skills: mentor.skills, yearsExperience: mentor.yearsExperience },
        relevance: calculateRelevance(query, `${mentor.name} ${mentor.currentRole} ${mentor.skills.join(" ")}`, mentor.name),
      }))
      .filter(r => r.relevance > 0)
    ];
  }

  return results.sort((a, b) => b.relevance - a.relevance);
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");

  const results = useMemo(() => {
    return globalSearch(query, category);
  }, [query, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-0 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-3 pointer-events-none" style={{
        backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,0,0,.05) 25%, rgba(255,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(255,0,0,.05) 75%, rgba(255,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,0,0,.05) 25%, rgba(255,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(255,0,0,.05) 75%, rgba(255,0,0,.05) 76%, transparent 77%, transparent)",
        backgroundSize: "50px 50px"
      }}></div>

      {/* Girl illustrations */}
      <div className="absolute -left-32 top-40 w-64 h-80">
        <GirlIllustration1 />
      </div>
      <div className="absolute -right-32 bottom-40 w-64 h-80">
        <GirlIllustration2 />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <SearchIcon className="h-8 w-8 text-primary" />
            <h1 className="font-display text-4xl font-bold text-foreground">Advanced Search</h1>
          </div>
          <p className="text-muted-foreground">Find jobs, learning resources, and mentors tailored to your career goals</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar onSearch={setQuery} />
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {(["all", "jobs", "resources", "mentors"] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "gradient-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-card/80"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Results Summary */}
        {query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-sm text-muted-foreground"
          >
            Found <span className="font-semibold text-foreground">{results.length}</span> result{results.length !== 1 ? "s" : ""} for "{query}"
          </motion.div>
        )}

        {/* Search Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SearchResults results={results} query={query} />
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
