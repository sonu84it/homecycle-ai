"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Camera, CheckCircle2, CloudUpload, Loader2, Recycle, Sparkles, Store, Wrench } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import {
  demoScanLimit,
  getAnalysisCount,
  getDemoSessionId,
  incrementAnalysisCount,
  remainingAnalyses,
  saveDemoScan
} from "@/lib/demo-storage";
import type { AiAnalysis } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";

const maxUploadBytes = 8 * 1024 * 1024;
const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

export function UploadExperience() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [warning, setWarning] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [remaining, setRemaining] = useState(demoScanLimit);

  const canSubmit = Boolean(file) && !saving && remaining > 0;

  useEffect(() => {
    setRemaining(remainingAnalyses());
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectFile(nextFile?: File) {
    if (!nextFile) return;
    if (!allowedTypes.includes(nextFile.type)) {
      setError("Use a PNG, JPG, or WebP image.");
      return;
    }
    if (nextFile.size > maxUploadBytes) {
      setError("Image must be smaller than 8 MB for a reliable demo upload.");
      return;
    }
    setFile(nextFile);
    setAnalysis(null);
    setWarning("");
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(nextFile));
  }

  async function analyze() {
    if (!file) return;
    if (getAnalysisCount() >= demoScanLimit) {
      setRemaining(0);
      setError(`Demo limit reached: ${demoScanLimit} image analyses per browser session.`);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const imageDataUrl = await fileToDataUrl(file);
      const thumbnail = await createThumbnail(file);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imageDataUrl, sessionId: getDemoSessionId() })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Analysis failed.");
      }

      const nextAnalysis = payload.analysis as AiAnalysis;
      setAnalysis(nextAnalysis);
      setWarning(payload.warning ?? "");
      saveDemoScan({
        id: crypto.randomUUID(),
        imageDataUrl: thumbnail,
        analysis: nextAnalysis,
        createdAt: new Date().toISOString()
      });
      setRemaining(demoScanLimit - incrementAnalysisCount());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const actionColor = useMemo(() => {
    const action = analysis?.recommendedAction;
    if (action === "sell") return "bg-amber-100 text-amber-900";
    if (action === "donate") return "bg-sky-100 text-sky-900";
    if (action === "repair") return "bg-orange-100 text-orange-900";
    return "bg-emerald-100 text-emerald-900";
  }, [analysis]);

  return (
    <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="glass shadow-glass">
        <CardHeader>
          <CardTitle className="text-2xl">Upload an item</CardTitle>
          <p className="text-sm text-muted-foreground">Use a clear photo with the whole object visible.</p>
          <p className="text-xs font-semibold text-primary">
            Demo safety limit: {remaining} of {demoScanLimit} analyses left this browser session.
          </p>
        </CardHeader>
        <CardContent>
          <label
            className={cn(
              "flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-white/62 p-6 text-center transition",
              dragging && "scale-[0.99] border-primary bg-white/86"
            )}
            onDragLeave={() => setDragging(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              selectFile(event.dataTransfer.files?.[0]);
            }}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Selected household item" className="h-full w-full rounded-lg object-cover" src={preview} />
            ) : (
              <>
                <div className="flex size-16 items-center justify-center rounded-xl bg-primary/10">
                  <CloudUpload className="size-9 text-primary" />
                </div>
                <p className="mt-4 text-lg font-semibold">Drop a photo here</p>
                <p className="mt-2 text-sm text-muted-foreground">Camera, gallery, PNG, JPG, or WebP</p>
                <p className="mt-1 text-xs text-muted-foreground">Maximum 8 MB</p>
              </>
            )}
            <input
              accept="image/png,image/jpeg,image/webp"
              capture="environment"
              className="sr-only"
              onChange={(event) => selectFile(event.target.files?.[0])}
              type="file"
            />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full" disabled={!canSubmit} onClick={analyze}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {saving ? "Analyzing..." : "Analyze with AI"}
            </Button>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/history">View history</Link>
            </Button>
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {warning && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{warning}</p>}
        </CardContent>
      </Card>

      <Card className="glass shadow-glass">
        <CardHeader>
          <CardTitle className="text-2xl">Recommendation</CardTitle>
          <p className="text-sm text-muted-foreground">Your AI analysis appears here after upload.</p>
        </CardHeader>
        <CardContent>
          {saving ? (
            <AnalysisSkeleton />
          ) : !analysis ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-white/48 p-8 text-center">
              <div>
                <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary/10">
                  <Camera className="size-8 text-primary" />
                </div>
                <p className="mt-4 font-semibold">Ready for a scan</p>
                <p className="mt-2 text-sm text-muted-foreground">The saved result will be added to your dashboard automatically.</p>
              </div>
            </div>
          ) : (
            <motion.div animate={{ opacity: 1, y: 0 }} className="space-y-4" initial={{ opacity: 0, y: 12 }}>
              <div className="rounded-xl bg-white/72 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{analysis.category}</p>
                    <h2 className="mt-1 text-3xl font-bold">{analysis.objectName}</h2>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-sm font-bold capitalize", actionColor)}>
                    {analysis.recommendedAction}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{analysis.reasoning}</p>
                {warning && (
                  <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-900">
                    Demo fallback active: OpenAI quota needs billing/credits for image-specific analysis.
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Material", analysis.primaryMaterial],
                  ["Condition", analysis.condition],
                  ["Confidence", `${Math.round(analysis.confidence * 100)}%`]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white/72 p-4 shadow-sm">
                    <p className="text-xs uppercase text-muted-foreground">{label}</p>
                    <p className="mt-1 font-semibold capitalize">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Impact label="CO2e saved" value={`${formatNumber(analysis.carbonSavedKg)} kg`} />
                <Impact label="Landfill avoided" value={`${formatNumber(analysis.landfillAvoidedKg)} kg`} />
                <Impact label="Resale estimate" value={`$${formatNumber(analysis.estimatedResaleValueUsd)}`} />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Signal enabled={analysis.canDonate} icon={Recycle} label="Donation fit" />
                <Signal enabled={analysis.canSell} icon={Store} label="Resale fit" />
                <Signal enabled={analysis.canRepair} icon={Wrench} label="Repair fit" />
              </div>

              <div className="rounded-xl bg-white/72 p-5 shadow-sm">
                <h3 className="font-semibold">Next steps</h3>
                <div className="mt-3 space-y-2">
                  {analysis.nextSteps.map((step) => (
                    <div key={step} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 p-5 text-amber-950 shadow-sm">
                <div className="flex gap-2">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <p className="text-sm leading-6">{analysis.disposalSafetyNotes}</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="min-h-[420px] space-y-4 rounded-xl bg-white/48 p-5">
      <div className="h-28 animate-pulse rounded-xl bg-white/70" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-20 animate-pulse rounded-lg bg-white/70" />
        <div className="h-20 animate-pulse rounded-lg bg-white/70" />
        <div className="h-20 animate-pulse rounded-lg bg-white/70" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-lg bg-primary/20" />
        <div className="h-24 animate-pulse rounded-lg bg-primary/20" />
        <div className="h-24 animate-pulse rounded-lg bg-primary/20" />
      </div>
      <div className="h-32 animate-pulse rounded-xl bg-white/70" />
    </div>
  );
}

function Impact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-primary p-4 text-primary-foreground shadow-sm">
      <p className="text-xs opacity-80">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function Signal({
  enabled,
  icon: Icon,
  label
}: {
  enabled: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className={cn("rounded-lg p-4 shadow-sm", enabled ? "bg-emerald-100 text-emerald-950" : "bg-white/62 text-muted-foreground")}>
      <Icon className="size-4" />
      <p className="mt-2 text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs">{enabled ? "Recommended" : "Lower fit"}</p>
    </div>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

function createThumbnail(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 720;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not prepare image preview."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not prepare image preview."));
    };
    image.src = objectUrl;
  });
}
