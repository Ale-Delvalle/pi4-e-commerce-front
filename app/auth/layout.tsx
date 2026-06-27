import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
