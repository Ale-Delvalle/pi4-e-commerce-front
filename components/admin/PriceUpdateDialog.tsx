"use client";

import { useForm } from "react-hook-form";
import { useUpdatePrice } from "@/lib/queries/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Product } from "@/types/api.types";

interface FormValues {
  newPrice: string;
}

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function PriceUpdateDialog({ product, open, onClose }: Props) {
  const { mutate, isPending } = useUpdatePrice();

  const { register, handleSubmit, reset } = useForm<FormValues>({
    values: { newPrice: String(product?.price ?? "") },
  });

  const onSubmit = (data: FormValues) => {
    if (!product) return;
    const newPrice = parseFloat(data.newPrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error("Ingresá un precio válido");
      return;
    }
    mutate(
      { id: product.id, newPrice },
      {
        onSuccess: () => {
          toast.success("Precio actualizado");
          reset();
          onClose();
        },
        onError: () => toast.error("Error al actualizar el precio"),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Actualizar precio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-muted-foreground">{product?.name}</p>
          <div className="space-y-1">
            <Label htmlFor="newPrice">Nuevo precio (USD)</Label>
            <Input
              id="newPrice"
              type="number"
              step="0.01"
              min="0.01"
              {...register("newPrice", { required: true })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-green-700 text-white" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
