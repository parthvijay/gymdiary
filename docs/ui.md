# UI Coding Standards

## Component Library: shadcn/ui Only

This project uses **shadcn/ui** as its sole UI component library. All UI must be built exclusively with shadcn/ui components.

### Rules

1. **NO custom components.** Do not create custom UI components. Every UI element must come from shadcn/ui.
2. **Use shadcn/ui primitives for all UI needs.** Buttons, inputs, dialogs, cards, tables, forms, navigation — use the shadcn/ui version for all of these.
3. **Add components via the CLI.** Install new shadcn/ui components using `npx shadcn@latest add <component>`. Do not copy-paste component code manually.
4. **Do not modify shadcn/ui component internals.** The generated files in `src/components/ui/` should remain as-is. If you need different behavior, compose components together rather than editing the generated source.
5. **Compose, don't create.** Build pages and features by composing shadcn/ui components together. Combine `Card`, `Button`, `Input`, `Dialog`, etc. directly in your page/layout files.
6. **No third-party UI libraries.** Do not install or use any other component library (e.g., Material UI, Chakra, Ant Design, Radix primitives directly). shadcn/ui already wraps Radix — use it through shadcn/ui.

### Accessibility (a11y)

All UI must be accessible. shadcn/ui components are built on Radix primitives which provide accessibility out of the box — preserve that by following these rules:

1. **Always provide labels for inputs.** Use the shadcn/ui `Label` component and associate it with every `Input`, `Select`, `Textarea`, etc. via `htmlFor`/`id`. Never leave a form control without a visible or `sr-only` label.
2. **Use semantic HTML elements.** Rely on the semantic elements that shadcn/ui provides (`<button>`, `<dialog>`, `<nav>`, etc.). Do not override them with generic `<div>` or `<span>` elements.
3. **Include alt text for all images.** Every `<img>` and `<Image>` must have a descriptive `alt` attribute. Decorative images should use `alt=""`.
4. **Maintain keyboard navigation.** All interactive elements must be reachable and operable via keyboard. Do not add `tabIndex="-1"` to interactive elements or suppress focus styles.
5. **Preserve focus indicators.** Do not remove or hide focus rings. shadcn/ui provides built-in focus-visible styles — leave them intact.
6. **Use ARIA attributes when needed.** If composing components in a way that creates a custom interaction pattern, add appropriate `aria-label`, `aria-describedby`, `aria-live`, or `role` attributes.
7. **Ensure sufficient color contrast.** Use the shadcn/ui theme tokens which are designed for WCAG AA contrast. Do not override colors with low-contrast values.
8. **Test with keyboard and screen reader.** All pages should be navigable with keyboard alone and produce a logical reading order for screen readers.

### Styling

- Use **Tailwind CSS** utility classes for layout, spacing, and any style adjustments.
- Use the shadcn/ui theming system (CSS variables in `globals.css`) for colors and design tokens.
- Do not write custom CSS for components. Tailwind utilities and shadcn/ui's built-in `className` prop are sufficient.

### File Structure

- shadcn/ui components live in `src/components/ui/`.
- Pages and layouts compose these components directly — there is no separate `src/components/custom/` or similar directory.

### Examples

**Correct** — composing shadcn/ui components in a page:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function WorkoutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Workout</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Input placeholder="Exercise name" />
        <Button>Save</Button>
      </CardContent>
    </Card>
  );
}
```

**Incorrect** — creating a custom component:

```tsx
// DO NOT do this
function CustomCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border p-4 shadow">{children}</div>;
}
```

Use `<Card>` from shadcn/ui instead.
