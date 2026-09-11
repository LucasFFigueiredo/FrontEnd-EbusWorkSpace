import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/core/services/user.service";
import { toast } from "sonner";
import {
  createReservationAction,
  getDailyRoomReservationsAction,
} from "@/core/actions/booking.actions";
import { validateBookingRange } from "@/core/services/booking.service";

const parseLocalDateStr = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const combine = (date: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const c = new Date(date);
  c.setHours(h || 0, m || 0, 0, 0);
  return c;
};

export function useRoomBookingPage(initialParams: {
  date: string;
  start: string;
  end: string;
  floor: string;
}) {
  const router = useRouter();
  const user = useUser();
  const isPrivileged = user.access === "admin" || user.access === "facilities";

  const [meetingDate, setMeetingDate] = useState(
    initialParams.date || new Date().toISOString().slice(0, 10),
  );
  const [startTime, setStartTime] = useState(initialParams.start || "09:00");
  const [endTime, setEndTime] = useState(initialParams.end || "10:00");
  const [floorId, setFloorId] = useState(initialParams.floor || "all");

  const [resourceId, setResourceId] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dailyAgenda, setDailyAgenda] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchAgenda() {
      if (!meetingDate) return;
      const data = await getDailyRoomReservationsAction(meetingDate);
      if (isMounted) setDailyAgenda(data);
    }
    fetchAgenda();
    return () => {
      isMounted = false;
    };
  }, [meetingDate]);

  function handleStartBooking(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!meetingDate) return toast.error("Selecione a data da reunião");
    if (!startTime || !endTime) return toast.error("Selecione o horário");
    if (!resourceId) return toast.error("Selecione uma sala de reunião");

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const diffMinutes = endH * 60 + endM - (startH * 60 + startM);

    if (diffMinutes <= 0) return toast.error("O horário de término deve ser maior que o início.");

    if (!isPrivileged && diffMinutes > 180) {
      return toast.error("O tempo máximo permitido para colaboradores é de 3 horas.");
    }

    setShowConfirm(true);
  }

  async function confirmRoomBooking() {
    setIsSubmitting(true);
    try {
      const dateObj = parseLocalDateStr(meetingDate);
      const startISO = combine(dateObj, startTime).toISOString();
      const endISO = combine(dateObj, endTime).toISOString();

      const err = validateBookingRange(startISO, endISO);
      if (err) {
        toast.error(err);
        setIsSubmitting(false);
        return;
      }

      await createReservationAction({
        spaceId: resourceId,
        startTime: startISO,
        endTime: endISO,
      });

      toast.success("Reserva de sala confirmada com sucesso!");
      setShowConfirm(false);
      router.push("/bookings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao reservar sala.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    meetingDate,
    setMeetingDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    floorId,
    setFloorId,
    resourceId,
    setResourceId,
    showConfirm,
    setShowConfirm,
    isSubmitting,
    dailyAgenda,
    handleStartBooking,
    confirmRoomBooking,
  };
}
