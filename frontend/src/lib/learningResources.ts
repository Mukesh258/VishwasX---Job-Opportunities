export interface LearningResource {
  id: string;
  title: string;
  platform: "YouTube" | "Coursera" | "Udemy" | "Google" | "LinkedIn Learning";
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  skillsCovered: string[];
  role: string;
  description: string;
  instructor?: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface FeaturedWorkshop extends LearningResource {
  featured: true;
  description: string;
}

export const learningResources: LearningResource[] = [
  // Data Analyst Resources
  {
    id: "da-1",
    title: "Power BI Full Course - Complete Tutorial",
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "2 hours",
    skillsCovered: ["Power BI", "Data Visualization"],
    role: "Data Analyst",
    description: "Learn Power BI from scratch with real-world examples and dashboards.",
    instructor: "Alex The Analyst",
    level: "beginner",
  },
  {
    id: "da-2",
    title: "SQL for Data Analysis - Advanced Queries",
    platform: "Coursera",
    videoUrl: "https://www.coursera.org/learn/sql-data-analysis",
    thumbnailUrl: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/8f/e8e8e0e8e8e8e8e8e8e8e8e8e8e8e8e8.png",
    duration: "4 weeks",
    skillsCovered: ["SQL", "Database Design"],
    role: "Data Analyst",
    description: "Master SQL with window functions, CTEs, and optimization techniques.",
    instructor: "Google Cloud",
    level: "intermediate",
  },
  {
    id: "da-3",
    title: "Python for Data Analysis - Pandas & NumPy",
    platform: "Udemy",
    videoUrl: "https://www.udemy.com/course/python-for-data-analysis",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/python-for-data-analysis.jpg",
    duration: "3 hours",
    skillsCovered: ["Python", "Pandas", "Data Analysis"],
    role: "Data Analyst",
    description: "Learn Python data manipulation with Pandas and NumPy libraries.",
    instructor: "Jose Portilla",
    level: "beginner",
  },
  {
    id: "da-4",
    title: "Tableau Dashboard Masterclass",
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/watch?v=tableau-masterclass",
    thumbnailUrl: "https://img.youtube.com/vi/tableau-masterclass/maxresdefault.jpg",
    duration: "3 hours",
    skillsCovered: ["Tableau", "Data Visualization"],
    role: "Data Analyst",
    description: "Create professional dashboards and visualizations with Tableau.",
    instructor: "Data Visualization Expert",
    level: "intermediate",
  },
  {
    id: "da-5",
    title: "Statistics for Data Analysis",
    platform: "Google",
    videoUrl: "https://www.coursera.org/learn/statistics-data-analysis",
    thumbnailUrl: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/statistics.png",
    duration: "5 weeks",
    skillsCovered: ["Statistics", "Data Analysis"],
    role: "Data Analyst",
    description: "Understand statistical concepts essential for data analysis.",
    instructor: "Google Cloud",
    level: "intermediate",
  },
  {
    id: "da-6",
    title: "Excel Advanced - Data Analysis Techniques",
    platform: "LinkedIn Learning",
    videoUrl: "https://www.linkedin.com/learning/excel-advanced",
    thumbnailUrl: "https://media.licdn.com/dms/image/C4D0DAQExcel/learning-course.jpg",
    duration: "2 hours",
    skillsCovered: ["Excel", "Data Analysis"],
    role: "Data Analyst",
    description: "Master advanced Excel functions for data analysis and reporting.",
    instructor: "LinkedIn Learning",
    level: "intermediate",
  },

  // Product Manager Resources
  {
    id: "pm-1",
    title: "Product Management Fundamentals",
    platform: "Coursera",
    videoUrl: "https://www.coursera.org/learn/product-management",
    thumbnailUrl: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/pm.png",
    duration: "4 weeks",
    skillsCovered: ["Product Strategy", "User Research"],
    role: "Product Manager",
    description: "Learn core product management principles and frameworks.",
    instructor: "Google",
    level: "beginner",
  },
  {
    id: "pm-2",
    title: "Agile & Scrum for Product Managers",
    platform: "Udemy",
    videoUrl: "https://www.udemy.com/course/agile-scrum-pm",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/agile-scrum.jpg",
    duration: "3 hours",
    skillsCovered: ["Agile", "Scrum"],
    role: "Product Manager",
    description: "Master Agile methodologies and Scrum framework for product teams.",
    instructor: "Agile Expert",
    level: "beginner",
  },
  {
    id: "pm-3",
    title: "User Research & Testing Masterclass",
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/watch?v=user-research",
    thumbnailUrl: "https://img.youtube.com/vi/user-research/maxresdefault.jpg",
    duration: "2.5 hours",
    skillsCovered: ["User Research", "A/B Testing"],
    role: "Product Manager",
    description: "Conduct effective user research and A/B testing for product decisions.",
    instructor: "Product Expert",
    level: "intermediate",
  },

  // Software Developer Resources
  {
    id: "dev-1",
    title: "React.js Complete Course 2024",
    platform: "Udemy",
    videoUrl: "https://www.udemy.com/course/react-complete",
    thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/react-complete.jpg",
    duration: "4 hours",
    skillsCovered: ["React", "JavaScript"],
    role: "Full Stack Developer",
    description: "Learn React with hooks, context, and modern patterns.",
    instructor: "Maximilian Schwarzmüller",
    level: "beginner",
  },
  {
    id: "dev-2",
    title: "Node.js & Express Backend Development",
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/watch?v=nodejs-express",
    thumbnailUrl: "https://img.youtube.com/vi/nodejs-express/maxresdefault.jpg",
    duration: "3 hours",
    skillsCovered: ["Node.js", "Express", "Backend"],
    role: "Full Stack Developer",
    description: "Build scalable backend applications with Node.js and Express.",
    instructor: "Traversy Media",
    level: "intermediate",
  },
  {
    id: "dev-3",
    title: "TypeScript Masterclass",
    platform: "Coursera",
    videoUrl: "https://www.coursera.org/learn/typescript",
    thumbnailUrl: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/typescript.png",
    duration: "3 weeks",
    skillsCovered: ["TypeScript", "JavaScript"],
    role: "Full Stack Developer",
    description: "Master TypeScript for type-safe JavaScript development.",
    instructor: "Tech Academy",
    level: "intermediate",
  },

  // UX/UI Designer Resources
  {
    id: "ux-1",
    title: "Figma UI Design Masterclass",
    platform: "YouTube",
    videoUrl: "https://www.youtube.com/watch?v=figma-masterclass",
    thumbnailUrl: "https://img.youtube.com/vi/figma-masterclass/maxresdefault.jpg",
    duration: "2.5 hours",
    skillsCovered: ["Figma", "UI Design"],
    role: "UX Researcher",
    description: "Create professional UI designs with Figma from scratch.",
    instructor: "Design Expert",
    level: "beginner",
  },
  {
    id: "ux-2",
    title: "User Experience Design Principles",
    platform: "Coursera",
    videoUrl: "https://www.coursera.org/learn/ux-design",
    thumbnailUrl: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/ux.png",
    duration: "4 weeks",
    skillsCovered: ["UX Design", "User Research"],
    role: "UX Researcher",
    description: "Learn UX design principles and user-centered design methodology.",
    instructor: "Google",
    level: "beginner",
  },
];

export const featuredWorkshop: FeaturedWorkshop = {
  id: "featured-1",
  title: "Career Masterclass: From Break to Success",
  platform: "YouTube",
  videoUrl: "https://www.youtube.com/watch?v=career-comeback",
  thumbnailUrl: "https://img.youtube.com/vi/career-comeback/maxresdefault.jpg",
  duration: "1.5 hours",
  skillsCovered: ["Career Strategy", "Interview Prep", "Confidence"],
  role: "All",
  description: "Join our exclusive masterclass featuring successful professionals who returned to work. Learn strategies to overcome career gaps, build confidence, and land your dream role.",
  instructor: "VishwasX Team",
  level: "beginner",
  featured: true,
};

export function getLearningResources(desiredRole: string): LearningResource[] {
  return learningResources.filter(
    (resource) => resource.role === desiredRole || resource.role === "All"
  );
}

export function getResourcesBySkill(skill: string): LearningResource[] {
  return learningResources.filter((resource) =>
    resource.skillsCovered.some((s) => s.toLowerCase() === skill.toLowerCase())
  );
}

export function getAllSkills(): string[] {
  const skills = new Set<string>();
  learningResources.forEach((resource) => {
    resource.skillsCovered.forEach((skill) => skills.add(skill));
  });
  return Array.from(skills).sort();
}
