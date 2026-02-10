---
description: "UI coding standards — shadcn/ui only, accessibility rules, Tailwind styling, component composition. Use when building or modifying any UI."
---

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

### Accessibility (MANDATORY)

Every component and page MUST be fully accessible. These rules are non-negotiable and apply to ALL code written in this project. shadcn/ui components are built on Radix primitives which provide accessibility out of the box — preserve that by following these rules:

1. **Every form control MUST have a label.** Use the shadcn/ui `Label` component with `htmlFor`/`id` on every `Input`, `Select`, `Textarea`, `Switch`, `Checkbox`, and `RadioGroup`. If a visible label is not appropriate, use `sr-only` class. Never leave a form control unlabelled.
2. **Every `<img>` and `<Image>` MUST have an `alt` attribute.** Use descriptive text for meaningful images, `alt=""` for decorative ones.
3. **Every icon-only button MUST have `aria-label`.** If a `Button` contains only an icon and no visible text, it requires `aria-label` describing its action.
4. **Use semantic HTML.** Use `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<h1>`–`<h6>` appropriately. Do not use `<div>` or `<span>` for interactive elements.
5. **Sections and landmark regions MUST have labels.** Use `aria-label` or `aria-labelledby` on `<section>`, `<nav>`, and other landmark elements.
6. **Never remove focus indicators.** Do not override or hide focus-visible styles provided by shadcn/ui.
7. **All interactive elements MUST be keyboard accessible.** Do not add `tabIndex="-1"` to interactive elements. Do not use `onClick` on non-interactive elements like `<div>` or `<span>` — use `<button>` or `<a>` instead.
8. **Use ARIA attributes for dynamic content.** Loading states need `aria-busy="true"`. Live updates need `aria-live`. Expanded/collapsed sections need `aria-expanded`.
9. **Maintain sufficient color contrast.** Use shadcn/ui theme tokens. Do not override colors with values that fail WCAG AA contrast (4.5:1 for text, 3:1 for large text/UI).
10. **Pages MUST have a single `<h1>` and headings must not skip levels.** Use `<h1>` → `<h2>` → `<h3>` in order.
11. **Test with keyboard and screen reader.** All pages should be navigable with keyboard alone and produce a logical reading order for screen readers.

### User-Friendliness (MANDATORY)

All UI must be intuitive and self-explanatory. These rules apply to ALL code written in this project:

1. **Clickable items MUST have visual affordance.** If an element navigates or performs an action, it must look interactive. Use icons (e.g., `Pencil` for edit, `Trash` for delete, `ChevronRight` for navigation), hover states, or button styling to signal interactivity.
2. **Use contextual icons to clarify actions.** Pair actions with recognizable icons from `lucide-react`. An edit card should show a pencil icon, a delete action should show a trash icon, etc.
3. **Provide hover/focus feedback on interactive cards and list items.** When a card or list item is clickable, add visual feedback (e.g., `hover:shadow-md`, `hover:border-primary`, `transition-shadow`) so users understand it is interactive.
4. **Empty states MUST guide the user.** When a list is empty, show a helpful message and a call-to-action (e.g., a button to create the first item).
5. **Destructive actions MUST require confirmation.** Use a `Dialog` or `AlertDialog` from shadcn/ui before deleting or performing irreversible actions.

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
