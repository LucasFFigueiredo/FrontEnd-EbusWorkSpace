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
        <p className="text-muted-foreground mt-2">
          Esta área é exclusiva para Gestores e Administradores.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
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
    <div className="mx-auto max-w-6xl px-4 py-10 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" /> Métricas e Ocupação
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe dados, relatórios e estatísticas de uso do escritório.
          </p>
        </div>

        {}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMainTab("gerais")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${mainTab === "gerais" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Gerais
          </button>
          <button
            type="button"
            onClick={() => setMainTab("individual")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${mainTab === "individual" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Individual
          </button>
        </div>
      </div>

      {}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border bg-card mb-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Filtro de período:</span>
          <span className="text-xs text-muted-foreground font-normal hidden md:inline ml-2">
            • {periodLabel}
          </span>
        </div>

        {}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenDateDialog}
            className="h-9 gap-2 text-xs font-semibold flex-1 sm:flex-none"
          >
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            {startDate || endDate
              ? `${formatShortDate(startDate) || "Início"} → ${formatShortDate(endDate) || "Fim"}`
              : "Selecionar período"}
          </Button>
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDateRange}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <X className="h-3.5 w-3.5 mr-1" /> Limpar
            </Button>
          )}
        </div>
      </div>

      {}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Selecionar período
            </DialogTitle>
            <DialogDescription>
              Escolha uma data inicial e final para filtrar os dados.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-3 mt-2">
            <div>
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Atalhos rápidos
              </Label>
              {}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("7days")}
                >
                  Últimos 7 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("30days")}
                >
                  Últimos 30 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("thisMonth")}
                >
                  Este Mês
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => applyPreset("thisQuarter")}
                >
                  Este Trimestre
                </Button>
              </div>
            </div>

            <div className="h-px bg-border my-1" />

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date-start" className="text-xs font-semibold">
                  Data início
                </Label>
                <Input
                  id="date-start"
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date-end" className="text-xs font-semibold">
                  Data término
                </Label>
                <Input
                  id="date-end"
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex sm:gap-0 gap-2 mt-6">
            <Button
              variant="ghost"
              type="button"
              onClick={handleClearDateRange}
              className="flex-1 sm:flex-none"
            >
              Limpar
            </Button>
            <Button type="button" onClick={handleApplyDateRange} className="flex-1 sm:flex-none">
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      {mainTab === "gerais" && generalMetrics && (
        <div className="mt-6 grid gap-6">
          {}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard label="Total de reservas" value={generalMetrics.totals.totalReservations} />
            <StatCard label="Reservas ativas" value={generalMetrics.totals.activeReservations} />
            <StatCard label="Check-ins realizados" value={generalMetrics.totals.checkIns} />
            <StatCard label="Espaços bloqueados" value={generalMetrics.totals.blockedSpaces} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Ocupação por dia da semana"
              description="Distribuição das reservas ao longo da semana."
            >
              {}
              <div className="w-full overflow-hidden">
                <ChartContainer
                  config={{ reservas: { label: "Reservas", color: "var(--primary)" } }}
                  className="h-[250px] w-full"
                >
                  <BarChart data={generalMetrics.byDayOfWeek}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Salas mais utilizadas"
              description="Top salas de reunião por número de reservas."
            >
              {generalMetrics.topRooms.length === 0 ? (
                <EmptyChart />
              ) : (
                <div className="w-full overflow-hidden">
                  <ChartContainer
                    config={{ reservas: { label: "Reservas", color: "var(--primary-glow)" } }}
                    className="h-[250px] w-full"
                  >
                    <BarChart data={generalMetrics.topRooms} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        width={100}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              )}
            </ChartCard>

            <ChartCard
              title="Ocupação por time / setor"
              description="Quem mais reserva no escritório."
            >
              {generalMetrics.byDepartment.length === 0 ? (
                <EmptyChart />
              ) : (
                <div className="metrics-pie-layout flex flex-col sm:flex-row items-center gap-6 w-full">
                  <div className="metrics-pie-chart-wrapper shrink-0">
                    <ChartContainer config={{}} className="h-[200px] w-[200px]">
                      <PieChart>
                        <Pie
                          data={generalMetrics.byDepartment}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
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
                  {}
                  <div className="metrics-pie-legend w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {generalMetrics.byDepartment.map((dep: any, i: number) => {
                      const color = PALETTE[i % PALETTE.length];
                      const totalBookings = generalMetrics.totals.totalReservations || 1;
                      const pct = Math.round((dep.value / totalBookings) * 100);
                      return (
                        <div
                          key={dep.name}
                          className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/30"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <span className="font-medium truncate max-w-[100px] sm:max-w-xs">
                              {dep.name}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-xs font-medium">
                            {dep.value} ({pct}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </ChartCard>

            <ChartCard title="Ocupação por andar" description="Comparativo de uso entre andares.">
              <div className="w-full overflow-hidden">
                <ChartContainer
                  config={{ reservas: { label: "Reservas", color: "var(--success)" } }}
                  className="h-[250px] w-full"
                >
                  <BarChart data={generalMetrics.byFloor}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reservas" fill="var(--color-reservas)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {}
      {mainTab === "individual" && (
        <div className="mt-6 grid gap-6 space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="font-semibold text-lg">Busca individual</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione o departamento e depois o colaborador.
            </p>

            {}
            <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex-1 flex flex-col gap-1.5">
                <Label htmlFor="select-dept">Departamento</Label>
                <Select
                  value={selectedDept}
                  onValueChange={(val) => {
                    setSelectedDept(val);
                    setSelectedUserId("");
                  }}
                >
                  <SelectTrigger id="select-dept" className="w-full">
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os departamentos</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <Label htmlFor="select-user">Colaborador</Label>
                <Select value={selectedUserId} onValueChange={(val) => setSelectedUserId(val)}>
                  <SelectTrigger id="select-user" className="w-full">
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {activeUser && (
            <div className="rounded-xl border bg-card p-4 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                {initials(activeUser.name)}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-lg truncate">{activeUser.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {activeUser.email || "Sem e-mail registrado"} · {activeUser.sector || "Sem time"}
                </p>
              </div>
            </div>
          )}

          {userMetrics ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="TOTAL DE RESERVAS" value={userMetrics.stats.total} />
                <StatCard label="DIAS DE MESA" value={userMetrics.stats.desks} />
                <StatCard label="SALAS RESERVADAS" value={userMetrics.stats.rooms} />
                <StatCard label="CHECK-INS" value={userMetrics.stats.checkIns} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Presença por dia da semana"
                  description={`Média de ${userMetrics.stats.avgDaysPerWeek} dia(s) por semana no escritório.`}
                >
                  <div className="w-full overflow-hidden">
                    <ChartContainer
                      config={{ reservas: { label: "Reservas", color: "var(--primary)" } }}
                      className="h-[250px] w-full"
                    >
                      <BarChart data={userMetrics.byDayOfWeek}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="reservas"
                          fill="var(--color-reservas)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </ChartCard>

                <ChartCard
                  title="Ocupação por andar"
                  description="Em qual andar este colaborador mais reserva."
                >
                  <div className="w-full overflow-hidden">
                    <ChartContainer
                      config={{ reservas: { label: "Reservas", color: "var(--success)" } }}
                      className="h-[250px] w-full"
                    >
                      <BarChart data={userMetrics.byFloor}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="reservas"
                          fill="var(--color-reservas)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </ChartCard>
              </div>
            </>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-xl text-muted-foreground bg-muted/20">
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
    <div className="p-4 rounded-xl border bg-card shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-bold mt-1 text-primary">{value || 0}</p>
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
    <section className="p-5 rounded-xl border bg-card shadow-sm flex flex-col">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      <div className="flex-1 flex flex-col justify-end w-full">{children}</div>
    </section>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[200px] border border-dashed rounded-xl bg-muted/20 text-muted-foreground text-sm">
      Sem dados suficientes ainda.
    </div>
  );
}
