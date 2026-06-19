import os
import uuid
import base64
import hashlib
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from fastapi.responses import FileResponse
import sys
import firebase_admin
from firebase_admin import credentials, firestore_async
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging

# Append ml-services to path so we can import analyzer
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ml-services', 'AI-Resume')))
try:
    import analyzer
except ImportError as e:
    print(f"Warning: Could not import analyzer: {e}")
    analyzer = None

load_dotenv()

PORT = int(os.getenv("PORT", 4000))

# Global db client
db_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_client
    print("Connecting to Firebase Workspace...")
    try:
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("Connected to Firebase using credentials file.")
        else:
            firebase_admin.initialize_app()
            print("Connected to Firebase using default credentials.")
        
        db_client = firestore_async.client()
    except Exception as e:
        print(f"Failed to connect to Firebase: {e}")
    yield

app = FastAPI(lifespan=lifespan)

origins_raw = os.getenv("CORS_ORIGIN", "http://localhost:8080,http://localhost:8081,http://localhost:5173")
if origins_raw.strip() == "*":
    origins = ["*"]
else:
    origins = [o.strip() for o in origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

class SignInRequest(BaseModel):
    email: str
    password: str

class SignUpRequest(BaseModel):
    companyName: str
    normalizedDomain: str
    contactEmail: str
    hiringContactName: str
    hiringContactPhone: str
    companySize: str
    hiringRoles: str
    headquarters: str
    password: str
    companyId: str
    isVerified: bool = False

class JobCreate(BaseModel):
    title: str
    description: str
    skills: list[str]
    type: str
    companyId: str
    companyName: str
    extraQuestions: list[dict] = []

class ApplicationRequest(BaseModel):
    jobId: str | None = None
    userId: str | None = None
    userName: str | None = "Unknown"
    userEmail: str | None = "Unknown"
    resumeId: str | None = None
    resumeKey: str | None = None
    videoId: str | None = None
    answers: dict = {}

class RegisterUserRequest(BaseModel):
    name: str
    email: str
    phone: str
    firebaseUID: str

class UserProfileUpdate(BaseModel):
    firebaseUID: str
    email: str = None
    careerStage: str
    previousRole: str
    yearsExperience: int
    careerBreakDuration: str
    currentSkills: list[str]
    desiredRole: str
    educationLevel: str

@app.get("/health")
async def health_check():
    return {"success": True, "message": "API is healthy"}

@app.post("/api/auth/register-user")
async def register_user(req: RegisterUserRequest):
    users_ref = db_client.collection("users")
    docs = await users_ref.where("email", "==", req.email).limit(1).get()
    if len(docs) > 0:
        return {"success": True, "message": "User already registered"}

    user_data = req.model_dump()
    await users_ref.add(user_data)
    
    return {
        "success": True,
        "message": "User saved to DB successfully."
    }

@app.post("/api/auth/user/signin")
async def sign_in_user(req: SignInRequest):
    users_ref = db_client.collection("users")
    docs = await users_ref.where("email", "==", req.email).limit(1).get()
    
    if len(docs) == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found in database."
        )
    
    user = docs[0].to_dict()
    has_profile = "careerStage" in user and user["careerStage"]
    
    profile_data = None
    if has_profile:
        profile_data = {
            "careerStage": user.get("careerStage"),
            "previousRole": user.get("previousRole"),
            "yearsExperience": user.get("yearsExperience"),
            "careerBreakDuration": user.get("careerBreakDuration"),
            "currentSkills": user.get("currentSkills"),
            "desiredRole": user.get("desiredRole"),
            "educationLevel": user.get("educationLevel"),
        }
    
    return {
        "success": True,
        "message": "Signed in successfully",
        "user": {
            "id": docs[0].id,
            "email": user.get("email"),
            "name": user.get("name", "User")
        },
        "profile": profile_data
    }

@app.post("/api/auth/user/profile")
async def update_user_profile(req: UserProfileUpdate):
    users_ref = db_client.collection("users")
    
    docs = await users_ref.where("firebaseUID", "==", req.firebaseUID).limit(1).get()
    if len(docs) == 0 and req.email:
        docs = await users_ref.where("email", "==", req.email).limit(1).get()
        
    if len(docs) == 0:
        new_doc = req.model_dump(exclude={"firebaseUID", "email"})
        new_doc["firebaseUID"] = req.firebaseUID
        if req.email:
            new_doc["email"] = req.email
        await users_ref.add(new_doc)
    else:
        user = docs[0].to_dict()
        doc_id = docs[0].id
        update_data = req.model_dump(exclude={"firebaseUID", "email"})
        if "firebaseUID" not in user or user["firebaseUID"] != req.firebaseUID:
            update_data["firebaseUID"] = req.firebaseUID
            
        await users_ref.document(doc_id).update(update_data)
        
    return {
        "success": True,
        "message": "User profile updated successfully."
    }

