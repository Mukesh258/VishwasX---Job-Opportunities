// Authentication utilities
export interface User {
  id: string;
  phone?: string;
  email: string;
  password?: string;
  name: string;
  role: 'user' | 'company';
  companyId?: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

// Get password strength feedback
export function getPasswordStrength(password: string): {
  strength: "weak" | "medium" | "strong";
  feedback: string;
} {
  if (password.length < 8) {
    return { strength: "weak", feedback: "At least 8 characters required" };
  }
  if (!/[A-Z]/.test(password)) {
    return { strength: "weak", feedback: "Add uppercase letters" };
  }
  if (!/[a-z]/.test(password)) {
    return { strength: "weak", feedback: "Add lowercase letters" };
  }
  if (!/\d/.test(password)) {
    return { strength: "weak", feedback: "Add numbers" };
  }
  if (password.length < 12) {
    return { strength: "medium", feedback: "Good password" };
  }
  return { strength: "strong", feedback: "Strong password" };
}

// Sign Up - Create new user
export function signUp(email: string, password: string, name: string, phone?: string): { success: boolean; message: string; user?: User } {
  // Validate inputs
  if (!email || !password || !name) {
    return { success: false, message: "All fields are required" };
  }

  if (!isValidEmail(email)) {
    return { success: false, message: "Invalid email format" };
  }

  if (!isValidPassword(password)) {
    return {
      success: false,
      message: "Password must be at least 8 characters with uppercase, lowercase, and numbers",
    };
  }

  // Check if user already exists
  const users = getAllUsers();
  if (users.some((u) => u.email === email)) {
    return { success: false, message: "Email already registered" };
  }

  // Create new user
  const newUser: User = {
    id: generateUserId(),
    phone,
    email,
    password, // In production, hash this!
    name,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  // Save user to localStorage
  users.push(newUser);
  localStorage.setItem("sheReboot_users", JSON.stringify(users));

  // Auto-login after signup
  localStorage.setItem("sheReboot_currentUser", JSON.stringify(newUser));

  return { success: true, message: "Account created successfully", user: newUser };
}

// Sign In - Authenticate user by phone
export function signIn(phone: string, password: string): { success: boolean; message: string; user?: User } {
  // Validate inputs
  if (!phone || !password) {
    return { success: false, message: "Phone and password are required" };
  }

  // Find user
  const users = getAllUsers();
  const user = users.find((u) => u.phone === phone);

  if (!user) {
    return { success: false, message: "Phone not found" };
  }

  // Check password (in production, compare hashes)
  if (user.password !== password) {
    return { success: false, message: "Incorrect password" };
  }

  // Save current user to localStorage with role
  const userWithRole: User = { ...user, role: 'user' };
  localStorage.setItem("sheReboot_currentUser", JSON.stringify(userWithRole));

  return { success: true, message: "Signed in successfully", user: userWithRole };
}

// Sign In Company
export function signInCompany(company: any): void {
  const companyUser: User = {
    id: company.companyId || `comp_${Date.now()}`,
    email: company.email,
    name: company.name,
    role: 'company',
    companyId: company.companyId,
    isVerified: company.isVerified,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem("sheReboot_currentUser", JSON.stringify(companyUser));
}

// Sign Out
export function signOut(): void {
  localStorage.removeItem("sheReboot_currentUser");
}

// Get current user
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("sheReboot_currentUser");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Get all users (for development)
export function getAllUsers(): User[] {
  const usersStr = localStorage.getItem("sheReboot_users");
  if (!usersStr) return [];
  try {
    return JSON.parse(usersStr);
  } catch {
    return [];
  }
}

// Generate unique user ID
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Update user profile
export function updateUserProfile(userId: string, updates: Partial<User>): { success: boolean; message: string } {
  const users = getAllUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, message: "User not found" };
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem("sheReboot_users", JSON.stringify(users));

  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser?.id === userId) {
    localStorage.setItem("sheReboot_currentUser", JSON.stringify(users[userIndex]));
  }

  return { success: true, message: "Profile updated successfully" };
}
