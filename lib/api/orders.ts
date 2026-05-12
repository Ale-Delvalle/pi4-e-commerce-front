import apiClient from "./client";
import type { Order } from "@/types/api.types";

export const ordersApi = {
  create: async (userId: string, products: { id: string }[]): Promise<Order> => {
    const { data } = await apiClient.post<Order>("/orders", { userId, products });
    return data;
  },

  getById: async (orderId: string): Promise<Order> => {
    const { data } = await apiClient.get<Order>("/orders", { params: { id: orderId } });
    return data;
  },
};
