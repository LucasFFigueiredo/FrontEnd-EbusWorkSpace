"use client";

import Link from "next/link";
import {
  QrCode,
  ListChecks,
  Building2,
  Clock,
  ShieldCheck,
  LogIn,
  Armchair,
  DoorOpen,
  Zap,
  CalendarCheck,
  MessageSquare,
  Code2,
  MapPin,
  Plus,
} from "lucide-react";
import { useHomePage } from "../hooks/useHomePage";
import type { MappedBooking } from "@/app/page";

interface HomePageProps {
  todayBooking?: MappedBooking | null;
}

export function HomePage({ todayBooking }: HomePageProps) {
  const { isLoggedIn, user } = useHomePage();

  if (!isLoggedIn) return <GuestHome />;

  const firstName = user?.name?.split(" ")[0] || "Colaborador";

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] pb-12">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        
        {/* Header / Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Olá, {firstName}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {todayBooking
              ? "Você tem uma reserva para hoje."
              : "Você não tem agendamentos para hoje."}
          </p>
        </div>

        {/* Content Grid */}
        <div className={`grid gap-6 ${todayBooking ? "lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-3"}`}>
          
          {/* Today's Booking Card */}
          {todayBooking && (
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                {todayBooking.spaceType === "Room" ? (
                  <DoorOpen className="h-48 w-48" />
                ) : (
                  <Armchair className="h-48 w-48" />
                )}
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <h2 className="text-2xl font-bold">
                    {todayBooking.spaceName}, {todayBooking.floorName}
                  </h2>
                  <span className="inline-block shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Hoje, {todayBooking.startTime.split("T")[1].substring(0, 5)} - {todayBooking.endTime.split("T")[1].substring(0, 5)}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Sede JCA - Barueri</span>
                </div>
              </div>

              <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={todayBooking.spaceType === "Room" ? "/book/room" : "/book/desk"}
                  className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  title="Ver no mapa"
                >
                  <Building2 className="h-5 w-5" />
                </Link>
                
                <Link
                  href="/scan"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#008A90] px-6 py-3 font-medium text-white shadow-sm transition hover:bg-[#007075]"
                >
                  <QrCode className="h-4 w-4" />
                  Fazer Check-in
                </Link>
              </div>
            </div>
          )}

          {/* Cards de Ação Rápidas */}
          <div className={todayBooking ? "flex flex-col gap-4 lg:col-span-1" : "col-span-full grid gap-4 sm:grid-cols-3"}>
            <Link
              href="/book/desk"
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#008A90] to-[#007075] p-5 shadow-sm transition hover:scale-[1.02] h-full"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white transition-transform group-hover:scale-105">
                <Plus className="h-6 w-6" />
              </div>
              <div className="relative z-10 text-white">
                <h3 className="font-bold">Novo Agendamento</h3>
                <p className="mt-1 text-xs text-white/90">
                  Reserve uma mesa ou sala.
                </p>
              </div>
              
              {/* Decorative graphics */}
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
            </Link>

            <Link
              href="/book/desk"
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md group h-full"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-105">
                <Armchair className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Reserva de Mesa</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Visualize a planta e reserve.
                </p>
              </div>
            </Link>

            <Link
              href="/book/room"
              className="flex items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md group h-full"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-transform group-hover:scale-105">
                <DoorOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Reserva de Sala</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Encontre o espaço ideal.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <SupportFooter />
    </div>
  );
}

function GuestHome() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Acesso restrito a colaboradores
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Bem-vindo ao <span className="text-gradient-primary">E-bus WorkSpace</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Reserve mesas e salas de reunião de forma simples, rápida e organizada. Faça login
              para consultar os espaços disponíveis e realizar sua reserva.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-primary-foreground bg-gradient-primary shadow-elegant"
              >
                <LogIn className="h-4 w-4" /> Entrar na minha conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Building2,
            title: "Mesas e salas",
            desc: "Encontre o espaço ideal para sua jornada de trabalho.",
          },
          {
            icon: Clock,
            title: "Reserve seu horário",
            desc: "Escolha a data e o período que deseja utilizar o espaço.",
          },
          {
            icon: CalendarCheck,
            title: "Check-in por QR Code",
            desc: "Confirme sua presença ao chegar ao espaço reservado.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border bg-card p-5 card-shadow">
            <div className="flex items-center gap-3">
              <f.icon className="h-6 w-6 shrink-0 text-primary" />
              <h3 className="font-semibold">{f.title}</h3>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      <SupportFooter />
    </div>
  );
}

function SupportFooter() {
  return (
    <footer className="mt-12 bg-muted/30 border-t border-border/40">
      <div className="mx-auto max-w-5xl px-4 pt-12 pb-6">
        { }
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-5">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>

          <h2 className="text-xl font-bold text-foreground">
            Encontrou um problema ou tem uma sugestão?
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            O E-bus WorkSpace é uma iniciativa desenvolvida através do{" "}
            <strong>Projeto de Estágio</strong> e está em sua primeira fase de evolução. Sua opinião
            é fundamental para refinarmos o sistema e criarmos a melhor experiência!
          </p>

          <a
            href="mailto:lucas.figueiredo@jcatlm.com.br?subject=Feedback:%20E-bus%20WorkSpace"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Enviar Feedback
          </a>
        </div>

        { }
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Desenvolvido por Lucas Figueiredo - Pedro Viveiros - Thiffany Silva{" "}
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span> Programa de Estágio Grupo JCA © 2026
          </p>

          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border/50">
              <Code2 className="h-3.5 w-3.5" />
              Versão 1.0.0 (MVP)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
