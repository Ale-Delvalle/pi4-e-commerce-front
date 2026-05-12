import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoriesApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
}
