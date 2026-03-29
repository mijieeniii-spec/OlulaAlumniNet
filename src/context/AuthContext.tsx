"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "alumni" | "teacher" | null;

export interface User {
  name: string;
  email: string;
  role: UserRole;
  photo: string;
  classYear?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function detectRole(email: string): UserRole {
  if (email.endsWith("@student.olula.mn")) return "student";
  if (email.endsWith("@alumni.olula.mn")) return "alumni";
  if (email.endsWith("@teacher.olula.mn")) return "teacher";
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("olula_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("olula_user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const role = detectRole(email);
    if (!role) return false;
    const users = JSON.parse(localStorage.getItem("olula_users") || "[]");
    const found = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);
    if (!found) return false;
    const loggedIn: User = {
      name: found.name,
      email,
      role,
      photo: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`,
      classYear: found.classYear,
    };
    setUser(loggedIn);
    localStorage.setItem("olula_user", JSON.stringify(loggedIn));
    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    const role = detectRole(email);
    if (!role) {
      return {
        success: false,
        message: "Зөвхөн @student.olula.mn, @alumni.olula.mn, @teacher.olula.mn хаягаар бүртгүүлнэ үү.",
      };
    }
    const users = JSON.parse(localStorage.getItem("olula_users") || "[]");
    if (users.find((u: { email: string }) => u.email === email)) {
      return { success: false, message: "Энэ имэйл хаяг бүртгэлтэй байна." };
    }
    users.push({ name, email, password, role });
    localStorage.setItem("olula_users", JSON.stringify(users));
    const newUser: User = {
      name,
      email,
      role,
      photo: `https://api.dicebear.com/7.x/personas/svg?seed=${email}`,
    };
    setUser(newUser);
    localStorage.setItem("olula_user", JSON.stringify(newUser));
    return { success: true, message: "Амжилттай бүртгүүллээ!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("olula_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
