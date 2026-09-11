"use client";

import { useCheckinPage } from "../hooks/useCheckinPage";
import { Button } from "@/shared/components/ui/button";
import {
  MapPin,
  Loader2,
  CheckCircle2,
  XCircle,
  Home,
  RefreshCcw,
  Armchair,
  DoorOpen,
  Calendar,
} from "lucide-react";

export function CheckinPage() {
  const {
    status,
    errorMessage,
    isSubmitting,
    retry,
    goHome,
    goToRoomBooking,
    handleQuickDeskBooking,
  } = useCheckinPage();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="w-full max-w-md bg-card border shadow-sm rounded-2xl p-8 flex flex-col items-center gap-4">
        {}
        {status === "locating" && (
          <>
            <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center animate-pulse">
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold mt-2">Buscando sua localização...</h2>
            <p className="text-sm text-muted-foreground">
              Por favor, permita o acesso ao GPS quando o navegador solicitar.
            </p>
          </>
        )}

        {}
        {status === "processing" && (
          <>
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <h2 className="text-xl font-bold mt-2">Validando reserva...</h2>
            <p className="text-sm text-muted-foreground">Confirmando seus dados com o sistema.</p>
          </>
        )}

        {}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-success" />
            <h2 className="text-xl font-bold text-success mt-2">Check-in Concluído!</h2>
            <p className="text-sm text-muted-foreground">
              Sua presença foi confirmada e a reserva está garantida. Bom trabalho!
            </p>
            <Button className="mt-6 w-full" onClick={goHome}>
              <Home className="h-4 w-4 mr-2" /> Voltar ao Início
            </Button>
          </>
        )}

        {}
        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive" />
            <h2 className="text-xl font-bold text-destructive mt-2">Falha na Validação</h2>
            <p className="text-sm bg-destructive/10 text-destructive border border-destructive/20 font-medium p-3 rounded-lg w-full">
              {errorMessage}
            </p>
            <div className="flex gap-3 mt-6 w-full">
              <Button variant="outline" className="flex-1" onClick={retry}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Tentar de novo
              </Button>
              <Button className="flex-1" onClick={goHome}>
                <Home className="h-4 w-4 mr-2" /> Início
              </Button>
            </div>
          </>
        )}

        {}
        {status === "free_desk" && (
          <>
            <Armchair className="h-16 w-16 text-success" />
            <h2 className="text-xl font-bold mt-2">Mesa Livre!</h2>
            <p className="text-sm text-success bg-success/10 p-3 rounded-lg w-full border border-success/20">
              {errorMessage}
            </p>
            <div className="flex gap-3 mt-6 w-full">
              <Button variant="outline" className="flex-1" onClick={goHome} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
                onClick={handleQuickDeskBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Reservar agora
              </Button>
            </div>
          </>
        )}

        {}
        {status === "free_room" && (
          <>
            <DoorOpen className="h-16 w-16 text-warning" />
            <h2 className="text-xl font-bold mt-2">Sala Livre</h2>
            <p className="text-sm text-warning-foreground bg-warning/10 p-3 rounded-lg w-full border border-warning/20">
              {errorMessage}
            </p>
            <div className="flex gap-3 mt-6 w-full">
              <Button variant="outline" className="flex-1" onClick={goHome}>
                Início
              </Button>
              <Button
                className="flex-1 bg-warning hover:bg-warning/90 text-warning-foreground"
                onClick={goToRoomBooking}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Reservar Sala
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
