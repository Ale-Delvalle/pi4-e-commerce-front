import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 dark:bg-[#020b05] text-emerald-100 border-t border-emerald-900/50 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="font-extrabold text-white text-xl">Pi4 Market</h3>
          <p className="text-sm text-emerald-300/80 leading-relaxed max-w-xs">
            Tu tienda online de confianza. Ofreciendo los mejores productos premium al precio más conveniente.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 text-base">Tienda</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/products" className="text-emerald-300/70 hover:text-white transition-colors">Catálogo</Link></li>
            <li><Link href="/" className="text-emerald-300/70 hover:text-white transition-colors">Inicio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4 text-base">Cuenta</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/auth/login" className="text-emerald-300/70 hover:text-white transition-colors">Ingresar</Link></li>
            <li><Link href="/auth/register" className="text-emerald-300/70 hover:text-white transition-colors">Registrarse</Link></li>
            <li><Link href="/profile" className="text-emerald-300/70 hover:text-white transition-colors">Mi perfil</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-900/40 py-6 text-center text-xs text-emerald-400/60">
        © {new Date().getFullYear()} Pi4 Market. Todos los derechos reservados.
      </div>
    </footer>
  );
}
