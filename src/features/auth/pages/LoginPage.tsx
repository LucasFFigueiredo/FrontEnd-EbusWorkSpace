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

export function LoginPage() {
  const { handleGoogleSuccess, handleGoogleError } = useLoginPage();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg shadow-lg border rounded-2xl p-4">
        <CardHeader className="text-left space-y-3 pb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-2xl font-black tracking-tight text-foreground">
              <span className="text-[#E3521B]">od</span>
              <span className="bg-[#008A90] text-[rgb(13,84,87)] px-0.5 py-0.5 rounded-xs inline-block">
                p
              </span>
              tech
            </span>
          </div>

          <CardTitle className="text-2xl font-bold text-foreground">
            Entrar no E-bus WorkSpace
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Acesse a plataforma utilizando a sua conta Google corporativa.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="w-full flex justify-center pt-2">
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>

          <div className="border-t pt-4 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Precisa de acesso ou ajudasuporte técnico?{" "}
              <a
                href="mailto:lucas.figueiredo@jcatlm.com.br"
                className="text-foreground font-semibold hover:text-primary transition-colors"
              >
                Fale com o suporte técnico
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