@app.get("/api/user/profile/{userId}")
async def get_user_profile(userId: str):
    users_ref = db_client.collection("users")
    
    doc = await users_ref.document(userId).get()
    user = None
    doc_id = None
    
    if doc.exists:
        user = doc.to_dict()
        doc_id = doc.id
    else:
        docs = await users_ref.where("email", "==", userId).limit(1).get()
        if not docs:
            docs = await users_ref.where("firebaseUID", "==", userId).limit(1).get()
        if docs:
            user = docs[0].to_dict()
            doc_id = docs[0].id
            
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "success": True,
        "user": {
            "id": doc_id,
            "email": user.get("email"),
            "name": user.get("name"),
            "careerStage": user.get("careerStage"),
            "previousRole": user.get("previousRole"),
            "yearsExperience": user.get("yearsExperience"),
            "careerBreakDuration": user.get("careerBreakDuration"),
            "currentSkills": user.get("currentSkills", []),
            "desiredRole": user.get("desiredRole"),
            "educationLevel": user.get("educationLevel"),
        }
    }

@app.post("/api/company/post-job")
async def post_job(req: JobCreate):
    companies_ref = db_client.collection("companies")
    jobs_ref = db_client.collection("jobs")
    
    docs = await companies_ref.where("companyId", "==", req.companyId).limit(1).get()
    if len(docs) == 0:
        raise HTTPException(status_code=404, detail="Company not found")
        
    company = docs[0].to_dict()
    
    if not company.get("isVerified", False):
        raise HTTPException(
            status_code=403, 
            detail="Company not verified. Only verified companies can post jobs."
        )
    
    job_data = req.model_dump()
    job_data["jobId"] = str(uuid.uuid4())
    job_data["createdAt"] = datetime.now(timezone.utc)
    job_data["isVerifiedCompany"] = True
    
    await jobs_ref.add(job_data)
    
    return {"success": True, "message": "Job posted successfully", "jobId": job_data["jobId"]}

@app.get("/api/jobs")
async def get_all_jobs():
    jobs_ref = db_client.collection("jobs")
    
    docs = await jobs_ref.get()
    jobs = []
    for doc in docs:
        job = doc.to_dict()
        job["id"] = doc.id  # Ensure id is always present
        if isinstance(job.get("createdAt"), datetime):
            job["createdAt"] = job["createdAt"].isoformat()
        jobs.append(job)
    
    return {"success": True, "jobs": jobs}

@app.post("/api/jobs/match-skills")
async def calculate_job_skill_match(req: dict):
    user_skills = [s.lower().strip() for s in req.get("userSkills", [])]
    job_skills = [s.lower().strip() for s in req.get("jobSkills", [])]
    
    if not job_skills:
        return {
            "success": True,
            "matchPercentage": 100,
            "matchedSkills": [],
            "missingSkills": [],
            "recommendation": "No specific skills required for this position"
        }
    
    matched_skills = [skill for skill in job_skills if any(
        skill.lower() in us.lower() or us.lower() in skill.lower() 
        for us in user_skills
    )]
    
    missing_skills = [skill for skill in job_skills if skill not in matched_skills]
    match_percentage = round((len(matched_skills) / len(job_skills)) * 100) if job_skills else 0
    
    if match_percentage >= 80:
        recommendation = "Excellent match! You have most of the required skills."
    elif match_percentage >= 60:
        recommendation = "Good match. You have many required skills and can quickly learn the rest."
    elif match_percentage >= 40:
        recommendation = "Fair match. You'll need to develop some key skills for this role."
    else:
        recommendation = "Limited match. Consider gaining more skills before applying."
    
    return {
        "success": True,
        "matchPercentage": match_percentage,
        "matchedSkills": matched_skills,
        "missingSkills": missing_skills,
        "totalSkillsRequired": len(job_skills),
        "skillsMatched": len(matched_skills),
        "recommendation": recommendation
    }

@app.get("/api/company/my-jobs/{companyId}")
async def get_company_jobs(companyId: str):
    jobs_ref = db_client.collection("jobs")
    
    docs = await jobs_ref.where("companyId", "==", companyId).get()
    jobs = []
    for doc in docs:
        job = doc.to_dict()
        if isinstance(job.get("createdAt"), datetime):
            job["createdAt"] = job["createdAt"].isoformat()
        jobs.append(job)
    
    return {"success": True, "jobs": jobs}

