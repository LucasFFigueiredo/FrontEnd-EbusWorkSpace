import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { checkInAction, createReservationAction } from "@/core/actions/booking.actions";

export function useCheckinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [status, setStatus] = useState("locating");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!id) {
      setStatus("error");
      setErrorMessage("ID do espaço não fornecido no QR Code.");
      return;
    }
    startCheckinProcess();
  }, [id]);

  const startCheckinProcess = () => {
    setStatus("locating");
    setErrorMessage("");

    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setStatus("processing");

        try {
          await checkInAction({ spaceId: id!, userLatitude: latitude, userLongitude: longitude });
          setStatus("success");
          toast.success("Check-in validado com sucesso!");
        } catch (error: any) {
          const msg = error.message || "Falha ao validar reserva.";

          if (msg.startsWith("FREE_DESK|")) {
            setStatus("free_desk");
            setErrorMessage(msg.split("|")[1]);
          } else if (msg.startsWith("FREE_ROOM|")) {
            setStatus("free_room");
            setErrorMessage(msg.split("|")[1]);
          } else {
            setStatus("error");
            setErrorMessage(msg);
          }
        }
      },
      () => {
        setStatus("error");
        setErrorMessage("Permissão de localização negada ou falha ao obter GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleQuickDeskBooking = async () => {
    if (!id || !coords) return;
    setIsSubmitting(true);

    try {
      const now = new Date();
      const end = new Date();
      end.setHours(18, 0, 0, 0);

      if (now.getHours() >= 18) end.setHours(23, 59, 0, 0);

      await createReservationAction({
        spaceId: id,
        startTime: now.toISOString(),
        endTime: end.toISOString(),
      });

      await checkInAction({ spaceId: id, userLatitude: coords.lat, userLongitude: coords.lng });

      setStatus("success");
      toast.success("Mesa reservada e check-in concluído!");
    } catch (error: any) {
      const msg = error.message || "Falha ao validar reserva.";

      if (msg.includes("FREE_DESK|")) {
        setStatus("free_desk");
        setErrorMessage(msg.split("FREE_DESK|")[1]);
      } else if (msg.includes("FREE_ROOM|")) {
        setStatus("free_room");
        setErrorMessage(msg.split("FREE_ROOM|")[1]);
      } else {
        setStatus("error");
        setErrorMessage(msg);
      }
    }
  };

  const retry = () => startCheckinProcess();
  const goHome = () => router.push("/");
  const goToRoomBooking = () => router.push("/book/room");

  return {
    status,
    errorMessage,
    isSubmitting,
    retry,
    goHome,
    goToRoomBooking,
    handleQuickDeskBooking,
  };
}
