# Federation vs Web Components shell demo

Two independent workspaces implementing the same platform. 

```
federation/        Angular shell + Angular remote + React remote (Native Federation)
web-components/    Angular shell + Angular element + React element (Shadow DOM on/off)
```

Each workspace contains `apps/shell`, `apps/angular-app`, `apps/react-app`, `libs/platform-sdk` and `e2e/smoke.mjs`.

## Run

```bash
cd federation        # or web-components
npm install
npm run start -w apps/shell
npm run start -w apps/angular-app
npm run start -w apps/react-app
```

| Workspace         | Shell | Angular | React |
| ----------------- | ----- | ------- | ----- |
| `federation`      | 4200  | 4201    | 4202  |
| `web-components`  | 4300  | 4301    | 4302  |

## Smoke test (Playwright)

With the three servers of a workspace running:

```bash
npx playwright install chromium   # first time only
node e2e/smoke.mjs                # BASE_URL overrides the shell URL
```

Requires the registry to resolve the pinned versions in each `package.json`.