@app.delete("/api/job/{jobId}")
async def delete_job(jobId: str):
    jobs_ref = db_client.collection("jobs")
    
    docs = await jobs_ref.where("jobId", "==", jobId).get()
    if len(docs) == 0:
        raise HTTPException(status_code=404, detail="Job not found")
        
    for doc in docs:
        await jobs_ref.document(doc.id).delete()
        
    return {"success": True, "message": "Job deleted successfully"}

@app.post("/api/jobs/apply")
async def apply_for_job(req: ApplicationRequest):
    applications_ref = db_client.collection("applications")
    resumes_ref = db_client.collection("resumes")
    
    docs = await applications_ref.where("jobId", "==", req.jobId).where("userId", "==", req.userId).get()
    if len(docs) > 0:
        return {"success": False, "message": "You have already applied for this job"}
        
    app_data = req.model_dump()
    app_data["applicationId"] = str(uuid.uuid4())
    app_data["appliedAt"] = datetime.now(timezone.utc)
    app_data["status"] = "Pending"
    
    if not app_data.get("resumeKey") or not app_data.get("resumeId"):
        # Fetch without order_by to avoid index requirement, then sort in memory
        resumes_docs = await resumes_ref.where("userId", "==", req.userEmail).get()
        if len(resumes_docs) == 0:
            resumes_docs = await resumes_ref.where("userId", "==", req.userId).get()
        
        if len(resumes_docs) > 0:
            # Sort by createdAt descending
            sorted_resumes = sorted(resumes_docs, key=lambda x: x.to_dict().get("createdAt", ""), reverse=True)
            latest_resume = sorted_resumes[0].to_dict()
            if not app_data.get("resumeId"):
                app_data["resumeId"] = latest_resume.get("resumeId")
            if not app_data.get("resumeKey"):
                app_data["resumeKey"] = latest_resume.get("encryptionKey")
    
    await applications_ref.add(app_data)
    
    return {"success": True, "message": "Application submitted successfully"}

@app.get("/api/user/applications/{userId}")
async def get_user_applications(userId: str):
    applications_ref = db_client.collection("applications")
    jobs_ref = db_client.collection("jobs")
    
    docs = await applications_ref.where("userId", "==", userId).get()
    applications = []
    
    for doc in docs:
        app = doc.to_dict()
        job_docs = await jobs_ref.where("jobId", "==", str(app["jobId"])).limit(1).get()
        
        if len(job_docs) > 0:
            job = job_docs[0].to_dict()
            app["jobTitle"] = job.get("title")
            app["companyName"] = job.get("companyName")
        else:
            app["jobTitle"] = app.get("jobTitle") or "Applied Position"
            app["companyName"] = app.get("companyName") or "Verified Partner"
            
        if isinstance(app.get("appliedAt"), datetime):
            app["appliedAt"] = app["appliedAt"].isoformat()
        applications.append(app)
        
    return {"success": True, "applications": applications}

@app.post("/api/applications/status/{applicationId}")
async def update_application_status(applicationId: str, req: dict):
    applications_ref = db_client.collection("applications")
    
    status_val = req.get("status", "Pending")
    
    docs = await applications_ref.where("applicationId", "==", applicationId).get()
    if len(docs) == 0:
        return {"success": False, "message": "Application not found"}
        
    for doc in docs:
        await applications_ref.document(doc.id).update({"status": status_val})
        
    return {"success": True, "message": f"Status updated to {status_val}"}

@app.get("/api/company/applicants/{companyId}")
async def get_company_applicants(companyId: str):
    jobs_ref = db_client.collection("jobs")
    applications_ref = db_client.collection("applications")
    
    company_jobs_docs = await jobs_ref.where("companyId", "==", companyId).get()
    company_jobs = [j.to_dict() for j in company_jobs_docs]
    job_ids = [str(j["jobId"]) for j in company_jobs]
    
    if not job_ids:
        return {"success": True, "applicants": []}
    
    applicants = []
    # Firestore 'in' queries support up to 10 items. To avoid limits, we fetch per job or chunk
    for jid in job_ids:
        app_docs = await applications_ref.where("jobId", "==", str(jid)).get()
        for doc in app_docs:
            app = doc.to_dict()
            job = next((j for j in company_jobs if str(j["jobId"]) == str(app["jobId"])), None)
            if job:
                app["jobTitle"] = job["title"]
                
            if isinstance(app.get("appliedAt"), datetime):
                app["appliedAt"] = app["appliedAt"].isoformat()
            
            app.setdefault("resumeId", None)
            app.setdefault("resumeKey", None)
            app.setdefault("videoId", None)
            app.setdefault("answers", {})
            applicants.append(app)
            
    return {"success": True, "applicants": applicants}

