import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader } from "@/components/card";

export function PageSkeleton() {
  return (
    <AppShell>
      <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="w-full max-w-2xl space-y-3">
          <div className="h-4 w-40 animate-pulse rounded-full bg-white/70" />
          <div className="h-12 w-3/4 animate-pulse rounded-lg bg-white/70" />
          <div className="h-5 w-full animate-pulse rounded-full bg-white/60" />
        </div>
        <div className="h-12 w-36 animate-pulse rounded-lg bg-white/70" />
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Card key={item} className="glass shadow-glass">
            <CardHeader>
              <div className="h-5 w-5 animate-pulse rounded bg-white/70" />
              <div className="h-4 w-24 animate-pulse rounded bg-white/70" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-28 animate-pulse rounded bg-white/70" />
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-80 animate-pulse rounded-xl bg-white/60" />
        <div className="h-80 animate-pulse rounded-xl bg-white/60" />
      </section>
    </AppShell>
  );
}
