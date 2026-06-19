/**
 * Skill matching utility for prioritizing jobs based on user skills
 */

export interface SkillMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Calculate skill match between user skills and job requirements
 * @param userSkills - Array of user's current skills
 * @param jobSkills - Array of job's required skills
 * @returns Match percentage (0-100) and breakdown of matched/missing skills
 */
export const calculateSkillMatch = (
  userSkills: string[],
  jobSkills: string[]
): SkillMatchResult => {
  if (!jobSkills || jobSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: []
    };
  }

  // Normalize skills to lowercase for comparison
  const normalizedUserSkills = (userSkills || []).map(s => s.toLowerCase().trim());
  const normalizedJobSkills = (jobSkills || []).map(s => s.toLowerCase().trim());

  // Find matched and missing skills
  const matchedSkills = normalizedJobSkills.filter(skill => {
    // Look for exact word match to avoid "r" matching "react" or "java" matching "javascript"
    const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return normalizedUserSkills.some(userSkill => 
      skill === userSkill || skillRegex.test(userSkill)
    );
  });

  const missingSkills = normalizedJobSkills.filter(
    skill => !matchedSkills.includes(skill)
  );

  // Calculate match percentage
  const matchPercentage = Math.round(
    (matchedSkills.length / normalizedJobSkills.length) * 100
  );

  return {
    matchPercentage,
    matchedSkills,
    missingSkills
  };
};

/**
 * Sort jobs by skill match with user
 * @param jobs - Array of jobs to sort
 * @param userSkills - User's current skills
 * @returns Jobs sorted by match percentage (highest first)
 */
export const sortJobsBySkillMatch = (
  jobs: any[],
  userSkills: string[]
): any[] => {
  if (!userSkills || userSkills.length === 0) {
    return jobs;
  }

  return [...jobs].sort((a, b) => {
    const matchA = calculateSkillMatch(userSkills, a.skills || []);
    const matchB = calculateSkillMatch(userSkills, b.skills || []);
    return matchB.matchPercentage - matchA.matchPercentage;
  });
};

/**
 * Get color code based on match percentage
 */
export const getMatchColor = (percentage: number): string => {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-blue-500";
  if (percentage >= 40) return "bg-yellow-500";
  return "bg-red-500";
};

/**
 * Get color code for text based on match percentage
 */
export const getMatchTextColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-blue-600";
  if (percentage >= 40) return "text-yellow-600";
  return "text-red-600";
};
