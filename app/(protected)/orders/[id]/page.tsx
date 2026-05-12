"use client";

import { use } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useOrder } from "@/lib/queries/useOrders";
import { ButtonLink } from "@/components/ui/button-link";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface Props {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Orden no encontrada</h2>
        <ButtonLink href="/" variant="outline" className="mt-4 inline-flex">
          Volver al inicio
        </ButtonLink>
      </div>
    );
  }

  const products = order.orderDetails?.products ?? [];
  const total = order.orderDetails?.price ?? 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold text-neutral-900">¡Orden confirmada!</h1>
        <p className="text-muted-foreground text-sm">
          Orden #{order.id.slice(0, 8).toUpperCase()} —{" "}
          {new Date(order.date).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="bg-white rounded-xl ring-1 ring-neutral-200 p-6">
        <h2 className="font-semibold text-lg mb-4">Productos comprados</h2>
        <div className="divide-y">
          {products.map((product) => (
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
                {product.category_id && (
                  <p className="text-xs text-muted-foreground">{product.category_id.name}</p>
                )}
              </div>
              <p className="text-sm font-semibold text-primary shrink-0">
                {formatCurrency(Number(product.price))}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total pagado</span>
          <span className="text-primary">{formatCurrency(Number(total))}</span>
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <ButtonLink href="/products" variant="outline">
          Seguir comprando
        </ButtonLink>
        <ButtonLink href="/profile" className="bg-primary hover:bg-green-700 text-white">
          Mi perfil
        </ButtonLink>
      </div>
    </div>
  );
}
