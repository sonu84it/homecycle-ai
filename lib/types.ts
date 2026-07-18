export type ScanAction = "reuse" | "donate" | "sell" | "repair" | "upcycle" | "recycle";

export type AiAnalysis = {
  objectName: string;
  category: string;
  primaryMaterial: string;
  secondaryMaterials: string[];
  condition: "excellent" | "good" | "fair" | "poor" | "unknown";
  canReuse: boolean;
  canDonate: boolean;
  canSell: boolean;
  canRepair: boolean;
  canUpcycle: boolean;
  canRecycle: boolean;
  recommendedAction: ScanAction;
  alternativeActions: ScanAction[];
  confidence: number;
  estimatedResaleValueUsd: number;
  estimatedRepairCostUsd: number;
  carbonSavedKg: number;
  landfillAvoidedKg: number;
  disposalSafetyNotes: string;
  reasoning: string;
  nextSteps: string[];
  marketplaceTips: string[];
  outputIdeas?: OutputIdea[];
};

export type OutputIdea = {
  title: string;
  action: ScanAction;
  imageUrl: string;
  carbonSavedKg: number;
  landfillAvoidedKg: number;
  estimatedResaleValueUsd: number;
  summary: string;
  details: string[];
};

export type ScanRow = {
  id: string;
  user_id: string;
  image_url: string;
  image_path: string | null;
  object_name: string;
  category: string;
  material: string;
  condition: AiAnalysis["condition"];
  recommended_action: ScanAction;
  carbon_saved_kg: number;
  landfill_avoided_kg: number;
  estimated_resale_value_usd: number;
  analysis: AiAnalysis;
  created_at: string;
};
