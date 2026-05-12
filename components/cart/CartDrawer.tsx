"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, selectTotalPrice } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem";

export default function CartDrawer() {
  const { isCartOpen, closeCart, openLoginModal } = useUIStore();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore(selectTotalPrice);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Tu carrito ({items.length} {items.length === 1 ? "producto" : "productos"})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Button variant="outline" onClick={closeCart}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-4 space-y-4">
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span className="text-primary">{formatCurrency(totalPrice)}</span>
            </div>
            <Button
              className="w-full bg-primary hover:bg-green-700 text-white gap-2"
              onClick={handleCheckout}
            >
              Ir al Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
