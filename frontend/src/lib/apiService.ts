/**
 * Centralized API Configuration
 * All API endpoints should use this base URL
 */

/**
 * Dynamically resolves the API base URL.
 * - If VITE_API_BASE_URL env var is explicitly set, use it.
 * - Otherwise, derive from current browser hostname so that
 *   cross-device LAN access works automatically.
 */
function resolveApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  const host = window.location.hostname || "localhost";
  return `http://${host}:4000`;
}

export const API_BASE_URL = resolveApiBaseUrl();

/**
 * Helper function for API calls with proper error handling
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Call Failed: ${url}`, error);
    throw error;
  }
}

/**
 * Auth API endpoints
 */
export const authApi = {
  registerUser: (payload: any) =>
    apiCall("/api/auth/register-user", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  userSignIn: (payload: any) =>
    apiCall("/api/auth/user/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  userProfile: (payload: any) =>
    apiCall("/api/auth/user/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  companySignUp: (payload: any) =>
    apiCall("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  companySignIn: (payload: any) =>
    apiCall("/api/auth/company/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

/**
 * Jobs API endpoints
 */
export const jobsApi = {
  getAll: () => apiCall("/api/jobs"),
  post: (payload: any) =>
    apiCall("/api/company/post-job", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  apply: (payload: any) =>
    apiCall("/api/jobs/apply", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  matchSkills: (payload: any) =>
    apiCall("/api/jobs/match-skills", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

/**
 * User API endpoints
 */
export const userApi = {
  getProfile: (userId: string) => apiCall(`/api/user/profile/${userId}`),
  getApplications: (userId: string) => apiCall(`/api/user/applications/${userId}`),
};

/**
 * Company API endpoints
 */
export const companyApi = {
  getJobs: (companyId: string) => apiCall(`/api/company/my-jobs/${companyId}`),
  getApplicants: (companyId: string) => apiCall(`/api/company/applicants/${companyId}`),
  deleteJob: (jobId: string) =>
    apiCall(`/api/job/${jobId}`, { method: "DELETE" }),
};

/**
 * Resume API endpoints
 */
export const resumeApi = {
  upload: (formData: FormData) =>
    apiCall("/api/resume/upload", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    }),
  analyze: (payload: any) =>
    apiCall("/api/resume/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  decrypt: (payload: any) =>
    apiCall("/api/resume/decrypt", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAnalysis: (userId: string) => apiCall(`/api/resume/analysis/${encodeURIComponent(userId)}`),
  list: (userId: string) => apiCall(`/api/resume/list/${encodeURIComponent(userId)}`),
  delete: (resumeId: string) =>
    apiCall(`/api/resume/${resumeId}`, { method: "DELETE" }),
};

/**
 * Video API endpoints
 */
export const videoApi = {
  upload: (file: Blob) => {
    const formData = new FormData();
    formData.append("file", file, "intro.webm");
    return apiCall("/api/video/upload", {
      method: "POST",
      headers: {}, // Let browser set Content-Type
      body: formData,
    });
  },
  get: (videoId: string) => `${API_BASE_URL}/api/video/${videoId}`,
};

/**
 * Application API endpoints
 */
export const applicationApi = {
  updateStatus: (applicationId: string, status: string) =>
    apiCall(`/api/applications/status/${applicationId}`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),
};
