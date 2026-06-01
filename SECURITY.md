# Security Policy

## Supported Versions

The current `main` branch and latest GitHub release receive security fixes.

## Reporting a Vulnerability

Please report vulnerabilities through a private GitHub security advisory when possible. Do not include private files, tokens, or personal folder listings in public issues.

## Safety Model

`download-butler` moves local files. Contributors should preserve these guardrails:

- dry-run mode is the default
- hidden files are ignored by default
- existing files are not overwritten silently
- config files should be explicit and readable
