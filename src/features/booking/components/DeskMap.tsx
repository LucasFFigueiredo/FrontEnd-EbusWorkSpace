"use client";

import { cn } from "@/core/utils/cn";
import { LayoutGrid } from "lucide-react";
import type { DeskMapResource } from "@/core/models/booking.types";

interface DeskMapProps {
  desks: DeskMapResource[];
  selectedId: string;
  onSelect: (id: string) => void;
  tablesLayout: number[];
  floorId: string;
  compact?: boolean;
}

export function DeskMap({
  desks,
  selectedId,
  onSelect,
  tablesLayout,
  floorId,
  compact = false,
}: DeskMapProps) {
  let deskCounter = 0;

  return (
    <div className="flex flex-col gap-4 w-full">
      {!compact && (
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground px-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full border border-border bg-card shadow-sm"></span>
            Disponível
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-primary shadow-sm"></span>
            Selecionada
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-muted-foreground/60 shadow-sm"></span>
            Ocupada
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-destructive/70 shadow-sm"></span>
            Bloqueada
          </div>
        </div>
      )}

      <div
        className={cn(
          "relative flex w-full rounded-xl border border-border bg-background overflow-x-auto",
          compact ? "p-3" : "p-3 sm:p-6",
        )}
      >
        {!compact && (
          <div className="flex shrink-0 items-center justify-center border-r-2 border-dashed border-border pr-2 sm:pr-4 mr-2 sm:mr-6">
            <span
              className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-muted-foreground/60"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              JANELAS
            </span>
          </div>
        )}

        <div
          className={cn(
            "flex flex-1 flex-col items-center py-1",
            compact ? "gap-3 w-full" : "gap-6 w-full",
          )}
        >
          {!compact && (floorId === "f2" || floorId === "2") && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
              <LayoutGrid className="h-4 w-4 text-primary" /> Arquibancada
            </div>
          )}
          {!compact && (floorId === "f13" || floorId === "13") && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
              <LayoutGrid className="h-4 w-4 text-primary" /> Salas Diretoria
            </div>
          )}

          <div className={cn("grid w-full", compact ? "gap-3" : "gap-8 max-w-2xl")}>
            {tablesLayout.map((seats, tableIndex) => {
              const groupDesks = desks.slice(deskCounter, deskCounter + seats);
              deskCounter += seats;

              if (groupDesks.length === 0) return null;

              const isSeven = seats === 7;
              const topCount = isSeven ? 3 : Math.ceil(groupDesks.length / 2);
              const bottomCount = isSeven ? 3 : groupDesks.length - topCount;

              const topDesks = groupDesks.slice(0, topCount);
              const bottomDesks = groupDesks.slice(topCount, topCount + bottomCount);
              const rightDesk = isSeven ? groupDesks[6] : null;

              return (
                <div
                  key={`table-${tableIndex}`}
                  className={cn("flex w-full", compact ? "gap-2" : "gap-2")}
                >
                  { }
                  <div className={cn("flex flex-col flex-1", compact ? "gap-2" : "gap-1.5")}>
                    { }
                    <div
                      className={cn("grid", compact ? "gap-2" : "gap-1.5")}
                      style={{ gridTemplateColumns: `repeat(${topCount}, minmax(0, 1fr))` }}
                    >
                      {topDesks.map((desk) => (
                        <DeskButton
                          key={desk.id}
                          desk={desk}
                          selectedId={selectedId}
                          onSelect={onSelect}
                          compact={compact}
                        />
                      ))}
                    </div>

                    {!compact && (
                      <div className="h-10 w-full rounded-md border border-border bg-muted/50 shadow-inner" />
                    )}
                    {compact && (
                      <div className="h-2.5 w-full rounded-md border border-border bg-muted/60" />
                    )}

                    <div
                      className={cn("grid", compact ? "gap-2" : "gap-1.5")}
                      style={{ gridTemplateColumns: `repeat(${bottomCount}, minmax(0, 1fr))` }}
                    >
                      {bottomDesks.map((desk) => (
                        <DeskButton
                          key={desk.id}
                          desk={desk}
                          selectedId={selectedId}
                          onSelect={onSelect}
                          compact={compact}
                        />
                      ))}
                    </div>
                  </div>

                  {rightDesk && (
                    <div className={cn("flex shrink-0", compact ? "w-8" : "w-10 sm:w-12")}>
                      <DeskButton
                        desk={rightDesk}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        vertical
                        compact={compact}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!compact && (
          <div className="flex shrink-0 items-center justify-center border-l-2 border-dashed border-border pl-2 sm:pl-4 ml-2 sm:ml-6">
            <span
              className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-muted-foreground/60"
              style={{ writingMode: "vertical-rl" }}
            >
              CORREDOR
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function DeskButton({
  desk,
  selectedId,
  onSelect,
  vertical = false,
  compact = false,
}: {
  desk: DeskMapResource;
  selectedId: string;
  onSelect: (id: string) => void;
  vertical?: boolean;
  compact?: boolean;
}) {
  const isSelected = selectedId === desk.id;
  const isAvailable = desk.active;

  const title = !isAvailable
    ? desk.bookedBy
      ? `Ocupada por ${desk.bookedBy}`
      : desk.blockedReason || "Mesa Indisponível"
    : desk.name;

  let stateClass = "";
  if (isSelected) {
    stateClass =
      "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2";
  } else if (!isAvailable) {
    if (desk.bookedBy) {
      stateClass = "bg-muted text-muted-foreground border-border cursor-not-allowed";
    } else {
      stateClass = "bg-destructive/10 text-destructive border-destructive/30 cursor-not-allowed";
    }
  } else {
    stateClass =
      "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary cursor-pointer";
  }

  const dimensions = vertical
    ? compact
      ? "w-full h-full min-h-[4rem] py-1.5"
      : "w-full h-full min-h-[6rem] py-4"
    : compact
      ? "w-full h-8"
      : "w-full h-10";

  return (
    <button
      type="button"
      title={title}
      onClick={() => {
        if (isAvailable) {
          onSelect(desk.id);
        } else {
          import("sonner").then(({ toast }) => {
            toast.info(title, {
              description: "Esta mesa não pode ser selecionada.",
            });
          });
        }
      }}
      className={cn(
        "flex items-center justify-center rounded-md border font-medium transition-all shadow-sm",
        compact ? "text-[10px]" : "text-[11px] sm:text-xs",
        stateClass,
        dimensions,
      )}
    >
      <span className={vertical ? "-rotate-90 block whitespace-nowrap" : ""}>
        {desk.name.split(" ").pop()}
      </span>
    </button>
  );
}
