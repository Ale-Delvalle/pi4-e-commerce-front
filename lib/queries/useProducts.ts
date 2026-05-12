import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, type ProductFilters } from "@/lib/api/products";
import { fileUploadApi } from "@/lib/api/fileUpload";

export const productKeys = {
  all: ["products"] as const,
  list: (filters?: ProductFilters) => ["products", "list", filters] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getAll(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newPrice }: { id: string; newPrice: number }) =>
      productsApi.updatePrice(id, newPrice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUploadImage(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => fileUploadApi.uploadImage(productId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
