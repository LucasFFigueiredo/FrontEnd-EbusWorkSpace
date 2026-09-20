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

export interface FloorAvailability {
  floor: number;
  totalDesks: number;
  availableDesks: number;
}

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ebus_token")?.value;

  let todayBooking: MappedBooking | null = null;
  let weeklyBookings: boolean[] = [false, false, false, false, false];
  let floorAvailability: FloorAvailability[] = [];

  if (token) {
    try {
      const payloadBase64Url = token.split(".")[1];
      const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedJson = Buffer.from(base64, "base64").toString("utf-8");
      const decoded = JSON.parse(decodedJson);
      const userId = decoded.sub || decoded.nameid;

      const [userReservations, spaces, allReservations] = await Promise.all([
        serverFetch<ReservationDto[]>(`/api/Reservations/user/${userId}`),
        serverFetch<SpaceDto[]>("/api/Spaces"),
        serverFetch<ReservationDto[]>("/api/Reservations"),
      ]);

      const now = new Date();
      const todayStr = toLocalISOString(now);

      const todayRes = userReservations.find(
        (r) => r.startTime.startsWith(todayStr) && r.status !== "Canceled" && r.status !== "NoShow"
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

      const currentDayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1));

      for (let i = 0; i < 5; i++) {
        const targetDate = new Date(monday);
        targetDate.setDate(monday.getDate() + i);
        const dateStr = toLocalISOString(targetDate);

        const hasBooking = userReservations.some(
          (r) => r.startTime.startsWith(dateStr) && r.status !== "Canceled" && r.status !== "NoShow"
        );
        weeklyBookings[i] = hasBooking;
      }

      const deskSpaces = spaces.filter((s) => s.type === "Desk" && s.active !== false && !s.isBlocked);
      const floors = Array.from(new Set(deskSpaces.map((s) => s.floor))).sort((a, b) => a - b);

      const todayActiveReservations = allReservations.filter(
        (r) => r.startTime.startsWith(todayStr) && r.status !== "Canceled" && r.status !== "NoShow"
      );

      floorAvailability = floors.map((floor) => {
        const floorDesks = deskSpaces.filter((s) => s.floor === floor);
        const totalDesks = floorDesks.length;
        const floorDeskIds = new Set(floorDesks.map((s) => s.id));

        const bookedDesksCount = todayActiveReservations.filter((r) => floorDeskIds.has(r.spaceId)).length;
        const availableDesks = Math.max(0, totalDesks - bookedDesksCount);

        return {
          floor,
          totalDesks,
          availableDesks,
        };
      });

    } catch (error) {
      console.error("[Home Page] Erro ao buscar dados do dashboard:", error);
    }
  }

  return (
    <HomePage
      todayBooking={todayBooking}
      weeklyBookings={weeklyBookings}
      floorAvailability={floorAvailability}
    />
  );
}
