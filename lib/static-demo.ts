import type { AiAnalysis } from "@/lib/types";

export const staticDemoInputs = [
  {
    id: "worn-wooden-chair",
    title: "Worn wooden chair",
    category: "Furniture",
    imageUrl: "/demo/chair-input.jpeg",
    analysis: {
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
        "The selected input image shows a worn wooden chair with cosmetic finish damage but an apparently reusable structure. Repair/refinish preserves the highest material value, while donation or resale keeps the item in use and avoids the carbon cost of replacement.",
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
    } satisfies AiAnalysis
  }
];

export function getStaticDemoInput(id: string) {
  return staticDemoInputs.find((input) => input.id === id);
}
