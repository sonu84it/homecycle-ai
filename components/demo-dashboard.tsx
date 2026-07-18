"use client";

import { ArrowRight, BadgeDollarSign, Leaf, PackageCheck, Recycle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { actionCount, type DemoScan, getDemoScans } from "@/lib/demo-storage";
import type { ScanAction } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

const actions: ScanAction[] = ["reuse", "donate", "sell", "repair", "upcycle", "recycle"];

export function DemoDashboard() {
  const [scans, setScans] = useState<DemoScan[]>([]);

  useEffect(() => {
    const sync = () => setScans(getDemoScans());
    sync();
    window.addEventListener("homecycle-demo-scans-updated", sync);
    return () => window.removeEventListener("homecycle-demo-scans-updated", sync);
  }, []);

  const recent = scans.slice(0, 3);
  const carbon = scans.reduce((sum, item) => sum + Number(item.analysis.carbonSavedKg ?? 0), 0);
  const landfill = scans.reduce((sum, item) => sum + Number(item.analysis.landfillAvoidedKg ?? 0), 0);
  const resale = scans.reduce((sum, item) => sum + Number(item.analysis.estimatedResaleValueUsd ?? 0), 0);
  const impactScore = Math.min(100, Math.round(carbon * 6 + landfill * 3 + scans.length * 8));

  return (
    <AppShell>
      <section className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Circular home</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Your impact</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/upload">
            Scan item <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Carbon saved", value: `${formatNumber(carbon)} kg`, icon: Leaf },
          { label: "Landfill avoided", value: `${formatNumber(landfill)} kg`, icon: Recycle },
          { label: "Potential resale", value: `$${formatNumber(resale)}`, icon: BadgeDollarSign },
          { label: "Impact score", value: `${impactScore}/100`, icon: PackageCheck }
        ].map((stat) => (
          <Card className="glass p-4 shadow-glass" key={stat.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="size-5 text-primary" />
            </div>
          </Card>
        ))}
      </section>

      <section className="mt-4 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="glass p-4 shadow-glass">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Recent scans</h2>
            {scans.length > 0 && (
              <Link className="text-xs font-semibold text-primary hover:underline" href="/history">
                View all
              </Link>
            )}
          </div>
          {recent.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed bg-white/55 p-5 text-sm text-muted-foreground">
              Your first circular recommendation will appear here.
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {recent.map((scan) => (
                <Link className="flex items-center justify-between gap-3 rounded-lg bg-white/72 px-3 py-2 transition hover:bg-white" href="/history" key={scan.id}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{scan.analysis.objectName}</p>
                    <p className="text-xs capitalize text-muted-foreground">{scan.analysis.recommendedAction}</p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold text-primary">{formatNumber(scan.analysis.carbonSavedKg)} kg CO2e</p>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="glass p-4 shadow-glass">
          <h2 className="font-semibold">Action mix</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => {
              const count = actionCount(scans, action);
              return (
                <span className="rounded-md bg-white/74 px-2 py-1 text-xs font-semibold capitalize" key={action}>
                  {action} {count}
                </span>
              );
            })}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
