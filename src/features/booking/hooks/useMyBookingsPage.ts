import { useState } from "react";
import { toast } from "sonner";
import { cancelBookingAction, requestExtensionAction } from "@/core/actions/booking.actions";

export function fmtDateOnly(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function fmtRoomPeriod(startISO: string, endISO: string) {
  const startDate = new Date(startISO);
  const endDate = new Date(endISO);
  const dateStr = startDate.toLocaleDateString("pt-BR");
  const startTimeStr = startDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = endDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${dateStr}, ${startTimeStr} – ${endTimeStr}`;
}

export function useMyBookingsPage() {
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [extensionBookingId, setExtensionBookingId] = useState<string | null>(null);
  const [extensionMinutes, setExtensionMinutes] = useState<string>("30");
  const [extensionJustification, setExtensionJustification] = useState<string>("");

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsSubmitting(true);
    try {
      await cancelBookingAction(bookingToCancel);
      toast.success("Agendamento cancelado com sucesso.");
      setBookingToCancel(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar reserva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestExtension = async () => {
    if (!extensionBookingId) return;
    if (!extensionJustification.trim()) {
      toast.error("Por favor, preencha a justificativa para a extensão.");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestExtensionAction({
        reservationId: extensionBookingId,
        additionalMinutes: parseInt(extensionMinutes, 10),
        justification: extensionJustification,
      });

      toast.success("Pedido de extensão enviado aos Facilities para aprovação.");
      setExtensionBookingId(null);
      setExtensionJustification("");
      setExtensionMinutes("30");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao solicitar extensão de tempo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    bookingToCancel,
    setBookingToCancel,
    handleConfirmCancel,
    extensionBookingId,
    setExtensionBookingId,
    extensionMinutes,
    setExtensionMinutes,
    extensionJustification,
    setExtensionJustification,
    handleRequestExtension,
    isSubmitting,
  };
}
