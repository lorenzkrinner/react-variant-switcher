# react-variant-switcher

`react-variant-switcher` lets you preview UI alternatives by wrapping variant blocks with declarative React components and switching between them from a floating control.

## Features

- Provider + group + variant-option API
- Floating switcher UI with previous/next controls
- Keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `v` to toggle switcher)
- `localStorage` persistence
- Optional URL query syncing (`?groupName=optionId`)

## Installation

```bash
npm install react-variant-switcher
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
      <VariantGroup name="quote" title="Hero quote">
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
  storageKey?: string; // default "react_variant_switcher_config"
  syncWithUrl?: boolean; // default false
  urlParamNames?: Record<string, string>; // default { [groupName]: groupName }
  enableKeyboardShortcuts?: boolean; // default true
};
```

### `VariantGroup`

```tsx
type VariantGroupProps = {
  name: string;
  title?: string;
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

- `VariantProvider disabled` renders all variant content and hides the switcher.
- `VariantGroup disabled` renders all options in that group.
- `VariantOption disabled` always renders that option and excludes it from switching.

### `useVariant(groupId)`

Returns:

- `options`, `activeOptionId`, `activeOption`
- actions: `setActive(optionId)`, `next()`, `previous()`, `focus()`

## Example

A runnable Vite example is included in [`examples/basic`](examples/basic).


## Development

```bash
npm install
npm run lint
npm run test
npm run build
```

## License

MIT