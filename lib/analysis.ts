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
    objectName: "Worn wooden dining chair",
    category: "Furniture",
    primaryMaterial: "Solid wood",
    secondaryMaterials: ["Old paint or stain", "Possible glue/fasteners"],
    condition: "fair",
    canReuse: true,
    canDonate: true,
    canSell: true,
    canRepair: true,
    canUpcycle: true,
    canRecycle: false,
    recommendedAction: "repair",
    alternativeActions: ["donate", "sell", "upcycle"],
    confidence: 0.86,
    estimatedResaleValueUsd: 35,
    estimatedRepairCostUsd: 18,
    carbonSavedKg: 9.4,
    landfillAvoidedKg: 6.5,
    disposalSafetyNotes:
      "Static demo mode is active because OpenAI quota is unavailable. Before reuse, check chair joints, screws, splinters, and old finish. Sand outdoors or with ventilation if refinishing.",
    reasoning:
      "The supplied example image shows a worn wooden chair with cosmetic finish damage but an apparently reusable structure. Repair/refinish preserves the highest material value, while donation or resale keeps the item in use and avoids the carbon cost of replacement.",
    nextSteps: [
      "Tighten joints and inspect cross braces before anyone sits on it.",
      "Sand rough flakes and seal with low-VOC finish for safe reuse.",
      "If you do not need it, photograph it near a window and list it as rustic solid-wood furniture.",
      "If the seat is unstable, upcycle it into a plant stand instead of seating."
    ],
    marketplaceTips: [
      "Mention solid wood, rustic patina, and any repaired joints.",
      "Photograph the chair in natural light with scale context.",
      "Price low enough for pickup: $20-$45 depending on stability."
    ],
    outputIdeas: [
      {
        title: "Repair and refinish",
        action: "repair",
        imageUrl: "/demo/chair-repair-refinish.png",
        carbonSavedKg: 9.4,
        summary: "Sand, tighten, and seal the chair so it can replace buying a new dining or desk chair."
      },
      {
        title: "Upcycle as plant stand",
        action: "upcycle",
        imageUrl: "/demo/chair-upcycle-plant-stand.png",
        carbonSavedKg: 6.1,
        summary: "If seating safety is uncertain, convert it into a plant stand or decor piece."
      },
      {
        title: "Donate or resell",
        action: "donate",
        imageUrl: "/demo/chair-donate-resale.png",
        carbonSavedKg: 7.2,
        summary: "Clean and stage it for donation, marketplace pickup, or a local reuse group."
      }
    ]
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}
