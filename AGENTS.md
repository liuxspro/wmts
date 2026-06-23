# WMTS Maps — AGENTS.md

## Stack

- **Runtime**: Deno (no package.json, no Node)
- **Framework**: Hono (`jsr:@hono/hono`)
- **WMTS capabilities**: `@liuxspro/capgen` (JSR)
- **Geo utils**: `@liuxspro/libs` (JSR)

## Commands

```sh
deno task dev     # watch-mode dev server on src/server.ts
deno task build   # generate dist/*.xml (WMTS capabilities)
deno task deploy  # deployctl deploy --entrypoint src/server.ts
```

No test, lint, or typecheck commands exist.

## Entry points

- `src/server.ts` — Hono app, served via `Deno.serve()`
- `src/build.ts` — offline XML generation + provincial tile-config fetcher

## Architecture

| Directory | Purpose |
|---|---|
| `src/maps/` | WMTS Capabilities XML definitions (one file per provider) |
| `src/server/` | Hono route handlers |
| `dist/` | Pre-built `*.xml` capability files (checked in) |

Most routes serve a capability XML string via `create_router()` helper from `src/utils.ts`. Some services require a token:

- **tianditu** (`/tianditu`): accepts `tk` or `tdt` via header or query param
- **geocloud** (`/geocloud`): accepts `tk` via header or query param
- **吉林一号** (`/jl1`): accepts `tk` via header or query param

Bing has a live tile proxy at `/tile/bing/:z/:x/:y` (redirect to VirtualEarth).

Provincial tianditu sub-routers: `/tianditu/{jiangsu,guangdong,fujian,beijing,shanghai,hunan,wenzhou,sdhis/:id/:el}`.

## Build quirks

`deno task build` fetches tile configs for Jiangsu, Beijing, and Hunan from external sources and writes JSON into `src/maps/tianditu/`. These writes are committed.

## Serving modes

- `dist/*.xml` — static file serve via `serveStatic({ root: "./" })`
- Dynamic routes — generate XML at request time, substituting tokens
- `/collection` aggregates all providers into one capabilities document

## Dependencies

All deps in `deno.json` use `jsr:` imports. Lockfile: `deno.lock`.
