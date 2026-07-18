import { ArrowRight, Camera, Leaf, Recycle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

const features = [
  {
    icon: Camera,
    title: "Scan anything at home",
    copy: "Upload a photo and get a structured sustainability read in seconds."
  },
  {
    icon: Sparkles,
    title: "AI action plan",
    copy: "GPT vision estimates condition, materials, value, and the most useful next step."
  },
  {
    icon: Leaf,
    title: "Track your impact",
    copy: "See carbon savings, landfill diversion, and circular-economy wins over time."
  }
];

export default function LandingPage() {
  return (
    <main className="aurora min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2 text-base font-bold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Recycle className="size-5" />
          </span>
          HomeCycle AI
        </Link>
        <Button asChild variant="outline">
          <Link href="/dashboard">Open demo</Link>
        </Button>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-82px)] max-w-7xl items-center gap-10 px-5 pb-14 pt-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-white/68 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
            <Leaf className="size-4 text-primary" />
            Built for lower-waste households
          </div>
          <h1 className="text-5xl font-bold tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            Give every household item a smarter second life.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            HomeCycle AI identifies unused objects from photos and recommends whether to reuse, donate, sell,
            repair, upcycle, or recycle with measurable environmental impact.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/upload">
                Start scanning <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="glass rounded-xl p-4 shadow-glass">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="aspect-[4/3] rounded-lg bg-[linear-gradient(135deg,#dff4e9,#f9d79a_54%,#cdebf3)] p-5">
                <div className="flex h-full flex-col justify-between rounded-lg border border-white/55 bg-white/50 p-5 backdrop-blur">
                  <div>
                    <p className="text-sm font-semibold text-primary">AI recommendation</p>
                    <h2 className="mt-2 text-3xl font-bold">Donate locally</h2>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                      Good-condition desk lamp, mixed metal and plastic. Donation beats recycling by preserving
                      product utility.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["2.6 kg CO2e", "$18 value", "91% fit"].map((item) => (
                      <div key={item} className="rounded-lg bg-white/82 p-3 text-sm font-semibold shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-16 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="glass border-white/70 p-5 shadow-glass">
            <feature.icon className="size-6 text-primary" />
            <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.copy}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
