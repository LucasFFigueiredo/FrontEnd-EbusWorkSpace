"use client";

import Link from "next/link";
import { useProfilePage, fmtDateTime } from "../hooks/useProfilePage";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  CalendarCheck,
  CalendarClock,
  ShieldCheck,
  User as UserIcon,
  Building2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import type { MappedProfileBooking } from "@/app/profile/page";

interface ProfilePageProps {
  user: any;
  bookings: MappedProfileBooking[];
}

export function ProfilePage({ user, bookings }: ProfilePageProps) {
  const {
    name,
    setName,
    department,
    setDepartment,
    requestOpen,
    setRequestOpen,
    requestedRole,
    setRequestedRole,
    upcoming,
    past,
    handleSave,
    handleRequestAccess,
    userInitials,
    roleLabel,
    isAdmin,
    isSubmitting,
  } = useProfilePage(user, bookings);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg font-semibold text-primary-foreground bg-gradient-primary">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
            {department && <Badge variant="secondary">{department}</Badge>}
            <Badge variant={isAdmin ? "default" : "outline"}>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Administrador
                </span>
              ) : (
                roleLabel
              )}
            </Badge>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        { }
        { }
        <form
          onSubmit={handleSave}
          className="rounded-xl border bg-card p-6 grid gap-4 card-shadow h-fit self-start"
        >
          <h2 className="font-semibold flex items-center gap-2">
            <UserIcon className="h-4 w-4" /> Dados
          </h2>

          <div className="grid gap-2 mt-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled />
          </div>

          <div className="grid gap-2 mt-2">
            <Label htmlFor="dept" className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" /> Departamento
            </Label>
            <Input
              id="dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Ex: ODPTech: Build & Data"
              disabled
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {!department && (
                <Button asChild variant="default">
                  <Link href="/select-department">
                    <Building2 className="h-4 w-4 mr-1.5" /> Escolher Departamento
                  </Link>
                </Button>
              )}
              {!isAdmin ? (
                <Button type="button" variant="outline" onClick={() => setRequestOpen(true)}>
                  <ShieldAlert className="h-4 w-4 mr-1.5" /> Solicitar Acesso
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary py-2 px-3">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Acesso de Admin Ativo
                </span>
              )}
            </div>

            {isAdmin && (
              <>
                <div className="h-px bg-border my-2" />
                <Button
                  asChild
                  variant="outline"
                  className="w-fit text-muted-foreground hover:text-foreground"
                >
                  <Link href="/admin">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Acessar Painel de Gestão
                    <ArrowRight className="h-4 w-4 ml-6 opacity-50" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </form>

        { }
        <div className="space-y-6">
          { }
          <section className="rounded-xl border bg-card p-6 card-shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" /> Reservas agendadas
              </h2>
              <Badge variant="secondary">{upcoming.length}</Badge>
            </div>

            {upcoming.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nenhuma reserva futura.{" "}
                <Link href="/book/room" className="text-primary font-medium">
                  Agendar agora →
                </Link>
              </p>
            ) : (
              <ul className="mt-4 divide-y">
                {upcoming.map((b) => (
                  <li key={b.id} className="py-3 flex justify-between items-start gap-3">
                    <div>
                      <p className="font-medium text-sm">
                        {b.spaceName}{" "}
                        <span className="text-muted-foreground font-normal">· {b.floorName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {fmtDateTime(b.startTime)} → {fmtDateTime(b.endTime)}
                      </p>
                    </div>
                    {b.status === "CheckedIn" ? (
                      <span className="text-xs text-success font-medium">Validado</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pendente</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          { }
          <section className="rounded-xl border bg-card p-6 card-shadow">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-muted-foreground" /> Histórico
              </h2>
              <Badge variant="outline">{past.length}</Badge>
            </div>

            {past.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">Sem reservas anteriores ainda.</p>
            ) : (
              <ul className="mt-4 divide-y max-h-80 overflow-auto">
                {past.map((b) => (
                  <li key={b.id} className="py-3 flex justify-between items-start gap-3">
                    <div>
                      <p className="font-medium text-sm">
                        {b.spaceName}{" "}
                        <span className="text-muted-foreground font-normal">· {b.floorName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {fmtDateTime(b.startTime)} → {fmtDateTime(b.endTime)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {b.status === "CheckedIn" || b.status === "Completed"
                        ? "Validado"
                        : "Não validado"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      { }
      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Novas Permissões</DialogTitle>
            <DialogDescription>
              Selecione a função desejada para enviar um pedido de liberação aos administradores.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2 mt-2">
              <Label htmlFor="req-role">Função desejada</Label>
              <Select value={requestedRole} onValueChange={setRequestedRole}>
                <SelectTrigger id="req-role">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg bg-muted/60 p-3 text-xs space-y-1 mt-4">
              <p>
                <strong>Solicitante:</strong> {name}
              </p>
              <p>
                <strong>Função atual:</strong> {roleLabel}
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setRequestOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleRequestAccess} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
