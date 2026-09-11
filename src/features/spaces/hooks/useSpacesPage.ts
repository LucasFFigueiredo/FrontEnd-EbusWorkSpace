import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/core/services/user.service";
import { approveReservationAction, cancelBookingAction } from "@/core/actions/booking.actions";
import { blockResourceAction, unblockResourceAction } from "@/core/actions/space.actions";
import { useRouter } from "next/navigation";

export function fmt(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function useSpacesPage(
  rooms: any[],
  upcomingBookings: any[],
  pendingApprovals: any[],
  extensionRequests: any[],
) {
  const user = useUser();
  const router = useRouter();
  const isAllowed = user.access === "facilities" || user.access === "admin";

  const [blockingId, setBlockingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [blockTo, setBlockTo] = useState("");

  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // 👇 NOVOS ESTADOS: Para o Modal de Negação VIP ficar bonito
  const [rejectVipId, setRejectVipId] = useState<string | null>(null);
  const [rejectVipReason, setRejectVipReason] = useState("");

  // ============================================================================
  // LÓGICA DE MEMÓRIA (LOCALSTORAGE) PARA ESCONDER APROVAÇÕES
  // ============================================================================
  const [handledApprovals, setHandledApprovals] = useState<string[]>([]);

  useEffect(() => {
    try {
      const archivedKeys = JSON.parse(localStorage.getItem("handled_extensions") || "[]");
      setHandledApprovals(archivedKeys);
    } catch (e) {}
  }, []);

  const markAsHandled = (reservationId: string) => {
    try {
      const archivedKeys = JSON.parse(localStorage.getItem("handled_extensions") || "[]");
      if (!archivedKeys.includes(reservationId)) {
        archivedKeys.push(reservationId);
        localStorage.setItem("handled_extensions", JSON.stringify(archivedKeys));
        setHandledApprovals([...archivedKeys]);
      }
    } catch (e) {}
  };

  const filteredExtensions = useMemo(() => {
    return extensionRequests.filter((req) => !handledApprovals.includes(req.reservationId));
  }, [extensionRequests, handledApprovals]);

  const filteredApprovals = useMemo(() => {
    return pendingApprovals.filter((req) => !handledApprovals.includes(req.id));
  }, [pendingApprovals, handledApprovals]);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isDateDialogOpen, setIsDateDialogOpen] = useState<boolean>(false);
  const [tempStart, setTempStart] = useState<string>("");
  const [tempEnd, setTempEnd] = useState<string>("");

  const handleOpenDateDialog = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setIsDateDialogOpen(true);
  };

  const handleApplyDateRange = () => {
    setStartDate(tempStart);
    setEndDate(tempEnd);
    setIsDateDialogOpen(false);
  };

  const handleClearDateRange = () => {
    setTempStart("");
    setTempEnd("");
    setStartDate("");
    setEndDate("");
    setIsDateDialogOpen(false);
  };

  const applyPreset = (preset: "7days" | "30days" | "thisMonth" | "thisQuarter") => {
    const now = new Date();
    const endDateStr = now.toISOString().slice(0, 10);
    let start = new Date();

    if (preset === "7days") start.setDate(now.getDate() - 7);
    else if (preset === "30days") start.setDate(now.getDate() - 30);
    else if (preset === "thisMonth") start = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (preset === "thisQuarter") {
      const qMonth = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), qMonth, 1);
    }

    setTempStart(start.toISOString().slice(0, 10));
    setTempEnd(endDateStr);
  };

  const filteredBookings = useMemo(() => {
    if (!startDate && !endDate) return upcomingBookings;

    const startMs = startDate ? new Date(`${startDate}T00:00:00`).getTime() : 0;
    const endMs = endDate ? new Date(`${endDate}T23:59:59.999`).getTime() : Infinity;

    return upcomingBookings.filter((b) => {
      const t = new Date(b.startTime).getTime();
      return t >= startMs && t <= endMs;
    });
  }, [upcomingBookings, startDate, endDate]);

  const blockingResource = rooms.find((r) => r.id === blockingId);
  const cancelBooking = upcomingBookings.find((b) => b.id === cancelBookingId);
  const cancelResource = cancelBooking ? rooms.find((r) => r.id === cancelBooking.spaceId) : null;

  async function confirmBlock() {
    if (!blockingId) return;
    if (!reason.trim()) return toast.error("Informe o motivo do bloqueio");
    if (!blockTo) return toast.error("Informe a data final da inativação");

    const toDate = new Date(`${blockTo}T23:59:59`);
    if (toDate.getTime() < new Date().getTime())
      return toast.error("A data final não pode estar no passado");

    try {
      await blockResourceAction(
        blockingId,
        reason.trim(),
        new Date().toISOString(),
        toDate.toISOString(),
      );
      toast.success("Espaço bloqueado com sucesso");
      setBlockingId(null);
    } catch (e) {
      toast.error("Erro ao bloquear espaço");
    }
  }

  async function handleUnblock(spaceId: string) {
    try {
      await unblockResourceAction(spaceId);
      toast.success("Espaço reativado com sucesso");
    } catch (e) {
      toast.error("Erro ao reativar espaço");
    }
  }

  async function confirmForceCancel() {
    if (!cancelBookingId) return;
    try {
      await cancelBookingAction(cancelBookingId);
      toast.success("Reserva cancelada com sucesso.");
      setCancelBookingId(null);
    } catch (e) {
      toast.error("Erro ao cancelar a reserva.");
    }
  }

  async function handleApproveVip(id: string) {
    try {
      await approveReservationAction(id, true);
      toast.success("Aprovado com sucesso!");
      markAsHandled(id);
    } catch (e) {
      toast.error("Erro ao aprovar.");
    }
  }

  async function handleRejectVip(id: string, justification: string) {
    try {
      await approveReservationAction(id, false, justification);
      toast.success("Solicitação negada.");
      markAsHandled(id);
    } catch (e) {
      toast.error("Erro ao negar.");
    }
  }

  async function confirmRejectVip() {
    if (!rejectVipId) return;
    if (!rejectVipReason.trim()) return toast.error("Informe o motivo da negação.");

    try {
      await approveReservationAction(rejectVipId, false, rejectVipReason.trim());
      toast.success("Solicitação negada com sucesso.");
      markAsHandled(rejectVipId);
      setRejectVipId(null);
      setRejectVipReason("");
    } catch (e) {
      toast.error("Erro ao negar a solicitação.");
    }
  }

  return {
    isAllowed,
    blockingId,
    setBlockingId,
    reason,
    setReason,
    blockTo,
    setBlockTo,
    cancelBookingId,
    setCancelBookingId,
    cancelReason,
    setCancelReason,
    rejectVipId,
    setRejectVipId,
    rejectVipReason,
    setRejectVipReason,

    blockingResource,
    cancelBooking,
    cancelResource,
    filteredBookings,
    filteredExtensions,
    filteredApprovals,

    startDate,
    endDate,
    isDateDialogOpen,
    setIsDateDialogOpen,
    tempStart,
    setTempStart,
    tempEnd,
    setTempEnd,
    handleOpenDateDialog,
    handleApplyDateRange,
    handleClearDateRange,
    applyPreset,

    confirmBlock,
    handleUnblock,
    confirmForceCancel,
    handleApproveVip,
    handleRejectVip,
    confirmRejectVip,
  };
}
