import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types/api.types";
import { useAuthStore } from "./auth.store";

interface CartState {
  items: CartItem[];
  byUser: Record<string, CartItem[]>;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      byUser: {},

      addItem: (product) => {
        const userId = useAuthStore.getState().user?.id || "guest";
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.product.id === product.id);
        let newItems: CartItem[];
        if (existing) {
          newItems = currentItems.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          newItems = [...currentItems, { product, quantity: 1 }];
        }
        set((state) => ({
          items: newItems,
          byUser: {
            ...state.byUser,
            [userId]: newItems,
          },
        }));
      },

      removeItem: (productId) => {
        const userId = useAuthStore.getState().user?.id || "guest";
        const currentItems = get().items;
        const newItems = currentItems.filter((i) => i.product.id !== productId);
        set((state) => ({
          items: newItems,
          byUser: {
            ...state.byUser,
            [userId]: newItems,
          },
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const userId = useAuthStore.getState().user?.id || "guest";
        const currentItems = get().items;
        const newItems = currentItems.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        );
        set((state) => ({
          items: newItems,
          byUser: {
            ...state.byUser,
            [userId]: newItems,
          },
        }));
      },

      clearCart: () => {
        const userId = useAuthStore.getState().user?.id || "guest";
        set((state) => ({
          items: [],
          byUser: {
            ...state.byUser,
            [userId]: [],
          },
        }));
      },
    }),
    {
      name: "pi4-cart",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const userId = useAuthStore.getState().user?.id || "guest";
          const userItems = state.byUser?.[userId] || [];
          state.items = userItems;
        }
      },
    }
  )
);

// Sincronizar items activos del carrito cuando cambia el usuario en la sesión
if (typeof window !== "undefined") {
  useAuthStore.subscribe((authState) => {
    const userId = authState.user?.id || "guest";
    const cartStore = useCartStore.getState();
    const userItems = cartStore.byUser?.[userId] || [];
    // Evitamos re-actualizaciones si los ítems actuales ya son iguales a los guardados para el usuario
    if (JSON.stringify(cartStore.items) !== JSON.stringify(userItems)) {
      useCartStore.setState({ items: userItems });
    }
  });
}

// Selectors
export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);

export const selectTotalItems = (state: CartState) =>
  state.items.reduce((acc, item) => acc + item.quantity, 0);
