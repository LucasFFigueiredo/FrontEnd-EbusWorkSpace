"use client";

import { useMemo } from "react";
import { useUser } from "@/core/services/user.service";
import { useRoomBookingPage } from "../hooks/useRoomBookingPage";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import {
  Building2,
  DoorOpen,
  Clock,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Check,
  Users,
  Info,
} from "lucide-react";
import { cn } from "@/core/utils/cn";
import type { SpaceDto } from "@/core/models/booking.types";

const parseLocalDateStr = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const fmtBR = (d: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

interface RoomBookingPageProps {
  initialParams: { date: string; start: string; end: string; floor: string };
  floors: { id: string; name: string }[];
  allSpaces: SpaceDto[];
  availableRooms: SpaceDto[];
}

export default function RoomBookingPage({
  initialParams,
  floors,
  allSpaces,
  availableRooms,
}: RoomBookingPageProps) {
  const user = useUser();

  const {
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
  } = useRoomBookingPage(initialParams);

  const roomAvailabilityList = useMemo(() => {
    const roomsInFloor = allSpaces.filter(
      (s) => s.type === "Room" && (!floorId || floorId === "all" || s.floor.toString() === floorId),
    );

    return roomsInFloor.map((room) => {
      const isAvailable = availableRooms.some((ar) => ar.id === room.id);

      let parsedResources: string[] = [];
      if (room.resources) {
        try {
          parsedResources = JSON.parse(room.resources);
        } catch {
          parsedResources = [room.resources];
        }
      }

      return {
        room,
        floorName: `${room.floor}º Andar`,
        isAvailable,
        parsedResources,
      };
    });
  }, [allSpaces, availableRooms, floorId]);

  const selectedResource = allSpaces.find((r) => r.id === resourceId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Reserva de Salas</h1>
      <p className="text-muted-foreground mt-1">
        Informe a data e horário da reunião para visualizar as salas disponíveis.
      </p>

      <form
        onSubmit={handleStartBooking}
        className="mt-8 grid gap-6 rounded-xl border bg-card p-6 card-shadow"
      >
        <div className="grid gap-6">
          <div className="border-b pb-4">
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="grid gap-1.5">
                <Label htmlFor="meeting-date" className="flex items-center gap-1 font-medium">
                  <CalendarDays className="h-4 w-4" /> Data
                </Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => {
                    setMeetingDate(e.target.value);
                    setResourceId("");
                  }}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="start-time" className="flex items-center gap-1 font-medium">
                  <Clock className="h-4 w-4" /> Início
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    setResourceId("");
                  }}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="end-time" className="flex items-center gap-1 font-medium">
                  <Clock className="h-4 w-4" /> Fim
                </Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  min={startTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    setResourceId("");
                  }}
                  required
                />
              </div>
            </div>

            <div className="grid gap-1.5 mt-4">
              <Label className="flex items-center gap-1 font-medium">
                <Building2 className="h-4 w-4" />
                Andar
              </Label>
              <div className="flex rounded-lg border bg-muted/40 p-1 gap-1">
                {[
                  { value: "2", label: "2º Andar" },
                  { value: "13", label: "13º Andar" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setFloorId(opt.value);
                      setResourceId("");
                    }}
                    className={cn(
                      "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 text-center",
                      floorId === opt.value
                        ? "bg-card text-primary shadow-sm border border-border font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 mt-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center gap-2">
                <DoorOpen className="h-5 w-5 text-primary" /> Salas Disponíveis
              </Label>
            </div>

            {roomAvailabilityList.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground bg-muted/20">
                Nenhuma sala encontrada para este filtro.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {roomAvailabilityList.map(({ room, floorName, isAvailable, parsedResources }) => {
                  const isSelected = resourceId === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => isAvailable && setResourceId(room.id)}
                      className={cn(
                        "relative flex flex-col justify-between rounded-xl border p-4 transition shadow-xs cursor-pointer select-none",
                        isAvailable
                          ? isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary"
                            : "bg-card hover:border-primary hover:shadow-md"
                          : "bg-muted/40 opacity-70 cursor-not-allowed border-border",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground text-base flex items-center gap-1.5">
                              {room.name}{" "}
                              {isSelected && (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                  <Check className="h-3 w-3 stroke-3" />
                                </span>
                              )}
                            </h3>
                            <span className="text-xs text-muted-foreground">{floorName}</span>
                          </div>
                        </div>
                        <div>
                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                              <CheckCircle2 className="h-3 w-3" /> Disponível
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                              <AlertCircle className="h-3 w-3" /> Reservada/Bloqueada
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-0.5 font-medium text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" /> {room.capacity} lugares
                        </span>
                      </div>

                      {parsedResources.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {parsedResources.map((resItem, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              {resItem}
                            </span>
                          ))}
                        </div>
                      )}

                      {room.requiresApproval && (
                        <div className="mt-3">
                          <span className="inline-flex items-center gap-1 rounded-md border border-warning/40 bg-warning/10 px-2 py-0.5 text-[11px] font-medium text-warning">
                            <ShieldAlert className="h-3 w-3" /> Requer aprovação
                          </span>
                        </div>
                      )}

                      {}
                      <div className="mt-4 pt-3 border-t border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                          Agenda do Dia
                        </p>

                        {(() => {
                          const roomAgenda =
                            dailyAgenda?.filter((r: any) => r.spaceId === room.id) || [];
                          roomAgenda.sort(
                            (a: any, b: any) =>
                              new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
                          );

                          if (roomAgenda.length === 0) {
                            return (
                              <p className="text-xs font-medium text-success">Livre o dia todo</p>
                            );
                          }

                          return (
                            <div className="flex flex-col gap-1.5">
                              {roomAgenda.map((bk: any) => {
                                const formatTime = (isoString: string) => {
                                  return new Date(isoString).toLocaleTimeString("pt-BR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  });
                                };
                                return (
                                  <div
                                    key={bk.id}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                  >
                                    <Clock className="h-3 w-3 text-warning shrink-0" />
                                    <span className="font-semibold tabular-nums text-foreground/80">
                                      {formatTime(bk.startTime)} - {formatTime(bk.endTime)}
                                    </span>
                                    <span className="truncate max-w-[140px] text-muted-foreground">
                                      ({bk.userName})
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                      {}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 sm:px-4 text-xs sm:text-sm text-foreground/80 shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Info className="h-4 w-4" />
          </div>
          <p className="leading-snug text-muted-foreground">
            Para reservar salas com mais de <strong className="font-semibold text-foreground">3h de duração</strong>, entrar em contato com os <strong className="font-semibold text-primary">Facilities</strong>.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full mt-3"
          size="lg"
          disabled={!resourceId || isSubmitting}
        >
          {isSubmitting ? "Processando..." : "Confirmar agendamento"}
        </Button>
      </form>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar reserva de Sala</DialogTitle>
            <DialogDescription>
              Revise as informações da reunião antes de confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <p>
              <strong>Sala:</strong> {selectedResource?.name}
            </p>
            <p>
              <strong>Data:</strong> {meetingDate ? fmtBR(parseLocalDateStr(meetingDate)) : ""}
            </p>
            <p>
              <strong>Horário:</strong> {startTime} às {endTime}
            </p>
            {selectedResource?.requiresApproval && (
              <Alert className="mt-4 border-warning/50 bg-warning/10 text-warning">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <p className="text-xs mt-1">
                  Esta sala exige a aprovação do time de Facilities. A reserva ficará como
                  "Pendente" até a liberação.
                </p>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isSubmitting}
            >
              Voltar
            </Button>

            <Button type="button" onClick={confirmRoomBooking} disabled={isSubmitting}>
              {isSubmitting ? "Confirmando..." : "Confirmar Agendamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
