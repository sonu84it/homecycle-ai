import { z } from "zod";
import type { AiAnalysis } from "@/lib/types";

const actionSchema = z.enum(["reuse", "donate", "sell", "repair", "upcycle", "recycle"]);

export const aiAnalysisSchema = z.object({
  objectName: z.string().min(1).max(80),
  category: z.string().min(1).max(60),
  primaryMaterial: z.string().min(1).max(60),
  secondaryMaterials: z.array(z.string().min(1).max(40)).max(5).default([]),
  condition: z.enum(["excellent", "good", "fair", "poor", "unknown"]),
  canReuse: z.boolean(),
  canDonate: z.boolean(),
  canSell: z.boolean(),
  canRepair: z.boolean(),
  canUpcycle: z.boolean(),
  canRecycle: z.boolean(),
  recommendedAction: actionSchema,
  alternativeActions: z.array(actionSchema).max(3).default([]),
  confidence: z.number().min(0).max(1),
  estimatedResaleValueUsd: z.number().min(0).max(5000),
  estimatedRepairCostUsd: z.number().min(0).max(5000),
  carbonSavedKg: z.number().min(0).max(1000),
  landfillAvoidedKg: z.number().min(0).max(1000),
  disposalSafetyNotes: z.string().min(1).max(220),
  reasoning: z.string().min(1).max(420),
  nextSteps: z.array(z.string().min(1).max(160)).min(3).max(5),
  marketplaceTips: z.array(z.string().min(1).max(160)).min(2).max(4)
});

export type NormalizedAiAnalysis = z.infer<typeof aiAnalysisSchema>;

export function normalizeAnalysis(input: unknown): NormalizedAiAnalysis {
  const parsed = aiAnalysisSchema.parse(input);
  return {
    ...parsed,
    confidence: clamp(parsed.confidence, 0, 1),
    estimatedResaleValueUsd: Math.round(clamp(parsed.estimatedResaleValueUsd, 0, 5000)),
    estimatedRepairCostUsd: Math.round(clamp(parsed.estimatedRepairCostUsd, 0, 5000)),
    carbonSavedKg: roundOne(clamp(parsed.carbonSavedKg, 0, 1000)),
    landfillAvoidedKg: roundOne(clamp(parsed.landfillAvoidedKg, 0, 1000))
  };
}

export function createQuotaFallbackAnalysis(): AiAnalysis {
  return {
    objectName: "Demo household item",
    category: "Household goods",
    primaryMaterial: "Mixed material",
    secondaryMaterials: ["Unknown"],
    condition: "unknown",
    canReuse: true,
    canDonate: true,
    canSell: false,
    canRepair: false,
    canUpcycle: true,
    canRecycle: true,
    recommendedAction: "donate",
    alternativeActions: ["reuse", "upcycle", "recycle"],
    confidence: 0.42,
    estimatedResaleValueUsd: 0,
    estimatedRepairCostUsd: 0,
    carbonSavedKg: 1.2,
    landfillAvoidedKg: 0.8,
    disposalSafetyNotes:
      "Demo fallback mode is active because the OpenAI project has no available quota. Verify batteries, electronics, sharp edges, and local recycling rules before disposal.",
    reasoning:
      "OpenAI quota is unavailable, so this is a conservative demo fallback rather than image-specific AI analysis. For most reusable household items, donation or reuse preserves more value than immediate recycling.",
    nextSteps: [
      "Enable OpenAI billing or add credits for image-specific recommendations.",
      "If the item is clean and functional, place it in a donation or reuse pile.",
      "If it is broken, separate obvious recyclable materials and check local rules."
    ],
    marketplaceTips: [
      "Use the real AI analysis once quota is restored for item-specific resale tips.",
      "For demo judging, explain that this fallback prevents quota errors from blocking the flow."
    ]
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}
