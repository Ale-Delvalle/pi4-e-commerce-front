"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { RegisterSchema } from "@/lib/schemas/auth.schema";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(RegisterSchema) as any,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      const { confirmPassword: _c, ...payload } = data;
      void _c;
      await authApi.signup(payload as Parameters<typeof authApi.signup>[0]);
      toast.success("Cuenta creada. ¡Ya podés iniciar sesión!");
      router.push("/auth/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nombre completo</Label>
          <Input id="name" placeholder="Juan García" {...register("name")} className={(errors.name ? "border-red-500" : "") as string} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="tu@email.com" {...register("email")} className={(errors.email ? "border-red-500" : "") as string} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" placeholder="Min. 8 caracteres" {...register("password")} className={(errors.password ? "border-red-500" : "") as string} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input id="confirmPassword" type="password" placeholder="Repetí tu contraseña" {...register("confirmPassword")} className={(errors.confirmPassword ? "border-red-500" : "") as string} />
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" placeholder="Av. Corrientes 1234" {...register("address")} className={(errors.address ? "border-red-500" : "") as string} />
          {errors.address && <p className="text-xs text-red-500">{errors.address.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" type="number" placeholder="1122334455" {...register("phone")} className={(errors.phone ? "border-red-500" : "") as string} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="country">País</Label>
          <Input id="country" placeholder="Argentina" {...register("country")} className={(errors.country ? "border-red-500" : "") as string} />
          {errors.country && <p className="text-xs text-red-500">{errors.country.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" placeholder="Buenos Aires" {...register("city")} className={(errors.city ? "border-red-500" : "") as string} />
          {errors.city && <p className="text-xs text-red-500">{errors.city.message as string}</p>}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-green-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
