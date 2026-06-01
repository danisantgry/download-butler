import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultConfig, writeDefaultConfig } from "../src/config.js";
import { applyMovePlan, createMovePlan } from "../src/organizer.js";

async function tempFolder() {
  return mkdir(path.join(os.tmpdir(), `download-butler-${Date.now()}-${Math.random()}`), { recursive: true });
}

describe("download-butler", () => {
  it("creates a default config file", async () => {
    const root = await tempFolder();
    const file = await writeDefaultConfig(root);
    const contents = await readFile(file, "utf8");
    expect(contents).toContain("Images");
  });

  it("plans moves without touching files during dry run", async () => {
    const root = await tempFolder();
    await writeFile(path.join(root, "invoice.pdf"), "demo");
    const plan = await createMovePlan({ root, config: defaultConfig, dryRun: true });
    expect(plan).toHaveLength(1);
    expect(plan[0].to).toContain("Documents");
    await applyMovePlan(plan, true);
    await expect(readFile(path.join(root, "invoice.pdf"), "utf8")).resolves.toBe("demo");
  });
});
