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
pnpm install react-variant-switcher
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
        <VariantOption id="centered" label="Centered quote" default>
          <section>Centered quote version</section>
        </VariantOption>
        <VariantOption id="left" label="Left quote">
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
  enablePersistence?: boolean; // default true
  syncWithUrl?: boolean; // default false
  enableKeyboardShortcuts?: boolean; // default true
};
```

### `VariantGroup`

```tsx
type VariantGroupProps = {
  name: string;
  disabled?: boolean;
  children: ReactNode;
};
```

### `VariantOption`

```tsx
type VariantOptionProps = {
  id: string;
  label?: string;
  default?: boolean;
  disabled?: boolean;
  children: ReactNode;
};
```

If at least one option has `default`, the first `default` option in declaration order is selected.
If none are marked `default`, the first option is selected.

### Disabled behavior

- `VariantProvider disabled` — renders only the default/active option and hides the switcher.
- `VariantGroup disabled` — renders only the default/active option in that group.
- `VariantOption disabled` — excludes the option from registration and renders nothing.

### `useVariant(groupName)`

Pass the same `name` string you used on `<VariantGroup name="...">`.

Returns:

- `groupName`, `groupId`, `options`, `activeOptionId`, `activeOption`
- actions: `setActive(optionId)`, `next()`, `previous()`, `focus()`

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
