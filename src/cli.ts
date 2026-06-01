#!/usr/bin/env node
import { watch } from "node:fs";
import path from "node:path";
import { loadConfig, writeDefaultConfig } from "./config.js";
import { applyMovePlan, createMovePlan } from "./organizer.js";

type ParsedArgs = {
  command: "scan" | "watch" | "init" | "help";
  path: string;
  dryRun: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const [command = "help", ...rest] = argv;
  const getValue = (name: string) => {
    const index = rest.indexOf(name);
    return index >= 0 ? rest[index + 1] : undefined;
  };

  return {
    command: command === "scan" || command === "watch" || command === "init" ? command : "help",
    path: path.resolve(getValue("--path") ?? process.cwd()),
    dryRun: rest.includes("--dry-run") || !rest.includes("--apply")
  };
}

function printHelp(): void {
  console.log(`download-butler

Usage:
  download-butler init --path <folder>
  download-butler scan --path <folder> --dry-run
  download-butler scan --path <folder> --apply
  download-butler watch --path <folder> --dry-run

Safety:
  Dry run is the default. Use --apply to move files.`);
}

async function scan(folder: string, dryRun: boolean): Promise<void> {
  const config = await loadConfig(folder);
  const plan = await createMovePlan({ root: folder, config, dryRun });

  if (!plan.length) {
    console.log("Nothing to organize.");
    return;
  }

  for (const item of plan) {
    const status = item.skipped ? `skip: ${item.skipped}` : dryRun ? "would move" : "moved";
    console.log(`${status} | ${item.file} -> ${path.relative(folder, item.to)} (${item.rule})`);
  }

  await applyMovePlan(plan, dryRun);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.command === "help") {
    printHelp();
    return;
  }

  if (args.command === "init") {
    const configPath = await writeDefaultConfig(args.path);
    console.log(`Created ${configPath}`);
    return;
  }

  if (args.command === "scan") {
    await scan(args.path, args.dryRun);
    return;
  }

  await scan(args.path, args.dryRun);
  console.log(`Watching ${args.path}`);
  let timer: NodeJS.Timeout | undefined;
  watch(args.path, () => {
    clearTimeout(timer);
    timer = setTimeout(() => void scan(args.path, args.dryRun), 350);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
