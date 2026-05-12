"use client";

import { useState } from "react";
import Image from "next/image";
import { useProducts } from "@/lib/queries/useProducts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StockBadge from "@/components/product/StockBadge";
import PriceUpdateDialog from "@/components/admin/PriceUpdateDialog";
import ImageUploadDialog from "@/components/admin/ImageUploadDialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { DollarSign, ImageIcon } from "lucide-react";
import type { Product } from "@/types/api.types";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [priceProduct, setPriceProduct] = useState<Product | null>(null);
  const [imageProduct, setImageProduct] = useState<Product | null>(null);

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Gestión de productos</h1>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-xl ring-1 ring-neutral-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Img</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-neutral-100">
                      <Image
                        src={product.imgUrl || "/placeholder-product.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    <span className="truncate block">{product.name}</span>
                  </TableCell>
                  <TableCell>
                    {product.category_id && (
                      <Badge variant="secondary">{product.category_id.name}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-primary font-semibold">
                    {formatCurrency(Number(product.price))}
                  </TableCell>
                  <TableCell>
                    <StockBadge stock={product.stock} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPriceProduct(product)}
                        className="gap-1"
                      >
                        <DollarSign className="h-3.5 w-3.5" />
                        Precio
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setImageProduct(product)}
                        className="gap-1"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                        Imagen
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <PriceUpdateDialog
        product={priceProduct}
        open={!!priceProduct}
        onClose={() => setPriceProduct(null)}
      />
      <ImageUploadDialog
        product={imageProduct}
        open={!!imageProduct}
        onClose={() => setImageProduct(null)}
      />
    </div>
  );
}
