"use client";

import { useMemo } from "react";
import { useUser } from "@/core/services/user.service";
import { getMaxBookingDate, toLocalISOString } from "@/core/utils/date.utils";
import {
  useDeskBookingPage,
  WEEKDAYS,
  addDays,
  getTodayWeekdayIdx,
} from "../hooks/useDeskBookingPage";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { DeskMap } from "@/features/booking/components/DeskMap";
import {
  Building2,
  Armchair,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/core/utils/cn";
import type { SpaceDto, DeskMapResource } from "@/core/models/booking.types";

const fmtBR = (d: Date) =>
  `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;

interface DeskBookingPageProps {
  initialFloor: string;
  floors: { id: string; name: string }[];
  desks: SpaceDto[];
}

export default function DeskBookingPage({ initialFloor, floors, desks }: DeskBookingPageProps) {
  const user = useUser();

  const {
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
    batchErrors,
    occupancies,
    dayResourceOverride,
    setDayResourceOverride,
    handleStartBooking,
    confirmBatchBooking,
  } = useDeskBookingPage(initialFloor);

  const firstDayIdx = selectedDays.length > 0 ? selectedDays[0] : getTodayWeekdayIdx();
  const firstDayOccupancy = occupancies[firstDayIdx] || [];

  const desksForCurrentFloor = useMemo(() => {
    return desks.filter((d) => d.floor.toString() === floorId);
  }, [desks, floorId]);

  const mappedDesks: DeskMapResource[] = useMemo(() => {
    return desksForCurrentFloor.map((d) => {
      const occ = firstDayOccupancy.find((o: any) => o.spaceId === d.id);
      return {
        id: d.id,
        floorId: d.floor.toString(),
        name: d.name,
        type: "desk",
        active: !d.isBlocked && !occ?.isOccupied,
        blockedReason: d.maintenanceReason,
        bookedBy: occ?.isOccupied ? occ.occupantName : undefined,
      };
    });
  }, [desksForCurrentFloor, firstDayOccupancy]);

  const dayPlans = useMemo(() => {
    return selectedDays.map((idx) => {
      const occList = occupancies[idx] || [];
      const conflictOcc = occList.find((o: any) => o.spaceId === resourceId && o.isOccupied);

      const daySpecificDesks: DeskMapResource[] = desksForCurrentFloor.map((d) => {
        const dOcc = occList.find((o: any) => o.spaceId === d.id);
        return {
          id: d.id,
          floorId: d.floor.toString(),
          name: d.name,
          type: "desk",
          active: !d.isBlocked && !dOcc?.isOccupied,
          blockedReason: d.maintenanceReason,
          bookedBy: dOcc?.isOccupied ? dOcc.occupantName : undefined,
        };
      });

      return {
        idx,
        conflict: conflictOcc ? { userName: conflictOcc.occupantName } : null,
        daySpecificDesks,
      };
    });
  }, [selectedDays, occupancies, resourceId, desksForCurrentFloor]);

  const selectedDesk = mappedDesks.find((d) => d.id === resourceId);
  const tablesLayout = floorId === "2" ? [7, 7, 7, 7] : [8, 8, 8, 4];

  const hasUnresolvedConflicts = dayPlans.some((p) => p.conflict && !dayResourceOverride[p.idx]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Reserva de Mesas</h1>
      <p className="text-muted-foreground mt-1">
        Escolha o andar, a mesa no mapa e os dias na semana.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStartBooking();
        }}
        className="mt-8 grid gap-6 rounded-xl border bg-card p-6 card-shadow"
      >
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setWeekStart((w) => addDays(w, -7))}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex-1 text-center text-sm font-semibold text-foreground">
              {fmtBR(weekStart)} – {fmtBR(weekEnd)}
            </span>
            <button
              type="button"
              onClick={() => setWeekStart((w) => addDays(w, 7))}
              disabled={toLocalISOString(addDays(weekStart, 11)) > getMaxBookingDate()}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {WEEKDAYS.map((d) => {
              const dayDate = addDays(weekStart, d.idx - 1);
              const isActive = selectedDays.includes(d.idx);
              const occList = occupancies[d.idx] || [];

              const totalDesks = desksForCurrentFloor.filter((desk) => !desk.isBlocked).length;
              
              const floorDeskIds = new Set(desksForCurrentFloor.map(d => d.id));
              const occupiedDesksCount = new Set(
                occList
                  .filter((o: any) => o.isOccupied && floorDeskIds.has(o.spaceId))
                  .map((o: any) => o.spaceId)
              ).size;

              const availableCount = totalDesks - occupiedDesksCount;

              let availColorClass = "text-success";
              if (isActive) availColorClass = "text-primary-foreground/90";
              else if (availableCount === 0) availColorClass = "text-destructive";
              else if (availableCount <= 5) availColorClass = "text-warning";

              return (
                <button
                  key={d.idx}
                  type="button"
                  onClick={() => toggleDay(d.idx)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-xl border transition-all duration-150",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer",
                  )}
                >
                  <span className="font-semibold uppercase tracking-wide text-sm">
                    {d.short}
                  </span>

                  <span
                    className={cn(
                      "text-[11px] font-semibold mt-0.5 tracking-tight",
                      availColorClass,
                    )}
                  >
                    {occupancies[d.idx] ? `${availableCount}/${totalDesks}` : "..."}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedDays.length > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              {selectedDays.length} dia{selectedDays.length > 1 ? "s" : ""} selecionado
              {selectedDays.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label className="flex items-center gap-1 font-medium">
            <Building2 className="h-4 w-4" /> Andar
          </Label>
          <div className="flex flex-wrap rounded-lg border bg-muted/40 p-1 gap-1">
            {floors.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setFloorId(opt.id);
                  setResourceId("");
                }}
                className={cn(
                  "flex-1 min-w-[100px] rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 text-center",
                  floorId === opt.id
                    ? "bg-card text-primary shadow-sm border border-border font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                )}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label className="flex items-center gap-1 font-medium">
            <Armchair className="h-4 w-4" /> Seleção de mesa
          </Label>
          {floorId ? (
            <DeskMap
              desks={mappedDesks as any}
              selectedId={resourceId}
              onSelect={setResourceId}
              tablesLayout={tablesLayout}
              floorId={`f${floorId}`}
            />
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Escolha um andar para visualizar o mapa de mesas.
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={!resourceId || isSubmitting}>
          {isSubmitting ? "Processando..." : "Confirmar agendamento"}
        </Button>
      </form>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar lote de Mesas</DialogTitle>
            <DialogDescription>Revise as informações da mesa antes de confirmar.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                Mesa Principal
              </Label>
              <p className="text-xl font-semibold">{selectedDesk?.name}</p>
            </div>

            <div className="grid gap-3 mt-2">
              {dayPlans.map((plan) => {
                const w = WEEKDAYS.find((x) => x.idx === plan.idx);
                const dayDate = addDays(weekStart, plan.idx - 1);

                if (!plan.conflict) {
                  return (
                    <div
                      key={plan.idx}
                      className="flex items-center justify-between p-3 rounded-lg border bg-success/5"
                    >
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-success" />
                        <span className="font-medium">{w?.long}</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          ({fmtBR(dayDate)})
                        </span>
                      </div>
                      <span className="text-sm font-medium text-success">Livre</span>
                    </div>
                  );
                }

                const overrideDesk = desksForCurrentFloor.find((d) => d.id === dayResourceOverride[plan.idx]);

                return (
                  <Alert
                    key={plan.idx}
                    className="flex flex-col gap-2 bg-primary/5 border-primary/20"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <AlertTriangle className="h-5 w-5" />
                      <AlertTitle className="mb-0 text-base">
                        {w?.long} ({fmtBR(dayDate)}) — conflito
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-1 text-foreground/80">
                      <p className="mb-3">
                        A <strong>{selectedDesk?.name}</strong> está ocupada nesta{" "}
                        {w?.long.toLowerCase()}
                        (Reservada por {plan.conflict.userName}).
                      </p>

                      <p className="font-semibold text-primary mb-2">
                        Escolha uma mesa alternativa para {w?.long.toLowerCase()}:
                      </p>

                      <div className="rounded-xl overflow-hidden border border-primary/20">
                        <DeskMap
                          desks={plan.daySpecificDesks}
                          selectedId={dayResourceOverride[plan.idx] || ""}
                          onSelect={(id) =>
                            setDayResourceOverride((prev) => ({ ...prev, [plan.idx]: id }))
                          }
                          tablesLayout={tablesLayout}
                          floorId={`f${floorId}`}
                          compact
                        />
                      </div>

                      {overrideDesk && (
                        <p className="mt-3 text-sm text-success font-medium">
                          Mesa substituta selecionada: <strong>{overrideDesk.name}</strong>
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>
              Voltar
            </Button>
            <Button onClick={confirmBatchBooking} disabled={isSubmitting || hasUnresolvedConflicts}>
              {isSubmitting
                ? "Aguarde..."
                : hasUnresolvedConflicts
                  ? "Resolva os conflitos"
                  : "Confirmar Agendamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}