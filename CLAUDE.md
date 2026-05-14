# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
ng serve           # Dev server at http://localhost:4200
ng build           # Production build to dist/
ng test            # Run unit tests with Vitest
ng generate component path/name   # Generate a standalone component
```

> On Windows, use `ng.cmd` if `ng` is not recognized in PowerShell.

## Architecture

**Framework:** Angular 21, fully standalone components, signals-first.  
**UI Library:** PrimeNG 21 with the Aura theme (configured in `app.config.ts`).  
**Dark mode:** toggled by adding `.dark-mode` class to `<html>`.

### Form field pattern

Components in `core/` follow a **FormGroup + config object** pattern — not `ControlValueAccessor`. Every form field accepts two required inputs:

```ts
formGroup = input.required<FormGroup>();
control   = input.required<SomeControl>();   // extends BaseControl<T>
```

The config class (`BaseControl` → `InputTextControl`) carries all field metadata: `key`, `label`, `required`, `disabled`, `helpText`, `focus`, `controlDependencies`, and type-specific options. The component binds directly via `formControlName` using `control().key`.

### Control dependency system

`BaseControl.controlDependencies` is an array of `ControlDependency` objects. Each entry declares that this field should show/hide based on the value of a sibling control in the same `FormGroup`. The component subscribes to sibling `valueChanges` in `ngOnInit` and calls `evaluateDependencies()` to toggle a `showControl` signal.

### Adding a new form field component

1. Create a class in `core/classes/` extending `BaseControl<T>` and set `controlType`.
2. Generate a standalone component in `core/components/`.
3. Import `ReactiveFormsModule` and the relevant PrimeNG module(s) directly in the component's `imports` array — no shared module needed.
4. Use `input.required<FormGroup>()` + `input.required<YourControl>()` as the component's API.
5. Use `@if` / `@for` in templates — never `*ngIf` / `*ngFor`.

### Signals conventions

- Internal mutable state → `signal()`
- Derived state → `computed()`
- Component inputs → `input()` / `input.required()`
- Component outputs → `output()`
- DOM/child refs → `viewChild()` / `viewChildren()`
