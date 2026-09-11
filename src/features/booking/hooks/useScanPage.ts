"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";

export function useScanPage(containerId: string) {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState("");

  function goToCheckin(scannedText: string) {
    if (!scannedText.trim()) {
      toast.error("O código do espaço não pode ser vazio.");
      return;
    }

    let finalId = scannedText.trim();

    if (finalId.startsWith("http")) {
      try {
        const url = new URL(finalId);

        const urlId = url.searchParams.get("id") || url.searchParams.get("spaceId");

        if (urlId) {
          finalId = urlId;
        } else {
          toast.error("QR Code inválido: ID da sala não encontrado na URL.");
          return;
        }
      } catch (e) { }
    }

    router.push(`/checkin?id=${encodeURIComponent(finalId)}`);
  }

  async function start() {
    try {
      const html5 = new Html5Qrcode(containerId);
      scannerRef.current = html5;
      await html5.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          stop();
          goToCheckin(decodedText);
        },
        () => { },
      );
      setScanning(true);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível acessar a câmera do seu dispositivo.");
    }
  }

  async function stop() {
    const s = scannerRef.current;
    if (!s) return;
    try {
      await s.stop();
      await s.clear();
    } catch { }
    scannerRef.current = null;
    setScanning(false);
  }

  useEffect(() => {
    return () => {
      void stop();
    };
  }, []);

  return {
    scanning,
    manualId,
    setManualId,
    start,
    stop,
    goToCheckin,
  };
}
