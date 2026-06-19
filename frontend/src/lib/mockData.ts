export interface UserProfile {
  previousRole: string;
  yearsExperience: number;
  careerBreakDuration: string;
  currentSkills: string[];
  desiredRole: string;
  educationLevel: string;
}

export interface SkillGap {
  currentSkills: string[];
  missingSkills: string[];
  recommendedSkills: string[];
}

export interface RoadmapMonth {
  month: number;
  title: string;
  tasks: string[];
  resources: { name: string; platform: string; url: string }[];
}

export interface JobSuggestion {
  id: string;
  title: string;
  type: "entry" | "returnship" | "internship" | "remote";
  requiredSkills: string[];
  companies: string[];
  description: string;
}

export interface Connection {
  id: string;
  name: string;
  previousRole: string;
  careerBreak: string;
  desiredRole: string;
  skills: string[];
  matchReason: string;
  avatar: string;
}

export interface Mentor {
  id: string;
  name: string;
  currentRole: string;
  yearsExperience: number;
  skills: string[];
  avatar: string;
}

export interface CareerPath {
  id: string;
  role: string;
  matchScore: number;
  steps: string[];
  timeline: number;
  requiredSkills: string[];
  salaryRange: string;
}

export interface Workshop {
  id: string;
  title: string;
  instructor: string;
  date: string;
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  skills: string[];
  registrations: number;
  maxCapacity: number;
  description: string;
}

export interface AIInsight {
  id: string;
  category: "skill" | "industry" | "trend" | "opportunity";
  title: string;
  description: string;
  actionable: boolean;
  priority: "high" | "medium" | "low";
  recommendation: string;
}

export interface SkillProficiency {
  skill: string;
  current: number;
  required: number;
  industry: number;
}

export interface CareerGapAnalysis {
  oldSkillsRelevance: number;
  industryEvolution: string[];
  skillsToUpdate: string[];
  newTrendsToLearn: string[];
  transferableSkills: string[];
}

export const sampleConnections: Connection[] = [
  { id: "1", name: "Anita Sharma", previousRole: "Software Developer", careerBreak: "3 years", desiredRole: "Data Analyst", skills: ["Python", "SQL", "Excel"], matchReason: "You both aim to become Data Analysts", avatar: "AS" },
  { id: "2", name: "Priya Menon", previousRole: "Business Analyst", careerBreak: "4 years", desiredRole: "Product Manager", skills: ["SQL", "Tableau", "Agile"], matchReason: "Similar previous roles in analytics", avatar: "PM" },
  { id: "3", name: "Kavita Reddy", previousRole: "UI Designer", careerBreak: "2 years", desiredRole: "UX Researcher", skills: ["Figma", "User Testing", "Wireframing"], matchReason: "Shared design skills", avatar: "KR" },
  { id: "4", name: "Meera Joshi", previousRole: "Marketing Manager", careerBreak: "5 years", desiredRole: "Digital Marketing Lead", skills: ["SEO", "Content Strategy", "Analytics"], matchReason: "Both transitioning in marketing", avatar: "MJ" },
  { id: "5", name: "Sunita Patel", previousRole: "QA Engineer", careerBreak: "3 years", desiredRole: "Data Analyst", skills: ["Python", "Testing", "SQL"], matchReason: "You both aim to become Data Analysts", avatar: "SP" },
  { id: "6", name: "Deepa Krishnan", previousRole: "Frontend Developer", careerBreak: "2 years", desiredRole: "Full Stack Developer", skills: ["React", "JavaScript", "CSS"], matchReason: "Shared technical background", avatar: "DK" },
];

export const sampleMentors: Mentor[] = [
  { id: "1", name: "Radhika Verma", currentRole: "Senior Data Analyst", yearsExperience: 8, skills: ["SQL", "Power BI", "Data Visualization", "Statistics"], avatar: "RV" },
  { id: "2", name: "Sonal Gupta", currentRole: "Engineering Manager", yearsExperience: 12, skills: ["Python", "System Design", "Team Leadership"], avatar: "SG" },
  { id: "3", name: "Nisha Agarwal", currentRole: "Product Director", yearsExperience: 10, skills: ["Product Strategy", "Agile", "User Research"], avatar: "NA" },
  { id: "4", name: "Lakshmi Iyer", currentRole: "Data Science Lead", yearsExperience: 9, skills: ["Machine Learning", "Python", "Statistics", "R"], avatar: "LI" },
];

