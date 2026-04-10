# react-variant-switcher

`react-variant-switcher` lets you preview UI alternatives by wrapping variant blocks with declarative React components and switching between them from a floating control.

## Features

- Provider + group + option API
- Floating switcher UI with previous/next controls
- Keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `Shift+V` to toggle switcher)
- `localStorage` persistence
- Optional URL query syncing (`?rvs_groupId=optionId`)

## Installation

```bash
npm install react-variant-switcher
```

## Quickstart

```tsx
import {
  VariantProvider,
  VariantGroup,
  Option
} from "react-variant-switcher";
import "react-variant-switcher/styles.css";

export function App() {
  return (
    <VariantProvider syncWithUrl>
      <VariantGroup id="quote" title="Hero quote">
        <Option id="centered" label="Centered quote">
          <section>Centered quote version</section>
        </Option>
        <Option id="left" label="Left quote">
          <section>Left aligned version</section>
        </Option>
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
  defaultGroupId?: string;
  showSwitcher?: boolean;
  enablePersistence?: boolean; // default true
  storageKey?: string; // default "react-variant-switcher:selections"
  syncWithUrl?: boolean; // default false
  urlParamPrefix?: string; // default "rvs_"
  enableKeyboardShortcuts?: boolean; // default true
  keyboardToggleKey?: string; // default "v"
};
```

### `VariantGroup`

```tsx
type VariantGroupProps = {
  id: string;
  title?: string;
  children: ReactNode;
};
```

### `Option`

```tsx
type OptionProps = {
  id: string;
  label?: string;
  children: ReactNode;
};
```

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
