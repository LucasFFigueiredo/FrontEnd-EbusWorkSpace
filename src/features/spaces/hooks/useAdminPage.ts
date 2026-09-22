import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUser } from "@/core/services/user.service";
import { approveAccessRequestAction, rejectAccessRequestAction } from "@/core/actions/user.actions";

export function useAdminPage(initialRequests: any[]) {
  const user = useUser();
  const isAdmin = user.access === "admin";
  const [requests, setRequests] = useState(initialRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // The backend now only returns pending requests, no need for localStorage
    setRequests(initialRequests);
  }, [initialRequests]);

  const handleApprove = async (requestId: string, requestedRole: string) => {
    setIsSubmitting(true);
    try {
      await approveAccessRequestAction(requestId);
      toast.success(`Acesso de ${requestedRole} concedido com sucesso!`);

      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao aprovar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setIsSubmitting(true);
    try {
      await rejectAccessRequestAction(requestId);
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
      toast.success("Solicitação rejeitada com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao rejeitar solicitação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isAdmin,
    requests,
    isSubmitting,
    handleApprove,
    handleReject,
  };
}
