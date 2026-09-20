import type { Metadata } from "next";
import { HomePage } from "@/features/booking/pages/HomePage";
import { cookies } from "next/headers";
import { serverFetch } from "@/core/services/serverApi";
import type { ReservationDto, SpaceDto } from "@/core/models/booking.types";
import { toLocalISOString } from "@/core/utils/date.utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "E-Bus WorkSpace",
  description: "Plataforma de agendamento de salas e mesas com validação por QR Code.",
};

export type MappedBooking = ReservationDto & {
  spaceType: string;
  floorName: string;
  spaceName: string;
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ebus_token")?.value;

  let todayBooking: MappedBooking | null = null;

  if (token) {
    try {
      const payloadBase64Url = token.split(".")[1];
      const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedJson = Buffer.from(base64, "base64").toString("utf-8");
      const decoded = JSON.parse(decodedJson);
      const userId = decoded.sub || decoded.nameid;

      const [reservations, spaces] = await Promise.all([
        serverFetch<ReservationDto[]>(`/api/Reservations/user/${userId}`),
        serverFetch<SpaceDto[]>("/api/Spaces"),
      ]);

      const todayStr = toLocalISOString(new Date());

      const todayRes = reservations.find(
        (r) => r.startTime.startsWith(todayStr) && r.status !== "Canceled"
      );

      if (todayRes) {
        const space = spaces.find((s) => s.id === todayRes.spaceId);
        todayBooking = {
          ...todayRes,
          spaceType: space?.type || "Desk",
          floorName: space ? `${space.floor}º Andar` : "Andar desconhecido",
          spaceName: space?.name || "Espaço desconhecido",
        };
      }
    } catch (error) {
      console.error("[Home Page] Erro ao buscar reservas de hoje:", error);
    }
  }

  return <HomePage todayBooking={todayBooking} />;
}
