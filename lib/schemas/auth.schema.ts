import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(3, "Mínimo 3 caracteres").max(80, "Máximo 80 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(15, "Máximo 15 caracteres")
      .regex(/[A-Z]/, "Debe tener al menos 1 mayúscula")
      .regex(/[a-z]/, "Debe tener al menos 1 minúscula")
      .regex(/[0-9]/, "Debe tener al menos 1 número")
      .regex(/[^a-zA-Z0-9]/, "Debe tener al menos 1 símbolo"),
    confirmPassword: z.string(),
    address: z.string().min(3, "Mínimo 3 caracteres").max(80, "Máximo 80 caracteres"),
    phone: z.coerce.number().positive("Debe ser un número positivo"),
    country: z.string().min(5, "Mínimo 5 caracteres").max(20, "Máximo 20 caracteres"),
    city: z.string().min(5, "Mínimo 5 caracteres").max(20, "Máximo 20 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const ChangePriceSchema = z.object({
  id: z.string().uuid("ID inválido"),
  newPrice: z.coerce.number().positive("El precio debe ser positivo"),
});

export const CreateOrderSchema = z.object({
  userId: z.string().uuid("UserID inválido"),
  products: z.array(z.object({ id: z.string().uuid() })).min(1, "Debe tener al menos 1 producto"),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(3).max(80).optional(),
  phone: z.coerce.number().positive().optional(),
  country: z.string().min(5).max(20).optional(),
  city: z.string().min(5).max(20).optional(),
  address: z.string().min(3).max(80).optional(),
});
