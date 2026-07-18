"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Camera, CheckCircle2, Loader2, Sparkles, X } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  demoScanLimit,
  getAnalysisCount,
  incrementAnalysisCount,
  remainingAnalyses,
  saveDemoScan
} from "@/lib/demo-storage";
import { getStaticDemoInput, staticDemoInputs } from "@/lib/static-demo";
import type { AiAnalysis, ScanAction } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

export function UploadExperience() {
  const [inputMode, setInputMode] = useState<"idle" | "static">("idle");
  const [selectedStaticInputId, setSelectedStaticInputId] = useState("");
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [expandedIdeaTitle, setExpandedIdeaTitle] = useState("");
  const [inputDetailsOpen, setInputDetailsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(demoScanLimit);

  const selectedStaticInput = selectedStaticInputId ? getStaticDemoInput(selectedStaticInputId) : undefined;
  const currentImage = selectedStaticInput?.imageUrl;
  const currentTitle = selectedStaticInput?.title || "Selected item";
  const canSubmit = Boolean(currentImage) && !saving && remaining > 0;

  useEffect(() => {
    setRemaining(remainingAnalyses());
  }, []);

  function clearAnalysis() {
    setAnalysis(null);
    setExpandedIdeaTitle("");
    setInputDetailsOpen(false);
    setError("");
  }

  function chooseInput(value: string) {
    clearAnalysis();
    setSelectedStaticInputId(value);
    setInputMode(value ? "static" : "idle");
  }

  function resetInput() {
    setSelectedStaticInputId("");
    setInputMode("idle");
    clearAnalysis();
  }

  async function analyze() {
    if (!selectedStaticInput) return;
    if (getAnalysisCount() >= demoScanLimit) {
      setRemaining(0);
      setError(`This browser session has reached its ${demoScanLimit}-scan demo limit.`);
      return;
    }

    setSaving(true);
    setError("");
    setExpandedIdeaTitle("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      setAnalysis(selectedStaticInput.analysis);
      saveDemoScan({
        id: crypto.randomUUID(),
        imageDataUrl: selectedStaticInput.imageUrl,
        analysis: selectedStaticInput.analysis,
        createdAt: new Date().toISOString()
      });
      setRemaining(demoScanLimit - incrementAnalysisCount());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const hasResults = saving || analysis;

  return (
    <div className="pb-3">
      <section
        className={cn(
          "grid gap-4",
          !hasResults && "min-h-[calc(100vh-96px)] place-items-center",
          hasResults && "xl:grid-cols-[320px_minmax(0,1fr)]"
        )}
      >
        <Card className={cn("glass shadow-glass", !hasResults && "mx-auto w-full max-w-2xl")}>
          <div className="flex items-start justify-between gap-4 p-5 pb-0">
            <div>
              <p className="text-sm font-semibold text-primary">HomeCycle AI</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Choose an item</h1>
              {inputMode === "idle" && <p className="mt-2 text-sm text-muted-foreground">Choose one of the curated demo items.</p>}
            </div>
            <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary" title="Demo session limit">
              {remaining}/{demoScanLimit}
            </span>
          </div>

          <CardContent className="pt-5">
            <label className="block text-sm font-semibold" htmlFor="demo-input">
              Demo item
            </label>
            <select
              className="mt-2 h-11 w-full rounded-lg border border-input bg-white/85 px-3 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              id="demo-input"
              onChange={(event) => chooseInput(event.target.value)}
              value={selectedStaticInputId}
            >
              <option disabled value="">
                Select a demo item
              </option>
              {staticDemoInputs.map((input) => (
                <option key={input.id} value={input.id}>
                  {input.title}
                </option>
              ))}
            </select>

            {currentImage && (
              <motion.div animate={{ opacity: 1, y: 0 }} className="mt-4" initial={{ opacity: 0, y: 8 }}>
                <button
                  aria-expanded={inputDetailsOpen}
                  className="group relative block w-full overflow-hidden rounded-lg border bg-white text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setInputDetailsOpen((isOpen) => !isOpen)}
                  type="button"
                >
                  <div className="relative aspect-[16/9]">
                    <NextImage alt={currentTitle} className="object-cover" fill sizes="(min-width: 1280px) 300px, (min-width: 640px) 540px, 100vw" src={currentImage} />
                  </div>
                  <span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-lg bg-white/92 text-primary shadow-sm transition group-hover:scale-105">
                    <Camera className="size-4" />
                    <span className="sr-only">Show input details</span>
                  </span>
                </button>

                {inputDetailsOpen && (
                  <motion.div animate={{ opacity: 1, height: "auto" }} className="mt-3 rounded-lg border bg-white/74 p-3" initial={{ opacity: 0, height: 0 }}>
                    <p className="text-sm font-semibold">{currentTitle}</p>
                    {analysis ? (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <MiniDetail label="Material" value={analysis.primaryMaterial} />
                        <MiniDetail label="Condition" value={analysis.condition} />
                        <MiniDetail label="Confidence" value={`${Math.round(analysis.confidence * 100)}%`} />
                      </div>
                    ) : (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">Your item is selected and ready for a circular-life recommendation.</p>
                    )}
                  </motion.div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button className="flex-1" disabled={!canSubmit} onClick={analyze}>
                    {saving ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    {saving ? "Analyzing" : "Analyze with AI"}
                  </Button>
                  <Button aria-label="Choose a different input" onClick={resetInput} title="Choose a different input" variant="outline">
                    <X className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          </CardContent>
        </Card>

        {hasResults && (
          <Card className="glass overflow-hidden shadow-glass">
            <div className="flex items-start justify-between gap-4 p-5 pb-0">
              <div>
                <p className="text-sm font-semibold text-primary">Your next best option</p>
                <h2 className="mt-1 text-2xl font-bold">{analysis?.objectName ?? "Finding circular options"}</h2>
              </div>
              {analysis && <span className={cn("rounded-md px-2 py-1 text-xs font-bold capitalize", actionTone(analysis.recommendedAction))}>{analysis.recommendedAction}</span>}
            </div>
            <CardContent className="pt-5">
              {saving ? (
                <AnalysisSkeleton />
              ) : analysis ? (
                <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 8 }}>
                  <p className="text-sm text-muted-foreground">Choose an outcome image to see its impact and practical steps.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {analysis.outputIdeas?.map((idea) => (
                      <button
                        aria-pressed={expandedIdeaTitle === idea.title}
                        key={idea.title}
                        className={cn(
                          "group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          expandedIdeaTitle === idea.title ? "border-primary ring-2 ring-primary/20" : "border-white"
                        )}
                        onClick={() => setExpandedIdeaTitle(idea.title)}
                        type="button"
                      >
                        <div className="relative aspect-[4/3]">
                          <NextImage alt={idea.title} className="object-cover transition duration-300 group-hover:scale-[1.02]" fill sizes="(min-width: 640px) 30vw, 100vw" src={idea.imageUrl} />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-bold">{idea.title}</p>
                          <p className="mt-1 text-xs font-semibold capitalize text-primary">{idea.action}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {(analysis.outputIdeas ?? [])
                    .filter((idea) => idea.title === expandedIdeaTitle)
                    .map((idea) => (
                      <motion.div animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg border bg-white/86 p-4" initial={{ opacity: 0, y: 8 }} key={idea.title}>
                        <p className="text-sm leading-6 text-muted-foreground">{idea.summary}</p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          <Impact label="Carbon saved" value={`${formatNumber(idea.carbonSavedKg)} kg`} />
                          <Impact label="Landfill avoided" value={`${formatNumber(idea.landfillAvoidedKg)} kg`} />
                          <Impact label="Potential resale" value={`$${formatNumber(idea.estimatedResaleValueUsd)}`} />
                        </div>
                        <div className="mt-4 space-y-2">
                          {idea.details.map((detail) => (
                            <div className="flex gap-2 text-sm text-muted-foreground" key={detail}>
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                        <details className="mt-4 border-t pt-3">
                          <summary className="cursor-pointer text-sm font-semibold">Care and disposal notes</summary>
                          <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
                            <p>{analysis.reasoning}</p>
                            <p>{analysis.disposalSafetyNotes}</p>
                            {analysis.nextSteps.map((step) => (
                              <p className="flex gap-2" key={step}>
                                <AlertTriangle className="mt-1 size-4 shrink-0 text-amber-700" />
                                <span>{step}</span>
                              </p>
                            ))}
                          </div>
                        </details>
                      </motion.div>
                    ))}
                </motion.div>
              ) : null}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-white/70" />
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-white/70" />
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-white/70" />
      </div>
      <div className="h-20 animate-pulse rounded-lg bg-white/70" />
    </div>
  );
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-2">
      <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-xs font-semibold capitalize">{value}</p>
    </div>
  );
}

function Impact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-primary p-3 text-primary-foreground shadow-sm">
      <p className="text-xs opacity-80">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

function actionTone(action: ScanAction) {
  if (action === "sell") return "bg-amber-100 text-amber-900";
  if (action === "donate") return "bg-sky-100 text-sky-900";
  if (action === "repair") return "bg-orange-100 text-orange-900";
  return "bg-emerald-100 text-emerald-900";
}
