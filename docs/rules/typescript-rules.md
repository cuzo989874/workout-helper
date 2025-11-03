# TypeScript Development Rules

This document outlines the essential rules and conventions for writing TypeScript and React code in this project. As an Engineer, I must adhere to these rules to ensure code quality, consistency, and maintainability.

## 1. Test-Driven Development (TDD)

-   **Mandatory TDD**: All new functionality, including components, hooks, and services, must be developed following the **Red-Green-Refactor** cycle.
-   **Red**: Before writing any implementation code, I must first write a failing test that defines the desired behavior.
-   **Green**: I must write the simplest possible code to make the test pass.
-   **Refactor**: I must then refactor the code for clarity and efficiency, ensuring all tests continue to pass.
-   **Test Files**: Tests must be co-located with the source file (e.g., `MyComponent.tsx` and `MyComponent.test.tsx`).

## 2. Coding Style & Conventions

### Naming

-   **Interfaces**: All interface names must be in `PascalCase` and prefixed with an `I`. Example: `interface IWorkoutSession { ... }`.
-   **Type Aliases**: All type alias names must be in `PascalCase` and prefixed with a `T`. Example: `type TWorkoutId = string;`.
-   **Unused Variables**: To explicitly mark a variable as unused (e.g., in function arguments or destructuring), I must prefix its name with an underscore `_`. Example: `const [_, setValue] = useState(0);`.

### Component Structure

-   **File Co-location**: A new component (e.g., `MyComponent`) must be created in its own directory and consist of at least three files:
    1.  `MyComponent.tsx` (Component logic and JSX)
    2.  `MyComponent.module.scss` (Scoped styles)
    3.  `MyComponent.test.tsx` (Vitest tests)
-   **State**: Prefer component-level state (`useState`, `useReducer`). Use custom hooks to share stateful logic between components.

### Type Safety

-   **Strict Mode**: The project enforces TypeScript's `strict` mode. I must not use `any` unless absolutely necessary and justified.
-   **Type Inference**: I should leverage type inference where possible but provide explicit types for function arguments, return values, and complex objects to improve clarity.

## 3. Mandatory Quality Checks

Before I can consider any task complete, I must run and pass all of the following quality gates:

1.  **Type Checking**: Run `npm run typecheck` to ensure there are no TypeScript errors.
2.  **Linting**: Run `npm run lint` to check for style and code quality issues. I can use `npm run lint:fix` to automatically correct some issues.
3.  **Testing**: Run `npm run test` to ensure all unit and component tests pass.

**Condition**: I will not mark a task as complete or request a review if any of these checks fail.
