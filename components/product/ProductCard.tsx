"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StockBadge from "./StockBadge";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { Product } from "@/types/api.types";
import { toast } from "sonner";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  const handleAddToCart = () => {
    addItem(product);
    openCart();
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="group rounded-xl shadow-sm ring-1 ring-neutral-200 hover:shadow-md hover:ring-green-300 transition-all bg-white flex flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.imgUrl || "/placeholder-product.svg"}
          alt={product.name}
          fill
          className="object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-xl">
            <span className="text-white font-semibold text-sm">Sin stock</span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-neutral-900 leading-tight line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <StockBadge stock={product.stock} />
        </div>

        {product.category_id && (
          <Badge variant="secondary" className="self-start text-xs">
            {product.category_id.name}
          </Badge>
        )}

        <p className="text-primary font-bold text-lg mt-auto">
          {formatCurrency(Number(product.price))}
        </p>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-primary hover:bg-green-700 text-white rounded-lg gap-2"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        </Button>
      </div>
    </div>
  );
}
