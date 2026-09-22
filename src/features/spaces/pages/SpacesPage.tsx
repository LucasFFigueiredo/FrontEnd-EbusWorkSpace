"use client";

import Link from "next/link";
import { useSpacesPage, fmt } from "../hooks/useSpacesPage";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import {
  Lock,
  Unlock,
  AlertTriangle,
  Building,
  X,
  ShieldAlert,
  Clock,
  Check,
  CalendarDays,
} from "lucide-react";

interface SpacesPageProps {
  rooms: any[];
  upcomingBookings: any[];
  pendingApprovals: any[];
  extensionRequests: any[];
}

export function SpacesPage({
  rooms,
  upcomingBookings,
  pendingApprovals,
  extensionRequests,
}: SpacesPageProps) {
  const {
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
    handleApproveExtension,
    handleRejectExtension,
  } = useSpacesPage(rooms, upcomingBookings, pendingApprovals, extensionRequests);

  if (!isAllowed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Acesso restrito</h1>
        <p className="text-muted-foreground mt-2">
          Esta área é exclusiva para as equipes de Facilities e Administradores.
        </p>
        <Link href="/" className="inline-block mt-6 text-primary font-medium hover:underline">
          ← Voltar para o início
        </Link>
      </div>
    );
  }

  const todayString = new Date().toLocaleDateString("en-CA");

  const formatShortDate = (dStr: string) => {
    if (!dStr) return "";
    const parts = dStr.split("-");
    if (parts.length < 3) return dStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <Building className="h-8 w-8 text-primary" /> Gestão de Espaços
      </h1>
      <p className="text-muted-foreground mt-1">
        Controle de manutenção e aprovações de Salas do escritório.
      </p>

      <div className="mt-8 grid gap-8">
        {}
        {filteredExtensions.length > 0 && (
          <section className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg text-primary">Solicitações de Tempo Extra</h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {filteredExtensions.map((req: any, index: number) => (
                <li
                  key={req.id || `${req.reservationId}-${index}`}
                  className="flex flex-col justify-between rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm">{req.userName}</p>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        + {req.requestedMinutes} min
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {req.spaceName}
                    </p>
                    <div className="mt-3 rounded bg-muted/50 p-2 text-xs italic text-muted-foreground">
                      "{req.justification}"
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 justify-end border-t pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleRejectExtension(req.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Negar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => handleApproveExtension(req.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {}
        {filteredApprovals.length > 0 && (
          <section className="rounded-xl border border-warning/30 bg-warning/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="h-5 w-5 text-warning" />
              <h2 className="font-semibold text-lg text-warning">
                Aprovações de Salas VIP Pendentes
              </h2>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {filteredApprovals.map((req) => (
                <li
                  key={req.id}
                  className="flex flex-col justify-between rounded-lg border bg-card p-4 shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm">{req.userName}</p>
                      <Badge variant="outline" className="border-warning/50 text-warning">
                        Pendente
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      {req.spaceName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Data:{" "}
                      {new Date(req.startTime).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2 justify-end border-t pt-3">
                    {}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setRejectVipId(req.id);
                        setRejectVipReason("");
                      }}
                    >
                      <X className="h-4 w-4 mr-1" /> Negar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-warning hover:bg-warning/90 text-warning-foreground"
                      onClick={() => handleApproveVip(req.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {}
        <section className="rounded-xl border bg-card p-6 card-shadow">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-lg">Manutenção e Inativação de Salas</h2>
              <p className="text-sm text-muted-foreground">
                Inative salas temporariamente quando precisarem de manutenção ou reformas.
              </p>
            </div>
          </div>
          <ul className="mt-4 divide-y max-h-[28rem] overflow-auto">
            {rooms.map((r) => {
              const blocked = r.isBlocked;
              return (
                <li key={r.id} className="flex items-start justify-between gap-2 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong>{r.name}</strong>
                      <span className="text-muted-foreground text-xs">
                        {r.floor}º Andar · Sala{r.capacity ? ` · ${r.capacity}p` : ""}
                      </span>
                      {blocked && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" /> Em manutenção
                        </Badge>
                      )}
                    </div>
                    {blocked && r.maintenanceReason && (
                      <p className="text-xs text-destructive mt-1">Motivo: {r.maintenanceReason}</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {blocked ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handleUnblock(r.id)}
                      >
                        <Unlock className="h-4 w-4" /> Reativar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          setBlockingId(r.id);
                          setReason("");
                          setBlockTo("");
                        }}
                      >
                        <Lock className="h-4 w-4" /> Inativar
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {}
        <section className="rounded-xl border bg-card p-6 card-shadow">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">Reservas ativas de salas</h2>
              <p className="text-sm text-muted-foreground">
                Cancele reservas em casos de manutenção emergencial.
              </p>
            </div>

            {}
            <Button variant="outline" size="sm" onClick={handleOpenDateDialog} className="shrink-0">
              <CalendarDays className="h-4 w-4 mr-2 text-primary" />
              {startDate || endDate
                ? `${formatShortDate(startDate) || "Início"} → ${formatShortDate(endDate) || "Fim"}`
                : "Selecionar período"}
            </Button>
          </div>

          <ul className="mt-4 divide-y max-h-[28rem] overflow-auto">
            {filteredBookings.map((b) => (
              <li key={b.id} className="flex items-start justify-between gap-2 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong>{b.spaceName}</strong>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {b.userName} · {fmt(b.startTime)} → {fmt(b.endTime)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 shrink-0 text-destructive hover:text-destructive"
                  onClick={() => {
                    setCancelBookingId(b.id);
                    setCancelReason("");
                  }}
                >
                  <X className="h-4 w-4" /> Cancelar
                </Button>
              </li>
            ))}
            {filteredBookings.length === 0 && (
              <li className="py-3 text-sm text-muted-foreground">
                Nenhuma reserva encontrada para este período.
              </li>
            )}
          </ul>
        </section>
      </div>

      {}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Selecionar período
            </DialogTitle>
            <DialogDescription>
              Escolha uma data inicial e final para filtrar as reservas ativas.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Atalhos rápidos</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("7days")}
                  className="text-xs"
                >
                  Últimos 7 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("30days")}
                  className="text-xs"
                >
                  Últimos 30 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("thisMonth")}
                  className="text-xs"
                >
                  Este Mês
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("thisQuarter")}
                  className="text-xs"
                >
                  Este Trimestre
                </Button>
              </div>
            </div>

            <div className="h-px bg-border my-1" />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date-start" className="text-xs font-semibold">
                  Data início
                </Label>
                <Input
                  id="date-start"
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date-end" className="text-xs font-semibold">
                  Data término
                </Label>
                <Input
                  id="date-end"
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" type="button" onClick={handleClearDateRange}>
              Limpar filtro
            </Button>
            <Button type="button" onClick={handleApplyDateRange}>
              Aplicar filtro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={!!blockingId} onOpenChange={(o) => !o && setBlockingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inativar {blockingResource?.name}</DialogTitle>
            <DialogDescription>Bloqueie a sala para futuras reservas.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo da inativação</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Ar-condicionado avariado"
                maxLength={200}
                rows={3}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="block-from">Início da inativação</Label>
                <Input
                  id="block-from"
                  type="date"
                  value={todayString}
                  disabled
                  className="bg-muted opacity-60 cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="block-to">Fim da inativação</Label>
                <Input
                  id="block-to"
                  type="date"
                  value={blockTo}
                  min={todayString}
                  onChange={(e) => setBlockTo(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBlockingId(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmBlock}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={!!cancelBookingId} onOpenChange={(o) => !o && setCancelBookingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar reserva</DialogTitle>
            <DialogDescription>Atenção: Esta ação é irreversível.</DialogDescription>
          </DialogHeader>
          {cancelBooking && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <p>
                <strong>{cancelResource?.name ?? "Espaço"}</strong> — {cancelBooking.userName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {fmt(cancelBooking.startTime)} → {fmt(cancelBooking.endTime)}
              </p>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="cancel-reason">Motivo do cancelamento</Label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Manutenção emergencial do ar-condicionado"
              maxLength={200}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelBookingId(null)}>
              Desistir
            </Button>
            <Button variant="destructive" onClick={confirmForceCancel}>
              Confirmar cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={!!rejectVipId} onOpenChange={(o) => !o && setRejectVipId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Negar Solicitação VIP</DialogTitle>
            <DialogDescription>
              Informe o motivo para negar a reserva desta sala VIP.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-2">
            <Label htmlFor="vip-reason">Motivo da negação</Label>
            <Textarea
              id="vip-reason"
              value={rejectVipReason}
              onChange={(e) => setRejectVipReason(e.target.value)}
              placeholder="Ex: A sala já foi reservada para uma reunião de diretoria neste horário."
              maxLength={200}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectVipId(null)}>
              Desistir
            </Button>
            <Button variant="destructive" onClick={confirmRejectVip}>
              Confirmar Negação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
