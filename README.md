# react-variant-switcher

`react-variant-switcher` lets you preview UI alternatives by wrapping variant blocks with declarative React components and switching between them from a floating control.

## Features

- Provider + group + variant-option API
- Floating switcher UI with previous/next controls
- Keyboard shortcuts (`Alt+Arrow` to switch, `Cmd+H` to toggle switcher, `Alt+S` to cycle groups)
- `localStorage` persistence
- Optional URL query syncing (`?groupName=optionId`)
- Fully themeable via CSS custom properties and class overrides

## Installation

```bash
pnpm install react-variant-switcher -D
```

Import the stylesheet in your app entry:

```ts
import "react-variant-switcher/styles.css";
```

## Quickstart

```tsx
import {
  VariantProvider,
  VariantGroup,
  VariantOption
} from "react-variant-switcher";

export function App() {
  return (
    <VariantProvider syncWithUrl>
      <VariantGroup name="hero">
        <VariantOption name="centered" label="Centered quote" default>
          <section>Centered quote version</section>
        </VariantOption>
        <VariantOption name="left" label="Left quote">
          <section>Left aligned version</section>
        </VariantOption>
      </VariantGroup>
    </VariantProvider>
  );
}
```

## API

### `VariantProvider`

```tsx
type VariantProviderProps = {
  children: ReactNode;
  disabled?: boolean;
  defaultGroupId?: string;
  showSwitcher?: boolean;
  disablePersistence?: boolean;
  syncWithUrl?: boolean;
  disableKeyboardShortcuts?: boolean;
};
```

| Prop | Default | Description |
|------|---------|-------------|
| `children` | — | Your app content. Place `VariantGroup` trees anywhere inside. |
| `disabled` | `false` | Disables the entire switcher. All groups render only their default/active option and the switcher UI is hidden. Useful for production builds. |
| `defaultGroupId` | — | The internal ID of the group that should be focused in the switcher on first render. |
| `showSwitcher` | `true` in dev, `false` in prod | Overrides switcher visibility. Pass `false` to always hide it, `true` to always show it regardless of environment. |
| `disablePersistence` | `false` | Disables localStorage persistence. By default, active selections are saved and restored on reload. |
| `syncWithUrl` | `false` | Syncs active selections to URL query params (e.g. `?hero=centered`). Useful for sharing specific variants via link. |
| `disableKeyboardShortcuts` | `false` | Disables all keyboard shortcuts (`Alt+Arrow`, `Cmd+H`, `Alt+S`). |

### `VariantGroup`

```tsx
type VariantGroupProps = {
  name: string;
  disabled?: boolean;
  children: ReactNode;
};
```

| Prop | Default | Description |
|------|---------|-------------|
| `name` | — | Unique name for this group. Used as the URL param key when `syncWithUrl` is on and as the argument to `useVariant(name)`. |
| `disabled` | `false` | Renders only the default/active option in this group. The group is hidden from the switcher UI. |
| `children` | — | `VariantOption` elements. |

### `VariantOption`

```tsx
type VariantOptionProps = {
  name: string;
  label?: string;
  default?: boolean;
  disabled?: boolean;
  children: ReactNode;
};
```

| Prop | Default | Description |
|------|---------|-------------|
| `name` | — | Unique identifier for this option within its group. Used as the URL param value when `syncWithUrl` is on. |
| `label` | same as `name` | Display label shown in the switcher dropdown. Falls back to `name` if omitted. |
| `default` | `false` | Marks this option as the default selection. If multiple options have `default`, the first one in declaration order wins. If no option has `default`, the first option is selected. |
| `disabled` | `false` | Excludes this option from registration entirely. It won't appear in the switcher and its children won't render. |
| `children` | — | Content rendered when this option is active. |

### Disabled behavior

- `VariantProvider disabled` — renders only the default/active option and hides the switcher.
- `VariantGroup disabled` — renders only the default/active option in that group.
- `VariantOption disabled` — excludes the option from registration and renders nothing.

### `useVariant(groupName)`

Pass the same `name` string you used on `<VariantGroup name="...">`.

Returns:

- `groupName`, `groupId`, `options`, `activeOptionName`, `activeOption`
- actions: `setActive(optionName)`, `next()`, `previous()`, `focus()`

### `VariantSwitcher`

A standalone switcher component you can place anywhere inside a `VariantProvider`. When rendered, it suppresses the automatic floating switcher.

```tsx
import { VariantSwitcher } from "react-variant-switcher";

<VariantSwitcher className="my-custom-class" style={{ bottom: 40 }} />
```

## Theming

### CSS custom properties

Variables are scoped to `.rvs-root` and use [shadcn/ui](https://ui.shadcn.com)-compatible names. Override them on `.rvs-root` or any parent element:

```css
/* Switcher (scoped to .rvs-root) */
--background           /* switcher background */
--foreground           /* primary text */
--muted                /* hover bg, dividers */
--muted-foreground     /* secondary text, counters, icons */
--accent               /* select/badge surface */
--accent-foreground    /* hover text */
--border               /* switcher border */
--radius               /* border radius (default: pill) */
--shadow               /* box shadow */
--font-sans            /* font family */
--font-mono            /* counter font family */
--font-size            /* base font size */
--font-size-counter    /* counter font size */

/* Overlay (scoped to .rvs-overlay) */
--popover              /* overlay background */
--popover-foreground   /* overlay text */
--popover-border       /* overlay border */
--popover-shadow       /* overlay shadow */
--popover-highlight    /* preview highlight bg */
--popover-current      /* current group text */
--popover-dim          /* inactive group text */
```

If you use shadcn/ui, the switcher inherits your theme automatically when you override these variables at a parent level.

### CSS classes

All switcher elements use `.rvs-` prefixed classes that you can override:

| Class | Element |
|-------|---------|
| `.rvs-root` | Switcher container (pill) |
| `.rvs-portal` | Fixed-position portal wrapper |
| `.rvs-nav-btn` | Previous/next arrow buttons |
| `.rvs-divider` | Vertical separator lines |
| `.rvs-select-label` | Select wrapper `<label>` |
| `.rvs-select` | Dropdown `<select>` elements |
| `.rvs-select-with-prefix` | Select with counter prefix (extra left padding) |
| `.rvs-select-chevron` | Dropdown arrow icon |
| `.rvs-counter` | Option index counter (e.g. "2/3") |
| `.rvs-badge` | Single-option label (no dropdown) |
| `.rvs-overlay` | Group switcher overlay container |
| `.rvs-overlay-portal` | Overlay portal wrapper |
| `.rvs-overlay-option` | Individual group option row |
| `.rvs-overlay-option-current` | Currently active group row |

## Example

A runnable Vite example is included in [`examples/spacex`](examples/spacex).

## Development

```bash
pnpm install
pnpm run lint
pnpm run test
pnpm run build
```

## License

MIT
