"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { api } from "@/service/api";

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  exp?: number;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("financeapp_token");
      if (savedToken) {
        const payload = jwtDecode<JwtPayload>(savedToken);
        if (payload) {
          setUser({
            id: payload.sub,
            email: payload.email,
            name: payload.name,
          });
          setToken(savedToken);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar token:", error);
      localStorage.removeItem("financeapp_token");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>("/v1/auth/login", {
      email,
      password,
    });

    const payload = jwtDecode<JwtPayload>(data.accessToken);
    if (payload) {
      setUser({ id: payload.sub, email: payload.email, name: payload.name });
      setToken(data.accessToken);
      localStorage.setItem("financeapp_token", data.accessToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("financeapp_token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