export const sampleJobs: JobSuggestion[] = [
  { id: "1", title: "Junior Data Analyst", type: "entry", requiredSkills: ["SQL", "Excel", "Python"], companies: ["TCS", "Infosys", "Wipro"], description: "Analyze business data and create reports for stakeholders." },
  { id: "2", title: "Data Analytics Returnship", type: "returnship", requiredSkills: ["SQL", "Tableau", "Statistics"], companies: ["Goldman Sachs", "Morgan Stanley"], description: "16-week paid returnship program for experienced professionals." },
  { id: "3", title: "Business Intelligence Intern", type: "internship", requiredSkills: ["Excel", "SQL", "Power BI"], companies: ["Deloitte", "Accenture"], description: "Learn BI tools while working on real client projects." },
  { id: "4", title: "Remote Data Analyst", type: "remote", requiredSkills: ["Python", "SQL", "Data Visualization"], companies: ["Automattic", "GitLab", "Zapier"], description: "Fully remote position with flexible hours." },
  { id: "5", title: "Product Analyst", type: "entry", requiredSkills: ["SQL", "A/B Testing", "Analytics"], companies: ["Flipkart", "Amazon", "Swiggy"], description: "Drive product decisions through data-driven insights." },
  { id: "6", title: "Analytics Engineer Returnship", type: "returnship", requiredSkills: ["SQL", "dbt", "Python"], companies: ["JPMorgan", "Credit Suisse"], description: "12-week program to re-enter tech with mentorship." },
];

export const interviewQuestions = [
  "Tell me about yourself and your career journey.",
  "How have you kept your skills updated during your career break?",
  "Describe a challenging project from your previous role.",
  "How do you handle working with new technologies?",
  "What motivated you to return to the workforce?",
  "How do you prioritize tasks in a fast-paced environment?",
  "Describe your experience with data analysis tools.",
  "How do you communicate technical findings to non-technical stakeholders?",
  "Where do you see yourself in 2-3 years?",
  "Do you have any questions for us?",
];

export const technicalTopics = [
  "SQL Joins and Window Functions",
  "Python Pandas for Data Analysis",
  "Statistical Concepts: Mean, Median, Standard Deviation",
  "Data Visualization Best Practices",
  "A/B Testing Methodology",
  "ETL Processes",
];

export const resumeTips = [
  "Highlight transferable skills from your career break",
  "Include any freelance, volunteer, or self-learning during the break",
  "Use a functional resume format emphasizing skills over chronology",
  "Quantify achievements from your previous role",
  "Add relevant certifications completed during the break",
];

export const confidenceTips = [
  "Your career break doesn't define your ability — your skills do",
  "Practice your elevator pitch until it feels natural",
  "Research the company thoroughly before the interview",
  "Prepare examples that show adaptability and growth mindset",
  "Remember: many top professionals have taken career breaks",
];

export function generateSkillGap(profile: UserProfile): SkillGap {
  const roleSkillMap: Record<string, string[]> = {
    "Data Analyst": ["SQL", "Python", "Power BI", "Statistics", "Data Visualization", "Excel", "Tableau"],
    "Product Manager": ["Agile", "User Research", "SQL", "A/B Testing", "Roadmapping", "Data Analysis"],
    "UX Researcher": ["User Testing", "Surveys", "Data Analysis", "Figma", "Wireframing", "A/B Testing"],
    "Full Stack Developer": ["React", "Node.js", "TypeScript", "SQL", "REST APIs", "Git", "Docker"],
    "Digital Marketing Lead": ["SEO", "Content Strategy", "Google Analytics", "PPC", "Social Media", "Email Marketing"],
  };
  const required = roleSkillMap[profile.desiredRole] || ["Communication", "Problem Solving", "Technical Skills", "Teamwork", "Time Management"];
  const current = profile.currentSkills.map(s => s.trim());
  const missing = required.filter(s => !current.some(c => c.toLowerCase() === s.toLowerCase()));
  const recommended = missing.slice(0, 4);
  return { currentSkills: current, missingSkills: missing, recommendedSkills: recommended };
}

