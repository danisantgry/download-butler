# download-butler

`download-butler` is a cautious TypeScript CLI for cleaning up busy download folders. It plans moves from simple rules, shows a dry run by default, and only touches files when you explicitly pass `--apply`.

## Features

- Organize files by extension, rough MIME group, and file age.
- Run one-off scans or keep a folder watched.
- Generate a readable `download-butler.config.json`.
- Skip hidden files and avoid overwriting existing targets.
- Default to dry-run mode for safer automation.

## Install

```bash
npm install
npm run build
```

Run locally:

```bash
npm run dev -- init --path ~/Downloads
npm run dev -- scan --path ~/Downloads --dry-run
npm run dev -- scan --path ~/Downloads --apply
```

After publishing or linking:

```bash
download-butler scan --path ~/Downloads --dry-run
```

## Configuration

Create a starter config:

```bash
download-butler init --path ~/Downloads
```

Example rule:

```json
{
  "name": "Screenshots",
  "destination": "Images/Screenshots",
  "extensions": [".png", ".jpg"],
  "olderThan": { "value": 1, "unit": "hours" }
}
```

## Commands

- `download-butler init --path <folder>` creates `download-butler.config.json`.
- `download-butler scan --path <folder> --dry-run` previews the move plan.
- `download-butler scan --path <folder> --apply` moves files.
- `download-butler watch --path <folder> --dry-run` watches and previews continuously.

## Safety Notes

Dry run is the default. Files are moved only with `--apply`. Existing targets are renamed by default, and hidden files are ignored unless config changes that behavior.

## Roadmap

- Rule presets for common workflows.
- Undo log for applied moves.
- Optional desktop notifications.
