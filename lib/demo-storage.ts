"use client";

import type { AiAnalysis, ScanAction } from "@/lib/types";

export const demoScanLimit = 6;
const scansKey = "homecycle.demo.scans";
const countKey = "homecycle.demo.analysis-count";
const sessionKey = "homecycle.demo.session-id";

export type DemoScan = {
  id: string;
  imageDataUrl: string;
  analysis: AiAnalysis;
  createdAt: string;
};

export function getDemoSessionId() {
  let id = sessionStorage.getItem(sessionKey);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(sessionKey, id);
  }
  return id;
}

export function getAnalysisCount() {
  return Number(sessionStorage.getItem(countKey) ?? "0");
}

export function incrementAnalysisCount() {
  const next = getAnalysisCount() + 1;
  sessionStorage.setItem(countKey, String(next));
  return next;
}

export function remainingAnalyses() {
  return Math.max(0, demoScanLimit - getAnalysisCount());
}

export function getDemoScans(): DemoScan[] {
  try {
    return JSON.parse(sessionStorage.getItem(scansKey) ?? "[]") as DemoScan[];
  } catch {
    return [];
  }
}

export function saveDemoScan(scan: DemoScan) {
  const scans = [scan, ...getDemoScans()].slice(0, demoScanLimit);
  sessionStorage.setItem(scansKey, JSON.stringify(scans));
  window.dispatchEvent(new Event("homecycle-demo-scans-updated"));
}

export function actionCount(scans: DemoScan[], action: ScanAction) {
  return scans.filter((scan) => scan.analysis.recommendedAction === action).length;
}
