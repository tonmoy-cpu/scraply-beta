"use client";

const isLocalStorageAvailable = typeof window !== "undefined";

interface User {
  id: string;
  email: string;
  phoneNumber: string;
  fullname?: string;
  name?: string;   // some backends return "name" instead of "fullname"
  fullName?: string; // Add fullName property
  username?: string;
  role?: string;
}

// Store token in localStorage
export const setToken = (token: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("token", token);
  }
};

// Retrieve token from localStorage
export const getToken = (): string | null => {
  if (isLocalStorageAvailable) {
    const token = localStorage.getItem("token");
    return token;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const isAuth = !!token;
  return isAuth;
};

// Store user data in localStorage
export const setUser = (user: User): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

// Retrieve user data from localStorage
export const getUser = (): User | null => {
  if (isLocalStorageAvailable) {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    return parsedUser;
  }
  return null;
};

// Store user ID
export const setUserID = (id: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("id", id);
  }
};

// Retrieve user ID
export const getUserID = (): string | null => {
  if (isLocalStorageAvailable) {
    const userId = localStorage.getItem("id");
    return userId;
  }
  return null;
};

// Store username
export const setUserName = (username: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("username", username);
  }
};

// Retrieve username
export const getUserName = (): string | null => {
  if (isLocalStorageAvailable) {
    const username = localStorage.getItem("username");
    return username;
  }
  return null;
};

// Store fullname
export const setfullname = (fullname: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("fullname", fullname);
  }
};

// Retrieve fullname
export const getfullname = (): string | null => {
  if (isLocalStorageAvailable) {
    const fullname = localStorage.getItem("fullname");
    return fullname;
  }
  return null;
};

// Store email
export const setEmail = (email: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("email", email);
  }
};

// Retrieve email
export const getEmail = (): string | null => {
  if (isLocalStorageAvailable) {
    const email = localStorage.getItem("email");
    return email;
  }
  return null;
};

// Store phone number
export const setPhoneNumber = (phoneNumber: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("phoneNumber", phoneNumber);
  }
};

// Retrieve phone number
export const getPhoneNumber = (): string | null => {
  if (isLocalStorageAvailable) {
    const phoneNumber = localStorage.getItem("phoneNumber");
    return phoneNumber;
  }
  return null;
};

// Store user role
export const setUserRole = (role: string): void => {
  if (isLocalStorageAvailable) {
    localStorage.setItem("userRole", role);
  }
};

// Retrieve user role
export const getUserRole = (): string | null => {
  if (isLocalStorageAvailable) {
    return localStorage.getItem("userRole");
  }
  return null;
};

// ✅ Check if all required user data is present (fullname optional)
export const isUserDataComplete = (): boolean => {
  const email = getEmail();
  const userId = getUserID();
  const phoneNumber = getPhoneNumber();
  const fullname = getfullname();

  const isComplete = !!email && !!userId && !!phoneNumber; 
  return isComplete;
};

// Clear localStorage and redirect to sign-in
export const handleLogout = (): void => {
  if (isLocalStorageAvailable) {
    localStorage.clear();
    window.location.href = "/sign-in";
  }
};
