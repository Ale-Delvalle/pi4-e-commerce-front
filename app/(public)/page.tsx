"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { useProducts } from "@/lib/queries/useProducts";
import { useCategories } from "@/lib/queries/useCategories";

const VALUE_PROPS = [
  { icon: Truck, title: "Envíos rápidos", desc: "A todo el país en 24-72hs" },
  { icon: ShieldCheck, title: "Compra garantizada", desc: "Devolución sin preguntas" },
  { icon: CreditCard, title: "Pagos seguros", desc: "Múltiples métodos de pago" },
];

export default function HomePage() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCats } = useCategories();

  const featured = products?.slice(0, 8) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-950 to-green-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-green-600 text-white hover:bg-green-600 text-sm px-3 py-1">
            🌿 Bienvenido a Pi4 Market
          </Badge>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            Descubrí lo mejor<br />al mejor precio
          </h1>
          <p className="text-green-200 text-lg max-w-xl mx-auto">
            Los mejores productos de tecnología, hogar y más. Envíos rápidos y pagos seguros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink href="/products" size="lg" className="bg-green-500 hover:bg-green-400 text-white gap-2 text-base">
              Explorar productos <ArrowRight className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/auth/register" size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base">
              Crear cuenta gratis
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Categorías</h2>
        {loadingCats ? (
          <div className="flex gap-3 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-neutral-200 rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {categories?.map((cat) => (
              <Link key={cat.id} href={`/products?category=${encodeURIComponent(cat.name)}`}>
                <Badge
                  variant="secondary"
                  className="text-sm px-4 py-1.5 cursor-pointer hover:bg-green-100 hover:text-green-800 transition-colors"
                >
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Productos destacados</h2>
          <Link href="/products" className="text-primary hover:underline text-sm font-medium">
            Ver todos →
          </Link>
        </div>
        {loadingProducts ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Value Props */}
      <section className="bg-green-50 border-t border-green-100 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {VALUE_PROPS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="bg-green-100 text-green-700 rounded-full p-4">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-neutral-900">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
