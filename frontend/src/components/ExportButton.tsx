import { useState } from "react";
import { Download, FileText, Sheet, Code } from "lucide-react";
import { motion } from "framer-motion";
import {
  exportRoadmapAsPDF,
  exportCareerAnalysisAsPDF,
  exportProfileAsJSON,
  exportProgressAsJSON,
  exportToCSV,
} from "@/lib/export";
import { getCurrentUser } from "@/lib/auth";
import { getProgress } from "@/lib/progress";
import { generateSkillGap, generateRoadmap } from "@/lib/mockData";

interface ExportButtonProps {
  type: "roadmap" | "career-analysis" | "profile" | "progress";
  label?: string;
}

const ExportButton = ({ type, label = "Export" }: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "pdf" | "csv" | "json") => {
    setIsExporting(true);
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("Please sign in to export");
        return;
      }

      // Get user profile
      const profileStr = localStorage.getItem("restartai_profile");
      if (!profileStr) {
        alert("Profile not found. Please complete your profile first.");
        return;
      }
      const profile = JSON.parse(profileStr);

      switch (type) {
        case "roadmap":
          if (format === "pdf") {
            const skillGap = generateSkillGap(profile);
            const roadmap = generateRoadmap(skillGap.missingSkills);
            const progress = getProgress();
            exportRoadmapAsPDF(profile, roadmap, progress);
          } else if (format === "json") {
            const progress = getProgress();
            exportProgressAsJSON(progress);
          }
          break;

        case "career-analysis":
          if (format === "pdf") {
            const skillGap = generateSkillGap(profile);
            exportCareerAnalysisAsPDF(profile, skillGap);
          }
          break;

        case "profile":
          if (format === "json") {
            exportProfileAsJSON(profile);
          }
          break;

        case "progress":
          if (format === "json") {
            const progress = getProgress();
            exportProgressAsJSON(progress);
          } else if (format === "csv") {
            const progress = getProgress();
            const csvData = Object.entries(progress).map(([key, value]) => ({
              task: key,
              completed: value ? "Yes" : "No",
            }));
            exportToCSV(csvData, "progress.csv");
          }
          break;
      }

      setIsOpen(false);
      alert("Export successful!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = {
    roadmap: [
      { format: "pdf", label: "PDF", icon: FileText },
      { format: "json", label: "JSON", icon: Code },
    ],
    "career-analysis": [{ format: "pdf", label: "PDF", icon: FileText }],
    profile: [{ format: "json", label: "JSON", icon: Code }],
    progress: [
      { format: "json", label: "JSON", icon: Code },
      { format: "csv", label: "CSV", icon: Sheet },
    ],
  };

  const options = exportOptions[type] || [];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {label}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50"
        >
          <div className="p-2">
            {options.map(({ format, label: optionLabel, icon: Icon }) => (
              <button
                key={format}
                onClick={() => handleExport(format as "pdf" | "csv" | "json")}
                disabled={isExporting}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Icon className="h-4 w-4" />
                {optionLabel}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ExportButton;
