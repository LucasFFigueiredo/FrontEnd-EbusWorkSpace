"use client";

import { useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";
import "./appstyle.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Next.js App Error Boundary]:", error);
  }, [error]);

  return (
    <div className="app-error-container">
      <div className="app-error-icon-wrapper">
        <AlertTriangle className="app-error-icon" />
      </div>
      <h2 className="app-error-title">Ocorreu um erro no servidor</h2>
      <p className="app-error-desc">
        {error.message || "Não foi possível carregar os dados. Verifique a conexão com a API."}
      </p>
      <Button onClick={() => reset()} variant="default">
        Tentar novamente
      </Button>
    </div>
  );
}
