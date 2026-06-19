import fitz  # PyMuPDF
import re
import os
import joblib

# Expanded skills list — covers the most common tech, data, design, and soft skills
GLOBAL_SKILLS_LIST = [
    # Programming Languages
    "python", "java", "c++", "c#", "c", "javascript", "typescript", "ruby", "go",
    "rust", "kotlin", "swift", "scala", "r", "php", "perl", "matlab", "dart",
    "objective-c", "lua", "haskell", "elixir", "clojure", "groovy", "shell",
    "bash", "powershell", "vba",
    # Web Frontend
    "html", "css", "sass", "less", "tailwindcss", "bootstrap",
    "react", "angular", "vue", "svelte", "next.js", "nuxt.js", "gatsby",
    "jquery", "webpack", "vite",
    # Web Backend & Frameworks
    "node.js", "express", "django", "flask", "fastapi", "spring", "spring boot",
    ".net", "asp.net", "rails", "laravel", "gin", "fiber",
    # Mobile
    "react native", "flutter", "swiftui", "android", "ios",
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle",
    "cassandra", "dynamodb", "firebase", "supabase", "neo4j", "elasticsearch",
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "github actions", "gitlab ci", "ci/cd", "nginx", "apache",
    "linux", "unix", "windows server",
    # Data & ML
    "machine learning", "deep learning", "nlp", "natural language processing",
    "computer vision", "data science", "data engineering", "data analysis",
    "statistics", "numpy", "pandas", "scikit-learn", "tensorflow", "pytorch",
    "keras", "opencv", "spark", "hadoop", "airflow", "dbt",
    "power bi", "tableau", "excel", "looker", "metabase",
    # AI / LLM
    "openai", "langchain", "llm", "generative ai", "prompt engineering",
    "hugging face", "transformers",
    # Tools & Platforms
    "git", "github", "gitlab", "bitbucket", "jira", "confluence",
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",
    "postman", "swagger", "graphql", "rest api",
    "vs code", "intellij",
    # Security
    "cybersecurity", "penetration testing", "owasp", "ssl", "encryption",
    # Soft Skills
    "agile", "scrum", "kanban", "project management", "communication",
    "leadership", "teamwork", "problem solving", "critical thinking",
    "time management", "presentation",
    # Other
    "blockchain", "web3", "solidity", "ethereum",
    "iot", "embedded systems", "arduino", "raspberry pi",
    "sap", "salesforce", "servicenow",
    "ui/ux", "ux design", "ui design", "wireframing", "prototyping",
    "technical writing", "documentation",
]

# Expanded roles with required skills
ROLES_DB = {
    "Data Analyst": ["python", "sql", "excel", "power bi", "statistics", "tableau", "pandas"],
    "Data Scientist": ["python", "machine learning", "statistics", "pandas", "numpy", "sql", "tensorflow", "scikit-learn"],
    "Data Engineer": ["python", "sql", "spark", "airflow", "aws", "docker", "postgresql", "data engineering"],
    "Web Developer": ["html", "css", "javascript", "react", "node.js", "git", "typescript"],
    "Frontend Developer": ["html", "css", "javascript", "react", "typescript", "tailwindcss", "git", "figma"],
    "Backend Developer": ["python", "node.js", "sql", "docker", "git", "rest api", "postgresql"],
    "Fullstack Developer": ["html", "css", "javascript", "react", "node.js", "sql", "git", "docker", "typescript"],
    "Software Engineer": ["python", "java", "c++", "sql", "git", "docker", "linux", "agile"],
    "ML Engineer": ["python", "machine learning", "numpy", "pandas", "tensorflow", "pytorch", "sql", "docker"],
    "AI Engineer": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "docker", "openai"],
    "Cloud Architect": ["aws", "azure", "gcp", "docker", "kubernetes", "linux", "python", "terraform"],
    "DevOps Engineer": ["docker", "kubernetes", "linux", "aws", "terraform", "jenkins", "git", "ci/cd"],
    "Mobile Developer": ["react native", "flutter", "javascript", "typescript", "android", "ios", "git"],
    "UI/UX Designer": ["figma", "adobe xd", "sketch", "wireframing", "prototyping", "ui/ux", "ux design", "css"],
    "Cybersecurity Analyst": ["cybersecurity", "linux", "python", "penetration testing", "owasp", "encryption"],
    "QA Engineer": ["python", "javascript", "git", "agile", "sql", "postman", "linux"],
    "Project Manager": ["agile", "scrum", "jira", "communication", "leadership", "project management"],
    "Technical Writer": ["technical writing", "documentation", "git", "html", "communication"],
    "Blockchain Developer": ["solidity", "ethereum", "javascript", "web3", "blockchain", "python", "git"],
}

