"use client";

import { ArrowRight, BadgeDollarSign, Leaf, PackageCheck, Recycle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
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

  const recent = scans.slice(0, 6);
  const carbon = scans.reduce((sum, item) => sum + Number(item.analysis.carbonSavedKg ?? 0), 0);
  const landfill = scans.reduce((sum, item) => sum + Number(item.analysis.landfillAvoidedKg ?? 0), 0);
  const resale = scans.reduce((sum, item) => sum + Number(item.analysis.estimatedResaleValueUsd ?? 0), 0);
  const impactScore = Math.min(100, Math.round(carbon * 6 + landfill * 3 + scans.length * 8));

  return (
    <AppShell>
      <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-primary">Circular home dashboard</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Demo household impact</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            No login needed. This demo keeps scans in this browser session and limits analysis volume for safety.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/upload">
            Scan an item <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Carbon saved", value: `${formatNumber(carbon)} kg`, icon: Leaf },
          { label: "Landfill avoided", value: `${formatNumber(landfill)} kg`, icon: Recycle },
          { label: "Potential resale", value: `$${formatNumber(resale)}`, icon: BadgeDollarSign },
          { label: "Impact score", value: `${impactScore}/100`, icon: PackageCheck }
        ].map((stat) => (
          <Card key={stat.label} className="glass shadow-glass">
            <CardHeader className="pb-3">
              <stat.icon className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass shadow-glass">
          <CardHeader>
            <CardTitle>Recent scans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-white/55 p-8 text-center">
                <p className="font-semibold">No scans yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload a household item to create your first recommendation.
                </p>
              </div>
            ) : (
              recent.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/72 p-3 shadow-sm">
                  <div>
                    <p className="font-semibold">{scan.analysis.objectName}</p>
                    <p className="text-sm capitalize text-muted-foreground">
                      {scan.analysis.category} · {scan.analysis.recommendedAction}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-primary">{formatNumber(scan.analysis.carbonSavedKg)} kg CO2e</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="glass shadow-glass">
          <CardHeader>
            <CardTitle>Action mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actions.map((action) => {
              const count = actionCount(scans, action);
              const width = scans.length ? `${Math.max(10, (count / scans.length) * 100)}%` : "10%";
              return (
                <div key={action}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize">{action}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/70">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
