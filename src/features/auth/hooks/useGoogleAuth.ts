import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { authService } from "@/core/services/auth.service";
import type { UserProfile } from "@/core/models/user.types";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle";
              logo_alignment?: "left" | "center";
              width?: string | number;
              locale?: string;
            },
          ) => void;
          prompt: (
            notification?: (notification: {
              isNotDisplayed: () => boolean;
              getNotDisplayedReason: () => string;
            }) => void,
          ) => void;
          revoke: (email: string, done: () => void) => void;
        };
      };
    };
  }
}

interface UseGoogleAuthOptions {
  onSuccess?: (user: UserProfile) => void;
  onError?: (error: Error) => void;
  clientId?: string;
}

export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const googleClientId =
    options.clientId ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      if (!response?.credential) {
        const err = new Error("Token de credencial do Google não foi recebido.");
        toast.error("Falha ao obter credenciais do Google.");
        options.onError?.(err);
        return;
      }

      setLoading(true);
      try {
        const user = await authService.loginWithGoogle(response.credential);
        options.onSuccess?.(user);
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Falha ao autenticar com o Google.");
        toast.error("Falha ao autenticar com o Google. Tente novamente.");
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    [options],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const existingScript = document.getElementById("google-gis-sdk");
    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gis-sdk";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.warn("[GoogleAuth] Não foi possível carregar o SDK do Google Identity Services.");
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });

      if (buttonRef.current) {
        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: "100%",
          locale: "pt-BR",
        });
      }
    } catch (err) {
      console.warn("[GoogleAuth] Erro ao inicializar botão do Google GIS:", err);
    }
  }, [scriptLoaded, googleClientId, handleCredentialResponse]);

  const triggerGoogleLogin = async (mockToken?: string) => {
    setLoading(true);
    try {
      const token = mockToken || "mock_google_identity_credential_token_12345";
      const user = await authService.loginWithGoogle(token);
      options.onSuccess?.(user);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Falha ao autenticar com o Google.");
      toast.error("Falha ao autenticar com o Google. Tente novamente.");
      options.onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    scriptLoaded,
    buttonRef,
    triggerGoogleLogin,
  };
}
