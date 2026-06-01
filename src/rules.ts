import path from "node:path";
import type { ButlerRule } from "./config.js";

const groups: Record<NonNullable<ButlerRule["mimeGroup"]>, string[]> = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".heic"],
  video: [".mp4", ".mov", ".mkv", ".avi", ".webm"],
  audio: [".mp3", ".wav", ".aac", ".flac", ".m4a"],
  document: [".pdf", ".doc", ".docx", ".txt", ".md", ".rtf", ".xlsx", ".pptx"],
  archive: [".zip", ".rar", ".7z", ".tar", ".gz"],
  code: [".js", ".ts", ".tsx", ".jsx", ".py", ".json", ".html", ".css", ".go", ".rs"]
};

export function ageInMs(value: number, unit: "minutes" | "hours" | "days"): number {
  const minute = 60 * 1000;
  if (unit === "minutes") return value * minute;
  if (unit === "hours") return value * 60 * minute;
  return value * 24 * 60 * minute;
}

export function matchesRule(fileName: string, modifiedAt: Date, rule: ButlerRule, now = new Date()): boolean {
  const extension = path.extname(fileName).toLowerCase();
  const explicit = rule.extensions?.map((item) => item.toLowerCase()) ?? [];
  const grouped = rule.mimeGroup ? groups[rule.mimeGroup] : [];
  const extensionMatches = explicit.includes(extension) || grouped.includes(extension);
  const ageMatches = rule.olderThan ? now.getTime() - modifiedAt.getTime() >= ageInMs(rule.olderThan.value, rule.olderThan.unit) : true;
  return extensionMatches && ageMatches;
}
