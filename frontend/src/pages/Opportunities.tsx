import { useState, useEffect, useMemo } from "react";
import { Briefcase, Loader2, AlertCircle } from "lucide-react";
import JobCard from "@/components/JobCard";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import VideoRecorder from "@/components/VideoRecorder";
import { X, UploadCloud, HelpCircle } from "lucide-react";
import { calculateSkillMatch, sortJobsBySkillMatch } from "@/lib/skillMatcher";
import { jobsApi, userApi, videoApi, applicationApi, API_BASE_URL } from "@/lib/apiService";

const Opportunities = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const currentUser = getCurrentUser();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sort jobs by skill match
  const sortedJobs = useMemo(() => {
    if (userSkills.length === 0) return jobs;
    return sortJobsBySkillMatch(jobs, userSkills);
  }, [jobs, userSkills]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const data = await jobsApi.getAll();
        if (data.success) {
          setJobs(data.jobs);
        }

        // Fetch user profile to get skills if logged in
        if (currentUser?.id) {
          try {
            const userData = await userApi.getProfile(currentUser.id);
            if (userData.success && userData.user?.currentSkills) {
              setUserSkills(userData.user.currentSkills);
            }
          } catch (error) {
            console.warn("Could not fetch user skills:", error);
          }

          // Fetch user applications
          try {
            const appsData = await userApi.getApplications(currentUser.id);
            if (appsData.success) {
              const ids = new Set<string>(appsData.applications.map((a: any) => a.jobId));
              setAppliedJobIds(ids);
            }
          } catch (error) {
            console.warn("Could not fetch applications:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load opportunities");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser?.id]);

  const handleApply = (job: any) => {
    if (!currentUser) {
      toast.error("Please sign in to apply");
      return;
    }

    if (currentUser.role === 'company') {
      toast.error("Companies cannot apply for jobs. Please use a candidate account.");
      return;
    }

    setSelectedJob(job);
    setVideoBlob(null);
    setAnswers({});
    setShowApplyModal(true);
  };

  const submitApplication = async () => {
    if (selectedJob?.extraQuestions) {
        for (const eq of selectedJob.extraQuestions) {
            if (eq.required && (!answers[eq.question] || !answers[eq.question].trim())) {
                toast.error(`Please answer the mandatory question: "${eq.question}"`);
                return;
            }
        }
    }
    setIsSubmitting(true);
    const resumeId = localStorage.getItem("vishwasx_resume_id") || "";
    const resumeKey = sessionStorage.getItem("vishwasx_ai_key") || "";
    let videoId = null;

    if (videoBlob) {
        try {
            const vidData = await videoApi.upload(videoBlob);
            if (vidData.success) {
                videoId = vidData.videoId;
            }
        } catch(e) {
            toast.error("Error uploading video. Continuing without it.");
        }
    }

    try {
      const payload = {
        jobId: selectedJob.jobId || selectedJob.id,
        userId: currentUser.id || currentUser.email,
        userName: currentUser.name || "User",
        userEmail: currentUser.email,
        resumeId: resumeId || null,
        resumeKey: resumeKey || null,
        videoId: videoId || null,
        answers: answers || {}
      };

      const respData = await jobsApi.apply(payload);
      
      if (respData.success) {
        toast.success("Application Submitted Successfully!");
        setAppliedJobIds(prev => new Set(prev).add(selectedJob.jobId));
        setShowApplyModal(false);
      } else {
        toast.error(respData.message || "Submission failed");
        if (respData.message?.includes("already applied")) {
           setAppliedJobIds(prev => new Set(prev).add(selectedJob.jobId));
        }
      }
    } catch (error) {
      console.error("Application Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-0 py-12 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="mx-auto max-w-4xl relative z-10">
        <div className="mb-8 flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Career Opportunities</h1>
        </div>
        <p className="mb-8 text-muted-foreground">
          Explore entry-level roles, returnship programs, internships, and remote positions matched to your skills.
        </p>
        
        {currentUser && userSkills.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900">Skills Match Enabled</p>
                <p className="text-sm text-blue-800">Jobs are prioritized based on your skills: {userSkills.slice(0, 3).join(", ")}{userSkills.length > 3 ? ` +${userSkills.length - 3}` : ""}</p>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading opportunities...</p>
          </div>
        ) : sortedJobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedJobs.map((j) => {
              const skillMatch = calculateSkillMatch(userSkills, j.skills || []);
              return (
                <JobCard 
                  key={j.jobId} 
                  job={j} 
                  onApply={handleApply} 
                  isApplied={appliedJobIds.has(j.jobId)}
                  skillMatchPercentage={skillMatch.matchPercentage}
                  matchedSkills={skillMatch.matchedSkills}
                  missingSkills={skillMatch.missingSkills}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-card/50 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No opportunities available at the moment. Check back later!</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-2xl p-6 relative">
              <button 
                 onClick={() => setShowApplyModal(false)}
                 className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                 <X className="h-4 w-4" />
              </button>
              
              <h2 className="text-2xl font-bold font-display mb-2">Apply for {selectedJob.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">at {selectedJob.companyName}</p>

              <div className="space-y-6">
                 <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                       <UploadCloud className="h-5 w-5 text-primary" /> Optional: Live Video Introduction
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                       Candidates who upload a short video introduction stand out and are grouped at the top of the recruiter's list! Hit the button below to turn on your camera.
                    </p>
                    <VideoRecorder onVideoRecorded={(blob) => setVideoBlob(blob)} />
                 </div>

                 {selectedJob.extraQuestions && selectedJob.extraQuestions.length > 0 && (
                    <div className="space-y-4 pt-6 border-t border-border">
                       <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                          <HelpCircle className="h-5 w-5 text-primary" /> Screening Questions
                       </h3>
                       {selectedJob.extraQuestions.map((eq: any, idx: number) => (
                          <div key={idx} className="space-y-2">
                             <label className="text-sm font-bold text-foreground block">
                                {eq.question} {eq.required && <span className="text-red-500">*</span>}
                             </label>
                             <textarea 
                                value={answers[eq.question] || ""}
                                onChange={(e) => setAnswers({...answers, [eq.question]: e.target.value})}
                                rows={2}
                                className="w-full bg-muted/20 border border-border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition resize-none text-sm"
                                placeholder="Type your answer here..."
                             />
                          </div>
                       ))}
                    </div>
                 )}

                 <div className="flex justify-end gap-3 pt-6 border-t border-border">
                    <button 
                       onClick={() => setShowApplyModal(false)} 
                       className="px-6 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted transition-colors"
                    >
                       Cancel
                    </button>
                    <button 
                       onClick={submitApplication}
                       disabled={isSubmitting}
                       className="px-8 py-2 rounded-xl text-sm font-bold gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    >
                       {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                       {isSubmitting ? "Submitting..." : videoBlob ? "Submit with Video" : "Skip Video & Apply"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
