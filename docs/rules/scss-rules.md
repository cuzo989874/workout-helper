# SCSS Styling Rules

This document defines the rules for writing SCSS in this project. As an Engineer, I must follow these guidelines to maintain a consistent and scalable styling architecture.

## 1. Styling Approach

-   **CSS Modules**: The project exclusively uses **CSS Modules** for component-level styling. All styles for a specific component must be placed in a co-located `.module.scss` file (e.g., `MyComponent.module.scss`). This ensures all class names are locally scoped by default, preventing global style conflicts.

-   **Global Styles**: The `/styles` directory is reserved for genuinely global styles. I should only modify files here if the change applies to the entire application (e.g., CSS resets, typography, or global theme variables).

## 2. Best Practices

-   **Use Variables**: I must use the predefined SCSS variables from `/styles/abstracts/_variables.scss` for colors, fonts, spacing, etc. I should not hardcode values in component styles.

-   **Use Mixins**: For common patterns like flexbox centering or media queries, I must use the mixins defined in `/styles/abstracts/_mixins.scss` to ensure consistency and reduce code duplication.

-   **Nesting**: I should keep SCSS nesting to a minimum (no more than 2-3 levels deep). Deep nesting leads to overly specific CSS selectors that are hard to override and maintain.

    ```scss
    // Good
    .card {
      .title {
        color: var(--primary-color);
      }
    }

    // Bad: Avoid deep nesting
    .card {
      .content {
        .item {
          .link {
            color: red; // Hard to override
          }
        }
      }
    }
    ```

-   **BEM Naming**: While CSS Modules handle scoping, following a loose BEM (Block__Element--Modifier) naming convention for class names within a module can improve readability.

    ```scss
    // Example: styles for a Card component
    .card {
      padding: 1rem;

      &__header {
        font-size: 1.5rem;
      }

      &--disabled {
        opacity: 0.5;
      }
    }
    ```

## 3. File Structure

-   **Component Styles**: For a component named `MyComponent`, all its styles must be in `src/components/feature/MyComponent/MyComponent.module.scss`.
-   **Global Style Definitions**:
    -   `styles/abstracts/`: Variables, mixins, functions.
    -   `styles/base/`: Global resets, typography, base element styles.
    -   `styles/layout/`: Layout helpers (e.g., grid, flexbox classes).
