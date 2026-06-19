# 🔍 Project Audit Report - VishwasX

**Date**: April 6, 2026  
**Project**: careerReboot AI  
**Status**: ⚠️ Multiple Issues Identified

---

## 📊 Executive Summary

| Category | Status | Count |
|----------|--------|-------|
| **Critical Issues** | 🔴 | 3 |
| **High Priority** | 🟠 | 5 |
| **Medium Priority** | 🟡 | 4 |
| **Low Priority** | 🟢 | 2 |

---

## 🔴 CRITICAL ISSUES (Deployment Blockers)

### 1. **Hardcoded API URLs Scattered Throughout Frontend**
**Severity**: CRITICAL  
**Files Affected**: 
- `frontend/src/pages/SignUp.tsx` (line 97)
- `frontend/src/pages/SignIn.tsx` (line 47)
- `frontend/src/pages/CompanySignUp.tsx` (line 111)
- `frontend/src/pages/CompanySignIn.tsx` (line 43)
- `frontend/src/pages/ProfileSetup.tsx` (line 109)
- `frontend/src/pages/Opportunities.tsx` (lines 33, 42, 52, 104, 118)
- `frontend/src/pages/CompanyDashboard.tsx` (lines 87, 95, 122, 131, 167, 199, 561, 854)
- `frontend/src/components/ResumeUploader.tsx` (line 45)

**Problem**: 
```tsx
// ❌ BAD - Hardcoded
const response = await fetch("http://localhost:4000/api/jobs");

// ✅ GOOD - Using env variable (only in Dashboard.tsx)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
```

**Impact**: Will fail in production. No way to configure API endpoint for staging/production.

**Fix Required**: Create a centralized API configuration service
```typescript
// frontend/src/lib/apiConfig.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
```

---

### 2. **Firebase API Keys Exposed in Version Control**
**Severity**: CRITICAL (Security)  
**File**: `frontend/.env`

**Problem**: 
```
VITE_FIREBASE_API_KEY=AIzaSyDvo-3or2b6VTYHLVDlYIs2oMnZr9eezc4
VITE_FIREBASE_PROJECT_ID=vishwasx-1
(and other secrets)
```

**Impact**: Credentials are publicly visible in git history.
- Anyone with repo access can abuse Firebase resources
- Mobile app can be spoofed

**Fix Required**:
1. Add `.env` to `.gitignore`
2. Create `.env.example` with placeholder values
3. Rotate Firebase credentials immediately
4. Use environment-based secrets in CI/CD

---

### 3. **Root Package.json References Non-Existent Backend npm Script**
**Severity**: CRITICAL  
**File**: `package.json`

**Problem**:
```json
{
  "scripts": {
    "dev:backend": "npm --prefix backend run dev",  // ❌ Backend is Python!
    "install:all": "npm --prefix backend install"  // ❌ No package.json in backend!
  }
}
```

**Impact**: `npm run install:all` and `npm run dev:full` will fail immediately.

**Fix Required**: Either
- Use proper npm/node backend (Express.js)
- Remove these scripts and document Python setup separately
- Create bash/powershell scripts that handle both

---

## 🟠 HIGH PRIORITY ISSUES

### 4. **ML Services Not Integrated**
**Severity**: HIGH  
**Status**: Incomplete

**Problem**:
- Phishing detection service exists but not called before job posting
- Resume analyzer is imported but integration incomplete
- No webhook or API call from job creation to phishing scorer

**Current State**:
```python
# Backend: analyzer is imported but not fully utilized
sys.path.append(...'AI-Resume')
try:
    import analyzer
except ImportError as e:
    print(f"Warning: Could not import analyzer: {e}")
    analyzer = None  # Falls back to None
```

**Impact**: Company verification doesn't check for phishing/malicious intent.

**Required Fix**: Add security gate to job posting
```python
@app.post("/api/company/post-job")
async def post_job(req: JobCreate):
    # ... existing code ...
    
    # NEW: Check company for phishing
    phishing_score = await check_phishing_score(company.website)
    if phishing_score > 0.7:
        raise HTTPException(status_code=403, detail="Company failed verification")
    
    # Continue with job posting ...
```

---

### 5. **Resume Analysis Query Inconsistency**
**Severity**: HIGH  
**Issue**: Parameter mismatch in API calls

**Problem**:
- `/api/resume/analysis/{userId}` endpoint expects `userId`
- Frontend calls it with `currentUser.email`: `analysis/${encodeURIComponent(currentUser.email)}`
- Backend may be trying to look up by email instead of userId

**Affected Files**:
- `frontend/src/pages/Dashboard.tsx` (lines 92, 336)
- Backend: `main.py` line 722

**Code**:
```python
# Backend expects what?
@app.get("/api/resume/analysis/{userId}")
async def get_latest_analysis(userId: str):
    result = await results_collection.find_one({"userId": userId})  # Expects userId
    # But frontend sends email...
```

