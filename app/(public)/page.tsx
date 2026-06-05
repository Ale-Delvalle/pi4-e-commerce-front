"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Sparkles, 
  Star, 
  Laptop, 
  Home, 
  Shirt, 
  Smartphone, 
  ChevronRight,
  Mail,
  ArrowUpRight,
  ShoppingBag,
  Sun,
  Moon
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { useProducts } from "@/lib/queries/useProducts";
import { useCategories } from "@/lib/queries/useCategories";
import { useAuthStore } from "@/stores/auth.store";

// Propuestas de valor mejoradas
const VALUE_PROPS = [
  { 
    icon: Truck, 
    title: "Envíos veloces y seguros", 
    desc: "Entrega prioritaria a todo el país en 24-72hs con seguimiento en vivo.",
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-100/50"
  },
  { 
    icon: ShieldCheck, 
    title: "Compra 100% garantizada", 
    desc: "Garantía de devolución total de 30 días si no estás conforme.",
    color: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border-green-100/50"
  },
  { 
    icon: CreditCard, 
    title: "Pagos seguros en cuotas", 
    desc: "Aceptamos todas las tarjetas de crédito, débito y transferencias seguras.",
    color: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-100/50"
  },
];

// Categorías por defecto con iconos si la API no devuelve datos
const DEFAULT_CATEGORIES = [
  { id: "1", name: "Tecnología", icon: Laptop, count: "Explorar Gadgets", bg: "from-emerald-500/10 to-teal-500/10", hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-500" },
  { id: "2", name: "Hogar", icon: Home, count: "Diseño y Decoración", bg: "from-green-500/10 to-emerald-500/10", hoverBorder: "hover:border-green-300 dark:hover:border-green-500" },
  { id: "3", name: "Moda", icon: Shirt, count: "Prendas de Temporada", bg: "from-teal-500/10 to-green-500/10", hoverBorder: "hover:border-teal-300 dark:hover:border-teal-500" },
  { id: "4", name: "Celulares", icon: Smartphone, count: "Últimos Modelos", bg: "from-emerald-500/10 to-green-500/10", hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-500" },
];

// Productos simulados (Mock Products) con imágenes reales de Unsplash permitidas por next.config.ts
const MOCK_PRODUCTS = [
  {
    id: "mock-1",
    name: "Auriculares Over-Ear Inalámbricos ANC Pro",
    price: "12499.00",
    description: "Cancelación de ruido activa híbrida, sonido de alta resolución y autonomía de 45 horas.",
    imgUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    stock: 8,
    category_id: { id: "cat-tech", name: "Tecnología" }
  },
  {
    id: "mock-2",
    name: "Cafetera de Goteo Programable Smart",
    price: "18990.00",
    description: "Temporizador digital, jarra de vidrio templado de 1.5L y sistema antigoteo.",
    imgUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    stock: 12,
    category_id: { id: "cat-home", name: "Hogar" }
  },
  {
    id: "mock-3",
    name: "Smartwatch Sport GPS Edition",
    price: "24500.00",
    description: "Pantalla AMOLED, monitoreo cardíaco continuo, GPS integrado y resistencia al agua 5 ATM.",
    imgUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    stock: 5,
    category_id: { id: "cat-tech", name: "Tecnología" }
  },
  {
    id: "mock-4",
    name: "Mochila Tech Impermeable Antirrobo",
    price: "7200.00",
    description: "Compartimiento acolchado para notebook de 16 pulgadas, puerto USB externo y cierre oculto.",
    imgUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    stock: 15,
    category_id: { id: "cat-moda", name: "Moda" }
  }
];

// Función para asociar iconos a las categorías reales basadas en palabras clave
function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("tec") || lower.includes("gadget") || lower.includes("electro")) return Laptop;
  if (lower.includes("hog") || lower.includes("casa") || lower.includes("deco")) return Home;
  if (lower.includes("rop") || lower.includes("mod") || lower.includes("vest")) return Shirt;
  if (lower.includes("cel") || lower.includes("movi") || lower.includes("phone")) return Smartphone;
  return Sparkles;
}

