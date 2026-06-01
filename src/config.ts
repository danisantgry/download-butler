import { access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

export type AgeUnit = "minutes" | "hours" | "days";

export type ButlerRule = {
  name: string;
  destination: string;
  extensions?: string[];
  mimeGroup?: "image" | "video" | "audio" | "document" | "archive" | "code";
  olderThan?: {
    value: number;
    unit: AgeUnit;
  };
};

export type ButlerConfig = {
  rules: ButlerRule[];
  ignoreHidden: boolean;
  onConflict: "rename" | "skip";
};

export const CONFIG_FILE = "download-butler.config.json";

export const defaultConfig: ButlerConfig = {
  ignoreHidden: true,
  onConflict: "rename",
  rules: [
    {
      name: "Images",
      destination: "Images",
      mimeGroup: "image",
      extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
    },
    {
      name: "PDFs and docs",
      destination: "Documents",
      mimeGroup: "document",
      extensions: [".pdf", ".doc", ".docx", ".txt", ".md", ".xlsx", ".pptx"]
    },
    {
      name: "Archives",
      destination: "Archives",
      mimeGroup: "archive",
      extensions: [".zip", ".rar", ".7z", ".tar", ".gz"]
    },
    {
      name: "Code",
      destination: "Code",
      mimeGroup: "code",
      extensions: [".js", ".ts", ".tsx", ".py", ".json", ".html", ".css"]
    }
  ]
};

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function loadConfig(folder: string): Promise<ButlerConfig> {
  const configPath = path.join(folder, CONFIG_FILE);
  if (!(await fileExists(configPath))) {
    return defaultConfig;
  }

  const raw = await readFile(configPath, "utf8");
  const parsed = JSON.parse(raw) as Partial<ButlerConfig>;
  return {
    rules: parsed.rules?.length ? parsed.rules : defaultConfig.rules,
    ignoreHidden: parsed.ignoreHidden ?? defaultConfig.ignoreHidden,
    onConflict: parsed.onConflict ?? defaultConfig.onConflict
  };
}

export async function writeDefaultConfig(folder: string): Promise<string> {
  const configPath = path.join(folder, CONFIG_FILE);
  await writeFile(configPath, `${JSON.stringify(defaultConfig, null, 2)}\n`, "utf8");
  return configPath;
}
