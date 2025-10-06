# System Architecture Analysis

## Current System Status

This project is a React application built with TypeScript, utilizing `@react-router/dev` for development and `@react-router/node` for serving. The build process is managed by Vite.

**Key Technologies and Tools:**
*   **Frontend Framework:** React
*   **Routing:** React Router
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** SASS (SCSS modules are used for component-specific styling)
*   **Testing:** Vitest, `@testing-library/react`, `@testing-library/jest-dom`
*   **Linting & Formatting:** ESLint, Prettier
*   **Core Libraries:** `date-fns`, `i18next`, `lodash`
*   **Path Aliases:** `~/*` maps to the `app/` directory.

## Key Data Types

The following are the critical data types identified from the `app/interface` and `app/types` directories, which define the structure of data within the application, particularly for forms, storage, validation, and workout-related entities.

### Form-Related Interfaces

```typescript
/**
 * Base properties for any form field component.
 */
interface IFormFieldPropsBase {
  /**
   * @property {string} [id] - The unique identifier for the form field.
   */
  id?: string;
  /**
   * @property {string} [className] - CSS class names to apply to the component.
   */
  className?: string;
  /**
   * @property {string} [label] - The main label text for the form field.
   */
  label?: string;
  /**
   * @property {string} [labelTooltip] - Tooltip text to display next to the label.
   */
  labelTooltip?: string;
  /**
   * @property {string} [hint] - Helper text displayed below the form field.
   */
  hint?: string;
  /**
   * @property {string} [error] - Error message to display if the field is invalid.
   */
  error?: string;
  /**
   * @property {string} [errorLabel] - Label for the error message.
   */
  errorLabel?: string;
  /**
   * @property {boolean} [required] - Indicates if the field is mandatory.
   */
  required?: boolean;
  /**
   * @property {boolean} [disabled] - Indicates if the field is disabled.
   */
  disabled?: boolean;
  /**
   * @property {Array<(value: TValidationValue) => boolean>} [validators] - An array of validation functions.
   */
  validators?: Array<(value: TValidationValue) => boolean>;
}
```

```typescript
/**
 * Properties specific to a form field component, including validation triggers and callbacks.
 * Extends IFormFieldPropsBase.
 */
interface IFormFieldProps extends IFormFieldPropsBase {
  /**
   * @property {React.ReactNode} children - The child elements to be rendered within the form field.
   */
  children: React.ReactNode;
  /**
   * @property {boolean} [validateOnChange] - If true, validation is triggered on every change.
   */
  validateOnChange?: boolean;
  /**
   * @property {boolean} [validateOnBlur] - If true, validation is triggered when the field loses focus.
   */
  validateOnBlur?: boolean;
  /**
   * @property {(isValid: boolean) => void} [onValidationChange] - Callback function invoked when the validation status changes.
   */
  onValidationChange?: (isValid: boolean) => void;
  /**
   * @property {() => boolean} [checkValidity] - Function to programmatically check the validity of the field.
   */
  checkValidity?: () => boolean;
  /**
   * @property {() => boolean} [reportValidity] - Function to programmatically report the validity of the field.
   */
  reportValidity?: () => boolean;
}
```

### Storage Interface

```typescript
/**
 * A generic interface for structuring data stored in local storage or similar mechanisms,
 * including a version for schema migration.
 * @template T The type of the data being stored.
 */
interface IStorageData<T> {
  /**
   * @property {string} version - The version of the stored data schema.
   */
  version: string;
  /**
   * @property {T} data - The actual data being stored.
   */
  data: T;
}
```

### Validation Interfaces and Types

```typescript
/**
 * Represents the outcome of a validation check.
 */
interface IValidationResult {
  /**
   * @property {boolean} isValid - True if the validation passed, false otherwise.
   */
  isValid: boolean;
  /**
   * @property {string} [errorMessage] - An optional error message if validation failed.
   */
  errorMessage?: string;
}
```

