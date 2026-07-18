"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/card";
import { type DemoScan, getDemoScans } from "@/lib/demo-storage";
import { formatNumber } from "@/lib/utils";

export function DemoHistory() {
  const [scans, setScans] = useState<DemoScan[]>([]);
  const [expandedScanId, setExpandedScanId] = useState("");

  useEffect(() => {
    const sync = () => setScans(getDemoScans());
    sync();
    window.addEventListener("homecycle-demo-scans-updated", sync);
    return () => window.removeEventListener("homecycle-demo-scans-updated", sync);
  }, []);

  return (
    <AppShell>
      <section className="mb-4">
        <p className="text-sm font-semibold text-primary">Session history</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Your scanned items</h1>
      </section>

      {scans.length === 0 ? (
        <Card className="glass max-w-xl p-6 shadow-glass">
          <p className="font-semibold">No saved items yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Your completed scans will be kept here for this browser session.</p>
        </Card>
      ) : (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {scans.map((scan) => {
            const expanded = expandedScanId === scan.id;
            return (
              <Card className="glass overflow-hidden shadow-glass" key={scan.id}>
                <button
                  aria-expanded={expanded}
                  className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setExpandedScanId(expanded ? "" : scan.id)}
                  type="button"
                >
                  <div className="relative aspect-[16/7] bg-white/60">
                    <Image alt={scan.analysis.objectName} className="object-cover" fill sizes="(min-width: 1280px) 31vw, (min-width: 768px) 48vw, 100vw" src={scan.imageDataUrl} />
                  </div>
                  <div className="flex items-start justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{scan.analysis.objectName}</p>
                      <p className="mt-1 text-xs capitalize text-muted-foreground">{scan.analysis.category}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold capitalize text-emerald-900">
                      {scan.analysis.recommendedAction}
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div className="border-t bg-white/66 p-3">
                    <div className="grid grid-cols-3 gap-2">
                      <MiniStat label="CO2e" value={`${formatNumber(scan.analysis.carbonSavedKg)} kg`} />
                      <MiniStat label="Landfill" value={`${formatNumber(scan.analysis.landfillAvoidedKg)} kg`} />
                      <MiniStat label="Value" value={`$${formatNumber(scan.analysis.estimatedResaleValueUsd)}`} />
                    </div>
                    {scan.analysis.outputIdeas && scan.analysis.outputIdeas.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-1">
                        {scan.analysis.outputIdeas.map((idea) => (
                          <div className="relative aspect-square overflow-hidden rounded-md bg-white/70" key={idea.title} title={idea.title}>
                            <Image alt={idea.title} className="object-cover" fill sizes="90px" src={idea.imageUrl} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </section>
      )}
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-2">
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-bold">{value}</p>
    </div>
  );
}
