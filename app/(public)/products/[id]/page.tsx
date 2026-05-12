"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { useProduct, useProducts } from "@/lib/queries/useProducts";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StockBadge from "@/components/product/StockBadge";
import ProductCard from "@/components/product/ProductCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Producto no encontrado</h2>
        <Link href="/products" className="text-primary hover:underline mt-4 block">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const related = allProducts?.filter(
    (p) =>
      p.id !== product.id && p.category_id?.name === product.category_id?.name
  ).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    openCart();
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-primary">Productos</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 ring-1 ring-neutral-200">
          <Image
            src={product.imgUrl || "/placeholder-product.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {product.category_id && (
            <Badge variant="secondary" className="self-start">
              {product.category_id.name}
            </Badge>
          )}

          <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(Number(product.price))}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Cantidad:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-primary hover:bg-green-700 text-white gap-2 mt-2"
          >
            <ShoppingCart className="h-5 w-5" />
            {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
          </Button>
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
