import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, BarChart3, MessageSquare, Users, Sparkles, Zap, Target, 
  FileText, Shield, KeyRound, Copy, Download, Lock, CheckCircle, 
  AlertTriangle, Lightbulb, Upload, File as FileIcon, BookOpen,
  Eye, Unlock, X, Clock, HardDrive, Trash2, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "@/lib/auth";
import { isGuestMode } from "@/lib/guestMode";
import SkillGapAnalysis from "@/components/SkillGapAnalysis";
import CareerReadinessScore from "@/components/CareerReadinessScore";
import AIInsightsSection from "@/components/AIInsightsSection";
import InterviewPrep from "@/components/InterviewPrep";
import LearningTimelineWithProgress from "@/components/LearningTimelineWithProgress";
import CommunitySection from "@/components/CommunitySection";
import GuestModeBanner from "@/components/GuestModeBanner";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiService";

interface AIFeedback {
  success: boolean;
  experience_years: string;
  extracted_skills: string[];
  predicted_best_role: string;
  role_analysis: {
    role: string;
    match_score: number;
    matched_skills: string[];
    missing_skills: string[];
  };
  recommended_courses: string[];
  roadmap: any[];
}

const MAX_FILE_SIZE_MB = 5;

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);

  // AI Resume Integration State
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [analyzeError, setAnalyzeError] = useState("");
  const [latestResumeId, setLatestResumeId] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");

  // Modal State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [revealKey, setRevealKey] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyDownloaded, setKeyDownloaded] = useState(false);
  const [keyAcknowledged, setKeyAcknowledged] = useState(false);

  // Resume Viewer State
  const [showResumeViewer, setShowResumeViewer] = useState(false);
  const [resumePdfUrl, setResumePdfUrl] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [unlockKeyInput, setUnlockKeyInput] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [selectedViewResumeId, setSelectedViewResumeId] = useState("");

  // Resume History
  interface ResumeRecord {
    resumeId: string;
    fileName: string;
    fileSize: number;
    createdAt: string;
  }
  const [resumeList, setResumeList] = useState<ResumeRecord[]>([]);

  // Applications State
  interface ApplicationRecord {
    applicationId: string;
    jobTitle: string;
    companyName: string;
    appliedAt: string;
    status: string;
  }
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isAppsLoading, setIsAppsLoading] = useState(false);
  const [notifiedAppIds, setNotifiedAppIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchExistingAnalysis = async () => {
      if (!currentUser?.email || isGuestMode()) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/resume/analysis/${encodeURIComponent(currentUser.email)}`);
        const data = await response.json();
        
        if (data.success && data.analysis) {
          setAiFeedback(data.analysis);
          setLatestResumeId(data.resumeId);
          localStorage.setItem("vishwasx_ai_feedback", JSON.stringify(data.analysis));
          localStorage.setItem("vishwasx_resume_id", data.resumeId);
        }
      } catch (e) {
        console.log("No existing analysis found on server.");
      }
    };

    const cached = localStorage.getItem("vishwasx_ai_feedback");
    const cachedId = localStorage.getItem("vishwasx_resume_id");
    
    if (cached && cachedId) {
      try {
        setAiFeedback(JSON.parse(cached));
        setLatestResumeId(cachedId);
      } catch (e) {
        localStorage.removeItem("vishwasx_ai_feedback");
        localStorage.removeItem("vishwasx_resume_id");
        fetchExistingAnalysis();
      }
    } else {
      fetchExistingAnalysis();
    }
    
    // Auto-load key from session if exists
    const sessionKey = sessionStorage.getItem("vishwasx_ai_key");
    if (sessionKey) setEncryptionKey(sessionKey);

    // Fetch all uploaded resumes
    const fetchResumeList = async () => {
      if (!currentUser?.email || isGuestMode()) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/resume/list/${encodeURIComponent(currentUser.email)}`);
        const data = await res.json();
        if (data.success) setResumeList(data.resumes);
      } catch (e) {
        console.log("Could not fetch resume list.");
      }
    };

    const fetchApplications = async () => {
      if (!currentUser?.id || isGuestMode()) return;
      setIsAppsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/applications/${currentUser.id}`);
        const data = await response.json();
        if (data.success) {
          // Check for new interview invitations to toast
          data.applications.forEach((app: any) => {
            if (app.status === 'Interview Scheduled' && !notifiedAppIds.has(app.applicationId)) {
              toast.success(`Priority Invitation!`, {
                description: `Interview scheduled for ${app.jobTitle} at ${app.companyName}`,
                action: {
                  label: "Join Now",
                  onClick: () => console.log("Joining interview...")
                },
                duration: 10000,
              });
              setNotifiedAppIds(prev => new Set(prev).add(app.applicationId));
            }
          });
          setApplications(data.applications);
        }
      } catch (e) {
        console.error("Error fetching applications:", e);
      } finally {
        setIsAppsLoading(false);
      }
    };

    fetchResumeList();
    fetchApplications();
    const interval = setInterval(fetchApplications, 5000); // Poll every 5s for real-time feel
    return () => clearInterval(interval);
  }, [currentUser?.id, currentUser?.email]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setSelectedFile(file);
    setUploadError("");
  };

  const handleSecureUpload = async () => {
    if (!currentUser?.email) {
      setUploadError("Please sign in first.");
      return;
    }

    if (!selectedFile) {
      setUploadError("Please select a PDF resume.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", currentUser.email);

      const response = await fetch(`${API_BASE_URL}/api/resume/upload`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setUploadError(payload.message || payload.detail || "Upload failed.");
        return;
      }

      setLatestResumeId(payload.resumeId);
      setEncryptionKey(payload.encryptionKey);
      setShowKeyModal(true);
    } catch (error) {
      setUploadError("Network error during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!latestResumeId || !encryptionKey) return;

    setIsAnalyzing(true);
    setAnalyzeError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: latestResumeId,
          encryptionKey: encryptionKey
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setAnalyzeError(payload.detail || payload.error || "Analysis failed.");
        return;
      }

      setAiFeedback(payload as AIFeedback);
      localStorage.setItem("vishwasx_ai_feedback", JSON.stringify(payload));
      localStorage.setItem("vishwasx_resume_id", latestResumeId);
      sessionStorage.setItem("vishwasx_ai_key", encryptionKey);
      setShowKeyModal(false);
    } catch (error) {
      setAnalyzeError("Network error during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const decryptAndShowResume = async (keyToUse: string, resumeId?: string) => {
    const targetId = resumeId || selectedViewResumeId || latestResumeId;
    if (!targetId) { setUnlockError("No resume selected."); return; }
    setIsDecrypting(true);
    setUnlockError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/resume/decrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: targetId, encryptionKey: keyToUse })
      });
      
      const payload = await response.json();
      if (payload.success) {
        const binaryString = window.atob(payload.fileData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        
        setResumePdfUrl(url);
        setEncryptionKey(keyToUse);
        sessionStorage.setItem("vishwasx_ai_key", keyToUse);
      } else {
        setUnlockError(payload.detail || "Invalid key or corrupted file.");
      }
    } catch(e) {
      setUnlockError("Network error during decryption.");
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleOpenViewer = (resumeId?: string) => {
    const targetId = resumeId || latestResumeId;
    setSelectedViewResumeId(targetId);
    setResumePdfUrl(""); // reset previous PDF
    const storedKey = encryptionKey || sessionStorage.getItem("vishwasx_ai_key");
    setShowResumeViewer(true);
    
    if (storedKey) {
      decryptAndShowResume(storedKey, targetId);
    }
  };

  const handleCopyKey = async () => {
    if (!navigator.clipboard) {
      toast.error("Clipboard access denied. Please manually copy the key.", {
        description: "This usually happens on non-secure (HTTP) connections."
      });
      return;
    }
    await navigator.clipboard.writeText(encryptionKey);
    setKeyCopied(true);
    toast.success("Key copied to clipboard!");
  };

  const handleDownloadKey = () => {
    const content = `VishwasX Secure Key\nID: ${latestResumeId}\nKey: ${encryptionKey}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vishwasx-key-${latestResumeId}.txt`;
    a.click();
    setKeyDownloaded(true);
  };

  const handleResetAnalysis = async () => {
    // 1. Clear persistent analysis from backend (if not guest)
    if (currentUser?.email && !isGuestMode()) {
      try {
        await fetch(`${API_BASE_URL}/api/resume/analysis/${encodeURIComponent(currentUser.email)}`, {
          method: "DELETE"
        });
      } catch (e) {
        console.error("Failed to sync reset with server.");
      }
    }

    // 2. Default Local Reset
    localStorage.removeItem("vishwasx_ai_feedback");
    localStorage.removeItem("vishwasx_resume_id");
    sessionStorage.removeItem("vishwasx_ai_key");
    setAiFeedback(null);
    setLatestResumeId("");
    setEncryptionKey("");
    setSelectedFile(null);
    setKeyAcknowledged(false);
    setResumePdfUrl("");
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to permanently delete this resume?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/resume/${resumeId}`, { method: "DELETE" });
      setResumeList(prev => prev.filter(r => r.resumeId !== resumeId));
    } catch (e) {
      console.error("Failed to delete resume.");
    }
  };

  // 1. Initial State: No Analysis yet
  if (!aiFeedback) {
    return (
      <div className="min-h-screen px-0 py-8 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl"
        >
          <div className="rounded-2xl border border-border bg-card p-10 shadow-2xl text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-lg rotate-3 hover:rotate-0 transition-transform cursor-default">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            
            <h1 className="font-display text-4xl font-black text-foreground tracking-tight">AI Career Profile</h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Upload your resume for a secure AI analysis. We'll identify your matched skills, 
              missing expertise, and build a personalized roadmap to your dream role.
            </p>

            <div className="mt-10 space-y-6">
              <label className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 px-8 py-12 cursor-pointer transition-all hover:bg-primary/10 hover:border-primary/40">
                <div className="h-12 w-12 rounded-full border border-primary/20 bg-background flex items-center justify-center text-primary transition-transform group-hover:-translate-y-1">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  {selectedFile ? selectedFile.name : "Select PDF Resume"}
                </span>
                {!selectedFile && <span className="text-xs text-muted-foreground">PDF only, max 5MB</span>}
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
              </label>

              {uploadError && <p className="text-sm text-destructive font-medium border border-destructive/20 bg-destructive/5 p-3 rounded-lg">{uploadError}</p>}

              <button
                onClick={handleSecureUpload}
                disabled={isUploading || !selectedFile}
                className="w-full rounded-2xl gradient-primary py-5 text-xl font-black text-primary-foreground shadow-elevated transition-all active:scale-95 disabled:opacity-50 hover:brightness-110"
              >
                {isUploading ? "Securing Data..." : "Analyze and Integrate"}
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Shield className="h-4 w-4 text-primary" />
              Secure-First Architecture
            </div>
          </div>
        </motion.div>

        {/* Modal for Encryption Key */}
        <AnimatePresence>
          {showKeyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-lg rounded-3xl bg-card p-8 shadow-2xl border border-border">
                <div className="flex h-12 w-12 rounded-full bg-primary/10 text-primary items-center justify-center mb-6">
                  <Lock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Your Private Encryption Key</h2>
                <p className="mt-2 text-muted-foreground">This key is required to decrypt your resume for analysis. <b>We never store this.</b> You must save it now.</p>
                
                <div className="mt-6 bg-muted p-5 rounded-2xl border border-border break-all font-mono text-sm relative group">
                  <div className={revealKey ? "text-foreground" : "text-transparent blur-sm select-none"}>
                    {encryptionKey}
                  </div>
                  {!revealKey && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <button onClick={() => setRevealKey(true)} className="px-4 py-2 rounded-lg bg-background border border-border text-xs font-bold shadow-sm hover:bg-muted">Reveal Passkey</button>
                    </div>
                  )}
                  {revealKey && (
                     <button onClick={() => setRevealKey(false)} className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-primary">Hide</button>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <button onClick={handleCopyKey} className="flex items-center justify-center gap-2 rounded-xl border border-border p-4 text-sm font-bold hover:bg-muted transition-colors">
                    <Copy className="h-5 w-5" /> {keyCopied ? "Copied" : "Copy Key"}
                  </button>
                  <button onClick={handleDownloadKey} className="flex items-center justify-center gap-2 rounded-xl border border-border p-4 text-sm font-bold hover:bg-muted transition-colors">
                    <Download className="h-5 w-5" /> {keyDownloaded ? "Downloaded" : "Save as TXT"}
                  </button>
                </div>

                <label className="mt-8 flex gap-3 text-sm font-medium cursor-pointer p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200">
                  <input type="checkbox" checked={keyAcknowledged} onChange={() => setKeyAcknowledged(!keyAcknowledged)} className="mt-0.5 rounded border-orange-500 text-orange-500 focus:ring-orange-500" />
                  <span>I understand that if I lose this key, my resume data cannot be recovered by VishwasX.</span>
                </label>

                <button
                  onClick={handleAnalyze}
                  disabled={!keyAcknowledged || isAnalyzing}
                  className="mt-8 w-full rounded-2xl gradient-primary py-4 font-black text-xl text-primary-foreground disabled:opacity-50 disabled:grayscale"
                >
                  {isAnalyzing ? "Processing AI Layers..." : "Generate Analysis Dashboard"}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 2. Analyzed State: Full Dashboard UI
  return (
    <>
      {isGuestMode() && <GuestModeBanner />}
      <div className="min-h-screen px-0 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* AI Success Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl bg-card p-8 border border-border shadow-soft bg-card/50 backdrop-blur-md"
          >
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">AI Engine Integrated</h1>
                <p className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start font-medium mt-1">
                  <CheckCircle className="h-4 w-4 text-secondary" /> Profile Analysis Sync: 100% Secure
                </p>
              </div>
            </div>
            <button 
              onClick={handleResetAnalysis}
              className="px-5 py-2 rounded-xl border border-border bg-background text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all hover:bg-primary/5"
            >
              Analyze New Resume
            </button>
          </motion.div>

          {/* Profile Summary & Readiness */}
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 rounded-3xl border border-border bg-card p-8 shadow-card h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="flex items-center gap-3 mb-8 relative">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-6 w-6" />
                </div>
                <h2 className="font-display text-2xl font-black">AI Career Profile</h2>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 relative lg:gap-8">
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-black">Predicted Master Role</span>
                  <p className="text-3xl font-black text-primary mt-2">{aiFeedback.predicted_best_role}</p>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/10 hover:border-secondary/30 transition-colors">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-black">Experience Quotient</span>
                  <p className="text-3xl font-black text-foreground mt-2">{aiFeedback.experience_years} Years</p>
                </div>
              </div>

              <div className="mt-10 relative">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-black">Skills Extracted from Resume</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aiFeedback.extracted_skills.map(s => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-bold shadow-sm capitalize hover:border-primary/20 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Apple-Style Interview Notification */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 15 }}
              className="lg:col-span-1"
            >
              <div className="h-full rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col p-8 group">
                {/* Background Glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full group-hover:bg-emerald-500/30 transition-all duration-700" />
                
                {/* Dynamic Island Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-white/10">
                    <motion.div 
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">System Live</span>
                  </div>
                  <Zap className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                </div>

                {/* Notification Content */}
                {applications.some(a => a.status === 'Interview Scheduled') ? (
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Priority Invitation</span>
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      {applications.find(a => a.status === 'Interview Scheduled')?.jobTitle || "Interview"}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      {applications.find(a => a.status === 'Interview Scheduled')?.companyName || "Verified Partner"}
                    </p>
                    
                    <div className="mt-auto pt-8">
                      <button className="w-full py-4 rounded-[1.5rem] gradient-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Join Interview
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">Career Flow</span>
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      Profile Active &amp; Discoverable
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      VISHWASX AI is currently matching your profile with top roles.
                    </p>
                    
                    <div className="mt-auto flex items-center gap-3 pt-8">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                           <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                             {String.fromCharCode(64 + i)}
                           </div>
                         ))}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">3 Comp. Viewing</span>
                    </div>
                  </div>
                )}

                {/* Reflective Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* ATS Score at the Top */}
          {aiFeedback && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
               <CareerReadinessScore scores={{
                 skillReadiness: aiFeedback.role_analysis.match_score,
                 industryAlignment: Math.min(100, (parseInt(aiFeedback.experience_years) || 0) * 10 + 40),
                 interviewReadiness: 75,
                 overall: aiFeedback.role_analysis.match_score
               }} />
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <InterviewPrep />
             </motion.div>

             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <AIInsightsSection insights={[
                 { id: "1", category: "skill", priority: "medium", title: "Career Strength", description: `Your ${aiFeedback?.experience_years || 0} years of industry experience provides a massive foundation for advanced roles.`, recommendation: "Leverage your experience in lead roles.", actionable: true },
                 { id: "2", category: "industry", priority: "high", title: "Skill Gap Identified", description: `Integrating ${aiFeedback?.role_analysis.matched_skills.length > 0 ? aiFeedback.role_analysis.matched_skills[0] : 'Modern Cloud'} expertise will unlock 40% more job opportunities.`, recommendation: "Focus on the recommended learning path below.", actionable: true },
                 { id: "3", category: "opportunity", priority: "low", title: "Role Demand", description: `The role of ${aiFeedback?.predicted_best_role || 'Expert'} is currently in high demand in your region.`, recommendation: "Keep your profile updated with new skills.", actionable: false }
               ]} />
             </motion.div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-black">Industry Gap Analysis</h2>
            </div>
            <SkillGapAnalysis data={{ 
              currentSkills: aiFeedback.role_analysis.matched_skills, 
              missingSkills: aiFeedback.role_analysis.missing_skills,
              recommendedSkills: aiFeedback.role_analysis.missing_skills.slice(0, 3)
            }} />

            {/* Dynamic Learning Roadmap */}
            {aiFeedback.roadmap && aiFeedback.roadmap.length > 0 && (
              <div className="mt-12 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-2xl font-black">Personalized Learning Roadmap</h2>
                </div>
                <LearningTimelineWithProgress roadmap={aiFeedback.roadmap} />
              </div>
            )}
          </div>


        {/* My Applications Section */}
        <section className="mt-12 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="h-6 w-6" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Applications</h2>
                    <p className="text-sm text-muted-foreground font-medium">Track your journey across the hiring pipeline</p>
                 </div>
              </div>
              <span className="px-3 py-1 bg-muted rounded-full text-xs font-bold text-muted-foreground uppercase tracking-widest">{applications.length} TOTAL</span>
           </div>

           <div className="bg-card/30 backdrop-blur-md rounded-2xl border border-border/50 overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-muted/50 border-b border-border/50">
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Applied Position</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Company</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Date Applied</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Current Status</th>
                          <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                       {applications.map((app) => (
                          <tr key={app.applicationId} className="group hover:bg-muted/20 transition-all duration-300">
                             <td className="p-4">
                                <div className="font-bold text-foreground">{app.jobTitle}</div>
                                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">ID: {app.applicationId.slice(-8)}</div>
                             </td>
                             <td className="p-4 text-sm font-medium text-muted-foreground">{app.companyName}</td>
                             <td className="p-4 text-sm font-medium text-muted-foreground">{new Date(app.appliedAt).toLocaleDateString()}</td>
                             <td className="p-4">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                   app.status === 'Interview Scheduled' 
                                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)] animate-pulse' 
                                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                }`}>
                                   {app.status === 'Interview Scheduled' && <Zap className="h-3 w-3 fill-emerald-600" />}
                                   {app.status}
                                </div>
                             </td>
                             <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                   <button 
                                      className="h-8 px-3 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                                      onClick={() => toast.info("Viewing details for " + app.jobTitle)}
                                   >
                                      <Eye className="h-3 w-3" /> View
                                   </button>
                                   <button 
                                      className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                                         app.status === 'Completed' 
                                            ? 'bg-emerald-500 text-white' 
                                            : 'bg-muted/50 text-muted-foreground hover:bg-emerald-500 hover:text-white'
                                      }`}
                                      onClick={() => {
                                         if (app.status !== 'Completed') {
                                            toast.success("Marked as Completed!");
                                            // Mock update for UI feedback
                                            setApplications(prev => prev.map(a => 
                                               a.applicationId === app.applicationId ? { ...a, status: 'Completed' } : a
                                            ));
                                         }
                                      }}
                                   >
                                      <CheckCircle className="h-4 w-4" />
                                   </button>
                                </div>
                             </td>
                          </tr>
                       ))}

                       {applications.length === 0 && !isAppsLoading && (
                          <tr>
                             <td colSpan={5} className="py-20 text-center">
                                <div className="max-w-xs mx-auto space-y-4">
                                   <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-30 shadow-inner">
                                      <HardDrive className="h-8 w-8" />
                                   </div>
                                   <div>
                                      <p className="font-black text-muted-foreground uppercase text-xs tracking-widest">No active applications</p>
                                      <p className="text-sm text-muted-foreground/60 mt-1">Your dream career starts here. Apply for jobs to see them tracking.</p>
                                   </div>
                                   <Link to="/opportunities" className="inline-block mt-4 text-sm font-bold text-primary hover:underline">
                                      Browse Opportunities &rarr;
                                   </Link>
                                </div>
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

          {/* Resume History Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-border bg-card p-8 shadow-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <FileIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">Resume Vault</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5 flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-green-500" /> AES-256 Encrypted &middot; {resumeList.length} file{resumeList.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {resumeList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No resumes uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resumeList.map((resume, idx) => {
                  const date = resume.createdAt ? new Date(resume.createdAt) : null;
                  const sizeKB = resume.fileSize ? (resume.fileSize / 1024).toFixed(1) : '—';
                  return (
                    <div 
                      key={resume.resumeId}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-background hover:border-primary/20 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          idx === 0 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate flex items-center gap-2">
                            {resume.fileName}
                            {idx === 0 && (
                              <span className="text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black">Latest</span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            {date && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              {sizeKB} KB
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => handleOpenViewer(resume.resumeId)}
                          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95"
                        >
                          <Eye className="h-4 w-4" /> View
                        </button>
                        <button 
                          onClick={() => handleDeleteResume(resume.resumeId)}
                          className="flex items-center gap-2 rounded-xl border border-destructive/20 px-4 py-2.5 text-sm font-bold text-muted-foreground hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 transition-all active:scale-95"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* PDF Viewer & Decryption Modal */}
      <AnimatePresence>
        {showResumeViewer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="w-full max-w-5xl h-[90vh] bg-background rounded-3xl overflow-hidden shadow-2xl border border-border flex flex-col relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-white">
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Secure Resume Viewer</h3>
                    {resumePdfUrl ? (
                      <span className="text-xs text-green-500 flex items-center gap-1 font-medium"><Unlock className="h-3 w-3" /> Successfully Decrypted</span>
                    ) : (
                      <span className="text-xs text-orange-500 flex items-center gap-1 font-medium"><Lock className="h-3 w-3" /> Encrypted State</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setShowResumeViewer(false)}
                  className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-muted/20 relative flex flex-col">
                {resumePdfUrl ? (
                  <iframe 
                    src={resumePdfUrl} 
                    className="w-full h-full border-0" 
                    title="User Resume PDF"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-20 w-20 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 drop-shadow-sm">
                      <Lock className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Vault is Locked</h2>
                    <p className="max-w-md text-muted-foreground mb-8 leading-relaxed">
                      For your privacy, your session key has expired. Please enter the encryption passkey you were given when you uploaded this resume to temporarily decrypt it.
                    </p>
                    
                    <div className="w-full max-w-sm space-y-4">
                      <input 
                        type="password" 
                        placeholder="Paste your 44-character key..." 
                        value={unlockKeyInput}
                        onChange={(e) => setUnlockKeyInput(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                      />
                      {unlockError && <p className="text-sm font-medium text-destructive">{unlockError}</p>}
                      <button 
                        onClick={() => decryptAndShowResume(unlockKeyInput)}
                        disabled={!unlockKeyInput || isDecrypting}
                        className="w-full rounded-xl gradient-primary py-3 font-bold text-primary-foreground shadow-md disabled:opacity-50 disabled:grayscale transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isDecrypting ? "Decrypting Matrix..." : <><Unlock className="h-4 w-4" /> Unlock PDF</>}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
