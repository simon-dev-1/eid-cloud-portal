# eid-cloud-portal

Web app for **eid-cloud.ch** — the client for the encrypted vault. Currently a file
upload/download app; client-side encryption is planned for a later phase.

## Tech stack

- Node 26, React 19.3, Vite 8, TypeScript 6.0, react-router 8
- react-hook-form 7 + zod 4
- CSS Modules + tokens/reset
- Vitest 5 + Testing Library + jsdom
- ESLint 10 flat, Prettier

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Runs on http://localhost:5173 and proxies `/api` to http://localhost:3000 (see `vite.config.ts`).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — type-check and build
- `npm test` — run Vitest
- `npm run lint` / `npm run format`

## Project structure

```
src/
  main.tsx, App.tsx, config.ts
  pages/         Landing, Vault, NotFound
  components/    FileList, UploadForm
  services/      api.client.ts, files.service.ts
  hooks/         useFileList, useFileUpload
  theme/         tokens.css, reset.css
tests/
```

## License

MIT. Owner: `simon-dev-1`.