@app.post("/api/auth/company/signin")
async def sign_in_company(req: SignInRequest):
    companies_ref = db_client.collection("companies")
    
    from firebase_admin.firestore import FieldFilter
    docs = await companies_ref.where(filter=FieldFilter("email", "==", req.email)).where(filter=FieldFilter("password", "==", req.password)).limit(1).get()
    
    if len(docs) == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Only registered companies can sign in."
        )
    
    company = docs[0].to_dict()
    
    return {
        "success": True,
        "message": "Signed in successfully",
        "company": {
            "id": docs[0].id,
            "email": company.get("email"),
            "name": company.get("companyName", "Company"),
            "companyId": company.get("companyId"),
            "isVerified": company.get("isVerified", False)
        }
    }

@app.post("/api/auth/signup")
async def sign_up_company(req: SignUpRequest):
    companies_ref = db_client.collection("companies")
    
    docs = await companies_ref.where("email", "==", req.contactEmail).limit(1).get()
    if len(docs) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company email is already registered."
        )
    
    company_data = req.model_dump()
    company_data["email"] = req.contactEmail
    
    await companies_ref.add(company_data)
    
    return {
        "success": True,
        "message": "Company registered successfully"
    }

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

VIDEO_DIR = os.path.join(os.path.dirname(__file__), "uploads_video")
os.makedirs(VIDEO_DIR, exist_ok=True)

@app.post("/api/video/upload")
async def upload_video(file: UploadFile = File(...)):
    video_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1] or ".webm"
    file_name = f"{video_id}{ext}"
    file_path = os.path.join(VIDEO_DIR, file_name)
    
    file_bytes = await file.read()
    with open(file_path, "wb") as f:
        f.write(file_bytes)
        
    return {"success": True, "videoId": file_name}

