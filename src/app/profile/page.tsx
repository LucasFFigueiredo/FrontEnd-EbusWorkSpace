import { ProfilePage } from "@/features/auth/pages/ProfilePage";
import { serverFetch } from "@/core/services/serverApi";
import { cookies } from "next/headers";

interface ReservationDto {
  id: string;
  spaceId: string;
  spaceName: string;
  startTime: string;
  endTime: string;
  status: string;
  checkInAt: string | null;
}

interface SpaceDto {
  id: string;
  name: string;
  type: string;
  floor: number;
}

export type MappedProfileBooking = ReservationDto & {
  floorName: string;
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ebus_token")?.value;

  if (!token) return null;

  const payloadBase64 = token.split(".")[1];
  const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
  const decoded = JSON.parse(decodedJson);

  const user = {
    id: decoded.sub || decoded.nameid,
    name: decoded.name || "Usuário",
    email: decoded.email || "",
    role: decoded.role || "Employee",
    sector: decoded.sector || "",
  };

  const [reservations, spaces] = await Promise.all([
    serverFetch<ReservationDto[]>(`/api/Reservations/user/${user.id}`),
    serverFetch<SpaceDto[]>("/api/Spaces"),
  ]);

  const mappedBookings: MappedProfileBooking[] = reservations.map((res) => {
    const space = spaces.find((s) => s.id === res.spaceId);
    return {
      ...res,
      floorName: space ? `${space.floor}º Andar` : "Andar desconhecido",
    };
  });

  return <ProfilePage user={user} bookings={mappedBookings} />;
}