export function generateRoadmap(missingSkills: string[]): RoadmapMonth[] {
  const skillsPerMonth = Math.ceil(missingSkills.length / 3);
  return [
    {
      month: 1, title: "Foundation & Refresh",
      tasks: missingSkills.slice(0, skillsPerMonth).map(s => `Learn fundamentals of ${s}`),
      resources: [
        { name: "Python for Data Science", platform: "Coursera", url: "#" },
        { name: "SQL Bootcamp", platform: "Udemy", url: "#" },
      ],
    },
    {
      month: 2, title: "Deep Dive & Practice",
      tasks: missingSkills.slice(skillsPerMonth, skillsPerMonth * 2).map(s => `Build proficiency in ${s}`),
      resources: [
        { name: "Statistics Fundamentals", platform: "YouTube", url: "#" },
        { name: "Data Visualization Course", platform: "Google", url: "#" },
      ],
    },
    {
      month: 3, title: "Projects & Portfolio",
      tasks: [...missingSkills.slice(skillsPerMonth * 2).map(s => `Master ${s}`), "Build portfolio project", "Update resume & LinkedIn"],
      resources: [
        { name: "Google Data Analytics Certificate", platform: "Google", url: "#" },
        { name: "Portfolio Building Workshop", platform: "YouTube", url: "#" },
      ],
    },
  ];
}

export function calculateReadinessScore(profile: UserProfile, skillGap: SkillGap) {
  const totalRequired = skillGap.currentSkills.length + skillGap.missingSkills.length;
  const skillMatch = totalRequired > 0 ? Math.round((skillGap.currentSkills.filter(s => !skillGap.missingSkills.includes(s)).length / totalRequired) * 100) : 50;
  const experienceBonus = Math.min(profile.yearsExperience * 5, 25);
  const breakPenalty = parseInt(profile.careerBreakDuration) * 3 || 10;
  const overall = Math.min(Math.max(skillMatch + experienceBonus - breakPenalty + 20, 15), 95);
  return {
    skillReadiness: Math.min(skillMatch + 15, 95),
    industryAlignment: Math.min(skillMatch + experienceBonus, 90),
    interviewReadiness: Math.max(overall - 15, 20),
    overall: Math.round(overall),
  };
}

export const sampleCareerPaths: CareerPath[] = [
  {
    id: "1",
    role: "Senior Data Analyst",
    matchScore: 92,
    steps: ["Learn SQL & Python", "Build portfolio projects", "Get certified", "Apply to mid-level roles", "Advance to senior"],
    timeline: 18,
    requiredSkills: ["SQL", "Python", "Statistics", "Power BI", "Communication"],
    salaryRange: "₹12-18 LPA",
  },
  {
    id: "2",
    role: "Product Manager",
    matchScore: 78,
    steps: ["Learn product fundamentals", "Take PM course", "Build case studies", "Network with PMs", "Apply to PM roles"],
    timeline: 12,
    requiredSkills: ["Agile", "User Research", "SQL", "Analytics", "Leadership"],
    salaryRange: "₹15-25 LPA",
  },
  {
    id: "3",
    role: "Data Science Lead",
    matchScore: 85,
    steps: ["Master ML algorithms", "Build ML projects", "Learn leadership", "Mentor others", "Lead data team"],
    timeline: 24,
    requiredSkills: ["Python", "Machine Learning", "Statistics", "SQL", "Leadership"],
    salaryRange: "₹18-30 LPA",
  },
];

