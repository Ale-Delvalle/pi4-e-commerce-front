"use client";

import { useRef, useState } from "react";
import { useUploadImage } from "@/lib/queries/useProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Product } from "@/types/api.types";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ImageUploadDialog({ product, open, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const { mutate, isPending } = useUploadImage(product?.id ?? "");

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error("Seleccioná un archivo");
    if (file.size > 200 * 1024) return toast.error("El archivo no debe superar 200KB");

    mutate(file, {
      onSuccess: () => {
        toast.success("Imagen actualizada");
        setFileName("");
        onClose();
      },
      onError: () => toast.error("Error al subir la imagen"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Subir imagen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{product?.name}</p>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="img-upload"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            />
            <label
              htmlFor="img-upload"
              className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-primary transition-colors text-sm text-muted-foreground"
            >
              {fileName || "Seleccioná un archivo (JPG, PNG, WebP — máx. 200KB)"}
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-primary hover:bg-green-700 text-white"
            onClick={handleUpload}
            disabled={isPending || !fileName}
          >
            {isPending ? "Subiendo..." : "Subir imagen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
