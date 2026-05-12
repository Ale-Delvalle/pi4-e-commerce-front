import apiClient from "./client";
import type { Category } from "@/types/api.types";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>("/categories");
    return data;
  },

  seed: async (): Promise<void> => {
    await apiClient.get("/categories/seeder");
  },
};
