// Progress tracking utilities
export interface ProgressItem {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

export interface MonthProgress {
  month: string;
  items: ProgressItem[];
  completionPercentage: number;
}

export interface RoadmapProgress {
  totalItems: number;
  completedItems: number;
  overallProgress: number;
  monthlyProgress: MonthProgress[];
}

// Get progress from localStorage
export const getProgress = (): Record<string, boolean> => {
  const stored = localStorage.getItem("sheReboot_progress");
  return stored ? JSON.parse(stored) : {};
};

// Save progress to localStorage
export const saveProgress = (progress: Record<string, boolean>): void => {
  localStorage.setItem("sheReboot_progress", JSON.stringify(progress));
};

// Toggle item completion
export const toggleItemCompletion = (itemId: string): void => {
  const progress = getProgress();
  progress[itemId] = !progress[itemId];
  saveProgress(progress);
};

// Mark item as complete
export const markItemComplete = (itemId: string): void => {
  const progress = getProgress();
  progress[itemId] = true;
  saveProgress(progress);
};

// Mark item as incomplete
export const markItemIncomplete = (itemId: string): void => {
  const progress = getProgress();
  progress[itemId] = false;
  saveProgress(progress);
};

// Check if item is completed
export const isItemCompleted = (itemId: string): boolean => {
  const progress = getProgress();
  return progress[itemId] || false;
};

// Calculate progress for items
export const calculateProgress = (items: ProgressItem[]): number => {
  if (items.length === 0) return 0;
  const completed = items.filter(item => item.completed).length;
  return Math.round((completed / items.length) * 100);
};

// Get milestone status
export const getMilestoneStatus = (progress: number): "not-started" | "in-progress" | "completed" => {
  if (progress === 0) return "not-started";
  if (progress === 100) return "completed";
  return "in-progress";
};

// Get milestone color
export const getMilestoneColor = (status: "not-started" | "in-progress" | "completed"): string => {
  switch (status) {
    case "not-started":
      return "bg-muted";
    case "in-progress":
      return "bg-primary";
    case "completed":
      return "bg-secondary";
  }
};

// Get milestone text color
export const getMilestoneTextColor = (status: "not-started" | "in-progress" | "completed"): string => {
  switch (status) {
    case "not-started":
      return "text-muted-foreground";
    case "in-progress":
      return "text-primary";
    case "completed":
      return "text-secondary";
  }
};

// Get streak (consecutive completed items)
export const getStreak = (items: ProgressItem[]): number => {
  let streak = 0;
  for (const item of items) {
    if (item.completed) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// Get next milestone
export const getNextMilestone = (items: ProgressItem[]): ProgressItem | null => {
  return items.find(item => !item.completed) || null;
};
