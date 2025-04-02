
// Types for user roles and authentication
export type UserRole = "student" | "teacher" | "proctor" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
}

// Store the current user in localStorage
export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
};

// Get the current user from localStorage
export const getCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
};

// Check if the current user has a specific role
export const hasRole = (role: UserRole | UserRole[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  return user.role === role;
};

// Demo users for testing (in a real app, these would be in a database)
export const demoUsers: User[] = [
  { id: "ADM1", name: "أحمد المدير", role: "admin", username: "admin" },
  { id: "TCH1", name: "محمد المعلم", role: "teacher", username: "teacher" },
  { id: "PRC1", name: "علي المراقب", role: "proctor", username: "proctor" },
  { id: "ST1001", name: "أحمد محمد", role: "student", username: "student1" },
  { id: "ST1002", name: "فاطمة عبدالله", role: "student", username: "student2" },
  { id: "ST1003", name: "محمد علي", role: "student", username: "student3" },
];

// Simple login function (in a real app, this would verify against a database)
export const loginUser = (username: string, password: string): User | null => {
  // For demo purposes, we'll accept any password for demo users
  const user = demoUsers.find(user => user.username === username);
  if (user) {
    setCurrentUser(user);
    return user;
  }
  return null;
};

// Logout function
export const logoutUser = () => {
  setCurrentUser(null);
  localStorage.removeItem("isAdmin");
};
