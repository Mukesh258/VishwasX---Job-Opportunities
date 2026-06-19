import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Building2, CheckCircle2, Eye, EyeOff, Globe, Lock, Mail, ShieldCheck } from "lucide-react";
import { getCompanyRegistrationPermission } from "@/lib/companyVerification";
import { API_BASE_URL } from "@/lib/apiService";

interface CompanyRegistrationForm {
  companyName: string;
  normalizedDomain: string;
  contactEmail: string;
  hiringContactName: string;
  hiringContactPhone: string;
  companySize: string;
  hiringRoles: string;
  headquarters: string;
  password: string;
  confirmPassword: string;
}

interface RegisteredCompanyRecord extends CompanyRegistrationForm {
  companyId: string;
  createdAt: string;
}



const CompanySignUp = () => {
  const navigate = useNavigate();
  const permission = useMemo(() => getCompanyRegistrationPermission(), []);

  const [form, setForm] = useState<CompanyRegistrationForm>({
    companyName: permission?.companyName ?? "",
    normalizedDomain: permission?.normalizedDomain ?? "",
    contactEmail: "",
    hiringContactName: "",
    hiringContactPhone: "",
    companySize: "",
    hiringRoles: "",
    headquarters: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const companyVerified = permission?.isVerified === true;

  const onChange = (field: keyof CompanyRegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!companyVerified) {
      nextErrors.submit = "Company is not verified. Please complete verification first.";
    }

    if (!form.companyName.trim()) nextErrors.companyName = "Company name is required";
    if (!form.normalizedDomain.trim()) nextErrors.normalizedDomain = "Domain is required";
    if (!form.contactEmail.trim()) {
      nextErrors.contactEmail = "Official contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      nextErrors.contactEmail = "Invalid email format";
    }

    if (!form.hiringContactName.trim()) nextErrors.hiringContactName = "Hiring contact name is required";
    if (!form.hiringContactPhone.trim()) nextErrors.hiringContactPhone = "Hiring contact phone is required";
    if (!form.companySize.trim()) nextErrors.companySize = "Company size is required";
    if (!form.hiringRoles.trim()) nextErrors.hiringRoles = "Please add hiring roles";
    if (!form.headquarters.trim()) nextErrors.headquarters = "Headquarters is required";

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (form.contactEmail && form.normalizedDomain) {
      const emailDomain = form.contactEmail.trim().toLowerCase().split("@")[1] || "";
      const normalizedDomain = form.normalizedDomain.trim().toLowerCase();
      if (emailDomain !== normalizedDomain && !emailDomain.endsWith(`.${normalizedDomain}`)) {
        nextErrors.contactEmail = "Contact email must match verified company domain";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(false);

    if (!validate()) return;

    const companyId = permission?.companyId ?? `company_${Date.now()}`;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, companyId, isVerified: companyVerified })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSaved(true);
        setTimeout(() => navigate("/company-signin"), 1200);
      } else {
        setErrors({ submit: result.detail || result.message || "Registration failed" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred during registration" });
    }
  };

  if (!permission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 px-0 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl">
          <h1 className="font-display text-2xl font-bold text-foreground">Company Registration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No verification record found. Please verify your company before registration.
          </p>
          <Link
            to="/company-verification"
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Go To Company Verification
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 px-0 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/90 p-6 shadow-xl backdrop-blur">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Company Onboarding</p>
            <h1 className="font-display text-3xl font-bold text-foreground">Verified Company Registration</h1>
          </div>
          {companyVerified ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              <ShieldCheck className="h-4 w-4" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4" /> Blocked
            </span>
          )}
        </div>

        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Company Name</span>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={form.companyName}
                onChange={(e) => onChange("companyName", e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="Nova Careers Pvt Ltd"
              />
            </div>
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Verified Domain</span>
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={form.normalizedDomain}
                onChange={(e) => onChange("normalizedDomain", e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="novacareers.com"
              />
            </div>
            {errors.normalizedDomain && <p className="text-xs text-destructive">{errors.normalizedDomain}</p>}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Official Contact Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => onChange("contactEmail", e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="hr@novacareers.com"
              />
            </div>
            {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail}</p>}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Hiring Contact Name</span>
            <input
              value={form.hiringContactName}
              onChange={(e) => onChange("hiringContactName", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
              placeholder="Ananya Sharma"
            />
            {errors.hiringContactName && <p className="text-xs text-destructive">{errors.hiringContactName}</p>}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Hiring Contact Phone</span>
            <input
              value={form.hiringContactPhone}
              onChange={(e) => onChange("hiringContactPhone", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
              placeholder="+919900001122"
            />
            {errors.hiringContactPhone && <p className="text-xs text-destructive">{errors.hiringContactPhone}</p>}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Company Size</span>
            <select
              value={form.companySize}
              onChange={(e) => onChange("companySize", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
            >
              <option value="">Select size</option>
              <option value="1-50">1-50</option>
              <option value="51-200">51-200</option>
              <option value="201-1000">201-1000</option>
              <option value="1000+">1000+</option>
            </select>
            {errors.companySize && <p className="text-xs text-destructive">{errors.companySize}</p>}
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-foreground">Current Hiring Roles</span>
            <textarea
              value={form.hiringRoles}
              onChange={(e) => onChange("hiringRoles", e.target.value)}
              className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
              placeholder="Frontend Developer, Data Analyst, QA Engineer"
            />
            {errors.hiringRoles && <p className="text-xs text-destructive">{errors.hiringRoles}</p>}
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-foreground">Headquarters</span>
            <input
              value={form.headquarters}
              onChange={(e) => onChange("headquarters", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
              placeholder="Bengaluru, India"
            />
            {errors.headquarters && <p className="text-xs text-destructive">{errors.headquarters}</p>}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => onChange("password", e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-10 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Confirm Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => onChange("confirmPassword", e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-10 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
          </label>

          {errors.submit && (
            <div className="sm:col-span-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.submit}
            </div>
          )}

          {saved && (
            <div className="sm:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Company registration saved. Redirecting to sign in...
              </div>
            </div>
          )}

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!companyVerified}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Complete Company Registration
            </button>
            <Link
              to="/company-verification"
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to Verification
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySignUp;
