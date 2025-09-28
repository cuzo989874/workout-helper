# Contributing to Workout Helper

Thank you for your interest in contributing to this project! This document provides guidelines to ensure a smooth and consistent development workflow.

## 1. Getting Started

Before you begin, please ensure your development environment is set up correctly. Instructions for installation and starting the development server can be found in the [README.md](./README.md) file.

Key commands:

- `npm run dev`: To start the development server.
- `npm run test`: To run the test suite.
- `npm run lint`: To check for code style issues.

## 2. Core Workflows

Following these standard operating procedures (SOPs) helps maintain a clean and organized codebase.

### How to Create a New Component

1. **Choose a location**: 
    - For generic, reusable components, use `app/components/` (e.g., a new `Button` or `Modal`).
    - For components tied to a specific feature, use `app/components/feature/` (e.g., `DailySummaryCard`).
2. **Create the files**: Create a new folder for your component and add the necessary files. For a component named `MyComponent`, you would create:
    - `MyComponent.tsx`: The component's logic and JSX.
    - `MyComponent.module.scss`: Scoped styles for the component.
    - `MyComponent.test.tsx`: Tests for the component.
3. **Export the component**: Export your new component from the directory's `index.ts` file if one exists, or directly from the file.

### How to Create a New Page (Route)

1. **Create the page component**: Add a new `.tsx` file in the `app/routes/` directory (e.g., `ProfilePage.tsx`). This component will represent the new page.
2. **Register the route**: Open `app/routes.ts` and add a new route definition that maps a URL path to your newly created page component.

    ```typescript
    // app/routes.ts
    import { type RouteConfig, index, route } from '@react-router/dev/routes';

    export default [
      // ... existing routes
      route('profile', 'routes/ProfilePage.tsx'), // Add your new route here
    ] satisfies RouteConfig;
    ```

## 3. Git Workflow

### Branch Naming

To keep our branch history clean, please use the following prefixes for your branch names:

- **feature/**: For new features (e.g., `feature/user-authentication`).
- **fix/**: For bug fixes (e.g., `fix/timer-display-issue`).
- **chore/**: For maintenance tasks, such as updating dependencies (e.g., `chore/update-vite`).
- **docs/**: For documentation changes (e.g., `docs/update-readme`).

### Commit Messages

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps in automating changelogs and makes the commit history more readable.

Each commit message should be in the format: `type(scope): subject`

- **`type`**: The type describes the nature of your change. Use one of the following:
  - `feat`: A new feature or enhancement.
  - `fix`: A bug fix.
  - `chore`: Routine tasks or maintenance (e.g., updating dependencies, build tasks).
  - `docs`: Documentation changes only.
  - `style`: Code style changes (formatting, missing semicolons, etc.) that do not affect functionality.
  - `refactor`: Code changes that neither fix a bug nor add a feature (e.g., code restructuring).
  - `test`: Adding or updating tests.
  - `update`: General updates that don't fit other types (use sparingly).
- **`scope`** (optional): The part of the codebase you are changing (e.g., `components`, `auth`, `docs`).
- **`subject`**: A short, imperative-tense description of the change.

**Examples:**

- `feat(auth): add google login button`
- `fix(timer): prevent negative countdown values`
- `docs(readme): update available scripts section`

## 4. Code Quality

Before submitting your changes, please run the linter and tests to ensure everything is in order:

```bash
npm run lint
npm run test
```