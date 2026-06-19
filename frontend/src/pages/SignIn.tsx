import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { disableGuestMode } from "@/lib/guestMode";
import { API_BASE_URL } from "@/lib/apiService";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Proceed with local profile hookup
      const response = await fetch(`${API_BASE_URL}/api/auth/user/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      
      const result = await response.json();
      console.log("Sign-in backend response:", result);

      if (response.ok && result.success) {
        disableGuestMode();
        setSuccessMessage("Signed in successfully! Redirecting...");
        if (rememberMe) {
          localStorage.setItem("sheReboot_rememberMe", formData.email);
        }
        
        // Save current user to localStorage so Navbar shows Profile instead of Sign In
        const currentUserData = {
          id: result.user.id || result.user.email,
          email: result.user.email,
          name: result.user.name,
          role: 'user' as const,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("sheReboot_currentUser", JSON.stringify(currentUserData));
        
        if (result.profile) {
          const profileData = {
            previousRole: result.profile.previousRole,
            yearsExperience: result.profile.yearsExperience,
            careerBreakDuration: result.profile.careerBreakDuration,
            currentSkills: result.profile.currentSkills,
            desiredRole: result.profile.desiredRole,
            educationLevel: result.profile.educationLevel,
          };
          localStorage.setItem("restartai_career_stage", result.profile.careerStage);
          localStorage.setItem("restartai_profile", JSON.stringify(profileData));
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          // Profile not completely setup, send them to /profile
          localStorage.removeItem("restartai_profile");
          localStorage.removeItem("restartai_career_stage");
          
          setTimeout(() => {
            navigate("/profile");
          }, 1500);
        }
      } else {
        setErrors({ submit: result.detail || result.message || "Sign-in failed." });
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      if (error?.code === "auth/invalid-credential" || error?.code === "auth/wrong-password") {
        setErrors({ submit: "Incorrect email or password." });
      } else if (error?.code === "auth/user-not-found") {
        setErrors({ submit: "No account found with this email. Please create one first." });
      } else {
        setErrors({ submit: error?.message || "An error occurred. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center px-0 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome</h1>
          <p className="text-muted-foreground">Sign in to your VishwasX user account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-xl">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-background/50 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-input bg-background/50 pl-10 pr-10 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
            />
            <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-3 flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <p className="text-sm text-secondary">{successMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg gradient-primary px-4 py-2.5 text-base font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Are you a company?{" "}
            <Link to="/company-signin" className="font-semibold text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>


      </motion.div>
    </div>
  );
};

export default SignIn;
