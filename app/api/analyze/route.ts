import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createQuotaFallbackAnalysis, normalizeAnalysis } from "@/lib/analysis";
import type { AiAnalysis } from "@/lib/types";

const rateWindows = new Map<string, { count: number; resetAt: number }>();
const windowMs = 60_000;
const maxRequestsPerWindow = 5;
const sessionWindows = new Map<string, { count: number; resetAt: number }>();
const sessionWindowMs = 24 * 60 * 60 * 1000;
const maxRequestsPerSession = 5;
const maxDataUrlLength = 12_000_000;

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectName: { type: "string" },
    category: { type: "string" },
    primaryMaterial: { type: "string" },
    secondaryMaterials: { type: "array", items: { type: "string" } },
    condition: { type: "string", enum: ["excellent", "good", "fair", "poor", "unknown"] },
    canReuse: { type: "boolean" },
    canDonate: { type: "boolean" },
    canSell: { type: "boolean" },
    canRepair: { type: "boolean" },
    canUpcycle: { type: "boolean" },
    canRecycle: { type: "boolean" },
    recommendedAction: { type: "string", enum: ["reuse", "donate", "sell", "repair", "upcycle", "recycle"] },
    alternativeActions: {
      type: "array",
      items: { type: "string", enum: ["reuse", "donate", "sell", "repair", "upcycle", "recycle"] }
    },
    confidence: { type: "number" },
    estimatedResaleValueUsd: { type: "number" },
    estimatedRepairCostUsd: { type: "number" },
    carbonSavedKg: { type: "number" },
    landfillAvoidedKg: { type: "number" },
    disposalSafetyNotes: { type: "string" },
    reasoning: { type: "string" },
    nextSteps: { type: "array", items: { type: "string" } },
    marketplaceTips: { type: "array", items: { type: "string" } }
  },
  required: [
    "objectName",
    "category",
    "primaryMaterial",
    "secondaryMaterials",
    "condition",
    "canReuse",
    "canDonate",
    "canSell",
    "canRepair",
    "canUpcycle",
    "canRecycle",
    "recommendedAction",
    "alternativeActions",
    "confidence",
    "estimatedResaleValueUsd",
    "estimatedRepairCostUsd",
    "carbonSavedKg",
    "landfillAvoidedKg",
    "disposalSafetyNotes",
    "reasoning",
    "nextSteps",
    "marketplaceTips"
  ]
} as const;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });
    }

    const clientKey = getClientKey(request);
    const ipRate = checkWindow(rateWindows, clientKey, maxRequestsPerWindow, windowMs);

    if (!ipRate.ok) {
      return NextResponse.json(
        { error: "Too many analyses. Wait a minute and try again." },
        { status: 429, headers: { "Retry-After": `${Math.ceil(ipRate.retryAfterMs / 1000)}` } }
      );
    }

    const { imageDataUrl, sessionId } = (await request.json()) as {
      imageDataUrl?: string;
      sessionId?: string;
    };

    if (!sessionId || !/^[a-zA-Z0-9-]{16,80}$/.test(sessionId)) {
      return NextResponse.json({ error: "A valid demo session is required." }, { status: 400 });
    }

    const sessionRate = checkWindow(sessionWindows, sessionId, maxRequestsPerSession, sessionWindowMs);
    if (!sessionRate.ok) {
      return NextResponse.json(
        { error: "Demo session image limit reached. Refreshing the browser session starts a new demo." },
        { status: 429, headers: { "Retry-After": `${Math.ceil(sessionRate.retryAfterMs / 1000)}` } }
      );
    }

    if (!imageDataUrl || !isSupportedImageDataUrl(imageDataUrl)) {
      return NextResponse.json({ error: "A PNG, JPG, or WebP image is required." }, { status: 400 });
    }

    if (imageDataUrl.length > maxDataUrlLength) {
      return NextResponse.json({ error: "Image is too large for demo analysis." }, { status: 413 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_MODEL || "gpt-5.6";

    try {
      const response = await openai.responses.create({
        model,
        input: [
          {
            role: "system",
            content:
              "You are HomeCycle AI, a careful home sustainability analyst. Analyze visible household items only. Be conservative when condition, material, or resale value is uncertain. Optimize for circular-economy value in this order: reuse as-is, repair, donate, sell, upcycle, recycle, then safe disposal guidance. Recycling should be recommended only when continued use is impractical, unsafe, unsanitary, or low-value. Never invent brand names, certifications, or exact local rules from an image."
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Return strictly valid JSON matching the schema. Decision rubric: 1) identify the object and broad category; 2) infer primary and secondary materials from visible evidence; 3) estimate condition using visible wear, damage, missing parts, and cleanliness; 4) decide the best action and 1-3 alternatives; 5) estimate conservative resale value, repair cost, carbon saved, and landfill avoided; 6) include specific next steps a household can take today. Use USD and kg. If there may be batteries, electronics, chemicals, sharp edges, textiles contamination, or e-waste, mention safety in disposalSafetyNotes."
              },
              {
                type: "input_image",
                image_url: imageDataUrl,
                detail: "high"
              }
            ]
          }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "homecycle_analysis",
            strict: true,
            schema: analysisSchema
          }
        }
      } as OpenAI.Responses.ResponseCreateParamsNonStreaming);

      const analysis = normalizeAnalysis(JSON.parse(response.output_text)) as AiAnalysis;
      return NextResponse.json({ analysis });
    } catch (openaiError) {
      if (isOpenAIQuotaError(openaiError)) {
        return NextResponse.json({
          analysis: createQuotaFallbackAnalysis(),
          warning: "OpenAI quota is unavailable. Returned demo fallback analysis."
        });
      }

      throw openaiError;
    }
  } catch (error) {
    console.error("HomeCycle analysis failed", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error ? error.message : "Analysis failed. Try another photo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function isOpenAIQuotaError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { status?: number; code?: string; message?: string; error?: { code?: string; message?: string } };
  const message = `${maybeError.message ?? ""} ${maybeError.error?.message ?? ""}`.toLowerCase();
  const code = `${maybeError.code ?? ""} ${maybeError.error?.code ?? ""}`.toLowerCase();
  return maybeError.status === 429 && (message.includes("quota") || message.includes("billing") || code.includes("quota"));
}

function checkWindow(store: Map<string, { count: number; resetAt: number }>, key: string, max: number, durationMs: number) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + durationMs });
    return { ok: true, retryAfterMs: 0 };
  }

  if (existing.count >= max) {
    return { ok: false, retryAfterMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

function getClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local-demo-client"
  );
}

function isSupportedImageDataUrl(value: string) {
  return /^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(value);
}
