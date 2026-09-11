import type { UserProfile, AccessType } from "../models/user.types";
import { saveUser, clearUser, getUser } from "./user.service";

const isClient = () => typeof window !== "undefined";
const getOrigin = () => {
  if (isClient() && window.location?.origin && window.location.origin !== "null") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

function buildUrl(path: string): string {
  const origin = getOrigin().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}

class AuthService {
  private currentUser: UserProfile | null = null;

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (!isClient()) return;

    try {
      const local = getUser();
      if (local?.name) {
        this.currentUser = local;
      }
    } catch (error) {
      console.warn("Falha ao restaurar perfil do usuário:", error);
      this.clearSessionData();
    }
  }

  private setSession(userProfile: UserProfile): void {
    this.currentUser = userProfile;
    saveUser(userProfile);
    this.dispatchAuthEvent();
  }

  private clearSessionData(): void {
    this.currentUser = null;
    clearUser();
    this.dispatchAuthEvent();
  }

  private dispatchAuthEvent(): void {
    if (isClient()) {
      window.dispatchEvent(new CustomEvent("rb:auth-changed"));
    }
  }

  public getToken(): string | null {
    return null;
  }

  public getUser(): UserProfile | null {
    if (!this.currentUser) {
      const local = getUser();
      if (local?.name) return local;
    }
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getUser()?.name);
  }

  public getAccessType(): AccessType {
    const u = this.getUser();
    return u?.access || "colaborador";
  }

  public async loginWithGoogle(googleToken: string): Promise<UserProfile> {
    if (!googleToken?.trim()) {
      throw new Error("Token de credencial do Google não foi fornecido.");
    }

    try {
      const response = await fetch(buildUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Falha na autenticação com o Google.");
      }

      const data = await response.json();

      if (!data?.user) {
        throw new Error("Resposta do servidor de autenticação em formato inválido.");
      }

      const userProfile: UserProfile = data.user;
      this.setSession(userProfile);

      return userProfile;
    } catch (error) {
      console.error("[AuthService] Erro na autenticação com o Google:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Falha ao autenticar com o Google. Tente novamente.");
    }
  }

  public async logout(): Promise<void> {
    this.clearSessionData();

    if (isClient() && window.google?.accounts?.id) {
      try {
        (window.google.accounts.id as any).disableAutoSelect();
      } catch (e) {
        console.warn("Não foi possível resetar o estado do Google", e);
      }
    }

    try {
      await fetch(buildUrl("/api/auth/logout"), { method: "POST" });
    } catch (error) {
      console.warn("[AuthService] Falha ao chamar /api/auth/logout:", error);
    }

    if (isClient()) {
      window.location.href = "/login";
    }
  }
}

export const authService = new AuthService();
