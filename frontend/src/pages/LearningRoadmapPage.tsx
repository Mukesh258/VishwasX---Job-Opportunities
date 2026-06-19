import { useState, useEffect, useRef } from "react";
import { BookOpen, Zap, Shield, CheckCircle, ArrowRight, PlayCircle, Clock, Star, Trophy, Sparkles, RefreshCcw, Target, GraduationCap } from "lucide-react";
import { learningResources, LearningResource } from "@/lib/learningResources";
import { motion, useScroll, useSpring } from "framer-motion";

interface RoadmapMonth {
  month: number;
  title: string;
  tasks: string[];
  resources: { name: string; url: string; platform: string }[];
}

// Build dynamic resource cards from AI roadmap data when static resources don't match
function buildDynamicResources(
  missingSkills: string[],
  roadmap: RoadmapMonth[],
  recommendedCourses: string[]
): LearningResource[] {
  const dynamicResources: LearningResource[] = [];
  const usedIds = new Set<string>();

  // 1. First try matching from the static learningResources library (case-insensitive)
  missingSkills.forEach((skill) => {
    const matches = learningResources.filter((r) =>
      r.skillsCovered.some(
        (s) =>
          s.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(s.toLowerCase())
      )
    );
    matches.forEach((m) => {
      if (!usedIds.has(m.id)) {
        dynamicResources.push(m);
        usedIds.add(m.id);
      }
    });
  });

  // 2. If we still don't have enough, generate cards from the AI roadmap months
  if (dynamicResources.length < 3 && roadmap && roadmap.length > 0) {
    roadmap.forEach((month) => {
      const id = `ai-month-${month.month}`;
      if (usedIds.has(id)) return;

      const skillsForMonth = missingSkills.slice(
        (month.month - 1) * 2,
        month.month * 2
      );

      dynamicResources.push({
        id,
        title: `Month ${month.month}: ${month.title}`,
        platform: month.resources?.[0]?.platform as any || "Coursera",
        videoUrl: month.resources?.[0]?.url || "#",
        thumbnailUrl: "",
        duration: `Month ${month.month} of 3`,
        skillsCovered: skillsForMonth.length > 0 ? skillsForMonth.map(s => s.charAt(0).toUpperCase() + s.slice(1)) : ["Core Skills"],
        role: "Personalized",
        description: month.tasks.join(" → "),
        level: month.month === 1 ? "beginner" : month.month === 2 ? "intermediate" : "advanced",
      });
      usedIds.add(id);
    });
  }

  // 3. If we STILL don't have enough, generate cards from recommended courses
  if (dynamicResources.length < 3 && recommendedCourses && recommendedCourses.length > 0) {
    recommendedCourses.forEach((course, idx) => {
      const id = `ai-course-${idx}`;
      if (usedIds.has(id)) return;

      const platform = course.toLowerCase().includes("coursera")
        ? "Coursera"
        : course.toLowerCase().includes("udemy")
        ? "Udemy"
        : course.toLowerCase().includes("khan")
        ? "YouTube"
        : "Coursera";

      const skill = missingSkills[idx] || "Industry Skills";

      dynamicResources.push({
        id,
        title: course,
        platform: platform as any,
        videoUrl: "#",
        thumbnailUrl: "",
        duration: "Self-paced",
        skillsCovered: [skill.charAt(0).toUpperCase() + skill.slice(1)],
        role: "Recommended",
        description: `AI-recommended course to bridge your ${skill} skill gap.`,
        level: "beginner",
      });
      usedIds.add(id);
    });
  }

  return dynamicResources.slice(0, 6);
}

const LearningRoadmapPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem("vishwasx_ai_feedback");

    if (cached) {
      try {
        const aiData = JSON.parse(cached);
        const gaps: string[] = aiData?.role_analysis?.missing_skills || [];
        const roadmap: RoadmapMonth[] = aiData?.roadmap || [];
        const courses: string[] = aiData?.recommended_courses || [];

        if (gaps.length > 0) {
          setMissingSkills(gaps);
          setIsPersonalized(true);

          const matched = buildDynamicResources(gaps, roadmap, courses);
          setResources(matched);
        } else {
          // No gaps — genuinely elite
          setIsPersonalized(true);
          setResources([]);
        }
      } catch (e) {
        console.error("Error parsing AI feedback:", e);
        setResources(learningResources.slice(0, 5));
      }
    } else {
      // No AI data — show default resources
      setResources(learningResources.slice(0, 5));
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen px-0 py-20 bg-background flex flex-col items-center overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24 space-y-6 max-w-3xl relative"
      >
        <div className="inline-flex h-16 w-16 rounded-[2rem] bg-primary text-white items-center justify-center shadow-2xl shadow-primary/40 mb-2 transform -rotate-6">
          <BookOpen className="h-8 w-8" />
        </div>

        <div className="flex flex-col items-center">
          {isPersonalized && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Personalized Career Sync
            </motion.div>
          )}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground drop-shadow-sm">
            The <span className="text-primary italic">VishwasX</span> Path
          </h1>
        </div>

        <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
          {isPersonalized
            ? missingSkills.length > 0
              ? `We've synced with your AI Career Profile to bridge your specific ${missingSkills.length} skill gap${missingSkills.length > 1 ? "s" : ""}.`
              : "Your AI Career Profile shows you're already exceeding market standards!"
            : "We've mapped out the exact modules you need to conquer the industry. Follow the path to reach your target role."}
        </p>
      </motion.div>

      <div ref={containerRef} className="w-full max-w-5xl relative pb-32">
        {/* The Animated Roadmap Path */}
        {resources.length > 0 && (
          <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-[4px] bg-muted/30 transform -translate-x-1/2 rounded-full overflow-hidden">
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="w-full h-full bg-gradient-to-b from-primary via-primary/80 to-secondary rounded-full"
            />
          </div>
        )}

        <div className="space-y-32 relative">
          {resources.map((resource, idx) => (
            <div
              key={`${resource.id}-${idx}`}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Step Marker */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="absolute left-[31px] md:left-1/2 w-12 h-12 rounded-[1.25rem] bg-background border-[4px] border-primary shadow-[0_0_25px_rgba(var(--primary),0.3)] transform -translate-x-1/2 z-20 flex items-center justify-center font-black text-primary text-lg"
              >
                {idx + 1}
              </motion.div>

              {/* Connector from path to card */}
              <div
                className={`hidden md:block absolute top-1/2 h-[2px] w-12 bg-primary/20 -translate-y-1/2 z-10 ${
                  idx % 2 === 0
                    ? "left-[calc(50%+24px)]"
                    : "right-[calc(50%+24px)]"
                }`}
              />

              {/* Resource Content Card */}
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full md:w-[42%] ml-16 md:ml-0"
              >
                <div className="group relative">
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative bg-card/60 backdrop-blur-xl rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group-hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {resource.platform}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        {resource.duration}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>

                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed line-clamp-3">
                      {resource.description ||
                        "Master these essential skills with expert-led instruction and high-impact hands-on projects designed for immediate career application."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {resource.skillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-xl bg-secondary/30 text-[10px] font-bold text-secondary-foreground uppercase tracking-tight"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <a
                      href={resource.videoUrl !== "#" ? resource.videoUrl : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-primary text-white text-sm font-black hover:bg-primary/90 transition-all shadow-[0_10px_20px_-5px_rgba(var(--primary),0.3)] active:scale-95 group/btn"
                    >
                      Initialize Module{" "}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Offset Spacer */}
              <div className="hidden md:block w-[42%]" />
            </div>
          ))}

          {/* Goal Marker */}
          {resources.length > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative flex flex-col items-center justify-center pt-20"
            >
              <div className="h-28 w-28 rounded-[3rem] bg-gradient-to-br from-primary to-secondary p-1 shadow-2xl shadow-primary/20">
                <div className="w-full h-full rounded-[2.8rem] bg-background flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)]"
                  />
                  <Trophy className="h-12 w-12 text-primary" />
                </div>
              </div>
              <div className="mt-10 text-center space-y-2">
                <h3 className="text-3xl font-black tracking-tight italic">
                  Destiny Awaits
                </h3>
                <p className="text-muted-foreground font-medium">
                  Your skills are now ready for the global stage.
                </p>
              </div>
            </motion.div>
          )}

          {/* Empty State: Not personalized — no AI data */}
          {!isPersonalized && resources.length === 0 && (
            <div className="text-center py-20 bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border p-12 max-w-2xl mx-auto shadow-2xl">
              <Zap className="h-20 w-20 text-primary/30 mx-auto mb-8" />
              <h2 className="text-3xl font-black mb-4">Build Your Path</h2>
              <p className="text-muted-foreground text-lg px-8 mb-10">
                Upload your resume on the dashboard for a secure AI analysis.
                We'll build a personalized path based on your unique skill gaps.
              </p>
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="px-8 py-4 rounded-2xl bg-primary text-white font-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Elite state: personalized + genuinely no gaps */}
          {isPersonalized && missingSkills.length === 0 && resources.length === 0 && (
            <div className="text-center py-24 bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border p-12 max-w-2xl mx-auto shadow-2xl">
              <Star className="h-20 w-20 text-primary/30 mx-auto mb-8" />
              <h2 className="text-3xl font-black mb-4">
                Elite Readiness Achieved
              </h2>
              <p className="text-muted-foreground text-lg px-8">
                Our AI has analyzed your profile and determined you are
                currently exceeding market standards. No major skill gaps
                detected!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmapPage;
