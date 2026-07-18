import { ArrowRight, History, LayoutDashboard, Recycle, ScanLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-foreground text-white">
      <section className="relative isolate min-h-screen overflow-hidden">
        <Image
          alt="A repaired chair, donated books, reusable jar, faded shirt, smartphone, and recyclable laundry basket in a sunlit home"
          className="-z-20 object-cover"
          fill
          priority
          sizes="100vw"
          src="/hero/homecycle-overview.png"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/20" />

        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link className="flex items-center gap-2 font-bold" href="/">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Recycle className="size-5" />
            </span>
            HomeCycle AI
          </Link>
          <div className="flex items-center gap-1">
            <Button asChild aria-label="Dashboard" size="sm" variant="ghost" className="text-white hover:bg-white/15">
              <Link href="/dashboard">
                <LayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </Button>
            <Button asChild aria-label="View history" size="sm" variant="ghost" className="text-white hover:bg-white/15">
              <Link href="/history">
                <History className="size-4" />
                <span className="hidden sm:inline">History</span>
              </Link>
            </Button>
          </div>
        </nav>

        <div className="mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl items-center px-5 pb-20">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-emerald-200">A practical second life for every item</p>
            <h1 className="mt-3 text-5xl font-bold leading-[1.05] sm:text-6xl">HomeCycle AI</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-white/88">
              See the clearest reuse, repair, donation, resale, upcycling, or recycling path from one household photo.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/85">
              <span>Repair</span>
              <span>Reuse</span>
              <span>Donate</span>
              <span>Resell</span>
              <span>Recycle</span>
            </div>
            <Button asChild className="mt-8 bg-primary hover:bg-primary/90" size="lg">
              <Link href="/upload">
                Scan an item <ScanLine className="size-4" />
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
