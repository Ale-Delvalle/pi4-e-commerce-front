import { useQuery, useMutation } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";

export const orderKeys = {
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: ({ userId, products }: { userId: string; products: { id: string }[] }) =>
      ordersApi.create(userId, products),
  });
}
