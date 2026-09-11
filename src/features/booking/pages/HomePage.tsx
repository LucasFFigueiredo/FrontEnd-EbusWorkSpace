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
} from "lucide-react";
import { useHomePage } from "../hooks/useHomePage";

export function HomePage() {
  const { isLoggedIn } = useHomePage();

  if (!isLoggedIn) return <GuestHome />;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-subtle">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Validação por QR Code
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Organize seu <span className="text-gradient-primary">espaço de trabalho</span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground">
              Reserve mesas e salas de reunião de forma simples, rápida e organizada.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/book/desk"
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-primary-foreground shadow-lg transition hover:opacity-90 bg-gradient-primary shadow-elegant"
                >
                  <Armchair className="h-4 w-4" />
                  Reservar Mesa
                </Link>

                <Link
                  href="/book/room"
                  className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 font-medium hover:bg-muted"
                >
                  <DoorOpen className="h-4 w-4" />
                  Reservar Sala
                </Link>
              </div>

              {}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Building2,
            title: "Espaços por andar",
            desc: "Acesse os espaços disponíveis em cada andar.",
          },
          {
            icon: Clock,
            title: "Escolha o horário",
            desc: "Escolha a data e o horário da sua reserva.",
          },
          {
            icon: QrCode,
            title: "Faça Check-In",
            desc: "Confirme sua presença.",
          },
          {
            icon: ListChecks,
            title: "Gerencie suas reservas",
            desc: "Consulte e gerencie suas reservas.",
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

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border bg-card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-shadow">
          <div>
            <h2 className="text-xl font-semibold">Reserva agendada?</h2>
            <p className="text-sm text-muted-foreground mt-1">Faça check-in e confime sua</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-5 py-3 font-medium text-primary transition hover:bg-primary/20 shadow-xs"
            >
              <Zap className="h-4 w-4" /> Realizar Check-in
            </Link>
          </div>
        </div>
      </section>

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
        {}
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

        {}
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
