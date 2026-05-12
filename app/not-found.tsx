import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-green-900 flex items-center justify-center px-4">
      <div className="text-center text-white space-y-6">
        <h1 className="text-8xl font-bold text-green-400">404</h1>
        <h2 className="text-2xl font-semibold">Página no encontrada</h2>
        <p className="text-green-300 max-w-sm mx-auto">
          La página que buscás no existe o fue movida.
        </p>
        <ButtonLink href="/" className="bg-green-500 hover:bg-green-400 text-white">
          Volver al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
