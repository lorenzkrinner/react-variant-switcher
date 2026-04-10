# react-variant-switcher

`react-variant-switcher` lets you preview UI alternatives by wrapping variant blocks with declarative React components and switching between them from a floating control.

## Features

- Provider + group + option API
- Floating switcher UI with previous/next controls
- Keyboard shortcuts (`ArrowLeft`, `ArrowRight`, `v` to toggle switcher)
- `localStorage` persistence
- Optional URL query syncing (`?groupId=optionId`)

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
      <VariantGroup name="quote" title="Hero quote">
        <Option id="centered" label="Centered quote" default>
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
  children: ReactNode;
};
```

### `Option`

```tsx
type OptionProps = {
  id: string;
  label?: string;
  default?: boolean;
  children: ReactNode;
};
```

If at least one option has `default`, the first `default` option in declaration order is selected.
If none are marked `default`, the first option is selected.

### `useVariant(groupId)`

Returns:

- `options`, `activeOptionId`, `activeOption`
- actions: `setActive(optionId)`, `next()`, `previous()`, `focus()`

## Example

A runnable Vite example is included in `[examples/basic](examples/basic)`.


## Development

```bash
npm install
npm run lint
npm run test
npm run build
```

## License

MIT