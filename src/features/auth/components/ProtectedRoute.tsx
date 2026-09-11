"use client";

import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/core/services/auth.service";
import type { AccessType } from "@/core/models/user.types";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AccessType[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getAccessType();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`${redirectTo}?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    const user = authService.getUser();
    if (
      user &&
      (!user.department || user.department.trim() === "") &&
      pathname !== "/select-department"
    ) {
      router.replace("/select-department");
    }
  }, [isAuthenticated, router, redirectTo, pathname]);

  if (!isAuthenticated) return null;

  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(userRole) || userRole === "admin";

    if (!hasPermission) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10 text-warning mb-4 shadow-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Acesso Restrito</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Seu perfil de acesso ({userRole}) não possui permissão para visualizar esta
            funcionalidade. Solicite permissão ao administrador se necessário.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => window.history.back()} className="rounded-xl">
              Voltar
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-primary hover:bg-primary-glow text-primary-foreground rounded-xl"
            >
              Ir para o Início
            </Button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
