"use client";

import Link from "next/link";
import { useAdminPage } from "../hooks/useAdminPage";
import { ShieldAlert, ShieldQuestion, Check, X, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface AdminPageProps {
  requests: any[];
}

export function AdminPage({ requests: initialRequests }: AdminPageProps) {
  const { isAdmin, requests, isSubmitting, handleApprove, handleReject } =
    useAdminPage(initialRequests);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Acesso restrito</h1>
        <p className="text-muted-foreground mt-2">
          Esta área é exclusiva para Administradores do sistema.
        </p>
        <Link href="/" className="inline-block mt-6 text-primary font-medium hover:underline">
          ← Voltar para o início
        </Link>
      </div>
    );
  }

  const fmtDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Painel do Administrador</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as permissões e o nível de acesso dos colaboradores.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldQuestion className="h-5 w-5 text-primary" />
            Solicitações Pendentes
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          </h2>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed">
            <Check className="h-8 w-8 text-success mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">Não há solicitações de acesso pendentes.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {}
            {requests.map((request, index) => (
              <div
                key={request.requestId || request.id || `${request.userId}-${index}`}
                className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border bg-card transition-all hover:border-primary/20 card-shadow"
              >
                {}
                <div className="flex-1">
                  <div className="flex justify-between sm:justify-start items-start sm:items-center gap-3 mb-2">
                    <h3 className="font-semibold text-base">{request.userName}</h3>
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" /> {fmtDate(request.requestedAt)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{request.userEmail}</p>

                  {}
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <span className="bg-muted text-muted-foreground px-2.5 py-0.5 rounded-md font-medium border border-border">
                      {request.currentProfile}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="bg-accent text-accent-foreground px-2.5 py-0.5 rounded-md font-medium border border-accent">
                      {request.requestedProfile}
                    </span>
                  </div>
                </div>

                {}
                <div className="flex sm:flex-col justify-end gap-2 pt-2 sm:pt-0 sm:border-l sm:pl-4">
                  <Button
                    className="flex-1 sm:flex-none bg-success hover:bg-success/90 text-success-foreground"
                    size="sm"
                    disabled={isSubmitting}

                    onClick={() =>
                      handleApprove(request.requestId, request.requestedProfile)
                    }
                  >
                    <Check className="h-4 w-4 mr-1.5" /> Aprovar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                    size="sm"
                    disabled={isSubmitting}

                    onClick={() => handleReject(request.requestId)}
                  >
                    <X className="h-4 w-4 mr-1.5" /> Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