export const sampleWorkshops: Workshop[] = [
  {
    id: "1",
    title: "SQL Mastery for Data Analysis",
    instructor: "Radhika Verma",
    date: "2024-03-20",
    duration: 4,
    level: "beginner",
    skills: ["SQL", "Database Design"],
    registrations: 24,
    maxCapacity: 30,
    description: "Learn SQL from basics to advanced queries. Perfect for career returners.",
  },
  {
    id: "2",
    title: "Python for Data Science",
    instructor: "Sonal Gupta",
    date: "2024-03-25",
    duration: 6,
    level: "intermediate",
    skills: ["Python", "Pandas", "NumPy"],
    registrations: 18,
    maxCapacity: 25,
    description: "Hands-on Python workshop with real-world data analysis projects.",
  },
  {
    id: "3",
    title: "Interview Prep Bootcamp",
    instructor: "Nisha Agarwal",
    date: "2024-04-01",
    duration: 3,
    level: "beginner",
    skills: ["Interview Skills", "Communication"],
    registrations: 32,
    maxCapacity: 40,
    description: "Prepare for your interview with mock sessions and feedback.",
  },
  {
    id: "4",
    title: "Data Visualization with Power BI",
    instructor: "Lakshmi Iyer",
    date: "2024-04-10",
    duration: 5,
    level: "intermediate",
    skills: ["Power BI", "Data Visualization"],
    registrations: 15,
    maxCapacity: 20,
    description: "Create stunning dashboards and reports with Power BI.",
  },
];

export const sampleAIInsights: AIInsight[] = [
  {
    id: "1",
    category: "skill",
    title: "Python is Critical for Your Role",
    description: "90% of Data Analyst roles now require Python proficiency. Your current skills don't include it.",
    actionable: true,
    priority: "high",
    recommendation: "Start with 'Python for Data Science' workshop this week. Allocate 2 hours daily.",
  },
  {
    id: "2",
    category: "industry",
    title: "Industry Shift: Cloud Skills in Demand",
    description: "Cloud platforms (AWS, GCP, Azure) are now essential. Only 20% of your peers have these skills.",
    actionable: true,
    priority: "high",
    recommendation: "Enroll in AWS Fundamentals course. This will set you apart from other candidates.",
  },
  {
    id: "3",
    category: "trend",
    title: "AI/ML Integration Accelerating",
    description: "Companies are integrating AI into analytics workflows. Early adopters have 40% higher salaries.",
    actionable: true,
    priority: "medium",
    recommendation: "Learn basic ML concepts. Start with 'ML for Analytics' course next month.",
  },
  {
    id: "4",
    category: "opportunity",
    title: "Returnship Programs Expanding",
    description: "Top tech companies are launching returnship programs specifically for career returners.",
    actionable: true,
    priority: "high",
    recommendation: "Apply to Goldman Sachs and Morgan Stanley returnship programs. Deadline: March 31.",
  },
];

export const sampleSkillProficiencies: SkillProficiency[] = [
  { skill: "SQL", current: 70, required: 90, industry: 95 },
  { skill: "Python", current: 40, required: 85, industry: 90 },
  { skill: "Statistics", current: 60, required: 80, industry: 85 },
  { skill: "Data Visualization", current: 50, required: 75, industry: 80 },
  { skill: "Excel", current: 85, required: 70, industry: 75 },
  { skill: "Communication", current: 80, required: 85, industry: 90 },
];

export function generateCareerGapAnalysis(profile: UserProfile, skillGap: SkillGap): CareerGapAnalysis {
  const yearsAway = parseInt(profile.careerBreakDuration) || 2;
  return {
    oldSkillsRelevance: Math.max(100 - yearsAway * 8, 40),
    industryEvolution: [
      "Cloud computing adoption increased 300%",
      "AI/ML integration in analytics workflows",
      "Remote-first work culture",
      "Agile methodology now standard",
      "Data privacy regulations (GDPR, CCPA) critical",
    ],
    skillsToUpdate: skillGap.missingSkills.slice(0, 3),
    newTrendsToLearn: ["Cloud Platforms", "AI/ML Basics", "Data Privacy", "Modern DevOps"],
    transferableSkills: profile.currentSkills.filter(s => ["Communication", "Problem Solving", "Leadership", "Teamwork"].some(t => s.toLowerCase().includes(t.toLowerCase()))),
  };
}
