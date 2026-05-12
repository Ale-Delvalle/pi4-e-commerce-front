import apiClient from "./client";
import type { Product } from "@/types/api.types";

export const fileUploadApi = {
  uploadImage: async (productId: string, file: File): Promise<Product> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<Product>(
      `/file-upload/uploadImage/${productId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },
};
