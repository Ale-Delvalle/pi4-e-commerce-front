import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-white text-lg mb-3">Pi4 Market</h3>
          <p className="text-sm text-green-300">
            Tu tienda online de confianza. Los mejores productos al mejor precio.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Tienda</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">Catálogo</Link></li>
            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Cuenta</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/auth/login" className="hover:text-white transition-colors">Ingresar</Link></li>
            <li><Link href="/auth/register" className="hover:text-white transition-colors">Registrarse</Link></li>
            <li><Link href="/profile" className="hover:text-white transition-colors">Mi perfil</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-green-800 py-4 text-center text-xs text-green-400">
        © {new Date().getFullYear()} Pi4 Market. Todos los derechos reservados.
      </div>
    </footer>
  );
}
