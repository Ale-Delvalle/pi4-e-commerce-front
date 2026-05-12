"use client";

import { useProducts } from "@/lib/queries/useProducts";
import { useCategories } from "@/lib/queries/useCategories";
import { useUsers } from "@/lib/queries/useUsers";
import { Package, Tag, Users, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        {value === undefined ? (
          <LoadingSpinner size="sm" />
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const { data: users } = useUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={products?.length}
          icon={Package}
          color="bg-green-600"
        />
        <StatCard
          title="Categorías"
          value={categories?.length}
          icon={Tag}
          color="bg-blue-500"
        />
        <StatCard
          title="Usuarios"
          value={users?.length}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Sin stock"
          value={products?.filter((p) => p.stock === 0).length}
          icon={ShoppingBag}
          color="bg-red-500"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <a href="/admin/products" className="block text-primary hover:underline">
              → Gestionar productos
            </a>
            <a href="/admin/users" className="block text-primary hover:underline">
              → Gestionar usuarios
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Productos sin stock</CardTitle>
          </CardHeader>
          <CardContent>
            {products?.filter((p) => p.stock === 0).length === 0 ? (
              <p className="text-sm text-muted-foreground">Todos los productos tienen stock ✓</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {products
                  ?.filter((p) => p.stock === 0)
                  .slice(0, 5)
                  .map((p) => (
                    <li key={p.id} className="text-red-600 truncate">
                      • {p.name}
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
