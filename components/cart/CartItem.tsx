"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart.store";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { CartItem as CartItemType } from "@/types/api.types";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex gap-3 py-3">
      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
        <Image
          src={item.product.imgUrl || "/placeholder-product.svg"}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-neutral-900 truncate">{item.product.name}</p>
        <p className="text-primary font-semibold text-sm">
          {formatCurrency(Number(item.product.price))}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-auto text-red-500 hover:text-red-600"
            onClick={() => removeItem(item.product.id)}
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
