import apiClient from "./client";
import type { AuthResponse, User } from "@/types/api.types";
import type { LoginInput, RegisterInput } from "@/types/api.types";

export const authApi = {
  signin: async (credentials: LoginInput): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/signin", credentials);
    return data;
  },

  signup: async (userData: RegisterInput): Promise<Partial<User>> => {
    const { data } = await apiClient.post<Partial<User>>("/auth/signup", userData);
    return data;
  },
};
