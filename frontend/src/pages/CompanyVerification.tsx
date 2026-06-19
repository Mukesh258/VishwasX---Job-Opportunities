import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PHISHING_REJECT_PROBABILITY,
  TRUST_VERIFY_THRESHOLD,
  type CompanyVerificationInput,
  type CompanyVerificationResult,
  getVerifiedCompanies,
  verifyCompany,
} from "@/lib/companyVerification";

const initialForm: CompanyVerificationInput = {
  companyName: "",
  domain: "",
  email: "",
  website: "",
  industry: "",
  details: "",
};

const CompanyVerification = () => {
  const [form, setForm] = useState<CompanyVerificationInput>(initialForm);
  const [result, setResult] = useState<CompanyVerificationResult | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifiedCompanies = useMemo(() => getVerifiedCompanies(), [result]);

  const onChange = (field: keyof CompanyVerificationInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 450));

    const verification = verifyCompany(form);
    if (verification.success === false) {
      setResult(null);
      setError(verification.message);
      setIsSubmitting(false);
      return;
    }

    setResult(verification.result);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 px-0 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-2xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur"
        >
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">SecureApply Phase 1</p>
            <h1 className="font-display text-3xl font-bold text-foreground">Company Verification Console</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Hybrid decision: approve only when trust score is {TRUST_VERIFY_THRESHOLD}+ and phishing probability is below {Math.round(PHISHING_REJECT_PROBABILITY * 100)}%.
            </p>
          </div>

          <form onSubmit={handleVerify} className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-foreground">Company Name</span>
              <input
                value={form.companyName}
                onChange={(e) => onChange("companyName", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="Nova Careers Pvt Ltd"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-foreground">Company Domain</span>
              <input
                value={form.domain}
                onChange={(e) => onChange("domain", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="novacareers.com"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-foreground">Official Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="hr@novacareers.com"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-foreground">Website URL</span>
              <input
                value={form.website}
                onChange={(e) => onChange("website", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="https://novacareers.com"
              />
            </label>

            <label className="space-y-2 sm:col-span-1">
              <span className="text-sm font-medium text-foreground">Industry</span>
              <input
                value={form.industry}
                onChange={(e) => onChange("industry", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="Technology"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-foreground">Company Details</span>
              <textarea
                value={form.details}
                onChange={(e) => onChange("details", e.target.value)}
                className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="Describe hiring practices, legal registration, and public business profile."
              />
            </label>

            {error && (
              <div className="sm:col-span-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Evaluating company..." : "Run phishing verification"}
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-6 rounded-xl border border-border bg-background/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Trust score</p>
                    <p className="font-display text-4xl font-bold text-foreground">{result.trustScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Phishing risk</p>
                    <p className="font-display text-4xl font-bold text-foreground">{result.phishingRiskPercent}%</p>
                  </div>
                </div>
                <div className="rounded-full px-4 py-2 text-sm font-semibold">
                  {result.isVerified ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                      <ShieldCheck className="h-4 w-4" /> Verified Company
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                      <ShieldAlert className="h-4 w-4" /> Rejected (possible fraud)
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {result.signals.map((signal) => (
                  <div key={signal.name} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-semibold text-foreground">{signal.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Score: {signal.score}/{signal.maxScore}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">{signal.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="text-sm font-semibold text-foreground">Rule flags</p>
                {result.ruleFlags.length === 0 ? (
                  <p className="mt-1 text-xs text-emerald-700">No rule flags triggered.</p>
                ) : (
                  <ul className="mt-2 space-y-1 text-xs text-rose-700">
                    {result.ruleFlags.map((flag) => (
                      <li key={flag}>- {flag}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 rounded-lg border border-border p-3">
                <p className="text-sm font-semibold text-foreground">Registration permission</p>
                {result.isVerified ? (
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="text-xs text-emerald-700">Allowed: This verified company can proceed to register.</p>
                    <Link
                      to="/company-signup"
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Proceed to Register
                    </Link>
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="text-xs text-rose-700">Blocked: Rejected (possible fraud). Registration is not allowed.</p>
                    <button
                      type="button"
                      disabled
                      className="cursor-not-allowed rounded-lg bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground"
                    >
                      Registration Blocked
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur"
        >
          <div className="mb-4 flex items-center gap-2">
            <ShieldQuestion className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Verification Rules</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              Domain age pattern
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              SSL certificate (HTTPS)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              Suspicious URL patterns
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              Blacklist indicator checks
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
              Email-domain match
            </li>
          </ul>

          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
            MVP note: this is a heuristic frontend model for Phase 1. In production, wire WHOIS, SSL certificate checks, and Safe Browsing APIs in backend.
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-foreground">Verified companies ({verifiedCompanies.length})</h3>
            {verifiedCompanies.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">No verified companies yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {verifiedCompanies.slice(0, 6).map((company) => (
                  <div key={company.companyId} className="rounded-lg border border-border px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{company.companyName}</p>
                    <p className="text-xs text-muted-foreground">{company.normalizedDomain}</p>
                    <p className="text-xs text-emerald-700">Trust: {company.trustScore}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <p>
                Current rule: trust must be at least {TRUST_VERIFY_THRESHOLD}% and phishing probability must stay below {Math.round(PHISHING_REJECT_PROBABILITY * 100)}%.
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

export default CompanyVerification;
