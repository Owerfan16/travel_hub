"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Helper function to get cookies (for CSRF token)
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // Get CSRF token
  const fetchCSRFToken = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/csrf-token/", {
        credentials: "include",
      });
      return true;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      return false;
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Get CSRF token first
        await fetchCSRFToken();

        const response = await fetch(
          "http://localhost:8000/api/auth/profile/",
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Get CSRF token first
      await fetchCSRFToken();

      const csrfToken = getCookie("csrftoken");

      // Generate a username from email
      const username = email.split("@")[0];

      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        body: JSON.stringify({ username, name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      setUser(data.user);

      // Redirect based on screen size
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          // For desktop, stay on current page (Profile_pc component will be activated)
        } else {
          // For mobile, go to profile page
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Get CSRF token first
      await fetchCSRFToken();

      const csrfToken = getCookie("csrftoken");

      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      setUser(data.user);

      // Redirect based on screen size
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          // For desktop, stay on current page (Profile_pc component will be activated)
        } else {
          // For mobile, go to profile page
          router.push("/profile");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Get CSRF token first
      await fetchCSRFToken();

      const csrfToken = getCookie("csrftoken");

      await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken || "",
        },
      });

      setUser(null);

      // Redirect to auth page
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
