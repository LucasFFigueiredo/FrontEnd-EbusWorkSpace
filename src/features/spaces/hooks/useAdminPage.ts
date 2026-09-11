import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/core/services/user.service";
import { updateUserRoleAction } from "@/core/actions/user.actions";

export function useAdminPage(initialRequests: any[]) {
  const user = useUser();
  const isAdmin = user.access === "admin";
  const [requests, setRequests] = useState(initialRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const archivedKeys = JSON.parse(localStorage.getItem("handled_requests") || "[]");
      if (archivedKeys.length > 0) {
        setRequests(
          initialRequests.filter((r) => !archivedKeys.includes(`${r.userId}-${r.requestedAt}`)),
        );
      } else {
        setRequests(initialRequests);
      }
    } catch (e) {
      setRequests(initialRequests);
    }
  }, [initialRequests]);

  const markAsHandled = (userId: string, requestedAt: string) => {
    try {
      const archivedKeys = JSON.parse(localStorage.getItem("handled_requests") || "[]");
      const key = `${userId}-${requestedAt}`;
      if (!archivedKeys.includes(key)) {
        archivedKeys.push(key);
        localStorage.setItem("handled_requests", JSON.stringify(archivedKeys));
      }
    } catch (e) {}
  };

  const handleApprove = async (userId: string, requestedRole: string, requestedAt: string) => {
    setIsSubmitting(true);
    try {
      await updateUserRoleAction(userId, requestedRole);
      toast.success(`Acesso de ${requestedRole} concedido com sucesso!`);

      markAsHandled(userId, requestedAt);
      setRequests((prev) => prev.filter((r) => r.userId !== userId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao aprovar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = (userId: string, requestedAt: string) => {
    markAsHandled(userId, requestedAt);
    setRequests((prev) => prev.filter((r) => r.userId !== userId));
    toast.error("Solicitação rejeitada (arquivada).");
  };

  return {
    isAdmin,
    requests,
    isSubmitting,
    handleApprove,
    handleReject,
  };
}
