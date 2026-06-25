import type {
  LoginSchema,
  RegisterSchema,
  ChangePriceSchema,
  CreateOrderSchema,
} from "@/lib/schemas/auth.schema";
import type { z } from "zod";

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ChangePriceInput = z.infer<typeof ChangePriceSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imgUrl?: string;
  category_id: Category;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  country: string;
  city: string;
  address: string;
  avatarUrl?: string;
  isAdmin: boolean;
  orders?: Order[];
}

export interface OrderDetail {
  id: string;
  price: number;
  products: Product[];
}

export interface Order {
  id: string;
  date: string;
  user_id?: User;
  orderDetails?: OrderDetail;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
