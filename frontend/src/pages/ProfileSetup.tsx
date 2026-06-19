import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "@/lib/mockData";
import { getFirebaseAuth } from "@/lib/firebase";
import { API_BASE_URL } from "@/lib/apiService";

const educationLevels = ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Diploma/Certificate", "Other"];
const careerStages = [
  "Career Restart",
  "Student / Fresher",
  "Early Career (0-3 years)",
  "Mid Career (4-10 years)",
  "Senior Professional (10+ years)",
  "Career Switch",
  "Freelancer / Consultant",
  "Business Owner / Entrepreneur",
  "Other",
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [form, setForm] = useState({
    careerStage: "",
    previousRole: "",
    yearsExperience: "",
    careerBreakDuration: "",
    currentSkills: "",
    desiredRole: "",
    educationLevel: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const storedStage = localStorage.getItem("restartai_career_stage");
    const storedProfile = localStorage.getItem("restartai_profile");
    if (storedStage && storedProfile) {
      try {
        const p = JSON.parse(storedProfile);
        setForm({
          careerStage: storedStage,
          previousRole: p.previousRole || "",
          yearsExperience: p.yearsExperience?.toString() || "",
          careerBreakDuration: p.careerBreakDuration || "",
          currentSkills: Array.isArray(p.currentSkills) ? p.currentSkills.join(", ") : p.currentSkills || "",
          desiredRole: p.desiredRole || "",
          educationLevel: p.educationLevel || "",
        });
        setHasProfile(true);
        setIsEdit(false);
      } catch (e) {
        // skip
      }
    } else {
      setIsEdit(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.careerStage) errs.careerStage = "Select your current career stage";
    if (!form.previousRole.trim()) errs.previousRole = "Required";
    if (!form.yearsExperience || +form.yearsExperience < 0) errs.yearsExperience = "Enter valid experience";
    if (form.careerStage === "Career Restart" && !form.careerBreakDuration.trim()) {
      errs.careerBreakDuration = "Required for career restart";
    }
    if (!form.currentSkills.trim()) errs.currentSkills = "Enter at least one skill";
    if (!form.desiredRole.trim()) errs.desiredRole = "Required";
    if (!form.educationLevel) errs.educationLevel = "Select education level";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);

    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      
      if (!user) {
        setErrors((prev) => ({ ...prev, submit: "You must be logged in to save your profile." }));
        setLoading(false);
        return;
      }

      const payload = {
        firebaseUID: user.uid,
        email: user.email,
        careerStage: form.careerStage,
        previousRole: form.previousRole.trim(),
        yearsExperience: +form.yearsExperience,
        careerBreakDuration: form.careerBreakDuration.trim() || "N/A",
        currentSkills: form.currentSkills.split(",").map(s => s.trim()).filter(Boolean),
        desiredRole: form.desiredRole.trim(),
        educationLevel: form.educationLevel,
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/user/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        setErrors((prev) => ({ ...prev, submit: result.detail || result.message || "Failed to update profile." }));
        setLoading(false);
        return;
      }

      // Preserve existing local storage cache for swift UI rendering downstream
      const profile: UserProfile = {
        previousRole: payload.previousRole,
        yearsExperience: payload.yearsExperience,
        careerBreakDuration: payload.careerBreakDuration,
        currentSkills: payload.currentSkills,
        desiredRole: payload.desiredRole,
        educationLevel: payload.educationLevel,
      };
      
      localStorage.setItem("restartai_career_stage", form.careerStage);
      localStorage.setItem("restartai_profile", JSON.stringify(profile));
      setHasProfile(true);
      setIsEdit(false);
      if (!hasProfile) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, submit: "A network error occurred." }));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
      errors[field] ? "border-destructive bg-destructive/5" : "border-border bg-card"
    }`;

  const profileRows = [
    { label: "Current Career Stage", value: form.careerStage || "-" },
    { label: "Current / Previous Job Role", value: form.previousRole || "-" },
    { label: "Years of Experience", value: form.yearsExperience || "-" },
    { label: "Career Break Duration", value: form.careerBreakDuration || "N/A" },
    { label: "Desired Career Role", value: form.desiredRole || "-" },
    { label: "Education Level", value: form.educationLevel || "-" },
  ];
  const skills = form.currentSkills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen px-0 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isEdit ? (hasProfile ? "Edit Career Profile" : "Career Profile Setup") : "Your Career Profile"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isEdit
              ? hasProfile
                ? "Update your background to adjust your personalized career path."
                : "Tell us about your background so we can personalize your career path for your current stage."
              : "Review your saved profile details. Click edit whenever you want to update information."}
          </p>
        </div>

        {!isEdit && hasProfile ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="space-y-4">
              {profileRows.map((row) => (
                <div key={row.label} className="rounded-xl border border-border bg-background/60 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{row.value}</p>
                </div>
              ))}

              <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Current Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsEdit(true)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-[1.01]"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Current Career Stage</label>
            <select name="careerStage" value={form.careerStage} onChange={handleChange} className={inputClass("careerStage")}>
              <option value="">Select...</option>
              {careerStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
            </select>
            {errors.careerStage && <p className="mt-1 text-xs text-destructive">{errors.careerStage}</p>}
          </div>

          {/* Previous Role */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Current / Previous Job Role</label>
            <input name="previousRole" value={form.previousRole} onChange={handleChange} placeholder="e.g. Software Developer" className={inputClass("previousRole")} />
            {errors.previousRole && <p className="mt-1 text-xs text-destructive">{errors.previousRole}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Years of Experience</label>
              <input name="yearsExperience" type="number" min="0" value={form.yearsExperience} onChange={handleChange} placeholder="e.g. 5" className={inputClass("yearsExperience")} />
              {errors.yearsExperience && <p className="mt-1 text-xs text-destructive">{errors.yearsExperience}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Career Break Duration (if applicable)</label>
              <input name="careerBreakDuration" value={form.careerBreakDuration} onChange={handleChange} placeholder={form.careerStage === "Career Restart" ? "e.g. 3 years" : "Optional"} className={inputClass("careerBreakDuration")} />
              {errors.careerBreakDuration && <p className="mt-1 text-xs text-destructive">{errors.careerBreakDuration}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Current Skills (comma separated)</label>
            <input name="currentSkills" value={form.currentSkills} onChange={handleChange} placeholder="e.g. Python, SQL, Excel" className={inputClass("currentSkills")} />
            {errors.currentSkills && <p className="mt-1 text-xs text-destructive">{errors.currentSkills}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Desired Career Role</label>
            <input name="desiredRole" value={form.desiredRole} onChange={handleChange} placeholder="e.g. Data Analyst" className={inputClass("desiredRole")} />
            {errors.desiredRole && <p className="mt-1 text-xs text-destructive">{errors.desiredRole}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Education Level</label>
            <select name="educationLevel" value={form.educationLevel} onChange={handleChange} className={inputClass("educationLevel")}>
              <option value="">Select...</option>
              {educationLevels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {errors.educationLevel && <p className="mt-1 text-xs text-destructive">{errors.educationLevel}</p>}
          </div>

          {errors.submit && (
             <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 mb-4">
               <p className="text-sm text-destructive font-medium">{errors.submit}</p>
             </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl gradient-primary py-3 text-base font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (isEdit ? "Updating Profile..." : "Saving Profile...") : (isEdit ? "Update Profile →" : "Start Career Analysis →")}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
