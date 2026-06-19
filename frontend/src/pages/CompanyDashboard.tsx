import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, 
  Users, 
  Briefcase, 
  BarChart3, 
  Sparkles, 
  Target,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
  Loader2,
  Plus,
  Trash2,
  FileText,
  Mail,
  CheckCircle,
  AlertCircle,
  BadgeCheck,
  Unlock,
  Lock,
  X,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Zap,
  User,
  UserCheck,
  Timer,
  CheckSquare,
  Shield,
  HardDrive,
  Video,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiService";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Map current path to active tab
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/company/post-job") return "post";
    if (path === "/company/manage-jobs") return "manage";
    if (path === "/company/applicants") return "applicants";
    if (path === "/company/resumes") return "resumes";
    return "overview";
  };

  const activeTab = getActiveTab();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  
  // Applicant Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [applicantAnalysis, setApplicantAnalysis] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedResumeUrl, setDecryptedResumeUrl] = useState("");
  const [fetchProfileLoading, setFetchProfileLoading] = useState(false);
  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    interviews: 5,
    matchScore: 88
  });

  const fetchData = useCallback(async () => {
    if (!currentUser?.companyId) return;
    setLoading(true);
    try {
      // Fetch Jobs
      const jobsRes = await fetch(`${API_BASE_URL}/api/company/my-jobs/${currentUser.companyId}`);
      const jobsData = await jobsRes.json();
      if (jobsData.success) {
        setMyJobs(jobsData.jobs);
        setStats(prev => ({ ...prev, activeJobs: jobsData.jobs.length }));
      }

      // Fetch Applicants
      const appsRes = await fetch(`${API_BASE_URL}/api/company/applicants/${currentUser.companyId}`);
      const appsData = await appsRes.json();
      if (appsData.success) {
        const sortedApps = appsData.applicants.sort((a, b) => {
            if (a.videoId && !b.videoId) return -1;
            if (!a.videoId && b.videoId) return 1;
            return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
        });
        setApplicants(sortedApps);
        setStats(prev => ({ ...prev, totalApplicants: appsData.applicants.length }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.companyId]);

  const handleViewProfile = async (applicant: any) => {
    setSelectedApplicant(applicant);
    setShowProfileModal(true);
    setFetchProfileLoading(true);
    setApplicantAnalysis(null);
    setDecryptedResumeUrl("");

    try {
      // 1. Fetch User Analysis (if available)
      const analysisRes = await fetch(`${API_BASE_URL}/api/resume/analysis/${encodeURIComponent(applicant.userEmail)}`);
      const analysisData = await analysisRes.json();
      if (analysisData.success) {
        setApplicantAnalysis(analysisData.analysis);
      }

      // 2. Decrypt Resume (if application has resumeId and key)
      if (applicant.resumeId && applicant.resumeKey) {
        setIsDecrypting(true);
        const decryptRes = await fetch(`${API_BASE_URL}/api/resume/decrypt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeId: applicant.resumeId,
            encryptionKey: applicant.resumeKey
          })
        });
        const decryptData = await decryptRes.json();
        if (decryptData.success) {
          const binaryString = window.atob(decryptData.fileData);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setDecryptedResumeUrl(url);
        }
      }
    } catch (error) {
      console.error("Error fetching applicant profile:", error);
      toast.error("Failed to load applicant profile completely");
    } finally {
      setFetchProfileLoading(false);
      setIsDecrypting(false);
      setIsResumeVisible(false);
      setShowWatermark(true);
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedApplicant?.applicationId) return;
    setIsScheduling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications/status/${selectedApplicant.applicationId}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ status: "Interview Scheduled" })
      });
      const data = await res.json();
      if (data.success) {
         toast.success("Interview Successfully Scheduled!");
         setSelectedApplicant(prev => ({ ...prev, status: "Interview Scheduled" }));
         fetchData(); // Refresh the list
      } else {
         toast.error(data.message || "Failed to schedule interview");
      }
    } catch (e) {
      toast.error("Network error during scheduling.");
    } finally {
      setIsScheduling(false);
    }
  };

  // Check if company is logged in
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'company') {
      navigate("/company-signin");
      return;
    }
    fetchData();
  }, [currentUser, navigate, fetchData]);

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/job/${jobId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success("Job deleted successfully");
        setMyJobs(myJobs.filter(j => j.jobId !== jobId));
      }
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 px-0 py-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 relative z-10">
        
        {/* Welcome Section */}
        <div className="rounded-2xl gradient-primary border border-primary/20 p-8 text-left shadow-lg flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-primary-foreground" />
              <div className="flex items-center gap-2">
                <h1 className="font-display text-3xl font-bold text-primary-foreground">
                  {currentUser?.name}
                </h1>
                {currentUser?.isVerified && (
                  <BadgeCheck className="h-6 w-6 text-blue-400 fill-blue-400/20" />
                )}
              </div>
            </div>
            <p className="text-primary-foreground/90 max-w-xl">
              Verified Company Dashboard. Manage your listings and discover exceptional talent.
            </p>
          </motion.div>
          <div className="hidden md:flex flex-col items-end">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium backdrop-blur-sm shadow-sm border ${
              currentUser?.isVerified 
                ? "bg-blue-500/20 text-white border-blue-400/30" 
                : "bg-white/20 text-primary-foreground border-white/10"
            }`}>
               {currentUser?.isVerified ? (
                 <BadgeCheck className="h-4 w-4 text-blue-400" />
               ) : (
                 <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
               )}
               {currentUser?.isVerified ? "Verified Account" : "Verification Pending"}
            </div>
            <span className="text-[10px] text-primary-foreground/60 mt-1 uppercase tracking-tighter uppercase font-bold">Log: {currentUser?.email}</span>
          </div>
        </div>

        {/* Dynamic Content Based on Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Briefcase />} label="Active Job Postings" value={stats.activeJobs} trend="+1 this week" color="text-blue-500" bg="bg-blue-500/10" />
                <StatCard icon={<Sparkles />} label="Total Applicants" value={stats.totalApplicants} trend="+12 this week" color="text-amber-500" bg="bg-amber-500/10" />
                <StatCard icon={<Calendar />} label="Interviews Scheduled" value={stats.interviews} trend="Next 7 days" color="text-emerald-500" bg="bg-emerald-500/10" />
                <StatCard icon={<Target />} label="Matching Success" value={`${stats.matchScore}%`} trend="This Quarter" color="text-purple-500" bg="bg-purple-500/10" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Recent Applicants Preview */}
                  <div className="rounded-xl border border-border bg-card shadow-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <h2 className="font-display text-xl font-semibold text-foreground">Recent Applicants</h2>
                      </div>
                    <Link to="/company/applicants" className="text-sm font-medium text-primary hover:underline flex items-center">
                        View All <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {applicants.length > 0 ? applicants.slice(0, 4).map((app, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                              {app.userName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{app.userName}</p>
                              <p className="text-xs text-muted-foreground">{app.jobTitle}</p>
                            </div>
                          </div>
                          <Link to="/company/applicants" className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                            Manage
                          </Link>
                        </div>
                      )) : (
                        <div className="py-12 text-center text-muted-foreground">
                          <p>No recent applicants found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Diversity Impact Card (Static but looks nice) */}
                  <div className="rounded-xl border border-border bg-card shadow-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      <h2 className="font-display text-lg font-semibold text-foreground">Diversity Impact</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground font-medium">Return-to-work success</span>
                            <span className="text-secondary font-bold">85%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[85%] rounded-full"></div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "post" && (
             <motion.div key="post" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto">
                <PostJobSection companyId={currentUser?.companyId} companyName={currentUser?.name} isVerified={currentUser?.isVerified} />
             </motion.div>
          )}

          {activeTab === "manage" && (
             <motion.div key="manage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-display font-bold">Manage Active Requisitions</h2>
                   <Link 
                     to={currentUser?.isVerified ? "/company/post-job" : "#"} 
                     onClick={(e) => {
                       if (!currentUser?.isVerified) {
                         e.preventDefault();
                         toast.error("Please verify your account to post jobs");
                       }
                     }}
                     className={`${currentUser?.isVerified ? "gradient-primary" : "bg-muted cursor-not-allowed opacity-70"} text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2`}
                   >
                     <Plus className="h-4 w-4" /> New Requisition
                   </Link>
                </div>
                <div className="grid gap-4">
                   {myJobs.map(job => (
                      <div key={job.jobId} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition-all group">
                         <div className="space-y-1">
                            <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                               <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                               <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-xs font-bold">{job.type}</span>
                            </div>
                         </div>
                         <div className="mt-4 md:mt-0 flex items-center gap-3">
                            <button onClick={() => handleDeleteJob(job.jobId)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                               <Trash2 className="h-5 w-5" />
                            </button>
                            <button className="px-4 py-2 border border-border rounded-lg text-sm font-bold hover:bg-muted transition-colors">
                               Edit
                            </button>
                         </div>
                      </div>
                   ))}
                   {myJobs.length === 0 && (
                      <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl">
                         <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                         <p className="text-muted-foreground">No active job postings. Start by creating one!</p>
                      </div>
                   )}
                </div>
             </motion.div>
          )}

          {activeTab === "applicants" && (
             <motion.div key="applicants" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-display font-bold">Job Applicants</h2>
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-muted/50 border-b border-border">
                            <th className="p-4 font-bold">Candidate</th>
                            <th className="p-4 font-bold">Position</th>
                            <th className="p-4 font-bold">Applied Date</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {applicants.map((app, idx) => (
                            <tr key={idx} className={`hover:bg-muted/30 transition-colors ${app.videoId ? 'bg-primary/5' : ''}`}>
                               <td className="p-4">
                                  <div className="font-bold flex items-center gap-2">
                                     {app.userName}
                                     {app.videoId && (
                                        <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                           <Video className="h-3 w-3" /> Pitch Attached
                                        </span>
                                     )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{app.userEmail}</div>
                               </td>
                               <td className="p-4 font-medium">{app.jobTitle}</td>
                               <td className="p-4 text-sm">{new Date(app.appliedAt).toLocaleDateString()}</td>
                               <td className="p-4">
                                  <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-600 text-xs font-bold">{app.status}</span>
                               </td>
                               <td className="p-4 text-right">
                                  <button 
                                      onClick={() => handleViewProfile(app)}
                                      className="text-primary hover:underline text-sm font-bold flex items-center justify-end gap-1 ml-auto"
                                   >
                                      <Eye className="h-4 w-4" /> View Profile
                                   </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                   {applicants.length === 0 && (
                      <div className="py-20 text-center">
                         <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                         <p className="text-muted-foreground">No applicants matching your listings yet.</p>
                      </div>
                   )}
                </div>
             </motion.div>
          )}

          {activeTab === "resumes" && (
             <motion.div key="resumes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                         <FileText className="h-6 w-6" />
                      </div>
                      <div>
                         <h2 className="text-2xl font-display font-bold">Secure Resume Portfolio</h2>
                         <p className="text-sm text-muted-foreground font-medium">Manage and access decrypted candidate documents</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {applicants.filter(a => a.status === 'Interview Scheduled').map((app, idx) => (
                      <div key={idx} className="bg-card border border-border rounded-[2rem] p-6 hover:shadow-card transition-all group relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Shield className="h-20 w-20" />
                         </div>
                         <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                               {app.userName.charAt(0)}
                            </div>
                            <div>
                               <h3 className="font-bold text-foreground truncate max-w-[150px]">{app.userName}</h3>
                               <p className="text-xs text-muted-foreground">{app.jobTitle}</p>
                            </div>
                         </div>
                         <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                               <span>Access Level:</span>
                               <span className="text-emerald-500 flex items-center gap-1"><Unlock className="h-3 w-3" /> UNLOCKED</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                               <span>Secure Key:</span>
                               <span className="text-foreground tracking-tighter">AES-256 Verified</span>
                            </div>
                         </div>
                         <button 
                            onClick={() => handleViewProfile(app)}
                            className="w-full py-3 rounded-xl bg-muted text-foreground text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                         >
                            <Eye className="h-4 w-4" /> View Document
                         </button>
                      </div>
                   ))}
                </div>

                {applicants.filter(a => a.status === 'Interview Scheduled').length === 0 && (
                   <div className="max-w-2xl mx-auto space-y-6 text-center py-20 border-2 border-dashed border-border rounded-[3rem] bg-muted/5">
                      <HardDrive className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-2xl font-display font-bold">No Unlocked Resumes</h2>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Your secure portfolio is currently empty. Resumes appear here once you've scheduled an interview and decrypted their security keys.
                      </p>
                      <button 
                         onClick={() => navigate("/company/applicants")}
                         className="gradient-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg"
                      >
                         Browse Applicants
                      </button>
                   </div>
                )}
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Applicant Profile Modal */}
      <AnimatePresence>
          {showProfileModal && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 20 }}
                   className="w-full max-w-6xl h-[90vh] bg-background rounded-[2rem] overflow-hidden shadow-2xl border border-border flex flex-col relative"
                >
                   {/* Modal Header */}
                   <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                            <User className="h-6 w-6" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                               {selectedApplicant?.userName}
                               {selectedApplicant?.status === "Interview Scheduled" && (
                                  <span className="text-[10px] uppercase bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-black border border-emerald-500/20 flex items-center gap-1">
                                     <UserCheck className="h-3 w-3" /> Interviewer View
                                  </span>
                               )}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                               <Mail className="h-3 w-3" /> {selectedApplicant?.userEmail} 
                               <span className="text-border px-1">&middot;</span> 
                               Applied for <span className="text-foreground font-bold">{selectedApplicant?.jobTitle}</span>
                            </p>
                         </div>
                      </div>
                      <button 
                         onClick={() => setShowProfileModal(false)}
                         className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                      >
                         <X className="h-5 w-5" />
                      </button>
                   </div>

                   {/* Modal Content */}
                   <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      {selectedApplicant?.videoId && (
                         <div className="mb-8 bg-card border border-border p-6 rounded-3xl shadow-soft">
                             <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                                <Video className="h-5 w-5 text-primary" /> Live Introduction Pitch
                             </h4>
                             <div className="aspect-video w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-inner mx-auto">
                                 <video controls className="w-full h-full object-contain" src={`${API_BASE_URL}/api/video/${selectedApplicant.videoId}`} />
                             </div>
                         </div>
                      )}
                      
                      <div className="grid gap-8 lg:grid-cols-5 h-full">
                         {/* Left Sidebar: AI Analysis */}
                         <div className="lg:col-span-2 space-y-6">
                            <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
                               <div className="flex items-center gap-3 mb-6">
                                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white">
                                     <Sparkles className="h-4 w-4" />
                                  </div>
                                  <h4 className="font-bold text-foreground">AI Career Intelligence</h4>
                               </div>
                               {fetchProfileLoading ? (
                                  <div className="space-y-4 animate-pulse">
                                     <div className="h-10 bg-muted/50 rounded-lg w-3/4"></div>
                                     <div className="h-4 bg-muted/50 rounded w-1/2"></div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="h-12 bg-muted/50 rounded-lg"></div>
                                        <div className="h-12 bg-muted/50 rounded-lg"></div>
                                     </div>
                                  </div>
                               ) : applicantAnalysis ? (
                                  <div className="space-y-8">
                                     <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-1">Predicted Master Role</p>
                                        <p className="text-2xl font-black text-primary tracking-tight leading-none">{applicantAnalysis.predicted_best_role}</p>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                           <div className="flex items-center gap-2 mb-1">
                                              <Timer className="h-3.5 w-3.5 text-primary" />
                                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Experience</p>
                                           </div>
                                           <p className="font-black text-foreground text-lg">{applicantAnalysis.experience_years} Years</p>
                                        </div>
                                        <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                                           <div className="flex items-center gap-2 mb-1">
                                              <Target className="h-3.5 w-3.5 text-secondary" />
                                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Match Score</p>
                                           </div>
                                           <p className="font-black text-secondary text-lg">{applicantAnalysis.role_analysis?.match_score}%</p>
                                        </div>
                                     </div>

                                     <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-3 border-b border-border pb-1">AI Identified Expertise</p>
                                        <div className="flex flex-wrap gap-2">
                                           {applicantAnalysis.extracted_skills?.map((s: string) => (
                                              <span key={s} className="px-3 py-1.5 rounded-lg bg-muted text-[11px] font-bold text-muted-foreground border border-border/50 uppercase">
                                                 {s}
                                              </span>
                                           ))}
                                        </div>
                                     </div>

                                     {/* Position Fit Sync */}
                                     <div className="pt-4 border-t border-border">
                                        <div className="flex items-center justify-between mb-2">
                                           <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Position Fit Analysis</p>
                                           <div className="flex items-center gap-1">
                                              <div className={`h-1.5 w-1.5 rounded-full ${applicantAnalysis.predicted_best_role.toLowerCase().includes(selectedApplicant?.jobTitle.toLowerCase()) ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                              <span className="text-[10px] font-bold text-foreground">Syncing...</span>
                                           </div>
                                        </div>
                                        <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                                           <div className="flex justify-between items-center text-xs">
                                              <span className="text-muted-foreground">Applied For:</span>
                                              <span className="font-bold text-foreground">{selectedApplicant?.jobTitle}</span>
                                           </div>
                                           <div className="flex justify-between items-center text-xs">
                                              <span className="text-muted-foreground">AI Focus:</span>
                                              <span className="font-bold text-primary">{applicantAnalysis.predicted_best_role}</span>
                                           </div>
                                           <div className="pt-2">
                                             <div className="flex justify-between text-[10px] mb-1">
                                               <span className="font-black uppercase tracking-tighter">Strategic Fit</span>
                                               <span className="font-black text-secondary">{applicantAnalysis.predicted_best_role.toLowerCase().includes(selectedApplicant?.jobTitle.toLowerCase()) ? '92%' : '45%'}</span>
                                             </div>
                                             <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                               <div className={`h-full rounded-full transition-all duration-1000 ${applicantAnalysis.predicted_best_role.toLowerCase().includes(selectedApplicant?.jobTitle.toLowerCase()) ? 'bg-emerald-500 w-[92%]' : 'bg-amber-500 w-[45%]'}`}></div>
                                             </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               ) : (
                                  <div className="py-12 text-center text-muted-foreground">
                                     <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                     <p className="text-xs font-bold leading-tight">No AI analysis found on user's secure bio.</p>
                                  </div>
                               )}
                            </section>

                            {/* Candidate Custom Answers Section */}
                            {selectedApplicant?.answers && Object.keys(selectedApplicant.answers).length > 0 && (
                               <section className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft">
                                  <div className="flex items-center gap-3 mb-6">
                                     <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                                        <HelpCircle className="h-4 w-4" />
                                     </div>
                                     <h4 className="font-bold text-foreground">Screening Question Responses</h4>
                                  </div>
                                  <div className="space-y-6">
                                     {Object.entries(selectedApplicant.answers).map(([q, ans], i) => (
                                        <div key={i} className="space-y-2 pb-6 border-b border-border border-dashed last:border-0 last:pb-0">
                                           <p className="text-sm font-bold text-foreground">{q}</p>
                                           <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{String(ans) || <span className="text-muted-foreground italic">No answer provided.</span>}</p>
                                           </div>
                                        </div>
                                     ))}
                                  </div>
                               </section>
                            )}

                            <section className="p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 shadow-soft relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                  <UserCheck className="h-12 w-12 -rotate-12" />
                               </div>
                               <div className="flex items-center gap-3 mb-4">
                                  <TrendingUp className="h-5 w-5 text-primary" />
                                  <h4 className="font-bold text-foreground">Hiring Execution</h4>
                               </div>
                               <div className="space-y-4 relative">
                                  {selectedApplicant?.status === "Interview Scheduled" ? (
                                     <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-start gap-3">
                                        <CheckSquare className="h-5 w-5 shrink-0 mt-0.5" />
                                        <div>
                                           <p className="text-xs font-black uppercase">Interview Locked In</p>
                                           <p className="text-[11px] font-medium leading-relaxed mt-0.5 opacity-80">Full document access has been granted for the interview process.</p>
                                        </div>
                                     </div>
                                  ) : (
                                     <div className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                                        <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                           <Loader2 className="h-3 w-3" />
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                           Ready for candidate review. Verified profile matches role expectations.
                                        </p>
                                     </div>
                                  )}
                                  <button 
                                     onClick={handleScheduleInterview}
                                     disabled={isScheduling || selectedApplicant?.status === "Interview Scheduled"}
                                     className={`w-full py-4 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                                        selectedApplicant?.status === "Interview Scheduled"
                                           ? "bg-muted text-muted-foreground cursor-not-allowed"
                                           : "gradient-primary text-white hover:brightness-110"
                                     }`}
                                  >
                                     {isScheduling ? "Syncing Event..." : selectedApplicant?.status === "Interview Scheduled" ? "Interview Scheduled" : "Schedule Interview"}
                                  </button>
                               </div>
                            </section>
                         </div>

                         {/* Right Side: Secure Document Vault */}
                         <div className="lg:col-span-3 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4 px-2">
                               <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                  <h4 className="font-bold text-foreground">Candidate Document Vault</h4>
                               </div>
                               {decryptedResumeUrl && (
                                  <div className="flex items-center gap-2">
                                     {selectedApplicant?.status === "Interview Scheduled" && (
                                        <button 
                                           onClick={() => setShowWatermark(!showWatermark)}
                                           className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                              showWatermark ? 'bg-muted text-muted-foreground border-border' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                           }`}
                                        >
                                           {showWatermark ? <Eye className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                                           {showWatermark ? 'Hide Watermark' : 'Show Watermark'}
                                        </button>
                                     )}
                                     {selectedApplicant?.status === "Interview Scheduled" ? (
                                        <span className="text-[10px] uppercase font-black text-emerald-500 flex items-center gap-1 bg-emerald-500/5 px-2 py-1 rounded-full border border-emerald-500/20">
                                           <Unlock className="h-3 w-3" /> Clean View Unlocked
                                        </span>
                                     ) : (
                                        <span className="text-[10px] uppercase font-black text-amber-500 flex items-center gap-1 bg-amber-500/5 px-2 py-1 rounded-full border border-amber-500/20">
                                           <Lock className="h-3 w-3" /> Protected Preview
                                        </span>
                                     )}
                                  </div>
                               )}
                            </div>
                            
                            <div className="flex-1 rounded-[1.5rem] border-2 border-dashed border-border bg-muted/10 relative overflow-hidden group shadow-inner min-h-[450px]">
                               {isResumeVisible && decryptedResumeUrl ? (
                                  <>
                                     <iframe 
                                        src={decryptedResumeUrl} 
                                        className="w-full h-full border-0 select-none pointer-events-auto"
                                        title="Candidate Resume"
                                     />
                                     {/* Clean Single-Text Conditional Watermark Overlay */}
                                     {(selectedApplicant?.status !== "Interview Scheduled" || showWatermark) && (
                                        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center z-10 transition-opacity duration-1000">
                                           <div className="text-[12vw] font-black tracking-tighter text-foreground opacity-[0.08] -rotate-45 pb-24">
                                              VishwasX
                                           </div>
                                        </div>
                                     )}
                                     <div className="absolute inset-0 pointer-events-none border-[20px] border-secondary/5 z-20"></div>
                                  </>
                               ) : (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                     <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30 mb-6 border border-border shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <Lock className="h-12 w-12" />
                                     </div>
                                     <h5 className="text-2xl font-black tracking-tight text-foreground">Verified Document Key Required</h5>
                                     <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed mb-8">
                                        This document is end-to-End Encrypted. Decryption is performed locally in your session.
                                     </p>
                                     <button 
                                        onClick={() => setIsResumeVisible(true)}
                                        disabled={!decryptedResumeUrl || fetchProfileLoading || isDecrypting}
                                        className="gradient-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:grayscale"
                                     >
                                        {fetchProfileLoading || isDecrypting ? (
                                           <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : !decryptedResumeUrl ? (
                                           "N/A (Key Missing)"
                                        ) : (
                                           <><Eye className="h-5 w-5" /> View Verified Resume</>
                                        )}
                                     </button>
                                     {!decryptedResumeUrl && !fetchProfileLoading && !isDecrypting && (
                                       <p className="text-[10px] text-red-500 font-bold mt-4 uppercase">
                                          Security Notice: Candidate's document key was not captured during application.
                                       </p>
                                     )}
                                  </div>
                               )}
                               
                               {/* Floating Shield Status */}
                               <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-background/90 backdrop-blur-md border border-border shadow-elevated flex items-center gap-3 z-30">
                                  <div className={`h-2 w-2 rounded-full ${decryptedResumeUrl ? 'bg-emerald-500 shadow-[0_0_8px_bg-emerald-500]' : 'bg-amber-500 animate-pulse'}`}></div>
                                  <span className="text-[10px] font-black uppercase text-foreground tracking-widest flex items-center gap-1.5">
                                     <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Multi-Layer Encryption: <span className={decryptedResumeUrl ? 'text-emerald-500' : 'text-amber-500'}>{decryptedResumeUrl ? 'Active' : 'Standby'}</span>
                                  </span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const PostJobSection = ({ companyId, companyName, isVerified }: { companyId: string | undefined; companyName: string | undefined; isVerified: boolean | undefined }) => {
  const [loading, setLoading] = useState(false);
  const [extraQuestions, setExtraQuestions] = useState<{question: string, required: boolean}[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [formData, setFormData] = useState({
     title: "",
     description: "",
     skills: "",
     type: "Full-time"
  });

  const handleAddQuestion = () => {
     if (newQuestionText.trim()) {
        setExtraQuestions([...extraQuestions, { question: newQuestionText.trim(), required: newQuestionRequired }]);
        setNewQuestionText("");
        setNewQuestionRequired(false);
     }
  };

  const handleRemoveQuestion = (idx: number) => {
     setExtraQuestions(extraQuestions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!companyId) return;
     
     setLoading(true);
     try {
        const response = await fetch(`${API_BASE_URL}/api/company/post-job`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              title: formData.title,
              description: formData.description,
              skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
              type: formData.type,
              companyId,
              companyName: companyName || "Unknown Company",
              extraQuestions
           })
        });
        const data = await response.json();
        if (data.success) {
           toast.success("Job posted successfully!");
           setFormData({ title: "", description: "", skills: "", type: "Full-time" });
           setExtraQuestions([]);
        } else {
           toast.error(data.detail || "Only verified companies can post jobs");
        }
     } catch (error) {
        toast.error("Failed to post job");
     } finally {
        setLoading(false);
     }
  };

  return (
     <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
           <Plus className="h-6 w-6 text-primary" />
           <h2 className="text-2xl font-display font-bold">Post New Job Requisition</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Job Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full bg-muted/30 border border-border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Job Type</label>
                <select 
                   value={formData.type}
                   onChange={e => setFormData({...formData, type: e.target.value})}
                   className="w-full bg-muted/30 border border-border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                >
                   <option>Full-time</option>
                   <option>Internship</option>
                   <option>Returnship</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Required Skills</label>
                <input 
                   required
                   value={formData.skills}
                   onChange={e => setFormData({...formData, skills: e.target.value})}
                   placeholder="React, Python, SQL (comma-separated)"
                   className="w-full bg-muted/30 border border-border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Job Description</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={5}
                placeholder="Describe the role, responsibilities, and specific details for returning workforce candidates..."
                className="w-full bg-muted/30 border border-border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition resize-none"
              />
           </div>
           {!isVerified && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 mb-6">
                 <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                 <div>
                    <p className="text-sm font-bold text-amber-800">Verification Required</p>
                    <p className="text-xs text-amber-700/80">Only verified accounts can post new job requisitions. Please complete your company verification process to unlock this feature.</p>
                 </div>
              </div>
           )}
           
           <div className="space-y-4 pt-4 border-t border-border">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                 <HelpCircle className="h-4 w-4" /> Custom Applicant Questions
              </label>
              
              {/* Question list */}
              {extraQuestions.length > 0 && (
                 <div className="space-y-3 mb-4">
                    {extraQuestions.map((eq, idx) => (
                       <div key={idx} className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/50">
                          <div className="flex-1 pr-4">
                             <p className="text-sm font-medium text-foreground">{eq.question}</p>
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${eq.required ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-primary/10 text-primary border border-primary/20"}`}>
                                {eq.required ? "Mandatory" : "Optional"}
                             </span>
                          </div>
                          <button type="button" onClick={() => handleRemoveQuestion(idx)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all">
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                    ))}
                 </div>
              )}
              
              <div className="flex items-start gap-3">
                 <div className="flex-1 space-y-3">
                    <input 
                       value={newQuestionText}
                       onChange={e => setNewQuestionText(e.target.value)}
                       placeholder="e.g. Why do you want to join our company?"
                       className="w-full bg-muted/30 border border-border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none transition"
                       onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddQuestion(); } }}
                    />
                    <label className="flex items-center gap-2 cursor-pointer w-max">
                       <input 
                          type="checkbox" 
                          checked={newQuestionRequired}
                          onChange={e => setNewQuestionRequired(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                       />
                       <span className="text-xs font-bold text-muted-foreground">Mark answer as mandatory</span>
                    </label>
                 </div>
                 <button 
                    type="button" 
                    onClick={handleAddQuestion}
                    disabled={!newQuestionText.trim()}
                    className="bg-primary/10 text-primary px-4 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/20 transition-all border border-primary/20"
                 >
                    <Plus className="h-4 w-4" /> Add
                 </button>
              </div>
           </div>


           <button 
              type="submit" 
              disabled={loading || !isVerified}
              className={`w-full ${isVerified ? "gradient-primary" : "bg-muted cursor-not-allowed grayscale"} text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2`}
           >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Publish Job Post <CheckCircle className="h-5 w-5" /></>}
           </button>
        </form>
     </div>
  );
};

const StatCard = ({ icon, label, value, trend, color, bg }: any) => (
  <div className="rounded-xl border border-border bg-card shadow-card p-6 flex flex-col justify-between">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${bg} ${color}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold px-2 py-1 rounded bg-muted/50 text-muted-foreground uppercase">
        {trend}
      </span>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default CompanyDashboard;
