export const TRUST_VERIFY_THRESHOLD = 85;
export const PHISHING_REJECT_PROBABILITY = 0.15;

export interface CompanyVerificationInput {
  companyName: string;
  domain: string;
  email: string;
  website: string;
  industry: string;
  details: string;
}

export interface VerificationSignal {
  name: string;
  score: number;
  maxScore: number;
  verdict: "pass" | "warning" | "fail";
  note: string;
}

export interface CompanyVerificationResult {
  companyId: string;
  normalizedDomain: string;
  phishingProbability: number;
  phishingRiskPercent: number;
  trustScore: number;
  isVerified: boolean;
  signals: VerificationSignal[];
  ruleFlags: string[];
  verifiedAt: string;
}

export interface VerifiedCompanyRecord extends CompanyVerificationInput, CompanyVerificationResult {}

export interface CompanyRegistrationPermission {
  companyId: string;
  companyName: string;
  normalizedDomain: string;
  isVerified: boolean;
  reason: string;
  updatedAt: string;
}

const VERIFIED_COMPANIES_KEY = "sheReboot_verifiedCompanies";
const COMPANY_AUDITS_KEY = "sheReboot_companyVerificationAudits";
const COMPANY_REGISTRATION_PERMISSION_KEY = "sheReboot_companyRegistrationPermission";

const BLACKLIST_SNIPPETS = [
  "free-gift",
  "secure-update-now",
  "verify-wallet",
  "crypto-win",
  "login-alert",
  "urgent-payment",
  "xn--",
];

const TRUSTED_TLDS = [".com", ".org", ".edu", ".gov", ".co", ".in", ".io"];

function normalizeDomain(input: string): string {
  const value = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");
  return value.split("/")[0];
}

function domainAgeSignal(domain: string): VerificationSignal {
  const hasManyDigits = (domain.match(/\d/g) || []).length >= 4;
  const hasSuspiciousWords = /(temp|new|offer|deal|promo|bonus)/.test(domain);
  const hasTrustedTld = TRUSTED_TLDS.some((tld) => domain.endsWith(tld));

  if (hasManyDigits || hasSuspiciousWords) {
    return {
      name: "Domain age pattern",
      score: 6,
      maxScore: 20,
      verdict: "warning",
      note: "Domain pattern suggests a recently created or campaign-style domain.",
    };
  }

  if (hasTrustedTld) {
    return {
      name: "Domain age pattern",
      score: 18,
      maxScore: 20,
      verdict: "pass",
      note: "Domain pattern looks stable and business-oriented.",
    };
  }

  return {
    name: "Domain age pattern",
    score: 10,
    maxScore: 20,
    verdict: "warning",
    note: "Domain age is uncertain; run WHOIS in backend for stronger evidence.",
  };
}

function sslSignal(website: string): VerificationSignal {
  const isHttps = website.trim().toLowerCase().startsWith("https://");
  if (isHttps) {
    return {
      name: "SSL certificate",
      score: 15,
      maxScore: 15,
      verdict: "pass",
      note: "HTTPS detected.",
    };
  }

  return {
    name: "SSL certificate",
    score: 0,
    maxScore: 15,
    verdict: "fail",
    note: "Website is not HTTPS.",
  };
}

function urlPatternSignal(website: string, domain: string): VerificationSignal {
  const target = `${website.toLowerCase()} ${domain}`;
  const suspiciousPattern = /(free|urgent|verify|password|wallet|bonus|claim|banking-login)/.test(target);

  if (suspiciousPattern) {
    return {
      name: "URL pattern",
      score: 6,
      maxScore: 20,
      verdict: "warning",
      note: "Suspicious URL keywords detected.",
    };
  }

  return {
    name: "URL pattern",
    score: 19,
    maxScore: 20,
    verdict: "pass",
    note: "No suspicious URL pattern found.",
  };
}

function blacklistSignal(website: string, domain: string): VerificationSignal {
  const haystack = `${website.toLowerCase()} ${domain}`;
  const hit = BLACKLIST_SNIPPETS.some((token) => haystack.includes(token));

  if (hit) {
    return {
      name: "Blacklist/API risk",
      score: 0,
      maxScore: 25,
      verdict: "fail",
      note: "Pattern matched known high-risk phishing indicators.",
    };
  }

  return {
    name: "Blacklist/API risk",
    score: 24,
    maxScore: 25,
    verdict: "pass",
    note: "No blacklist-style indicators in current heuristic checks.",
  };
}

function emailDomainSignal(email: string, domain: string): VerificationSignal {
  const emailDomain = email.trim().toLowerCase().split("@")[1] || "";

  if (!emailDomain) {
    return {
      name: "Email-domain match",
      score: 0,
      maxScore: 20,
      verdict: "fail",
      note: "Email format is invalid.",
    };
  }

  if (emailDomain === domain || emailDomain.endsWith(`.${domain}`) || domain.endsWith(`.${emailDomain}`)) {
    return {
      name: "Email-domain match",
      score: 20,
      maxScore: 20,
      verdict: "pass",
      note: "Email domain matches company domain.",
    };
  }

  return {
    name: "Email-domain match",
    score: 3,
    maxScore: 20,
    verdict: "fail",
    note: "Email domain does not match submitted company domain.",
  };
}

function validateInput(input: CompanyVerificationInput): string[] {
  const errors: string[] = [];
  if (!input.companyName.trim()) errors.push("Company name is required.");
  if (!input.domain.trim()) errors.push("Domain is required.");
  if (!input.email.trim()) errors.push("Official email is required.");
  if (!input.website.trim()) errors.push("Website URL is required.");
  if (!input.industry.trim()) errors.push("Industry is required.");
  if (!input.details.trim()) errors.push("Company details are required.");
  return errors;
}