# Expanded courses mapping
COURSES_DB = {
    "python": "Python for Everybody - Coursera",
    "java": "Java Programming and Software Engineering Fundamentals - Coursera",
    "c++": "C++ For C Programmers - Coursera",
    "sql": "SQL for Data Science - Coursera",
    "excel": "Excel Skills for Business - Macquarie University",
    "power bi": "Microsoft Power BI Desktop - Udemy",
    "javascript": "JavaScript: Understanding the Weird Parts - Udemy",
    "typescript": "Understanding TypeScript - Udemy",
    "react": "React - The Complete Guide - Udemy",
    "angular": "Angular - The Complete Guide - Udemy",
    "vue": "Vue - The Complete Guide - Udemy",
    "node.js": "The Complete Node.js Developer Course - Udemy",
    "machine learning": "Machine Learning by Andrew Ng - Coursera",
    "deep learning": "Deep Learning Specialization - Coursera",
    "nlp": "Natural Language Processing Specialization - Coursera",
    "aws": "AWS Certified Solutions Architect - Udemy",
    "azure": "Microsoft Azure Fundamentals AZ-900 - Udemy",
    "gcp": "Google Cloud Platform Fundamentals - Coursera",
    "docker": "Docker Mastery - Udemy",
    "kubernetes": "Kubernetes for the Absolute Beginners - Udemy",
    "statistics": "Statistics Basics - Khan Academy",
    "git": "Git Complete: The definitive guide - Udemy",
    "tensorflow": "TensorFlow Developer Certificate - Coursera",
    "pytorch": "PyTorch for Deep Learning - Udemy",
    "pandas": "Data Analysis with Pandas and Python - Udemy",
    "numpy": "NumPy for Data Science - Udemy",
    "scikit-learn": "Machine Learning with scikit-learn - DataCamp",
    "figma": "Figma UI UX Design Essentials - Udemy",
    "linux": "Linux Mastery: Master the Linux Command Line - Udemy",
    "terraform": "HashiCorp Certified: Terraform Associate - Udemy",
    "flutter": "The Complete Flutter Development Bootcamp - Udemy",
    "react native": "React Native - The Practical Guide - Udemy",
    "graphql": "GraphQL with React: The Complete Developers Guide - Udemy",
    "cybersecurity": "Google Cybersecurity Professional Certificate - Coursera",
    "agile": "Agile with Atlassian Jira - Coursera",
    "scrum": "Scrum Master Certification - Udemy",
    "project management": "Google Project Management Certificate - Coursera",
    "communication": "Improving Communication Skills - Coursera",
    "leadership": "Foundations of Leadership - Coursera",
    "tailwindcss": "Tailwind CSS From Scratch - Udemy",
    "next.js": "Next.js & React - The Complete Guide - Udemy",
    "django": "Django for Everybody - Coursera",
    "flask": "REST APIs with Flask and Python - Udemy",
    "fastapi": "FastAPI - The Complete Course - Udemy",
    "spark": "Apache Spark with Scala - Udemy",
    "mongodb": "MongoDB - The Complete Developer's Guide - Udemy",
    "postgresql": "The Complete SQL Bootcamp - Udemy",
    "redis": "Redis: The Complete Developer's Guide - Udemy",
    "blockchain": "Blockchain Basics - Coursera",
    "solidity": "Ethereum and Solidity: The Complete Developer's Guide - Udemy",
    "openai": "ChatGPT Prompt Engineering for Developers - DeepLearning.AI",
    "prompt engineering": "Prompt Engineering for ChatGPT - Coursera",
    "rest api": "REST API Design, Development & Management - Udemy",
    "ci/cd": "DevOps CI/CD Pipeline with Jenkins - Udemy",
}

