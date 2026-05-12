"use client";

import { useState } from "react";
import { useProducts } from "@/lib/queries/useProducts";
import { useCategories } from "@/lib/queries/useCategories";
import ProductGrid, { ProductGridSkeleton } from "@/components/product/ProductGrid";
import EmptyState from "@/components/shared/EmptyState";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: allProducts, isLoading } = useProducts();
  const { data: categories } = useCategories();

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const filteredProducts = allProducts?.filter((p) => {
    const matchesSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category_id?.name || "");
    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    router.push("/products");
  };

  const hasFilters = search || selectedCategories.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Catálogo</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl p-4 ring-1 ring-neutral-200 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </h3>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                  <X className="h-3 w-3 mr-1" /> Limpiar
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>

            {/* Categories */}
            {categories && categories.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Categorías</p>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <Checkbox
                        id={cat.id}
                        checked={selectedCategories.includes(cat.name)}
                        onCheckedChange={() => toggleCategory(cat.name)}
                      />
                      <Label htmlFor={cat.id} className="text-sm cursor-pointer">
                        {cat.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <EmptyState
              title="Sin productos"
              description="No encontramos productos con esos filtros."
              action={{ label: "Limpiar filtros", onClick: clearFilters }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><ProductGridSkeleton /></div>}>
      <CatalogContent />
    </Suspense>
  );
}
