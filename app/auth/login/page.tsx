import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Iniciar sesión — Astro Tech" };

export default function LoginPage() {
  return (
    <div className="flex-1 bg-gradient-to-br from-green-950 to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🌿</div>
          <CardTitle className="text-2xl">Astro Tech</CardTitle>
          <CardDescription>Iniciá sesión en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-32 animate-pulse bg-neutral-100 rounded" />}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
