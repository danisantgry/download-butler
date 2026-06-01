import { mkdir, readdir, rename, stat } from "node:fs/promises";
import path from "node:path";
import type { ButlerConfig } from "./config.js";
import { fileExists } from "./config.js";
import { matchesRule } from "./rules.js";

export type PlanOptions = {
  root: string;
  config: ButlerConfig;
  dryRun: boolean;
};

export type MovePlan = {
  file: string;
  from: string;
  to: string;
  rule: string;
  skipped?: string;
};

function isHidden(fileName: string): boolean {
  return fileName.startsWith(".");
}

async function availableTarget(target: string, onConflict: ButlerConfig["onConflict"]): Promise<string | undefined> {
  if (!(await fileExists(target))) return target;
  if (onConflict === "skip") return undefined;

  const parsed = path.parse(target);
  for (let index = 1; index < 1000; index += 1) {
    const candidate = path.join(parsed.dir, `${parsed.name}-${index}${parsed.ext}`);
    if (!(await fileExists(candidate))) return candidate;
  }
  return undefined;
}

export async function createMovePlan(options: PlanOptions): Promise<MovePlan[]> {
  const entries = await readdir(options.root);
  const moves: MovePlan[] = [];

  for (const entry of entries) {
    if (entry === "download-butler.config.json") continue;
    if (options.config.ignoreHidden && isHidden(entry)) continue;

    const from = path.join(options.root, entry);
    const details = await stat(from);
    if (!details.isFile()) continue;

    const rule = options.config.rules.find((candidate) => matchesRule(entry, details.mtime, candidate));
    if (!rule) continue;

    const destinationFolder = path.join(options.root, rule.destination);
    const target = await availableTarget(path.join(destinationFolder, entry), options.config.onConflict);
    moves.push({
      file: entry,
      from,
      to: target ?? path.join(destinationFolder, entry),
      rule: rule.name,
      skipped: target ? undefined : "target already exists"
    });
  }

  return moves;
}

export async function applyMovePlan(plan: MovePlan[], dryRun: boolean): Promise<void> {
  if (dryRun) return;

  for (const item of plan) {
    if (item.skipped) continue;
    await mkdir(path.dirname(item.to), { recursive: true });
    await rename(item.from, item.to);
  }
}