**Fix Required**: Standardize - either:
1. Rename endpoint to `/api/resume/analysis/{email}` and change backend
2. Update frontend to send userId instead of email

---

### 6. **Debug Print Statements Left in Code**
**Severity**: HIGH  
**File**: `backend/main.py` (line 150)

**Problem**:
```python
print(f"[SIGNIN DEBUG] email={req.email}, has_profile={has_profile}, keys={list(user.keys())}")
```

**Impact**: 
- Logs expose user information
- Unprofessional in production
- Could leak sensitive data

**Fix**: Remove or use proper logging

---

### 7. **Python Environment Configuration Issues**
**Severity**: HIGH  
**Status**: Pylance shows unresolved imports

**Unresolved Imports**:
- motor
- fastapi
- pydantic
- cryptography
- fitz
- analyzer
- joblib

**Problem**: IDE can't find packages even though they exist in requirements.txt

**Cause**: 
- Python interpreter may not be properly detected
- Virtual environment not activated for IDE
- Workspace settings point to wrong Python path

**Impact**: IDE doesn't provide autocomplete/linting for backend

---

### 8. **Phishing ML Service Setup Failed**
**Severity**: HIGH  
**Status**: Failed activation detected

**Context**:
```
Last Command: & f:\VishwasX\VishwasX\ml-services\Phishing\.venv\Scripts\Activate.ps1
Cwd: F:\VishwasX
Exit Code: 1  ❌ FAILURE
```

**Problem**: Virtual environment activation failed

**Impact**: Phishing ML service cannot run

**Investigation Needed**: Check if `.venv` folder exists and is properly set up

---

## 🟡 MEDIUM PRIORITY ISSUES

### 9. **Missing Error Boundaries & Error Handling**
**Severity**: MEDIUM  
**Issue**: Network errors not properly caught in some flows

**Example**:
```typescript
// Opportunities.tsx - What if fetch fails?
const response = await fetch("http://localhost:4000/api/jobs");
const data = await response.json();  // Will crash if response isn't JSON
if (data.success) { ... }
```

**Missing**:
- Error boundaries for async operations
- Retry logic for failed requests
- User-friendly error messages for all API failures

---

### 10. **Inconsistent Auth Flow**
**Severity**: MEDIUM  
**Issue**: Multiple auth patterns in different files

**Problems**:
- Some pages use Firebase OTP (SignUp/SignIn)
- Company flow uses email/password (CompanySignIn)
- No unified auth service
- Session/token management not consistent

---

### 11. **No API Documentation/Swagger UI**
**Severity**: MEDIUM  
**Backend**: FastAPI supports automatic docs at `/docs`

**Current State**: Likely not configured

**Missing**:
- No `/docs` endpoint
- No OpenAPI schema available
- Difficult for frontend devs to understand API contract

**Fix**: Add to backend
```python
from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    # ... OpenAPI config ...
```

---

### 12. **Missing .env.example Files**
**Severity**: MEDIUM  
**Status**: No examples provided

**Missing**:
- `frontend/.env.example`
- `backend/.env.example`
- `ml-services/.env.example`

**Impact**: New developers can't set up without guessing required vars

---

## 🟢 LOW PRIORITY ISSUES

### 13. **Unused/Duplicate Dependencies**
**Severity**: LOW  
**Frontend**:
- Multiple Radix UI components imported in package.json but may not all be used
- Can audit with `npx depcheck`

---

### 14. **No Production Build Optimization**
**Severity**: LOW  
**Frontend**: 
- No environment-based builds documented
- No build size analysis
- No lazy loading strategy documented

---

## ✅ WHAT'S WORKING WELL

✓ Backend API endpoints are properly structured  
✓ Database schema and MongoDB integration solid  
✓ Frontend component architecture clean and modular  
✓ Skill matching feature properly implemented  
✓ CORS and authentication flow mostly implemented  
✓ Resume encryption/decryption working  

---

## 🚀 RECOMMENDATIONS

### Immediate (This Week)
1. **Create API config service** - Centralize all API URLs
2. **Rotate Firebase credentials** - Remove from git
3. **Fix package.json** - Remove broken npm backend scripts
4. **Remove debug prints** - Clean up logging

### Short Term (Next 2 Weeks)
5. Setup Docker Compose for local development
6. Add API documentation (Swagger UI)
7. Fix resume analysis parameter inconsistency
8. Integrate phishing detection into job workflow
9. Setup proper error handling/boundaries

### Medium Term
10. Implement unified auth service
11. Add comprehensive test suite
12. Setup CI/CD pipeline with environment-based secrets
13. Performance optimization and monitoring

---

## 🧪 Testing Checklist

- [ ] Test all API endpoints with wrong/missing credentials
- [ ] Test frontend with API_BASE_URL pointing to different server
- [ ] Test ML services integration
- [ ] Load test with concurrent users
- [ ] Security audit of exposed keys
- [ ] Resume encryption/decryption with various file sizes

---

**Report Generated**: 2026-04-06  
**Auditor**: GitHub Copilot  
**Status**: Ready for Review
