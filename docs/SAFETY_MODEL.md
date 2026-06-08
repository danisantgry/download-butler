# Safety Model

`download-butler` is designed around preview-first file organization.

## Default Behavior

- `scan` and `watch` run as dry runs unless `--apply` is passed.
- Hidden files are skipped by default.
- Planned moves are printed before any file operation.
- Existing destination files are not overwritten.

## Apply Mode

Use `--apply` only after reviewing the dry-run plan:

```bash
download-butler scan --path ~/Downloads --dry-run
download-butler scan --path ~/Downloads --apply
```

## Rule Order

Rules are evaluated in the order they appear in `download-butler.config.json`. Put specific rules before broad rules.

## Recommended Workflow

1. Run `download-butler init --path <folder>`.
2. Edit the generated rules.
3. Run `scan --dry-run`.
4. Adjust destinations if needed.
5. Run `scan --apply` only after the plan looks correct.

## Non-Goals

- It does not delete files.
- It does not upload file names or metadata.
- It does not modify hidden files unless configured to do so.