def clean_text(text: str) -> str:
    """
    Clean text while preserving characters critical for skill matching:
    +  (for C++, C#)
    .  (for Node.js, Next.js, ASP.NET, etc.)
    -  (for scikit-learn, react-native)
    /  (for UI/UX, CI/CD)
    #  (for C#)
    """
    text = text.lower()
    # Keep alphanumeric, spaces, and skill-relevant punctuation: + . - / #
    text = re.sub(r'[^a-z0-9\s\+\.\-/#]', ' ', text)
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_text_from_pdf(pdf_buffer: bytes) -> str:
    doc = fitz.open(stream=pdf_buffer, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_skills(text: str) -> list:
    """
    Extract skills from cleaned text.
    Multi-word skills use substring matching.
    Single-word skills use word-boundary regex to avoid partial matches.
    """
    found = []
    for skill in GLOBAL_SKILLS_LIST:
        if " " in skill or "/" in skill or "." in skill or "+" in skill or "#" in skill:
            # Multi-word or special-char skill: direct substring match
            if skill in text:
                found.append(skill)
        else:
            # Single word skill: use word boundary to avoid partial matches
            # e.g., "r" should not match "react" or "parser"
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text):
                found.append(skill)
    return list(set(found))

def extract_experience(text: str) -> str:
    # Look for patterns like "5 years", "3+ years", "10+ years of experience"
    matches = re.findall(r'(\d+)\+?\s*years?', text)
    if matches:
        # Convert all matches to integers and find the max
        ints = [int(m) for m in matches]
        return str(max(ints))
    return "0"

def match_roles(user_skills: list, desired_role: str = None) -> dict:
    results = {}
    
    # If desired_role is provided but not in ROLES_DB, still check all roles
    roles_to_check = ROLES_DB
    if desired_role and desired_role in ROLES_DB:
        roles_to_check = {desired_role: ROLES_DB[desired_role]}
    
    for role, req_skills in roles_to_check.items():
        req_set = set(req_skills)
        user_set = set(user_skills)
        
        matched = list(user_set & req_set)
        missing = list(req_set - user_set)
        
        score = (len(matched) / len(req_set)) * 100 if req_set else 0
        
        results[role] = {
            "score": round(score, 2),
            "matched_skills": matched,
            "missing_skills": missing
        }
    
    # Find the best matching role
    best_role = max(results.keys(), key=lambda r: results[r]["score"])
    best_data = results[best_role]
    
    # If a specific desired_role was requested, prioritize its data
    if desired_role and desired_role in results:
        return {
            "role": desired_role,
            "match_score": results[desired_role]["score"],
            "matched_skills": results[desired_role]["matched_skills"],
            "missing_skills": results[desired_role]["missing_skills"]
        }
        
    return {
        "role": best_role,
        "match_score": best_data["score"],
        "matched_skills": best_data["matched_skills"],
        "missing_skills": best_data["missing_skills"]
    }

def recommend_courses(missing_skills: list) -> list:
    return [COURSES_DB[s] for s in missing_skills if s in COURSES_DB]

