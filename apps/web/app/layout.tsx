import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERP/POS Web",
  description: "ERP/POS modular preparado para PWA y futuras aplicaciones móviles.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
