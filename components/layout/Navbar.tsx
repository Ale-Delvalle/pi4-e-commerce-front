"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, LogOut, LayoutDashboard, Menu, Sun, Moon } from "lucide-react";
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
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const totalItems = useCartStore(selectTotalItems);
  const openCart = useUIStore((s) => s.openCart);
  const { user, isAuthenticated, clearSession } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      // Limpia cookies huérfanas si el estado de Zustand dice que no está autenticado
      fetch("/api/auth/clear-cookie", { method: "POST" }).catch(() => {});
    }
  }, [mounted, isAuthenticated]);

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

  const initials = mounted && user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-background/80 dark:bg-[#020b05]/90 text-foreground border-b border-border/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-xl whitespace-nowrap shrink-0 bg-gradient-to-r from-emerald-600 to-green-500 dark:from-emerald-400 dark:to-green-300 bg-clip-text text-transparent">
          Pi4 Market
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 hidden sm:flex max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-emerald-400/80" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full bg-muted/80 dark:bg-emerald-950/40 border-border dark:border-emerald-900/40 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-emerald-200/50 focus-visible:ring-emerald-500"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-muted dark:text-emerald-400 dark:hover:bg-emerald-950/60"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Alternar modo oscuro"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500 fill-current" />
              ) : (
                <Moon className="h-5 w-5 text-emerald-600 fill-current" />
              )}
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-foreground hover:bg-muted dark:text-emerald-400 dark:hover:bg-emerald-950/60"
            onClick={openCart}
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500 hover:bg-emerald-500 text-white text-xs rounded-full shadow-md">
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* User dropdown */}
          {mounted && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="text-foreground hover:bg-muted dark:hover:bg-emerald-950/60 rounded-full p-1 transition-colors">
                <Avatar className="h-8 w-8 border border-border dark:border-emerald-800/40">
                  <AvatarFallback className="bg-emerald-600 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border border-border/80">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" /> Mi perfil
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-muted-foreground" /> Admin
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
              className="hidden sm:inline-flex items-center px-4 h-9 rounded-xl border border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-200"
            >
              Ingresar
            </Link>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="sm:hidden text-foreground hover:bg-muted dark:hover:bg-emerald-950/60 rounded-lg p-2 transition-colors" aria-label="Menú">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card border-r border-border">
              <nav className="flex flex-col gap-4 mt-6">
                <Link href="/" onClick={() => setMobileOpen(false)} className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                  Pi4 Market
                </Link>
                <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </form>
                <Link href="/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium hover:text-emerald-500 transition-colors">
                  Catálogo
                </Link>
                {mounted && !isAuthenticated && (
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium hover:text-emerald-500 transition-colors">
                    Ingresar
                  </Link>
                )}
                {mounted && isAuthenticated && (
                  <>
                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="text-sm font-medium hover:text-emerald-500 transition-colors">
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