@app.get("/api/video/{video_id}")
async def get_video(video_id: str):
    file_path = os.path.join(VIDEO_DIR, video_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Video not found")
    return FileResponse(file_path)

@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...), userId: str = Form(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF files are allowed")
    
    file_bytes = await file.read()
    
    try:
        import fitz
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            pwidth = page.rect.width
            pheight = page.rect.height
            origin = fitz.Point(pwidth * 0.15, pheight * 0.75)
            matrix = fitz.Matrix(-45)
            page.insert_text(
                origin, 
                "VishwasX", 
                fontsize=90, 
                color=(0.75, 0.75, 0.75), 
                morph=(origin, matrix),
                overlay=True
            )
        file_bytes = doc.write()
    except Exception as e:
        print(f"Watermark failed: {e}")
    
    resume_id = str(uuid.uuid4())
    key = os.urandom(32)
    iv = os.urandom(16)
    
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(file_bytes) + padder.finalize()
    
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    
    file_path = os.path.join(UPLOAD_DIR, f"{resume_id}.enc")
    with open(file_path, "wb") as f:
        f.write(encrypted_data)
        
    hashed_key = hashlib.sha256(key).hexdigest()
    resumes_ref = db_client.collection("resumes")
    
    metadata = {
        "resumeId": resume_id,
        "userId": userId,
        "fileName": file.filename,
        "fileSize": len(file_bytes),
        "filePath": file_path,
        "encryptionKeyHash": hashed_key,
        "encryptionKey": base64.b64encode(key).decode('utf-8'),
        "iv": base64.b64encode(iv).decode('utf-8'),
        "createdAt": datetime.now(timezone.utc)
    }
    await resumes_ref.add(metadata)
    
    return {
        "success": True,
        "resumeId": resume_id,
        "encryptionKey": base64.b64encode(key).decode('utf-8')
    }

class DecryptRequest(BaseModel):
    resumeId: str
    encryptionKey: str

@app.post("/api/resume/decrypt")
async def decrypt_resume(req: DecryptRequest):
    resumes_ref = db_client.collection("resumes")
    docs = await resumes_ref.where("resumeId", "==", req.resumeId).limit(1).get()
    if len(docs) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
        
    metadata = docs[0].to_dict()
        
    try:
        key_bytes = base64.b64decode(req.encryptionKey)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid encryption key format")
        
    hashed_req_key = hashlib.sha256(key_bytes).hexdigest()
    if hashed_req_key != metadata.get("encryptionKeyHash"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid encryption key")
        
    iv_bytes = base64.b64decode(metadata["iv"])
    file_path = metadata["filePath"]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Encrypted file missing from storage")
        
    with open(file_path, "rb") as f:
        encrypted_data = f.read()
        
    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv_bytes), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
    
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted_data = unpadder.update(padded_data) + unpadder.finalize()
    
    return {
        "success": True,
        "fileData": base64.b64encode(decrypted_data).decode('utf-8')
    }

@app.post("/api/resume/analyze")
async def analyze_user_resume(req: DecryptRequest):
    resumes_ref = db_client.collection("resumes")
    docs = await resumes_ref.where("resumeId", "==", req.resumeId).limit(1).get()
    logger_metadata = docs[0].to_dict() if len(docs)>0 else None
    if not logger_metadata:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
        
    try:
        key_bytes = base64.b64decode(req.encryptionKey)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid encryption key format")
        
    if hashlib.sha256(key_bytes).hexdigest() != logger_metadata.get("encryptionKeyHash"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid encryption key")
        
    iv_bytes = base64.b64decode(logger_metadata["iv"])
    file_path = logger_metadata["filePath"]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Encrypted file missing from storage")
        
    with open(file_path, "rb") as f:
        encrypted_data = f.read()
        
    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv_bytes), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
    
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted_data = unpadder.update(padded_data) + unpadder.finalize()
    
    if not analyzer:
        return {"success": False, "error": "Analyzer engine not available"}
        
    result = analyzer.analyze_resume(decrypted_data)
    if result.get("success"):
        results_ref = db_client.collection("analysis_results")
        a_docs = await results_ref.where("userId", "==", logger_metadata["userId"]).limit(1).get()
        if len(a_docs) > 0:
            await results_ref.document(a_docs[0].id).update({
                "resumeId": req.resumeId,
                "analysis": result,
                "updatedAt": datetime.now(timezone.utc)
            })
        else:
            await results_ref.add({
                "userId": logger_metadata["userId"],
                "resumeId": req.resumeId,
                "analysis": result,
                "updatedAt": datetime.now(timezone.utc)
            })
    return result

@app.get("/api/resume/analysis/{userId}")
async def get_latest_analysis(userId: str):
    if not db_client:
        raise HTTPException(status_code=503, detail="Database not initialized")
    
    results_ref = db_client.collection("analysis_results")
    docs = await results_ref.where("userId", "==", userId).limit(1).get()
    
    if len(docs) == 0:
        return {"success": False, "message": "No analysis found"}
        
    result = docs[0].to_dict()
    return {"success": True, "analysis": result.get("analysis"), "resumeId": result.get("resumeId")}

@app.get("/api/resume/list/{userId}")
async def list_user_resumes(userId: str):
    if not db_client:
        raise HTTPException(status_code=503, detail="Database not initialized")
    
    resumes_ref = db_client.collection("resumes")
    # Fetch without order_by to avoid index requirement
    docs = await resumes_ref.where("userId", "==", userId).get()
    
    resumes_list = []
    for doc in docs:
        doc_data = doc.to_dict()
        resumes_list.append({
            "resumeId": doc_data.get("resumeId"),
            "fileName": doc_data.get("fileName", "resume.pdf"),
            "fileSize": doc_data.get("fileSize", 0),
            "createdAt": doc_data.get("createdAt")
        })
    
    # Sort in memory
    resumes_list.sort(key=lambda x: x["createdAt"] if x["createdAt"] else "", reverse=True)
    
    # Convert dates to ISO string for JSON
    for r in resumes_list:
        if r["createdAt"] and hasattr(r["createdAt"], "isoformat"):
            r["createdAt"] = r["createdAt"].isoformat()
        else:
            r["createdAt"] = str(r["createdAt"])
    
    return {"success": True, "resumes": resumes_list}

@app.delete("/api/resume/{resumeId}")
async def delete_resume(resumeId: str):
    if not db_client:
        raise HTTPException(status_code=503, detail="Database not initialized")
    
    resumes_ref = db_client.collection("resumes")
    docs = await resumes_ref.where("resumeId", "==", resumeId).limit(1).get()
    
    if len(docs) == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    metadata = docs[0].to_dict()
    doc_id = docs[0].id
    
    file_path = metadata.get("filePath", "")
    if file_path and os.path.exists(file_path):
        os.remove(file_path)
    
    await resumes_ref.document(doc_id).delete()
    
    return {"success": True, "message": "Resume deleted successfully"}

@app.delete("/api/resume/analysis/{userId}")
async def reset_analysis(userId: str):
    if not db_client:
        raise HTTPException(status_code=503, detail="Database not initialized")
    
    results_ref = db_client.collection("analysis_results")
    docs = await results_ref.where("userId", "==", userId).get()
    
    for doc in docs:
        await results_ref.document(doc.id).delete()
        
    return {"success": True, "message": "Analysis reset successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
