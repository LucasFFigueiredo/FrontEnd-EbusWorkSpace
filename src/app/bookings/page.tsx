import { MyBookingsPage } from "@/features/booking/pages/MyBookingsPage";
import { serverFetch } from "@/core/services/serverApi";
import { cookies } from "next/headers";
import type { ReservationDto, SpaceDto } from "@/core/models/booking.types";

export const dynamic = "force-dynamic";

export type MappedBooking = ReservationDto & {
  spaceType: string;
  floorName: string;
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ebus_token")?.value;

  if (!token) return null;

  const payloadBase64 = token.split(".")[1];
  const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
  const decoded = JSON.parse(decodedJson);
  const userId = decoded.sub || decoded.nameid;

  const [reservations, spaces] = await Promise.all([
    serverFetch<ReservationDto[]>(`/api/Reservations/user/${userId}`),
    serverFetch<SpaceDto[]>("/api/Spaces"),
  ]);

  const mappedBookings: MappedBooking[] = reservations.map((res) => {
    const space = spaces.find((s) => s.id === res.spaceId);
    return {
      ...res,
      spaceType: space?.type || "Desk",
      floorName: space ? `${space.floor}º Andar` : "Andar desconhecido",
    };
  });

  return <MyBookingsPage initialBookings={mappedBookings} />;
}
