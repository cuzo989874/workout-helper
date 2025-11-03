# Project Summary

This document provides a high-level summary of the Workout Helper project from a product management perspective. It is designed to give an AI Agent a quick grasp of the project's goals, status, and development conventions.

## 1. Product Vision & Goal

**Vision**: To provide users with a simple, fast, and modern web application for managing their personal workout routines.

**Core Goal**: The primary objective is to allow users to create, track, and manage workout sessions and their associated exercises. The application prioritizes a smooth user experience and reliable client-side data storage.

## 2. Key Features (Current)

-   **Workout Management**: Users can create, update, and delete workout sessions.
-   **Exercise Tracking**: Users can add detailed exercises to each workout, specifying sets, reps, weight, and rest times.
-   **Local Data Persistence**: All user data is stored directly in the browser's Local Storage. This makes the app self-contained and requires no backend account or authentication.

## 3. Target User

Individuals who want a straightforward digital tool to log their gym sessions without the complexity of larger fitness platforms. They value privacy and simplicity, making the local storage approach a key feature.

## 4. Project Status & Conventions

This is an active project with a well-defined structure and a set of established conventions that must be followed.

### Development Workflow

The project uses a standard Git workflow with specific branch naming conventions (`feature/`, `fix/`, `chore/`, `docs/`). All commit messages **must** adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Quality Gates

Before any new code is considered complete, it must pass the following checks:

1.  **Linting**: `npm run lint` must run without errors.
2.  **Testing**: `npm run test` must pass successfully.
3.  **Type Checking**: `npm run typecheck` must complete without any TypeScript errors.

These checks are mandatory to maintain code quality and prevent regressions.

## 5. Key Scripts for Project Management

-   `npm run dev`: To start and review the application in a development environment.
-   `npm run test`: To verify that all functionality is working as expected.
-   `npm run lint`: To ensure code quality standards are met.
-   `npm run build`: To create a production version for final review or deployment.
