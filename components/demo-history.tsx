"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { type DemoScan, getDemoScans } from "@/lib/demo-storage";
import { formatNumber } from "@/lib/utils";

export function DemoHistory() {
  const [scans, setScans] = useState<DemoScan[]>([]);

  useEffect(() => {
    const sync = () => setScans(getDemoScans());
    sync();
    window.addEventListener("homecycle-demo-scans-updated", sync);
    return () => window.removeEventListener("homecycle-demo-scans-updated", sync);
  }, []);

  return (
    <AppShell>
      <section className="mb-6">
        <p className="text-sm font-semibold text-primary">Session history</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Your demo circular inventory</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          These scans are stored only in this browser session for a no-login demo.
        </p>
      </section>

      {scans.length === 0 ? (
        <Card className="glass shadow-glass">
          <CardContent className="p-10 text-center">
            <p className="font-semibold">No saved items yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Run your first scan to start building household history.</p>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {scans.map((scan) => (
            <Card key={scan.id} className="glass overflow-hidden shadow-glass">
              <div className="relative aspect-[4/3] bg-white/60">
                <Image
                  alt={scan.analysis.objectName}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  src={scan.imageDataUrl}
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{scan.analysis.objectName}</CardTitle>
                    <p className="mt-1 text-sm capitalize text-muted-foreground">
                      {scan.analysis.category} · {scan.analysis.condition}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold capitalize text-emerald-900">
                    {scan.analysis.recommendedAction}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                <MiniStat label="CO2e" value={`${formatNumber(scan.analysis.carbonSavedKg)} kg`} />
                <MiniStat label="Landfill" value={`${formatNumber(scan.analysis.landfillAvoidedKg)} kg`} />
                <MiniStat label="Value" value={`$${formatNumber(scan.analysis.estimatedResaleValueUsd)}`} />
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </AppShell>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/70 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}