def generate_roadmap(missing_skills: list) -> list:
    """
    Generate a 3-month roadmap based on missing skills.
    """
    if not missing_skills:
        return [
            {"month": 1, "title": "Advanced Mastery", "tasks": ["Deep dive into advanced concepts", "Project optimization"], "resources": []},
            {"month": 2, "title": "Portfolio Building", "tasks": ["Build 2 major projects", "Open source contribution"], "resources": []},
            {"month": 3, "title": "Interview Prep", "tasks": ["Mock interviews", "Salary negotiation prep"], "resources": []}
        ]
    
    # Split skills into months
    month1 = missing_skills[:2]
    month2 = missing_skills[2:4]
    month3 = missing_skills[4:]
    
    roadmap = []
    
    if month1:
        roadmap.append({
            "month": 1,
            "title": "Foundation Building",
            "tasks": [f"Learn {s.title()} fundamentals" for s in month1] + ["Setup development environment"],
            "resources": [{"name": COURSES_DB[s], "url": "#", "platform": "Coursera/Udemy"} for s in month1 if s in COURSES_DB]
        })
    
    if month2:
        roadmap.append({
            "month": 2,
            "title": "Practical Application",
            "tasks": [f"Build projects using {s.title()}" for s in month2] + ["Connect components together"],
            "resources": [{"name": COURSES_DB[s], "url": "#", "platform": "Coursera/Udemy"} for s in month2 if s in COURSES_DB]
        })
    
    if month3 or len(roadmap) < 3:
        m3_skills = month3 if month3 else ["Advanced optimization"]
        roadmap.append({
            "month": 3,
            "title": "Mastery & Deployment",
            "tasks": [f"Master {s.title()}" for s in m3_skills] + ["Deploy to production", "Resume optimization"],
            "resources": [{"name": COURSES_DB[s], "url": "#", "platform": "Coursera/Udemy"} for s in m3_skills if s in COURSES_DB]
        })
        
    return roadmap

def analyze_resume(pdf_buffer: bytes, desired_role: str = None) -> dict:
    try:
        raw_text = extract_text_from_pdf(pdf_buffer)
        
        # Filter out watermark text before analysis
        raw_text_filtered = re.sub(r'vishwasx', '', raw_text, flags=re.IGNORECASE)
        
        cleaned_text = clean_text(raw_text_filtered)
        
        # ML Inference: Predict the role using the trained Random Forest model
        predicted_role = None
        model_path = os.path.join(os.path.dirname(__file__), 'resume_classifier.pkl')
        if os.path.exists(model_path):
            try:
                model = joblib.load(model_path)
                predicted_role = model.predict([cleaned_text])[0]
            except Exception as e:
                print(f"ML prediction failed (falling back to rule-based): {e}")
                
        # Map common ML model predictions to ROLES_DB keys
        if predicted_role == "Machine Learning":
            predicted_role = "ML Engineer"
        elif predicted_role == "Data Science":
            predicted_role = "Data Scientist"

        # If no role was passed, prefer the ML predicted one if available
        # But only if it's a recognized role in our DB
        if not desired_role and predicted_role:
            if predicted_role in ROLES_DB:
                desired_role = predicted_role
                
        skills = extract_skills(cleaned_text)
        experience = extract_experience(cleaned_text)
        
        # Rule-based matching for all roles
        match_info = match_roles(skills, None)
        
        # If the rule-based best role has a decent score, or no ML role was predicted,
        # we prefer the rule-based one.
        final_role = match_info["role"]
        
        # If ML prediction exists and rule-based score is low, try the ML role
        if predicted_role and match_info["match_score"] < 40:
            # Map common ML model predictions to ROLES_DB keys
            if predicted_role == "Machine Learning":
                mapped_role = "ML Engineer"
            elif predicted_role == "Data Science":
                mapped_role = "Data Scientist"
            else:
                mapped_role = predicted_role
                
            if mapped_role in ROLES_DB:
                ml_match = match_roles(skills, mapped_role)
                # Only switch if ML role isn't a total mismatch
                if ml_match["match_score"] >= match_info["match_score"]:
                    final_role = mapped_role
                    match_info = ml_match

        courses = recommend_courses(match_info["missing_skills"])
        roadmap = generate_roadmap(match_info["missing_skills"])
        
        return {
            "success": True,
            "experience_years": experience,
            "extracted_skills": skills,
            "predicted_best_role": final_role,
            "role_analysis": match_info,
            "recommended_courses": courses,
            "roadmap": roadmap
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }
