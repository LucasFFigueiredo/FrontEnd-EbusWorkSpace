import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/core/services/user.service";

export const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const PALETTE = [
  "#f97316",
  "#3b82f6",
  "#10b981",
  "#a855f7",
  "#ec4899",
  "#eab308",
  "#64748b",
];

export type MainTab = "gerais" | "individual";

interface MetricsParams {
  tab: string;
  startDate: string;
  endDate: string;
  userId: string;
  dept: string;
}

export function useMetricsPage(initialParams: MetricsParams, usersList: any[]) {
  const user = useUser();
  const router = useRouter();

  const [mainTab, setMainTab] = useState<MainTab>(initialParams.tab as MainTab);

  const [startDate, setStartDate] = useState<string>(initialParams.startDate);
  const [endDate, setEndDate] = useState<string>(initialParams.endDate);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState<boolean>(false);
  const [tempStart, setTempStart] = useState<string>(initialParams.startDate);
  const [tempEnd, setTempEnd] = useState<string>(initialParams.endDate);

  const [selectedDept, setSelectedDept] = useState<string>(initialParams.dept);
  const [selectedUserId, setSelectedUserId] = useState<string>(initialParams.userId);

  const isAllowed = user.access === "gestor" || user.access === "admin";

  useEffect(() => {
    const query = new URLSearchParams();
    query.set("tab", mainTab);
    if (startDate) query.set("start", startDate);
    if (endDate) query.set("end", endDate);
    if (selectedDept && selectedDept !== "all") query.set("dept", selectedDept);
    if (selectedUserId) query.set("userId", selectedUserId);

    router.replace(`?${query.toString()}`, { scroll: false });
  }, [mainTab, startDate, endDate, selectedDept, selectedUserId, router]);

  const handleOpenDateDialog = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setIsDateDialogOpen(true);
  };

  const handleApplyDateRange = () => {
    setStartDate(tempStart);
    setEndDate(tempEnd);
    setIsDateDialogOpen(false);
  };

  const handleClearDateRange = () => {
    setTempStart("");
    setTempEnd("");
    setStartDate("");
    setEndDate("");
    setIsDateDialogOpen(false);
  };

  const applyPreset = (preset: "7days" | "30days" | "thisMonth" | "thisQuarter") => {
    const now = new Date();
    const endDateStr = now.toISOString().slice(0, 10);
    let start = new Date();

    if (preset === "7days") start.setDate(now.getDate() - 7);
    else if (preset === "30days") start.setDate(now.getDate() - 30);
    else if (preset === "thisMonth") start = new Date(now.getFullYear(), now.getMonth(), 1);
    else if (preset === "thisQuarter") {
      const qMonth = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), qMonth, 1);
    }

    setTempStart(start.toISOString().slice(0, 10));
    setTempEnd(endDateStr);
  };

  const periodLabel = useMemo(() => {
    if (!startDate && !endDate) return "Exibindo todas as reservas";
    const fmt = (dStr: string) => {
      if (!dStr) return "";
      const parts = dStr.split("-");
      if (parts.length < 3) return dStr;
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };
    if (startDate && endDate) return `Período: ${fmt(startDate)} até ${fmt(endDate)}`;
    if (startDate) return `A partir de: ${fmt(startDate)}`;
    return `Até: ${fmt(endDate)}`;
  }, [startDate, endDate]);

  // Lista única de Departamentos (Baseado na tabela Users do C#)
  const departments = useMemo(() => {
    const set = new Set<string>();
    usersList.forEach((u) => {
      if (u.sector) set.add(u.sector);
    });
    return Array.from(set).sort();
  }, [usersList]);

  // Filtra os usuários no dropdown se um departamento estiver selecionado
  const filteredUsers = useMemo(() => {
    if (selectedDept === "all") return usersList;
    return usersList.filter((u) => u.sector === selectedDept);
  }, [usersList, selectedDept]);

  const activeUser = useMemo(() => {
    return filteredUsers.find((u) => u.id === selectedUserId) || null;
  }, [filteredUsers, selectedUserId]);

  return {
    isAllowed,
    mainTab,
    setMainTab,
    startDate,
    endDate,
    isDateDialogOpen,
    setIsDateDialogOpen,
    tempStart,
    setTempStart,
    tempEnd,
    setTempEnd,
    selectedDept,
    setSelectedDept,
    selectedUserId,
    setSelectedUserId,
    handleOpenDateDialog,
    handleApplyDateRange,
    handleClearDateRange,
    applyPreset,
    periodLabel,
    departments,
    filteredUsers,
    activeUser,
  };
}
