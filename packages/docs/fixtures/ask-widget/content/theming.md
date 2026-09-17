---
title: Theming
description: Select a preset or override individual widget colors.
order: 4
---

## Presets

Set `theme` to `light` or `dark`:

```tsx
<ChatWidget theme="light" />
```

## Product colors

Use the `colors` prop for deliberate overrides rather than editing package CSS.
The values become scoped CSS variables on the widget.

```tsx
<ChatWidget
	colors={{
		primary: "#f43f5e",
		background: "#09090b",
		text: "#fafafa",
		border: "#27272a",
	}}
/>
```
