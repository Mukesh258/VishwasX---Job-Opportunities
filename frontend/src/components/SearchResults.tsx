import { Briefcase, BookOpen, Users, AlertCircle, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { SearchResult } from "@/lib/search";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  query?: string;
}

export default function SearchResults({ results, isLoading = false, query = "" }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
          </div>
          <p className="text-muted-foreground">Searching...</p>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium text-foreground">Start searching</p>
        <p className="text-sm text-muted-foreground">Search for jobs, learning resources, or mentors</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-accent/50" />
        <p className="text-lg font-medium text-foreground">No results found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  // Group results by type
  const jobResults = results.filter(r => r.type === "job");
  const resourceResults = results.filter(r => r.type === "resource");
  const mentorResults = results.filter(r => r.type === "mentor");

  return (
    <div className="space-y-8">
      {/* Jobs */}
      {jobResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Jobs ({jobResults.length})
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {jobResults.map(result => (
              <div key={result.id} className="rounded-lg border border-border bg-card p-4 shadow-card hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">{result.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(result.metadata.companies as string[])?.map(company => (
                    <span key={company} className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Resources */}
      {resourceResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Learning Resources ({resourceResults.length})
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resourceResults.map(result => (
              <div key={result.id} className="rounded-lg border border-border bg-card p-4 shadow-card hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-foreground mb-2">{result.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(result.metadata.skills as string[])?.map(skill => (
                    <span key={skill} className="inline-block rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mentors */}
      {mentorResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Mentors ({mentorResults.length})
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentorResults.map(result => (
              <div key={result.id} className="rounded-lg border border-border bg-card p-4 shadow-card hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-foreground mb-1">{result.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(result.metadata.skills as string[])?.map(skill => (
                    <span key={skill} className="inline-block rounded-full bg-accent/10 px-2 py-1 text-xs text-accent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
