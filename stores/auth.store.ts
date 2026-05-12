import { create } from "zustand";
import type { User } from "@/types/api.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setSession: (user, token) => {
    set({ user, token, isAuthenticated: true });
    // Persist token in cookie via API route
    fetch("/api/auth/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {});
  },

  clearSession: () => {
    set({ user: null, token: null, isAuthenticated: false });
    fetch("/api/auth/clear-cookie", { method: "POST" }).catch(() => {});
  },
}));
