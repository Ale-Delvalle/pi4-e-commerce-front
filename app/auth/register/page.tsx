import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Registrarse — Pi4 Market" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 to-green-900 flex items-center justify-center p-4 py-12">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🌿</div>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Completá tus datos para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿Ya tenés cuenta?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
