"use client";

import { useScanPage } from "../hooks/useScanPage";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { QrCode, Camera } from "lucide-react";

export function ScanPage() {
  const containerId = "qr-reader-region";
  const { scanning, manualId, setManualId, start, stop, goToCheckin } = useScanPage(containerId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <QrCode className="h-7 w-7 text-primary" /> Validar Check-in
      </h1>
      <p className="text-muted-foreground mt-1">
        Escaneie o QR Code localizado na mesa ou na porta da sala.
      </p>

      <div className="mt-8 rounded-xl border bg-card p-6 card-shadow">
        <div
          id={containerId}
          className="w-full aspect-square max-w-sm mx-auto rounded-lg overflow-hidden bg-muted"
        />
        <div className="mt-4 flex justify-center">
          {!scanning ? (
            <Button onClick={start} size="lg">
              <Camera className="h-4 w-4 mr-2" /> Iniciar câmera
            </Button>
          ) : (
            <Button variant="secondary" onClick={stop} size="lg">
              Parar câmera
            </Button>
          )}
        </div>

        <div className="mt-6 grid gap-2">
          <Label htmlFor="manual">Problemas com a câmera? Valide manualmente:</Label>
          <div className="flex gap-2">
            <Input
              id="manual"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="Cole o ID do espaço aqui"
            />
            <Button onClick={() => goToCheckin(manualId)}>Validar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
