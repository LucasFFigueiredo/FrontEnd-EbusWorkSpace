"use client";

import { useLoginPage } from "../hooks/useLoginPage";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Building2, Clock, CalendarCheck, ShieldCheck } from "lucide-react";

export function LoginPage() {
  const { handleGoogleSuccess, handleGoogleError } = useLoginPage();

  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
      {/* Left Section - Info */}
      <div className="hidden lg:flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24 bg-linear-to-br from-[#008A90]/10 via-transparent to-transparent border-r">
        <div className="w-full max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-muted-foreground mb-8">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Acesso restrito a colaboradores
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Bem-vindo ao <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#008A90] to-[#005c60]">
              E-bus WorkSpace
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Reserve mesas e salas de reunião de forma simples, rápida e organizada.
            Pronto para começar? Utilize sua conta corporativa Google para entrar na plataforma.
          </p>
        </div>
      </div>

      {/* Right Section - Login */}
      <div className="flex items-start lg:items-center justify-center p-6 pt-38 sm:p-12 sm:pt-20 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Only Header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              <span className="text-[#005c60]">E-bus WorkSpace</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pronto para começar? Utilize sua conta corporativa Google para entrar na plataforma.
            </p>
          </div>

          <Card className="w-full shadow-xl border-border/50 rounded-2xl p-2 sm:p-4 bg-card/50 backdrop-blur-xl">
            <CardHeader className="text-center sm:text-left space-y-3 pb-4">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2">
                <span className="text-2xl font-black tracking-tight text-foreground">
                  <span className="text-[#E3521B]">od</span>
                  <span className="bg-[#008A90] text-[rgb(13,84,87)] px-0.5 py-0.5 rounded-xs inline-block">
                    p
                  </span>
                  tech
                </span>
              </div>

              <CardTitle className="text-2xl font-bold text-foreground">
                Acesse sua conta
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="w-full flex justify-center pt-2">
                <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              </div>

              <div className="border-t border-border/50 pt-6 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Precisa de acesso ou suporte técnico?{" "}
                  <a
                    href="mailto:lucas.figueiredo@jcatlm.com.br"
                    className="text-foreground font-semibold hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Fale com o suporte
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
