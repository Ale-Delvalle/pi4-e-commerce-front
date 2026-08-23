import type { NextConfig } from "next";

// `npm run dev` usa `next dev --webpack` (ver package.json) en vez de Turbopack.
// Motivo: en esta carpeta de proyecto (Windows, bajo Desktop\...), Turbopack entra
// en un loop de recarga completa infinito específicamente en /auth/register — el
// propio cliente HMR de Next fuerza el reload una y otra vez sin ningún error de
// React ni de red de por medio. Se descartó como causa cualquier código de la app:
// se bisectearon los 17 commits del repo en un git worktree aislado y NINGUNO
// reprodujo el bug ahí, con el mismo código que sí falla en esta carpeta real.
// Sospecha: un proceso de Windows (indexador de búsqueda o Defender en tiempo
// real) tocando archivos de esta carpeta interfiere con el watcher de Turbopack.
// `npm run dev:turbo` sigue disponible para probar Turbopack de nuevo (por
// ejemplo si se mueve el proyecto fuera de Desktop o se agrega una exclusión
// de Defender para esta carpeta).
const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.stuff.tv",
      },
    ],
  },
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/auth/register",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
