# GIGW Compliance Checker

Open-source, developer-oriented technical assessment for Indian government websites. It combines rendered-page accessibility analysis with a versioned, conservative GIGW 3.0 mapping.

> **Automated assessment — not an official GIGW/STQC certification.** This tool checks a defined technical subset only. Human judgment, organisational evidence, policy review, and manual inspection are required separately.

## Features

- React dashboard with accessible controls, status badges, filtering-ready issue table, details drawer and clear loading/error states.
- Express API: `POST /api/scans`, `GET /api/scans/:id`, `GET /api/scans/:id/report`, `GET /api/health`.
- Playwright rendered-DOM scan, axe-core violations/incomplete/passes, custom plugin rules, evidence, JSON API response and HTML report.
- SSRF controls: HTTP(S)-only, no URL credentials, localhost/private/loopback/link-local blocking, isolated browser contexts and bounded timeouts.
- Explicit separation of GIGW, WCAG/axe, generic quality/security, and manual requirements.

## Run locally

```sh
cp .env.example .env
npm install
npm run playwright:install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). API requests return a job ID immediately; poll the scan endpoint until complete.

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

## Architecture

See [architecture](docs/architecture.md), [GIGW mapping](docs/gigw-rule-mapping.md), [methodology](docs/methodology.md), and [limitations](docs/limitations.md). The rule registry currently has **3 GIGW-related rules with executable checks** (one is partial) and **2 manual GIGW requirements**. Additional generic quality/security checks and axe-core rules are separate.

## Security

Only scan websites you are authorised to test. Targets are treated as hostile. Production deployments should run Chromium in a container sandbox with egress allow-listing, add rate limiting and persistent storage, and review every dependency.

## Contributing and license

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). MIT licensed.