```typescript
/**
 * Defines the signature for a validation function that takes a value and returns an `IValidationResult`.
 * @template T The type of the value to be validated.
 */
type IValidator<T> = (value: T) => IValidationResult;
```

```typescript
/**
 * Basic JavaScript primitive types.
 */
type TPrimitiveValue = string | number | boolean;
```

```typescript
/**
 * A broader type encompassing values that can be subjected to validation.
 */
type TValidationValue = TPrimitiveValue | null | undefined | unknown[];
```

### Workout-Related Interfaces and Types

```typescript
/**
 * Defines the configuration for a single set within an exercise. All fields are optional.
 */
interface ISetSetting {
  /**
   * @property {number} [weightLifted] - The weight lifted in kilograms or pounds.
   */
  weightLifted?: number;
  /**
   * @property {number} [sets] - The number of sets performed.
   */
  sets?: number;
  /**
   * @property {number} [reps] - The number of repetitions per set.
   */
  reps?: number;
  /**
   * @property {number} [restTime] - The rest time between sets in seconds.
   */
  restTime?: number;
  /**
   * @property {number} [distance] - The distance covered in a cardio exercise.
   */
  distance?: number;
  /**
   * @property {number} [time] - The duration of the exercise in minutes or seconds.
   */
  time?: number;
  /**
   * @property {string} [notes] - Additional notes for the set.
   */
  notes?: string;
}
```

```typescript
/**
 * Similar to `ISetSetting` but allows empty strings for numerical fields,
 * suitable for form inputs where fields might be left blank.
 */
interface ISetSettingForm {
  /**
   * @property {number | ''} [weightLifted] - The weight lifted, or an empty string if not set.
   */
  weightLifted?: number | '';
  /**
   * @property {number | ''} [sets] - The number of sets, or an empty string if not set.
   */
  sets?: number | '';
  /**
   * @property {number | ''} [reps] - The number of repetitions, or an empty string if not set.
   */
  reps?: number | '';
  /**
   * @property {number | ''} [restTime] - The rest time, or an empty string if not set.
   */
  restTime?: number | '';
  /**
   * @property {number | ''} [distance] - The distance, or an empty string if not set.
   */
  distance?: number | '';
  /**
   * @property {number | ''} [time] - The duration, or an empty string if not set.
   */
  time?: number | '';
  /**
   * @property {string} [notes] - Additional notes for the set.
   */
  notes?: string;
}
```

```typescript
/**
 * Represents a single exercise, including its time, name, category, optional notes, and a list of set settings.
 */
interface IExercise {
  /**
   * @property {string} exerciseTime - The time when the exercise was performed (e.g., "HH:MM").
   */
  exerciseTime: string;
  /**
   * @property {string} exerciseName - The name of the exercise (e.g., "Bench Press").
   */
  exerciseName: string;
  /**
   * @property {TExerciseCategory} category - The category of the exercise.
   */
  category: TExerciseCategory;
  /**
   * @property {string} [notes] - Optional notes for the exercise.
   */
  notes?: string;
  /**
   * @property {ISetSetting[]} setSettingList - A list of set configurations for this exercise.
   */
  setSettingList: ISetSetting[];
}
```

```typescript
/**
 * Represents a complete workout session, identified by an ID, date, description, and a list of exercises performed.
 */
interface IWorkout {
  /**
   * @property {string} id - The unique identifier for the workout session.
   */
  id: string;
  /**
   * @property {string} date - The date when the workout was performed (e.g., "YYYY-MM-DD").
   */
  date: string;
  /**
   * @property {string} description - A description of the workout session.
   */
  description: string;
  /**
   * @property {IExercise[]} exerciseList - A list of exercises performed during the workout.
   */
  exerciseList: IExercise[];
}
```

```typescript
/**
 * Defines the allowed categories for an exercise.
 */
type TExerciseCategory = 'Strength' | 'Cardio' | 'Weightlifting';
```
