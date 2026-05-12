import apiClient from "./client";
import type { User } from "@/types/api.types";

export const usersApi = {
  getAll: async (page = 1, limit = 10): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>("/users", { params: { page, limit } });
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  getByEmail: async (email: string): Promise<User> => {
    const { data } = await apiClient.get<User>("/users", { params: { email } });
    return data;
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, userData);
    return data;
  },
};
