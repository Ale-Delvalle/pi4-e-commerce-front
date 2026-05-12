import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";
import type { User } from "@/types/api.types";

export const userKeys = {
  all: ["users"] as const,
  list: (page: number, limit: number) => ["users", "list", page, limit] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};

export function useUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: userKeys.list(page, limit),
    queryFn: () => usersApi.getAll(page, limit),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<User>) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
