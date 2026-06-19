import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { isValidEmail, isValidPassword, getPasswordStrength } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/apiService";

const PENDING_SIGNUP_KEY = "vishwasx_pending_signup";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+[1-9]\d{6,14}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone must be in E.164 format (example: +919876543210)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and numbers";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      let userCredential;

      try {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          setErrors({ submit: "This email is already registered! Please go to the Sign In page." });
          setLoading(false);
          return;
        } else {
           throw err;
        }
      }
      
      try {
        await sendEmailVerification(userCredential.user);
      } catch (err) {
        setErrors({ submit: "Failed to send verification email. Please try again later." });
        return;
      }

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        firebaseUID: userCredential.user.uid,
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/register-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrors({ submit: result.detail || result.message || "Saved in Firebase but failed to save profile to database." });
        return;
      }
      
      // Keep errors format but show success explicitly, or use a success toast.
      // We will show success inside the error block temporarily since it renders the string
      setErrors({ submit: "Registration successful! A verification link has been sent to your email. Redirecting to Sign In..." });
      
      setTimeout(() => {
        navigate("/signin");
      }, 4000);
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setErrors({ submit: "This email is already registered! Please go to the Sign In page." });
      } else {
        setErrors({ submit: err.message || "Unable to continue signup. Please try again." });
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
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join VishwasX and accelerate your career journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 p-6 shadow-xl">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-input bg-background/50 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+919876543210"
                className="w-full rounded-lg border border-input bg-background/50 pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.phone}
              </p>
            )}
          </div>

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
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
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

            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i <= (passwordStrength.strength === "weak" ? 1 : passwordStrength.strength === "medium" ? 2 : 3)
                          ? passwordStrength.strength === "weak"
                            ? "bg-destructive"
                            : passwordStrength.strength === "medium"
                              ? "bg-accent"
                              : "bg-secondary"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{passwordStrength.feedback}</p>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-input bg-background/50 pl-10 pr-10 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="mt-1 text-sm text-secondary flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Passwords match
              </p>
            )}

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg gradient-primary px-4 py-2.5 text-base font-semibold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>

        {/* Features */}
        <div className="mt-8 space-y-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md p-4 shadow-lg">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">What you get:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              Personalized career roadmap
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              AI-powered insights
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              Learning resources hub
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              Community support
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
