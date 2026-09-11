"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/core/services/auth.service";
import { saveUser, getRoleLabel } from "@/core/services/user.service";
import type { UserProfile } from "@/core/models/user.types";

export function useLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function performLogin(user: UserProfile) {
    saveUser(user);
    toast.success(`Bem-vindo(a), ${user.name}!`);

    if (!user.department || user.department.trim() === "") {
      router.push("/select-department");
    } else {
      router.push("/");
    }
  }

  function handleGoogleSuccess(user: UserProfile) {
    performLogin(user);
  }

  function handleGoogleError(error: Error) {
    console.error("[useLoginPage] Erro no login Google:", error);
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle("google_identity_services_token_mock");
      performLogin(user);
    } catch (error) {
      toast.error("Falha ao autenticar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    handleGoogleLogin,
    handleGoogleSuccess,
    handleGoogleError,
    getRoleLabel,
  };
}
