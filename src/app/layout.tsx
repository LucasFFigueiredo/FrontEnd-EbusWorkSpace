import type { Metadata } from "next";
import "../styles.css";
import { Providers } from "./providers";
import { Header } from "@/shared/components/Header";

export const metadata: Metadata = {
  title: {
    default: "E-bus WorkSpace — Reserva de Salas e Mesas",
    template: "%s — E-bus WorkSpace",
  },
  description: "Agende salas de reunião e mesas de trabalho.",
  authors: [{ name: "EstagJCA" }],
  openGraph: {
    title: "E-bus WorkSpace — Reserva de Salas e Mesas",
    description: "Agende salas de reunião e mesas de trabalho.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="overflow-x-hidden bg-background text-foreground">
        <Providers>
          <div className="min-h-screen flex flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 w-full max-w-[100vw]">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
