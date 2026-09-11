"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMyBookingsPage, fmtDateOnly, fmtRoomPeriod } from "../hooks/useMyBookingsPage";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Trash2,
  CheckCircle2,
  Armchair,
  DoorOpen,
  Calendar,
  Clock,
  AlertTriangle,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import type { MappedBooking } from "@/app/bookings/page";

interface MyBookingsPageProps {
  initialBookings: MappedBooking[];
}

export function MyBookingsPage({ initialBookings }: MyBookingsPageProps) {
  const {
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
  } = useMyBookingsPage();

  const { displayActive, displayHistory } = useMemo(() => {
    const now = new Date().getTime();

    const rawActive = initialBookings.filter((b) =>
      ["Pending", "CheckedIn", "AwaitingApproval"].includes(b.status),
    );
    const rawHistory = initialBookings.filter((b) =>
      ["Canceled", "NoShow", "Completed"].includes(b.status),
    );

    const validActive = rawActive.filter((b) => new Date(b.endTime).getTime() > now);

    const expiredActive = rawActive.filter((b) => new Date(b.endTime).getTime() <= now);

    const mergedHistory = [...rawHistory, ...expiredActive];

    mergedHistory.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return { displayActive: validActive, displayHistory: mergedHistory };
  }, [initialBookings]);

  const renderBookingCards = (bookingsList: MappedBooking[]) => {
    if (bookingsList.length === 0) {
      return (
        <div className="py-10 mt-4 text-center border border-dashed rounded-xl bg-muted/20 text-sm text-muted-foreground">
          Nenhuma reserva encontrada nesta categoria.
        </div>
      );
    }

    return (
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {bookingsList.map((b) => {
          const isRoom = b.spaceType === "Room";
          const canCancel = b.status === "Pending" || b.status === "AwaitingApproval";

          const isNotExpired = new Date(b.endTime).getTime() > new Date().getTime();
          const canExtend =
            isRoom && (b.status === "CheckedIn" || b.status === "Pending") && isNotExpired;

          return (
            <article
              key={b.id}
              className={`rounded-xl border bg-card p-5 flex flex-col justify-between card-shadow ${b.status === "Canceled" || b.status === "NoShow" || !isNotExpired ? "opacity-60" : ""}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{b.spaceName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {b.floorName} · {isRoom ? "Sala de Reunião" : "Mesa de Trabalho"}
                    </p>
                  </div>
                  {isRoom ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                      <DoorOpen className="h-3 w-3" /> Sala
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
                      <Armchair className="h-3 w-3" /> Mesa
                    </span>
                  )}
                </div>

                <div className="mt-3 text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {isRoom ? fmtRoomPeriod(b.startTime, b.endTime) : fmtDateOnly(b.startTime)}
                </div>

                <p className="text-xs mt-2 text-muted-foreground">Por: {b.userName}</p>

                {}
                {!isNotExpired && b.status !== "Canceled" && b.status !== "NoShow" ? (
                  <p className="mt-3 text-xs text-muted-foreground">Concluído</p>
                ) : (
                  <>
                    {b.status === "CheckedIn" && (
                      <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Check-in realizado
                      </p>
                    )}
                    {b.status === "Pending" && (
                      <p className="mt-3 text-xs text-warning font-medium">
                        <AlertTriangle className="inline h-3.5 w-3.5 mr-1" /> Aguardando check-in
                      </p>
                    )}
                    {b.status === "AwaitingApproval" && (
                      <p className="mt-3 text-xs text-blue-600 font-medium">
                        <ShieldAlert className="inline h-3.5 w-3.5 mr-1" /> Aguardando aprovação
                      </p>
                    )}
                    {b.status === "Canceled" && (
                      <p className="mt-3 text-xs text-destructive font-medium">
                        <XCircle className="inline h-3.5 w-3.5 mr-1" /> Cancelada
                      </p>
                    )}
                    {b.status === "NoShow" && (
                      <p className="mt-3 text-xs text-destructive font-medium">
                        <XCircle className="inline h-3.5 w-3.5 mr-1" /> No-Show
                      </p>
                    )}
                    {b.status === "Completed" && (
                      <p className="mt-3 text-xs text-muted-foreground">Concluído</p>
                    )}
                  </>
                )}
              </div>

              {(canExtend || canCancel) && (
                <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                  {canExtend && (
                    <Button variant="outline" size="sm" onClick={() => setExtensionBookingId(b.id)}>
                      <Clock className="h-4 w-4 mr-1.5" /> Prolongar
                    </Button>
                  )}
                  {canCancel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBookingToCancel(b.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Cancelar
                    </Button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus agendamentos</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas reservas ativas e histórico.</p>
        </div>
      </div>

      {initialBookings.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed bg-card p-10 text-center">
          <p className="text-muted-foreground">Nenhum agendamento ainda.</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/book/desk" className="text-primary font-medium hover:underline">
              Reservar Mesa →
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/book/room" className="text-primary font-medium hover:underline">
              Reservar Sala →
            </Link>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="ativas" className="w-full mt-8">
          <TabsList className="mb-2">
            <TabsTrigger value="ativas">Ativas ({displayActive.length})</TabsTrigger>
            <TabsTrigger value="historico">Histórico ({displayHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="ativas" className="outline-none">
            {renderBookingCards(displayActive)}
          </TabsContent>

          <TabsContent value="historico" className="outline-none">
            {renderBookingCards(displayHistory)}
          </TabsContent>
        </Tabs>
      )}

      {}
      <AlertDialog
        open={bookingToCancel !== null}
        onOpenChange={(open) => !open && setBookingToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita e a vaga
              será liberada imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} disabled={isSubmitting}>
              {isSubmitting ? "Cancelando..." : "Confirmar Cancelamento"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {}
      <Dialog
        open={extensionBookingId !== null}
        onOpenChange={(isOpen) => !isOpen && setExtensionBookingId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prolongar Reserva</DialogTitle>
            <DialogDescription>
              As salas possuem limite padrão de 3 horas. Solicite tempo extra e aguarde a aprovação
              do time de Facilities.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="extension-time">Tempo adicional necessário</Label>
              <Select value={extensionMinutes} onValueChange={setExtensionMinutes}>
                <SelectTrigger id="extension-time">
                  <SelectValue placeholder="Selecione o tempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">+ 30 Minutos</SelectItem>
                  <SelectItem value="60">+ 1 Hora</SelectItem>
                  <SelectItem value="90">+ 1 Hora e 30 Minutos</SelectItem>
                  <SelectItem value="120">+ 2 Horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="extension-justification">
                Justificativa <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="extension-justification"
                placeholder="Ex: A reunião de diretoria irá atrasar devido a pautas não finalizadas..."
                value={extensionJustification}
                onChange={(e) => setExtensionJustification(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExtensionBookingId(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleRequestExtension} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Solicitar Tempo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
