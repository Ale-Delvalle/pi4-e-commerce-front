import apiClient from "./client";
import type { Product } from "@/types/api.types";

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
}

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>("/products", { params: filters });
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  updatePrice: async (id: string, newPrice: number): Promise<Product> => {
    const { data } = await apiClient.put<Product>("/products", { id, newPrice });
    return data;
  },
};
