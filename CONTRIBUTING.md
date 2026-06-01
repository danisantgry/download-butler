# Contributing to download-butler

Thanks for considering a contribution. `download-butler` is a safety-first CLI, so changes should be small, predictable, and well tested.

## Local Setup

```bash
npm install
npm run lint
npm run build
npm test
```

## Contribution Ideas

- Add rule presets for common download folders.
- Improve conflict handling and undo planning.
- Add tests for age-based rules and watch mode behavior.
- Improve Windows, macOS, and Linux path handling.

## Safety Guidelines

- Dry run should remain the default.
- File-moving behavior must be covered by tests.
- Do not add destructive operations without explicit flags and documentation.
