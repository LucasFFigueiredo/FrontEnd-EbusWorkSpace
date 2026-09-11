import type { Metadata } from "next";
import { HomePage } from "@/features/booking/pages/HomePage";

export const metadata: Metadata = {
  title: "E-Bus WorkSpace",
  description: "Plataforma de agendamento de salas e mesas com validação por QR Code.",
};

export default function Page() {
  return <HomePage />;
}