export default function HomePage() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { isAuthenticated } = useAuthStore();
  
  // Estado para prevenir errores de hidratación (hydration mismatch) en SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si existen productos reales en la API, tomamos hasta 8. De lo contrario, usamos los 4 productos de muestra premium.
  const hasRealProducts = products && products.length > 0;
  const featured = hasRealProducts ? products.slice(0, 8) : MOCK_PRODUCTS;

  return (
    <div className="space-y-20 pb-20 bg-background text-foreground transition-colors duration-300">
      {/* 1. Hero Section (Split Layout Premium) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Círculos de luz difusa de fondo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-green-500/10 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Información del Hero (Izquierda) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-800/40 border border-emerald-700/60 backdrop-blur-md rounded-full py-1 px-4 text-emerald-300 text-sm font-medium animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              🌿 Bienvenidos a Astro Tech
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              La mejor selección de productos al <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">mejor precio</span>
            </h1>
            
            <p className="text-emerald-100/90 text-lg max-w-xl leading-relaxed">
              Descubrí tecnología de punta, accesorios premium y artículos para el hogar con envíos garantizados y la atención personalizada que te merecés.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <ButtonLink 
                href="/products" 
                size="lg" 
                className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold gap-2 text-base px-8 py-6 rounded-xl shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explorar productos <ArrowRight className="h-5 w-5" />
              </ButtonLink>
              
              {mounted && isAuthenticated ? (
                <ButtonLink 
                  href="/profile" 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 active:bg-white/20 text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-200"
                >
                  Mi perfil
                </ButtonLink>
              ) : (
                <ButtonLink 
                  href="/auth/register" 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 active:bg-white/20 text-base px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-200"
                >
                  Crear cuenta gratis
                </ButtonLink>
              )}
            </div>

            {/* Testimonio / Social Proof Corto */}
            <div className="pt-4 border-t border-emerald-800/40 flex items-center gap-6 text-sm text-emerald-200/80">
              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>Calificación <strong>4.9/5</strong> de +12,000 clientes felices</span>
            </div>
          </div>

          {/* Collage Decorativo Premium (Derecha) */}
          <div className="lg:col-span-5 relative w-full flex justify-center items-center">
            {/* Contenedor principal con efecto de vidrio */}
            <div className="relative w-full max-w-[400px] aspect-square rounded-2xl bg-gradient-to-tr from-emerald-900/30 to-emerald-700/10 border border-emerald-700/30 p-4 shadow-2xl backdrop-blur-sm overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Imagen central */}
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-emerald-950">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
                  alt="Auriculares Premium"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
                
                {/* Etiqueta de precio inferior */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-emerald-950/60 backdrop-blur-md border border-emerald-800/50 p-3 rounded-lg">
                  <div>
                    <p className="text-xs text-emerald-300 uppercase tracking-widest font-semibold">Oferta Especial</p>
                    <p className="text-sm font-bold text-white">Auriculares ANC Pro</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white font-bold hover:bg-emerald-500">
                    -15% OFF
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tarjeta flotante 1: Envío Gratis */}
            <div className="absolute -top-6 -left-6 bg-card text-foreground border border-border/80 shadow-xl rounded-xl p-3 flex items-center gap-3 animate-bounce-slow dark:bg-emerald-900/95 dark:border-emerald-800/60">
              <div className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 p-2 rounded-lg">
                <Truck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Envíos Gratis</p>
                <p className="text-xs font-bold text-foreground">Compras mayores a $15.000</p>
              </div>
            </div>

            {/* Tarjeta flotante 2: Garantía */}
            <div className="absolute -bottom-6 -right-6 bg-card text-foreground border border-border/80 shadow-xl rounded-xl p-3 flex items-center gap-3 dark:bg-emerald-900/95 dark:border-emerald-800/60">
              <div className="bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300 p-2 rounded-lg">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Seguridad</p>
                <p className="text-xs font-bold text-foreground">Compra Protegida</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categorías Section (Tarjetas Interactivas con Hovers Modernos) */}
      <section className="w-full bg-verde-100 dark:bg-emerald-950/20 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-emerald-950/40 border border-verde-500/30 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-full px-3 py-1 text-xs font-semibold mb-3">
              <Sparkles className="h-3 w-3" /> Categorías Populares
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Explorá por departamentos
            </h2>
          </div>
        </div>

        {loadingCats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Si existen categorías en la API, las usamos. Si no, cargamos las de muestra. */}
            {(categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES).map((cat, idx) => {
              const mockCat = DEFAULT_CATEGORIES[idx] || DEFAULT_CATEGORIES[0];
              const Icon = getCategoryIcon(cat.name);
              const bgGradient = mockCat.bg;
              const hoverBorder = mockCat.hoverBorder;
              
              return (
                <Link 
                  key={cat.id} 
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className={`group relative overflow-hidden bg-card border border-border/80 rounded-2xl p-5 flex flex-col justify-between h-32 hover:shadow-lg ${hoverBorder} hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${bgGradient} text-emerald-800 dark:text-emerald-200 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-foreground text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mt-0.5">
                      {mockCat.count}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </section>

      {/* 3. Productos Destacados (Con Fallback de Mocks Elegantes si no hay Base de Datos) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 rounded-full px-3 py-1 text-xs font-semibold mb-3">
              <ShoppingBag className="h-3 w-3" /> Recomendados para Vos
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              {hasRealProducts ? "Productos destacados" : "Productos recomendados (Muestra)"}
            </h2>
          </div>
          <Link 
            href="/products" 
            className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-semibold hover:underline group"
          >
            Ver catálogo completo 
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loadingProducts ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Propuestas de Valor (Bento Layout Glassmorphic) */}
      <section className="bg-verde-100 dark:bg-emerald-950/20 border-t border-b border-verde-500/20 dark:border-emerald-900/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              ¿Por qué elegir Astro Tech?
            </h2>
            <p className="text-muted-foreground">
              Nos enfocamos en brindar la mejor experiencia de compra en cada paso del proceso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUE_PROPS.map(({ icon: Icon, title, desc, color }) => (
              <div 
                key={title} 
                className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-4 group"
              >
                <div className={`p-4 rounded-full ${color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Banner de Promoción y Suscripción (Newsletter Premium) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 text-white py-16 px-6 sm:px-12 lg:py-20 lg:px-20 shadow-2xl">
          {/* Círculos decorativos luminosos */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-green-500/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Texto informativo */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 bg-emerald-800/60 border border-emerald-700/50 rounded-full px-3 py-1 text-xs font-semibold text-emerald-300">
                ✨ Descuento de Bienvenida
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Recibí un 15% OFF en tu primera compra
              </h2>
              <p className="text-emerald-100/90 text-sm sm:text-base max-w-lg leading-relaxed">
                Suscribite a nuestro newsletter y mantente al día con las ofertas exclusivas de temporada, lanzamientos de productos nuevos y guías de compra.
              </p>
            </div>

            {/* Input y Botón de Suscripción */}
            <div className="lg:col-span-5 w-full">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("¡Gracias por suscribirte!");
                }} 
                className="flex flex-col sm:flex-row gap-3 w-full bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md"
              >
                <div className="relative flex-1 flex items-center">
                  <Mail className="absolute left-3.5 h-5 w-5 text-emerald-300" />
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico"
                    className="w-full bg-transparent border-0 text-white placeholder-emerald-200/60 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg hover:shadow-emerald-500/10 whitespace-nowrap cursor-pointer"
                >
                  Suscribirme
                </button>
              </form>
              <p className="text-xs text-emerald-300/70 mt-3 text-left">
                * Respetamos tu privacidad. Podés cancelar tu suscripción en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
