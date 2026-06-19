# API Configuration Guide

## Overview

All API calls in the frontend now go through a centralized API service (`frontend/src/lib/apiService.ts`). This ensures:
- ✅ Single source of truth for API endpoints
- ✅ Consistent error handling
- ✅ Easy environment switching (dev/staging/prod)
- ✅ Type-safe API calls (with TypeScript)
- ✅ No hardcoded URLs scattered throughout code

---

## Setup

### 1. Environment Variable

Set this in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

The base URL is automatically picked up by the `apiService`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
```

### 2. Using the API Service

Instead of direct `fetch()` calls:

```typescript
// ❌ OLD - Hardcoded URL
const response = await fetch("http://localhost:4000/api/jobs");
const data = await response.json();

// ✅ NEW - Using apiService
import { jobsApi } from "@/lib/apiService";
const data = await jobsApi.getAll();
```

---

## API Endpoints

### Auth
```typescript
import { authApi } from "@/lib/apiService";

// Register user
await authApi.registerUser({ name, email, password });

// User sign in
await authApi.userSignIn({ email, password });

// Update user profile
await authApi.userProfile({ firebaseUID, email, ...profileData });

// Company sign up
await authApi.companySignUp({ companyName, email, ...companyData });

// Company sign in
await authApi.companySignIn({ email, password });
```

### Jobs
```typescript
import { jobsApi } from "@/lib/apiService";

// Get all jobs
const jobs = await jobsApi.getAll();

// Post a job (company-only)
await jobsApi.post({ title, description, skills, type, companyId });

// Apply for job
await jobsApi.apply({ jobId, userId, userName, userEmail, /*...*/ });

// Match skills (utility endpoint)
const match = await jobsApi.matchSkills({ userSkills: [], jobSkills: [] });
```

### Users
```typescript
import { userApi } from "@/lib/apiService";

// Get user profile
const profile = await userApi.getProfile(userId);

// Get user applications
const apps = await userApi.getApplications(userId);
```

### Company
```typescript
import { companyApi } from "@/lib/apiService";

// Get company's jobs
const jobs = await companyApi.getJobs(companyId);

// Get company's applicants
const applicants = await companyApi.getApplicants(companyId);

// Delete a job
await companyApi.deleteJob(jobId);
```

### Resumes
```typescript
import { resumeApi } from "@/lib/apiService";

// Upload resume (FormData)
const formData = new FormData();
formData.append("file", file);
formData.append("userId", userEmail);
const result = await resumeApi.upload(formData);

// Analyze resume
await resumeApi.analyze({ resumeId, encryptionKey });

// Decrypt resume
await resumeApi.decrypt({ resumeId, encryptionKey });

// Get resume analysis
const analysis = await resumeApi.getAnalysis(userId);

// List user's resumes
const list = await resumeApi.list(userId);

// Delete a resume
await resumeApi.delete(resumeId);
```

### Videos
```typescript
import { videoApi } from "@/lib/apiService";

// Upload video (File/Blob)
const result = await videoApi.upload(videoBlob);

// Get video URL (for playback)
const videoUrl = videoApi.get(videoId);
```

### Applications
```typescript
import { applicationApi } from "@/lib/apiService";

// Update application status
await applicationApi.updateStatus(applicationId, "Accepted");
```

---

## Error Handling

All API calls include automatic error handling:

```typescript
try {
  const data = await jobsApi.getAll();
  if (data.success) {
    // Handle success
  } else {
    // Handle API error (unsuccessful response)
  }
} catch (error) {
  // Handle network/parsing errors
  console.error("API error:", error);
}
```

---

## Advanced: Direct API Calls

For custom requests, use the `apiCall` helper:

```typescript
import { apiCall } from "@/lib/apiService";

// Custom GET
const data = await apiCall("/api/custom/endpoint");

// Custom POST with payload
const response = await apiCall("/api/custom/endpoint", {
  method: "POST",
  body: JSON.stringify({ key: "value" })
});

// Custom with headers
const result = await apiCall("/api/secure/endpoint", {
  method: "GET",
  headers: { "Authorization": "Bearer token" }
});
```

---

## Environment-Based Configuration

The API base URL automatically adapts to your environment:

```bash
# Development
VITE_API_BASE_URL=http://localhost:4000

# Staging
VITE_API_BASE_URL=https://api-staging.example.com

# Production
VITE_API_BASE_URL=https://api.example.com
```

No code changes needed - just update the environment variable!

---

## Migration Guide

Converting old hardcoded URLs to the new API service:

### Before
```typescript
const response = await fetch("http://localhost:4000/api/jobs");
const data = await response.json();
if (data.success) {
  setJobs(data.jobs);
}
```

### After
```typescript
import { jobsApi } from "@/lib/apiService";

const data = await jobsApi.getAll();
if (data.success) {
  setJobs(data.jobs);
}
```

---

## Type Safety (TypeScript)

The API service returns typed responses:

```typescript
interface ApiFeedback {
  success: boolean;
  message?: string;
  data?: any;
}

// Usage
const response: ApiFeedback = await jobsApi.getAll();
```

You can extend this with stricter typing in your components.

---

## Testing

To test API calls in different environments:

```bash
# Development
VITE_API_BASE_URL=http://localhost:4000 npm run dev

# Staging
VITE_API_BASE_URL=https://api-staging.example.com npm run dev

# Production (build)
VITE_API_BASE_URL=https://api.example.com npm run build
```

---

## Debugging

Enable request/response logging by updating `apiCall`:

```typescript
export async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  console.log(`[API] ${options.method || 'GET'} ${url}`);  // Debug log
  
  // ... rest of function
}
```

---

## Common Issues

### API calls still pointing to hardcoded URL
- Search for `http://localhost:4000` in your code
- Replace with `apiService` imports
- Reference this guide for correct endpoints

### Environment variable not loading
- Ensure `.env` file exists in `frontend/` directory
- Restart dev server after changing `.env`
- Variables must start with `VITE_` to be exposed

### CORS errors
- Check that `CORS_ORIGIN` in `backend/.env` includes your frontend URL
- Restart backend after updating CORS settings

---

**Last Updated**: April 6, 2026
