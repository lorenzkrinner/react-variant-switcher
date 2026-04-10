# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A React component library for previewing UI alternatives. Wrap variant blocks with declarative components (`VariantProvider` > `VariantGroup` > `VariantOption`) and switch between them via a floating control, keyboard shortcuts, URL params, or localStorage.

## Commands

```bash
pnpm install          # install deps
pnpm run build        # build with tsup → dist/ (ESM + CJS + .d.ts)
pnpm run dev          # watch mode build
pnpm run lint         # eslint (flat config)
pnpm run test         # vitest run (jsdom)
pnpm run test:watch   # vitest in watch mode
pnpm run typecheck    # tsc --noEmit
```

Run a single test file: `pnpm vitest run src/__tests__/provider.test.tsx`

## Architecture

Three-layer context model, all state lives in `VariantProvider`:

1. **Provider** (`src/provider/VariantProvider.tsx`) — owns the full `VariantStore` (groups map + group order + active group). Groups and options register/unregister via context callbacks during mount/unmount. Handles persistence (localStorage), URL sync, and keyboard shortcuts. Renders the `VariantSwitcher` portal when visible.

2. **Group + Option** (`src/components/`) — `VariantGroup` generates a stable internal ID from its `name` prop, registers itself with the provider, and wraps children in a `GroupContext`. `VariantOption` registers its option definition (with a global order counter for stable ordering) and conditionally renders children based on whether it's the active option.

3. **Switcher UI** (`src/components/VariantSwitcher.tsx`) — floating pill portaled to `document.body`. Uses inline `CSSProperties` objects (no external CSS in the library build). All class names are prefixed `rvs-`.

**State utilities** (`src/state/`) — `persistence.ts` handles localStorage read/write, `urlSync.ts` handles URL query param read/write via `history.replaceState`.

**Public hook** — `useVariant(groupId)` returns options, active state, and navigation actions for a specific group.

## Key patterns

- Option render order is preserved via a module-level `optionOrderCounter` in `VariantOption.tsx`.
- The "disabled" cascade: provider disabled → renders all content, hides switcher; group disabled → renders all options in that group; option disabled → always renders, excluded from switching.
- `useVariantContext()` throws if used outside `VariantProvider` — same pattern for `useCurrentGroup()` outside `VariantGroup`.
- Peer deps: React 18 or 19. No runtime dependencies.
