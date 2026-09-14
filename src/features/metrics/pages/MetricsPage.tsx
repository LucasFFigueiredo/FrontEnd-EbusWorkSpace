"use client";

import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { BarChart3, ShieldAlert, Calendar, CalendarDays, X } from "lucide-react";
import { initials } from "@/core/services/user.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { useMetricsPage, PALETTE } from "../hooks/useMetricsPage";

const PRESET_OPTIONS = [
  { key: "7days", label: "Últimos 7 dias" },
  { key: "30days", label: "Últimos 30 dias" },
  { key: "thisMonth", label: "Este Mês" },
  { key: "thisQuarter", label: "Este Trimestre" },
] as const;

interface MetricsPageProps {
  generalMetrics: any;
  userMetrics: any;
  usersList: any[];
  initialParams: any;
}

export function MetricsPage({
  generalMetrics,
  userMetrics,
  usersList,
  initialParams,
}: MetricsPageProps) {
  const {
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
  } = useMetricsPage(initialParams, usersList);

  if (!isAllowed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center p-6">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Acesso restrito</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Esta área é exclusiva para Gestores e Administradores.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary text-sm hover:underline">
          ← Voltar para o início
        </Link>
      </div>
    );
  }

  const formatShortDate = (dStr: string) => {
    if (!dStr) return "";
    const parts = dStr.split("-");
    if (parts.length < 3) return dStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-10 w-full overflow-hidden">
      {/* Header e Seletor de Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0" />
            <span>Métricas e Ocupação</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Acompanhe dados, relatórios e estatísticas de uso do escritório.
          </p>
        </div>

        <div className="grid grid-cols-2 p-1 bg-muted rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setMainTab("gerais")}
            className={`py-2 px-4 rounded-lg font-medium text-xs sm:text-sm transition-all ${mainTab === "gerais"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Gerais
          </button>
          <button
            type="button"
            onClick={() => setMainTab("individual")}
            className={`py-2 px-4 rounded-lg font-medium text-xs sm:text-sm transition-all ${mainTab === "individual"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Individual
          </button>
        </div>
      </div>

      {/* Barra de Filtro de Período */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border bg-card mb-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <Calendar className="h-4 w-4 text-primary shrink-0" />
          <span>Período:</span>
          <span className="text-muted-foreground font-normal truncate">
            {periodLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenDateDialog}
            className="h-9 gap-2 text-xs font-semibold flex-1 sm:flex-none justify-center"
          >
            <CalendarDays className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">
              {startDate || endDate
                ? `${formatShortDate(startDate) || "Início"} → ${formatShortDate(endDate) || "Fim"}`
                : "Selecionar período"}
            </span>
          </Button>

          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDateRange}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Modal de Data */}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="w-[92vw] max-w-md rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-5 w-5 text-primary" /> Selecionar período
            </DialogTitle>
            <DialogDescription className="text-xs">
              Escolha um intervalo de datas para filtrar os dados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div>
              <Label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider">
                Atalhos rápidos
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {PRESET_OPTIONS.map(({ key, label }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="text-xs h-8"
                    onClick={() => applyPreset(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border my-1" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="date-start" className="text-xs font-semibold">
                  Início
                </Label>
                <Input
                  id="date-start"
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="bg-background h-9 text-xs"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="date-end" className="text-xs font-semibold">
                  Término
                </Label>
                <Input
                  id="date-end"
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="bg-background h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 mt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={handleClearDateRange}
              className="flex-1 h-9 text-xs"
            >
              Limpar
            </Button>
            <Button
              type="button"
              onClick={handleApplyDateRange}
              className="flex-1 h-9 text-xs"
            >
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tab: Métricas Gerais */}
      {mainTab === "gerais" && generalMetrics && (
        <div className="grid gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total reservas" value={generalMetrics.totals.totalReservations} />
            <StatCard label="Ativas" value={generalMetrics.totals.activeReservations} />
            <StatCard label="Check-ins" value={generalMetrics.totals.checkIns} />
            <StatCard label="Bloqueados" value={generalMetrics.totals.blockedSpaces} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Ocupação por dia da semana"
              description="Distribuição das reservas ao longo dos dias."
            >
              <div className="w-full h-[220px] sm:h-[250px]">
                <ChartContainer
                  config={{ reservas: { label: "Reservas", color: "var(--primary)" } }}
                  className="h-full w-full"
                >
                  <BarChart data={generalMetrics.byDayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={24} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Salas mais utilizadas"
              description="Top salas com maior volume de agendamento."
            >
              {generalMetrics.topRooms.length === 0 ? (
                <EmptyChart />
              ) : (
                <div className="w-full h-[220px] sm:h-[250px]">
                  <ChartContainer
                    config={{ reservas: { label: "Reservas", color: "var(--primary-glow)" } }}
                    className="h-full w-full"
                  >
                    <BarChart data={generalMetrics.topRooms} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        width={70}
                        tick={{ fontSize: 10 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </ChartCard>

            <ChartCard
              title="Ocupação por time / setor"
              description="Distribuição percentual das reservas."
            >
              {generalMetrics.byDepartment.length === 0 ? (
                <EmptyChart />
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div className="h-[170px] w-[170px] sm:h-[200px] sm:w-[200px] shrink-0">
                    <ChartContainer config={{}} className="h-full w-full">
                      <PieChart>
                        <Pie
                          data={generalMetrics.byDepartment}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={2}
                        >
                          {generalMetrics.byDepartment.map((_: any, i: number) => (
                            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  <div className="w-full flex flex-col gap-1.5 max-h-[190px] overflow-y-auto pr-1">
                    {generalMetrics.byDepartment.map((dep: any, i: number) => {
                      const color = PALETTE[i % PALETTE.length];
                      const totalBookings = generalMetrics.totals.totalReservations || 1;
                      const pct = Math.round((dep.value / totalBookings) * 100);
                      return (
                        <div
                          key={dep.name}
                          className="flex items-center justify-between gap-2 text-xs p-2 rounded-lg bg-muted/40"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span
                              className="shrink-0 h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-medium truncate" title={dep.name}>
                              {dep.name}
                            </span>
                          </div>
                          <div className="shrink-0 text-muted-foreground font-semibold">
                            {dep.value} <span className="font-normal opacity-70">({pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </ChartCard>

            <ChartCard title="Ocupação por andar" description="Comparativo de uso entre andares.">
              <div className="w-full h-[220px] sm:h-[250px]">
                <ChartContainer
                  config={{ reservas: { label: "Reservas", color: "var(--success)" } }}
                  className="h-full w-full"
                >
                  <BarChart data={generalMetrics.byFloor} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={24} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Tab: Individual */}
      {mainTab === "individual" && (
        <div className="grid gap-6">
          <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs">
            <h2 className="font-semibold text-base sm:text-lg">Busca individual</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Selecione o departamento e o colaborador desejado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="select-dept" className="text-xs">Departamento</Label>
                <Select
                  value={selectedDept}
                  onValueChange={(val) => {
                    setSelectedDept(val);
                    setSelectedUserId("");
                  }}
                >
                  <SelectTrigger id="select-dept" className="w-full h-9 text-xs">
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os departamentos</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-xs">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="select-user" className="text-xs">Colaborador</Label>
                <Select value={selectedUserId} onValueChange={(val) => setSelectedUserId(val)}>
                  <SelectTrigger id="select-user" className="w-full h-9 text-xs">
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id} className="text-xs">
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {activeUser && (
            <div className="rounded-xl border bg-card p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xs">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm sm:text-base shrink-0">
                {initials(activeUser.name)}
              </div>
              <div className="overflow-hidden min-w-0">
                <h3 className="font-bold text-sm sm:text-base truncate">{activeUser.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {activeUser.email || "Sem e-mail"} · {activeUser.sector || "Sem time"}
                </p>
              </div>
            </div>
          )}

          {userMetrics ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard label="Total Reservas" value={userMetrics.stats.total} />
                <StatCard label="Dias de Mesa" value={userMetrics.stats.desks} />
                <StatCard label="Salas Agendadas" value={userMetrics.stats.rooms} />
                <StatCard label="Check-ins" value={userMetrics.stats.checkIns} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Presença por dia da semana"
                  description={`Média de ${userMetrics.stats.avgDaysPerWeek} dia(s) por semana.`}
                >
                  <div className="w-full h-[220px] sm:h-[250px]">
                    <ChartContainer
                      config={{ reservas: { label: "Reservas", color: "var(--primary)" } }}
                      className="h-full w-full"
                    >
                      <BarChart data={userMetrics.byDayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={24} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </ChartCard>

                <ChartCard
                  title="Ocupação por andar"
                  description="Andares com maior frequência de reservas."
                >
                  <div className="w-full h-[220px] sm:h-[250px]">
                    <ChartContainer
                      config={{ reservas: { label: "Reservas", color: "var(--success)" } }}
                      className="h-full w-full"
                    >
                      <BarChart data={userMetrics.byFloor} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={24} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </ChartCard>
              </div>
            </>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground text-xs sm:text-sm bg-muted/20">
              Selecione um usuário para visualizar suas métricas individuais.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3.5 sm:p-4 rounded-xl border bg-card shadow-xs flex flex-col justify-between">
      <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-bold mt-1 text-primary">{value || 0}</p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p-4 sm:p-5 rounded-xl border bg-card shadow-xs flex flex-col">
      <h3 className="font-bold text-sm sm:text-base">{title}</h3>
      <p className="text-xs text-muted-foreground mb-3 sm:mb-4">{description}</p>
      <div className="flex-1 flex flex-col justify-end w-full">{children}</div>
    </section>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[180px] sm:h-[200px] border border-dashed rounded-xl bg-muted/20 text-muted-foreground text-xs sm:text-sm">
      Sem dados suficientes ainda.
    </div>
  );
}