"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore, selectTotalItems } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const totalItems = useCartStore(selectTotalItems);
  const openCart = useUIStore((s) => s.openCart);
  const { user, isAuthenticated, clearSession } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-green-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl whitespace-nowrap shrink-0">
          Pi4 Market
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 hidden sm:flex max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-200" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full bg-green-800 border-green-600 text-white placeholder:text-green-300 focus-visible:ring-green-400"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-green-800"
            onClick={openCart}
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-green-500 text-white text-xs rounded-full">
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* User dropdown */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white hover:bg-green-800 rounded-full p-1 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-600 text-white text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="h-4 w-4 mr-2" /> Mi perfil
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex items-center px-3 h-8 rounded-lg border border-white text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Ingresar
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="sm:hidden text-white hover:bg-green-800 rounded-lg p-2 transition-colors" aria-label="Menú">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/" onClick={() => setMobileOpen(false)} className="font-bold text-lg">
                  Pi4 Market
                </Link>
                <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>
                <Link href="/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium hover:text-primary">
                  Catálogo
                </Link>
                {!isAuthenticated && (
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium hover:text-primary">
                    Ingresar
                  </Link>
                )}
                {isAuthenticated && (
                  <>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium hover:text-primary">
                      Mi perfil
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm font-medium text-red-500 text-left">
                      Cerrar sesión
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
