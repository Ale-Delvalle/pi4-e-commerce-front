"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useUser, useUpdateUser } from "@/lib/queries/useUsers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface UpdateUserInput {
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { data: fullUser, isLoading } = useUser(user?.id ?? "");
  const { mutate: updateUser, isPending } = useUpdateUser(user?.id ?? "");

  const { register, handleSubmit } = useForm<UpdateUserInput>({
    values: {
      name: fullUser?.name,
      phone: String(fullUser?.phone ?? ""),
      country: fullUser?.country,
      city: fullUser?.city,
      address: fullUser?.address,
    },
  });

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectedPhotoLabel = useMemo(
    () => selectedPhoto?.name ?? "Seleccionar archivo",
    [selectedPhoto]
  );

  useEffect(() => {
    if (!selectedPhoto) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedPhoto);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedPhoto]);

  const onPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedPhoto(file);
  };

  const currentPhotoUrl = previewUrl ?? fullUser?.avatarUrl ?? undefined;

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      const payload = {
        ...data,
        phone: data.phone ? Number(data.phone) : undefined,
      };
      await updateUser(payload as Parameters<typeof updateUser>[0]);
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Mi perfil</h1>

      <Tabs defaultValue="data">
        <TabsList className="mb-6">
          <TabsTrigger value="data">Mis datos</TabsTrigger>
          <TabsTrigger value="orders">Mis órdenes</TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 rounded-2xl border border-dashed border-border bg-muted p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar size="lg" className="border border-border">
                      {currentPhotoUrl ? (
                        <AvatarImage src={currentPhotoUrl} alt="Foto de perfil" />
                      ) : (
                        <AvatarFallback>
                          {fullUser?.name?.trim()?.[0] ?? "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Foto de perfil</p>
                        <p className="text-sm text-muted-foreground">
                          Selecciona una imagen para previsualizarla. Esta acción es solo de diseño por ahora.
                        </p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[1fr_auto] items-center">
                        <input
                          id="profile-photo"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={onPhotoChange}
                        />
                        <label
                          htmlFor="profile-photo"
                          className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted sm:w-auto"
                        >
                          <span>{selectedPhotoLabel}</span>
                          <span className="text-primary">Cambiar</span>
                        </label>
                        <p className="text-xs text-muted-foreground sm:col-span-2">
                          Formatos admitidos: JPG, PNG. La foto no se enviará al backend en esta versión.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Nombre</Label>
                  <Input {...register("name")} />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input value={fullUser?.email ?? ""} disabled className="bg-neutral-50" />
                </div>
                <div className="space-y-1">
                  <Label>Teléfono</Label>
                  <Input type="number" {...register("phone")} />
                </div>
                <div className="space-y-1">
                  <Label>País</Label>
                  <Input {...register("country")} />
                </div>
                <div className="space-y-1">
                  <Label>Ciudad</Label>
                  <Input {...register("city")} />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label>Dirección</Label>
                  <Input {...register("address")} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="bg-primary hover:bg-green-700 text-white" disabled={isPending}>
                    {isPending ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Mis órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              {!fullUser?.orders || fullUser.orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Todavía no realizaste ninguna compra.</p>
                  <ButtonLink href="/products" variant="outline" className="mt-4 inline-flex">
                    Ver catálogo
                  </ButtonLink>
                </div>
              ) : (
                <div className="divide-y">
                  {fullUser.orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-sm">
                          Orden #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("es-AR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {order.orderDetails?.price && (
                          <span className="font-semibold text-primary">
                            {formatCurrency(Number(order.orderDetails.price))}
                          </span>
                        )}
                        <ButtonLink href={`/orders/${order.id}`} variant="outline" size="sm">
                          Ver detalle
                        </ButtonLink>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
