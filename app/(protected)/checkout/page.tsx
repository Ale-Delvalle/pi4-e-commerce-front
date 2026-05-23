"use client";

import Image from "next/image";
import { useCartStore, selectTotalPrice } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { useCreateOrder } from "@/lib/queries/useOrders";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const handleConfirm = () => {
    if (!user) return;
    createOrder(
      {
        userId: user.id,
        products: items.map((i) => ({ id: i.product.id })),
      },
      {
        onSuccess: (order) => {
          clearCart();
          router.push(`/orders/${order.id}`);
        },
        onError: () => {
          toast.error("Error al crear la orden. Intentá nuevamente.");
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <ButtonLink href="/products" variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Ver productos
        </ButtonLink>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Confirmar compra</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-card rounded-xl ring-1 ring-neutral-200 dark:ring-border p-6">
          <h2 className="font-semibold text-lg mb-4">Resumen de productos</h2>
          <div className="divide-y">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 py-3">
                <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                  <Image
                    src={product.imgUrl || "/placeholder-product.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Cantidad: {quantity}</p>
                </div>
                <p className="text-sm font-semibold text-primary shrink-0">
                  {formatCurrency(Number(product.price) * quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-xl ring-1 ring-neutral-200 dark:ring-border p-6 h-fit sticky top-20">
          <h2 className="font-semibold text-lg mb-4">Total de la orden</h2>
          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {product.name} × {quantity}
                </span>
                <span>{formatCurrency(Number(product.price) * quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(totalPrice)}</span>
          </div>
          <Button
            className="w-full mt-6 bg-primary hover:bg-green-700 text-white gap-2"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? (
              <>
                <LoadingSpinner size="sm" /> Procesando...
              </>
            ) : (
              "Confirmar compra →"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
