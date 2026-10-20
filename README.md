# FloodAid Systems

Debugged / reviewed FloodAid application package.

## Stack

- Vite + React + TypeScript
- TanStack Router / Query / Start
- Better Auth + PGlite
- Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Other useful scripts:

- `npm run build` — production build + DB migrate
- `npm run typecheck`
- `npm test`
- `npm run lint`

## Notes

- See `CODE_AUDIT.md` for the review findings and remaining recommendations.
- Large data files under `attachments/` (Excel workbooks, PPTX) were part of the original package; add them locally or via Git LFS if needed.
- Build artifacts (`.vercel/`) and internal tooling (`.grok/`) are intentionally excluded.

## License

Private — all rights reserved unless otherwise stated.