function estimateMlPhishingProbability(input: CompanyVerificationInput, domain: string): number {
  const website = input.website.toLowerCase();
  const fullText = `${domain} ${website}`;

  let risk = 0.04;

  if (domain.length > 35) risk += 0.08;
  if ((domain.match(/\d/g) || []).length >= 4) risk += 0.1;
  if ((domain.match(/\./g) || []).length >= 3) risk += 0.08;
  if ((domain.match(/-/g) || []).length >= 2) risk += 0.06;
  if (!website.startsWith("https://")) risk += 0.18;

  if (/(login|verify|secure|update|wallet|banking|alert|claim|bonus)/.test(fullText)) {
    risk += 0.2;
  }

  if (BLACKLIST_SNIPPETS.some((token) => fullText.includes(token))) {
    risk += 0.18;
  }

  return Math.min(Math.max(risk, 0), 1);
}

function evaluateRuleFlags(input: CompanyVerificationInput, domain: string): { ruleFlags: string[]; ruleRisk: number } {
  const ruleFlags: string[] = [];
  const emailDomain = input.email.trim().toLowerCase().split("@")[1] || "";
  const website = input.website.trim().toLowerCase();

  if (!emailDomain || (emailDomain !== domain && !emailDomain.endsWith(`.${domain}`) && !domain.endsWith(`.${emailDomain}`))) {
    ruleFlags.push("Email-domain mismatch");
  }

  if (!website.startsWith("https://")) {
    ruleFlags.push("No HTTPS detected");
  }

  if ((domain.match(/\d/g) || []).length >= 4 || /(temp|offer|promo|bonus|new)/.test(domain)) {
    ruleFlags.push("Domain pattern suggests new or campaign style");
  }

  if (BLACKLIST_SNIPPETS.some((token) => `${domain} ${website}`.includes(token))) {
    ruleFlags.push("Blacklist-style pattern detected");
  }

  const ruleRisk = Math.min(ruleFlags.length * 0.18, 0.7);
  return { ruleFlags, ruleRisk };
}

function makeCompanyId(domain: string): string {
  return `company_${domain.replace(/[^a-z0-9]/g, "")}_${Date.now()}`;
}

export function verifyCompany(input: CompanyVerificationInput):
  | { success: true; result: CompanyVerificationResult }
  | { success: false; message: string } {
  const validationErrors = validateInput(input);
  if (validationErrors.length > 0) {
    return { success: false, message: validationErrors.join(" ") };
  }

  const normalizedDomain = normalizeDomain(input.domain);
  const signals = [
    domainAgeSignal(normalizedDomain),
    sslSignal(input.website),
    urlPatternSignal(input.website, normalizedDomain),
    blacklistSignal(input.website, normalizedDomain),
    emailDomainSignal(input.email, normalizedDomain),
  ];

  const mlProbability = estimateMlPhishingProbability(input, normalizedDomain);
  const { ruleFlags, ruleRisk } = evaluateRuleFlags(input, normalizedDomain);
  const phishingProbability = Math.min(Math.max(mlProbability * 0.6 + ruleRisk * 0.4, 0), 1);
  const phishingRiskPercent = Math.round(phishingProbability * 100);
  const trustScore = Math.round((1 - phishingProbability) * 100);

  const result: CompanyVerificationResult = {
    companyId: makeCompanyId(normalizedDomain),
    normalizedDomain,
    phishingProbability,
    phishingRiskPercent,
    trustScore,
    isVerified: phishingProbability < PHISHING_REJECT_PROBABILITY && trustScore >= TRUST_VERIFY_THRESHOLD,
    signals,
    ruleFlags,
    verifiedAt: new Date().toISOString(),
  };

  persistAudit({ ...input, ...result });

  if (result.isVerified) {
    persistVerifiedCompany({ ...input, ...result });
  }

  persistCompanyRegistrationPermission({
    companyId: result.companyId,
    companyName: input.companyName,
    normalizedDomain: result.normalizedDomain,
    isVerified: result.isVerified,
    reason: result.isVerified ? "Company is verified" : "Rejected (possible fraud)",
    updatedAt: new Date().toISOString(),
  });

  return { success: true, result };
}

export function getCompanyRegistrationPermission(): CompanyRegistrationPermission | null {
  const raw = localStorage.getItem(COMPANY_REGISTRATION_PERMISSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CompanyRegistrationPermission;
  } catch {
    return null;
  }
}

export function getVerifiedCompanies(): VerifiedCompanyRecord[] {
  const raw = localStorage.getItem(VERIFIED_COMPANIES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as VerifiedCompanyRecord[];
  } catch {
    return [];
  }
}

export function getCompanyVerificationAudits(): VerifiedCompanyRecord[] {
  const raw = localStorage.getItem(COMPANY_AUDITS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as VerifiedCompanyRecord[];
  } catch {
    return [];
  }
}

function persistVerifiedCompany(record: VerifiedCompanyRecord): void {
  const current = getVerifiedCompanies();
  const withoutCurrentDomain = current.filter((item) => item.normalizedDomain !== record.normalizedDomain);
  withoutCurrentDomain.unshift(record);
  localStorage.setItem(VERIFIED_COMPANIES_KEY, JSON.stringify(withoutCurrentDomain));
}

function persistAudit(record: VerifiedCompanyRecord): void {
  const current = getCompanyVerificationAudits();
  current.unshift(record);
  localStorage.setItem(COMPANY_AUDITS_KEY, JSON.stringify(current.slice(0, 200)));
}

function persistCompanyRegistrationPermission(permission: CompanyRegistrationPermission): void {
  localStorage.setItem(COMPANY_REGISTRATION_PERMISSION_KEY, JSON.stringify(permission));
}
