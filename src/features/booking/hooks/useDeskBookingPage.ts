import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createBatchReservationAction,
  getWeekOccupancyAction,
} from "@/core/actions/booking.actions";

export const WEEKDAYS = [
  { idx: 1, short: "SEG", long: "Segunda" },
  { idx: 2, short: "TER", long: "Terça" },
  { idx: 3, short: "QUA", long: "Quarta" },
  { idx: 4, short: "QUI", long: "Quinta" },
  { idx: 5, short: "SEX", long: "Sexta" },
];
export const MAX_DAYS = 3;

export function getTodayWeekdayIdx(): number {
  const dow = new Date().getDay();
  return dow >= 1 && dow <= 5 ? dow : 1;
}
export function startOfWeekMonday(d: Date) {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = c.getDay() === 0 ? -6 : 1 - c.getDay();
  c.setDate(c.getDate() + diff);
  return c;
}
export function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
const combine = (date: Date, hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const c = new Date(date);
  c.setHours(h || 0, m || 0, 0, 0);
  return c;
};

export function useDeskBookingPage(initialFloor: string) {
  const router = useRouter();

  const [floorId, setFloorId] = useState<string>(initialFloor || "2");
  const [resourceId, setResourceId] = useState<string>("");
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeekMonday(new Date()));
  const [selectedDays, setSelectedDays] = useState<number[]>([getTodayWeekdayIdx()]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dayResourceOverride, setDayResourceOverride] = useState<Record<number, string>>({});
  const [batchErrors, setBatchErrors] = useState<string[]>([]);

  const [occupancies, setOccupancies] = useState<Record<number, any[]>>({});

  const weekEnd = useMemo(() => addDays(weekStart, 4), [weekStart]);

  const lastFetchKey = useRef<string>("");

  useEffect(() => {
    let isMounted = true;

    async function fetchAllOccupancies() {
      if (!floorId) return;

      const fetchKey = `${floorId}-${weekStart.toISOString()}`;

      if (lastFetchKey.current === fetchKey) return;
      lastFetchKey.current = fetchKey;

      try {
        const weekData = await getWeekOccupancyAction(Number(floorId), weekStart.toISOString());

        if (isMounted) {
          setOccupancies(weekData);
        }
      } catch (error) {
        console.error("Erro ao buscar a semana:", error);
        lastFetchKey.current = "";
      }
    }

    fetchAllOccupancies();

    return () => {
      isMounted = false;
    };
  }, [floorId, weekStart]);

  function toggleDay(idx: number) {
    setSelectedDays((prev) => {
      if (prev.includes(idx)) return prev.filter((d) => d !== idx);
      if (prev.length >= MAX_DAYS) {
        toast.error(`Máximo de ${MAX_DAYS} dias por semana`);
        return prev;
      }
      return [...prev, idx].sort((a, b) => a - b);
    });
  }

  function handleStartBooking() {
    if (!floorId) return toast.error("Selecione o andar");
    if (selectedDays.length === 0) return toast.error("Selecione pelo menos um dia");
    if (!resourceId) return toast.error("Selecione a mesa no mapa principal");
    setBatchErrors([]);
    setShowConfirm(true);
  }

  async function confirmBatchBooking() {
    setIsSubmitting(true);
    setBatchErrors([]);

    try {
      const reservations = selectedDays.map((idx) => {
        const day = addDays(weekStart, idx - 1);
        const startISO = combine(day, "08:00").toISOString();
        const endISO = combine(day, "18:00").toISOString();

        const spaceId = dayResourceOverride[idx] || resourceId;

        return { spaceId, startTime: startISO, endTime: endISO };
      });

      const result = await createBatchReservationAction(reservations);

      if (result.isPartial) {
        toast.warning(`Algumas mesas já estavam ocupadas (${result.successfulCount} efetuadas).`);
        setBatchErrors(result.errors);
      } else if (result.success && result.successfulCount > 0) {
        toast.success(`Reserva criada com sucesso para ${result.successfulCount} dia(s)!`);
        setShowConfirm(false);
        router.push("/bookings");
      } else {
        toast.error("Nenhuma reserva pôde ser concluída.");
        setBatchErrors(result.errors);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao processar lote.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    floorId,
    setFloorId,
    resourceId,
    setResourceId,
    weekStart,
    setWeekStart,
    weekEnd,
    selectedDays,
    toggleDay,
    showConfirm,
    setShowConfirm,
    isSubmitting,
    dayResourceOverride,
    setDayResourceOverride,
    batchErrors,
    occupancies,
    handleStartBooking,
    confirmBatchBooking,
  };
}
