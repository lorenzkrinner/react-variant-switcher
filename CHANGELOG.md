# Changelog

## 0.1.0 – 2026-04-10

Initial release.

### Components

- `VariantProvider`: top-level context. Owns all state, handles persistence, URL sync, and keyboard shortcuts. Auto-renders the floating switcher in non-production environments.
- `VariantGroup`: registers a named group of variants. Accepts `name`, `disabled`.
- `VariantOption`: registers a single variant option. Accepts `name`, `label`, `default`, `disabled`.
- `VariantSwitcher`: floating pill UI portaled to `document.body`. Renders automatically via `VariantProvider`; can also be placed manually.

### Hook

- `useVariant(groupId)`: returns `options`, `activeOptionId`, `next()`, `previous()`, `setActive(id)` for a group.

### Features

- **Persistence:** active selections saved to `localStorage` and restored on reload. Opt out with `enablePersistence={false}`.
- **URL sync:** selections written to query params via `history.replaceState`. Opt in with `syncWithUrl`.
- **Keyboard shortcuts:** `←` / `→` cycle options in the active group, `Alt+S` opens the group switcher overlay.
- **Disabled cascade:** `disabled` on `VariantProvider` renders all content and hides the switcher; `disabled` on `VariantGroup` renders all options in that group; `disabled` on `VariantOption` always renders it and excludes it from cycling.
- **React 18 + 19** peer dependency support.
- **Dual build:** ESM + CJS with `.d.ts` declarations via tsup.
