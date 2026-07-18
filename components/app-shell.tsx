import { History, Home, Recycle, ScanLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="aurora min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4">
        <header className="glass sticky top-4 z-20 mb-6 flex items-center justify-between rounded-xl px-4 py-3 shadow-glass">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Recycle className="size-5" />
            </span>
            <span className="hidden sm:inline">HomeCycle AI</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Button asChild size="sm" variant="ghost">
              <Link href="/dashboard">
                <Home className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/upload">
                <ScanLine className="size-4" />
                <span className="hidden sm:inline">Scan</span>
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/history">
                <History className="size-4" />
                <span className="hidden sm:inline">History</span>
              </Link>
            </Button>
          </nav>
        </header>
        {children}
      </div>
    </main>
  );
}
