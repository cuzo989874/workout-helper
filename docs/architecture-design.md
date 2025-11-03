# Architecture Design: Calendar View Feature

**Document Version**: 1.0  
**Created**: 2025-10-07  
**Author**: AI Agent (Architect Role)  
**Based on**: PRD_calendar.md v1.0

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Current Architecture Analysis](#2-current-architecture-analysis)
3. [Calendar Feature Architecture](#3-calendar-feature-architecture)
4. [Component Specifications](#4-component-specifications)
5. [Data Flow & State Management](#5-data-flow--state-management)
6. [File Structure](#6-file-structure)
7. [Technology Decisions](#7-technology-decisions)
8. [Integration Points](#8-integration-points)
9. [Testing Strategy](#9-testing-strategy)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. Executive Summary

This document defines the technical architecture for adding a Calendar View feature to the Workout Helper application. The design follows existing project conventions and patterns while introducing new components in a modular, testable way.

**Key Architectural Decisions:**
- **No date-fns dependency**: Use native JavaScript Date API and existing `dateUtils.ts` utilities
- **Modal-based interaction**: Calendar workout display uses overlay/modal pattern consistent with existing `ExerciseFormModal`
- **Reuse existing components**: Leverage `Card`, `WorkoutCard`, and `Header` components
- **Consistent styling**: Follow SCSS module pattern with imports from `styles/abstracts/_variables.scss`
- **Route-based navigation**: Add `/calendar` route using existing React Router structure

---

## 2. Current Architecture Analysis

### 2.1 Project Structure Overview
```
src/
├── assets/          # SVG icons (calendar_month.svg already exists)
├── components/      # Reusable UI components
│   ├── calendar/    # Empty - will contain calendar components
│   ├── card/        # Card, CardHeader, CardBody
│   ├── feature/     # WorkoutCard, ExerciseCard
│   ├── form/        # Form components (DatePicker, Input, etc.)
│   └── layouts/     # Header, SubPageHeader
├── routes/          # Page-level components
├── services/        # LocalStorageService
├── utils/           # dateUtils, validators
├── interface/       # TypeScript interfaces (IWorkout, IExercise)
└── types/           # Type definitions
```

### 2.2 Key Findings

#### Existing Patterns:
1. **Routing**: Uses `@react-router/dev` with `routes.ts` configuration
2. **Styling**: SCSS modules with variables from `styles/abstracts/_variables.scss`
3. **Data Persistence**: `LocalStorageService` with versioning support
4. **Date Handling**: Custom `dateUtils.ts` without external date library
5. **State Management**: Local React state (useState) - no Redux/Zustand
6. **Testing**: Vitest + Testing Library for component tests
7. **Icons**: SVG imports using `vite-plugin-svgr` (e.g., `AddIcon.svg?react`)

#### Reusable Components:
- `Card`, `CardHeader`, `CardBody` - Base card structure
- `WorkoutCard` - Displays workout summary with exercises
- `Header` - Main app header with logo
- `FormDatePicker` - Existing date picker (not suitable for calendar grid)

#### Utilities Available:
- `formatDateAsNumeric(date)` - Returns "YYYY-MM-DD"
- `formatTimestampWithLanguage(timestamp, language, format)` - i18n date formatting
- `LocalStorageService.loadWorkouts()` - Fetch all workouts
- `useTranslation()` from i18next - Internationalization support

#### Missing Dependencies:
- ❌ **date-fns** is NOT installed (mentioned in architecture-analysis.md but not in package.json)
- ✅ Must use native Date API

---

## 3. Calendar Feature Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Header                               │
│  [Workout Helper]              [Calendar Icon Button]       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─ Home Route (/)
                            │  └─ List view (existing)
                            │
                            └─ Calendar Route (/calendar)
                               └─ Calendar Component
                                  ├─ CalendarHeader (month nav)
                                  ├─ CalendarGrid (7x5/6 grid)
                                  │  └─ CalendarDateCell (×35-42)
                                  └─ CalendarWorkoutModal
                                     └─ WorkoutCard (reused)
```

### 3.2 Component Hierarchy

```
Calendar (Page)
├── Header (existing, modified)
│   └── CalendarToggleButton (new)
└── main
    ├── CalendarHeader (new)
    │   ├── PreviousMonthButton
    │   ├── MonthYearDisplay
    │   └── NextMonthButton
    ├── CalendarGrid (new)
    │   └── CalendarDateCell (×35-42) (new)
    │       ├── DateNumber
    │       └── WorkoutIndicator (conditional)
    └── CalendarWorkoutModal (new)
        ├── Modal Overlay
        ├── SelectedDateDisplay
        ├── WorkoutList
        │   └── WorkoutCard (reused)
        └── CreateWorkoutButton
```

### 3.3 Data Flow Diagram

```
┌──────────────────────┐
│  LocalStorage        │
│  (workout_data)      │
└──────────┬───────────┘
           │
           ↓ loadWorkouts()
┌──────────────────────────────────────────────────────┐
│  Calendar Component State                            │
│  - currentMonth: Date                                │
│  - currentYear: number                               │
│  - workouts: IWorkout[]                              │
│  - selectedDate: string | null                       │
│  - isModalOpen: boolean                              │
└──────────┬───────────────────────────────────────────┘
           │
           ├─→ computeCalendarDays() → Day[]
           │   (calculate grid dates)
           │
           ├─→ groupWorkoutsByDate() → Map<string, IWorkout[]>
           │   (map workouts to dates)
           │
           └─→ getWorkoutsForDate(date) → IWorkout[]
               (filter workouts for modal)

User Actions:
  Click date → setSelectedDate() + openModal()
  Click workout → navigate(`/workout/${id}`)
  Click "Create" → navigate(`/workout/create?date=${date}`)
  Click prev/next → updateMonth()
```

---

## 4. Component Specifications

### 4.1 Calendar (Page Component)
**File**: `src/routes/calendar.tsx`

**Responsibilities:**
- Load workouts from LocalStorageService on mount
- Manage current month/year state
- Compute calendar grid data
- Handle date selection and modal state
- Provide navigation handlers

**State:**
```typescript
interface ICalendarState {
  currentMonth: number;      // 0-11
  currentYear: number;       // e.g., 2025
  workouts: IWorkout[];      // All workouts from storage
  selectedDate: string | null; // "YYYY-MM-DD" or null
  isModalOpen: boolean;
}
```

**Key Functions:**
```typescript
// Calculate days to display in calendar grid
const computeCalendarDays = (year: number, month: number): ICalendarDay[] => {
  // Return 35-42 day objects (including prev/next month padding)
}

// Group workouts by date for quick lookup
const groupWorkoutsByDate = (workouts: IWorkout[]): Map<string, IWorkout[]> => {
  // Return Map<"YYYY-MM-DD", IWorkout[]>
}

// Get workouts for a specific date
const getWorkoutsForDate = (date: string): IWorkout[] => {
  // Return workouts matching the date
}

// Navigation handlers
const goToPreviousMonth = () => { /* ... */ }
const goToNextMonth = () => { /* ... */ }
const goToToday = () => { /* ... */ }

// Modal handlers
const handleDateClick = (date: string) => { /* open modal */ }
const closeModal = () => { /* close modal */ }
```

**Props**: None (route component)

**Export**: `export default function Calendar()`

---

### 4.2 CalendarHeader Component
**File**: `src/components/calendar/CalendarHeader.tsx`

**Responsibilities:**
- Display current month and year
- Provide previous/next month navigation
- Optional: "Today" button to jump to current month

**Props:**
```typescript
interface ICalendarHeaderProps {
  currentMonth: number;    // 0-11
  currentYear: number;     // e.g., 2025
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday?: () => void;    // Optional
}
```

**Structure:**
```tsx
<div className={styles['calendar-header']}>
  <button onClick={onPreviousMonth} aria-label="Previous month">
    <ChevronLeftIcon />
  </button>
  <h2>{formatMonthYear(currentMonth, currentYear)}</h2>
  <button onClick={onNextMonth} aria-label="Next month">
    <ChevronRightIcon />
  </button>
</div>
```

**Styling**: `CalendarHeader.module.scss`

**Tests**: `CalendarHeader.test.tsx`
- Renders month/year correctly
- Calls navigation callbacks
- Handles different locales

---

### 4.3 CalendarGrid Component
**File**: `src/components/calendar/CalendarGrid.tsx`

**Responsibilities:**
- Render 7-column grid (Sun-Sat or Mon-Sun)
- Display day-of-week headers
- Render CalendarDateCell for each day
- Pass workout data to cells

**Props:**
```typescript
interface ICalendarGridProps {
  days: ICalendarDay[];          // 35-42 days
  workoutsByDate: Map<string, IWorkout[]>;
  onDateClick: (date: string) => void;
  todayDate: string;             // "YYYY-MM-DD" for highlighting
}

interface ICalendarDay {
  date: string;           // "YYYY-MM-DD"
  dayOfMonth: number;     // 1-31
  isCurrentMonth: boolean; // true if in displayed month
  isToday: boolean;       // true if today's date
}
```

**Structure:**
```tsx
<div className={styles['calendar-grid']}>
  {/* Week day headers */}
  <div className={styles['calendar-header-row']}>
    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
      <div key={day} className={styles['day-header']}>{day}</div>
    ))}
  </div>
  
  {/* Date cells */}
  <div className={styles['calendar-body']}>
    {days.map(day => (
      <CalendarDateCell
        key={day.date}
        day={day}
        workouts={workoutsByDate.get(day.date) || []}
        onClick={() => onDateClick(day.date)}
      />
    ))}
  </div>
</div>
```

**Styling**: 
- Use CSS Grid: `display: grid; grid-template-columns: repeat(7, 1fr);`
- Responsive sizing with `minmax()`

**Tests**: `CalendarGrid.test.tsx`
- Renders correct number of cells
- Displays day headers
- Calls onDateClick with correct date

---

### 4.4 CalendarDateCell Component
**File**: `src/components/calendar/CalendarDateCell.tsx`

**Responsibilities:**
- Display date number
- Show workout indicator (dot, badge, count)
- Apply styling for current month, today, past/future
- Handle click events

**Props:**
```typescript
interface ICalendarDateCellProps {
  day: ICalendarDay;
  workouts: IWorkout[];          // Workouts for this date
  onClick: () => void;
}
```

**Structure:**
```tsx
<div 
  className={cn(
    styles['calendar-date-cell'],
    !day.isCurrentMonth && styles['other-month'],
    day.isToday && styles['today'],
    workouts.length > 0 && styles['has-workouts']
  )}
  onClick={onClick}
>
  <span className={styles['date-number']}>{day.dayOfMonth}</span>
  {workouts.length > 0 && (
    <div className={styles['workout-indicator']}>
      {workouts.length > 1 ? workouts.length : ''}
    </div>
  )}
</div>
```

**Styling Variants:**
- `.other-month` - Faded text for prev/next month dates
- `.today` - Border or background highlight
- `.has-workouts` - Bold or colored indicator
- `.workout-indicator` - Small circle/badge with optional count

**Tests**: `CalendarDateCell.test.tsx`
- Renders date number
- Shows indicator when workouts exist
- Applies correct CSS classes
- Calls onClick handler

---

### 4.5 CalendarWorkoutModal Component
**File**: `src/components/calendar/CalendarWorkoutModal.tsx`

**Responsibilities:**
- Display modal overlay when date is selected
- Show selected date prominently
- List all workouts for that date using `WorkoutCard`
- Provide "Create Workout" button
- Handle navigation to workout detail or creation

**Props:**
```typescript
interface ICalendarWorkoutModalProps {
  isOpen: boolean;
  selectedDate: string | null;  // "YYYY-MM-DD"
  workouts: IWorkout[];
  onClose: () => void;
  onWorkoutClick: (workoutId: string) => void;
  onCreateWorkout: () => void;
}
```

**Structure:**
```tsx
{isOpen && (
  <div className={styles['modal-overlay']} onClick={onClose}>
    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
      <div className={styles['modal-header']}>
        <h3>{formatDate(selectedDate)}</h3>
        <button onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>
      </div>
      
      <div className={styles['modal-body']}>
        {workouts.length === 0 ? (
          <p className="text--grey">No workouts on this date.</p>
        ) : (
          <ul className="flex flex-column g-md">
            {workouts.map(workout => (
              <li key={workout.id} onClick={() => onWorkoutClick(workout.id)}>
                <WorkoutCard workout={workout} />
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className={styles['modal-footer']}>
        <button 
          className="btn btn-flat--primary w-100"
          onClick={onCreateWorkout}
        >
          <AddIcon /> Create Workout
        </button>
      </div>
    </div>
  </div>
)}
```

**Styling**: 
- Modal overlay: semi-transparent background
- Modal content: centered, white card with shadow
- Match existing modal patterns (check if there's a base Modal component)

**Tests**: `CalendarWorkoutModal.test.tsx`
- Renders when isOpen is true
- Does not render when isOpen is false
- Displays correct date
- Renders WorkoutCard for each workout
- Calls callbacks correctly

---

### 4.6 Header Component (Modified)
**File**: `src/components/layouts/Header.tsx` (existing, to be modified)

**Changes:**
- Add calendar toggle button to the right side of header
- Button shows calendar icon when on home page
- Button shows list icon when on calendar page (optional for MVP)

**Updated Structure:**
```tsx
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Add this
  
  const isCalendarView = location.pathname === '/calendar';
  
  const handleLogoClick = () => { /* existing */ }
  
  const handleViewToggle = () => {
    if (isCalendarView) {
      navigate('/');
    } else {
      navigate('/calendar');
    }
  };
  
  return (
    <header className={styles.header}>
      <a className="clickable" aria-label="Logo" onClick={handleLogoClick}>
        <h1>Workout Helper</h1>
      </a>
      
      <button 
        className="btn icon-btn"
        onClick={handleViewToggle}
        aria-label={isCalendarView ? "Switch to list view" : "Switch to calendar view"}
      >
        {isCalendarView ? <ListIcon /> : <CalendarIcon />}
      </button>
    </header>
  );
}
```

**Icon:**
- Use existing `calendar_month.svg` from `src/assets/google-fonts/`
- May need to add `list.svg` or `view_list.svg` for list view icon

**Updated Tests**: `Header.test.tsx`
- Add test for view toggle button
- Verify navigation calls

---

### 4.7 CreateWorkout Component (Modified)
**File**: `src/routes/createWorkout.tsx` (existing, minor modification)

**Changes:**
- Accept date parameter from URL query string
- Pre-populate date field if provided

**Implementation:**
```tsx
import { useSearchParams } from 'react-router';

export default function CreateWorkout() {
  const [searchParams] = useSearchParams();
  const dateFromQuery = searchParams.get('date');
  
  const [date, setDate] = useState(
    dateFromQuery || formatDateAsNumeric(new Date())
  );
  
  // Rest of component remains the same
}
```

**Tests**: Update `createWorkout.test.tsx`
- Add test for date query parameter handling

---

## 5. Data Flow & State Management

### 5.1 State Location

All state is managed locally in the `Calendar` component using `useState`:

```typescript
const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
const [workouts, setWorkouts] = useState<IWorkout[]>([]);
const [selectedDate, setSelectedDate] = useState<string | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```

**Rationale**: Follows existing pattern in `home.tsx` and `createWorkout.tsx`. No global state needed as calendar is isolated.

### 5.2 Data Loading

```typescript
useEffect(() => {
  const loadedWorkouts = LocalStorageService.loadWorkouts() || [];
  setWorkouts(loadedWorkouts);
}, []);
```

**Refresh Strategy**: 
- Load once on mount
- Optional: Add listener/effect to reload when returning from creation/detail pages
- Alternative: Use React Router `loader` function for SSR compatibility

### 5.3 Computed Values

Use `useMemo` for expensive calculations:

```typescript
const calendarDays = useMemo(() => {
  return computeCalendarDays(currentYear, currentMonth);
}, [currentYear, currentMonth]);

const workoutsByDate = useMemo(() => {
  return groupWorkoutsByDate(workouts);
}, [workouts]);

const selectedDateWorkouts = useMemo(() => {
  return selectedDate ? workoutsByDate.get(selectedDate) || [] : [];
}, [selectedDate, workoutsByDate]);

const todayDateString = useMemo(() => {
  return formatDateAsNumeric(new Date());
}, []);
```

### 5.4 Event Handlers

```typescript
const handlePreviousMonth = () => {
  if (currentMonth === 0) {
    setCurrentMonth(11);
    setCurrentYear(currentYear - 1);
  } else {
    setCurrentMonth(currentMonth - 1);
  }
};

const handleNextMonth = () => {
  if (currentMonth === 11) {
    setCurrentMonth(0);
    setCurrentYear(currentYear + 1);
  } else {
    setCurrentMonth(currentMonth + 1);
  }
};

const handleDateClick = (date: string) => {
  setSelectedDate(date);
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setSelectedDate(null);
};

const handleWorkoutClick = (workoutId: string) => {
  navigate(`/workout/${workoutId}`);
};

const handleCreateWorkout = () => {
  navigate(`/workout/create?date=${selectedDate}`);
};
```

---

## 6. File Structure

### 6.1 New Files to Create

```
src/
├── routes/
│   ├── calendar.tsx                          # Main calendar page component
│   ├── calendar.module.scss                  # Page-level styles
│   └── calendar.test.tsx                     # Page tests
│
├── components/
│   └── calendar/
│       ├── CalendarHeader.tsx                # Month navigation header
│       ├── CalendarHeader.module.scss
│       ├── CalendarHeader.test.tsx
│       │
│       ├── CalendarGrid.tsx                  # Calendar grid container
│       ├── CalendarGrid.module.scss
│       ├── CalendarGrid.test.tsx
│       │
│       ├── CalendarDateCell.tsx              # Individual date cell
│       ├── CalendarDateCell.module.scss
│       ├── CalendarDateCell.test.tsx
│       │
│       ├── CalendarWorkoutModal.tsx          # Modal for date workouts
│       ├── CalendarWorkoutModal.module.scss
│       ├── CalendarWorkoutModal.test.tsx
│       │
│       └── index.ts                          # Barrel export (optional)
│
└── utils/
    ├── calendarUtils.ts                      # Calendar calculation utilities
    └── calendarUtils.test.ts                # Utility tests
```

### 6.2 Files to Modify

```
src/
├── routes.ts                                 # Add calendar route
├── routes/
│   └── createWorkout.tsx                     # Add date query param handling
│
├── components/
│   └── layouts/
│       ├── Header.tsx                        # Add calendar toggle button
│       ├── Header.module.scss                # Style toggle button
│       └── Header.test.tsx                   # Test toggle button
│
└── assets/
    └── google-fonts/
        └── (verify calendar_month.svg exists, add list.svg if needed)
```

### 6.3 Total File Count
- **New Files**: 13 files (4 components × 3 files each + 1 page × 3 files + 1 utility × 2 files)
- **Modified Files**: 5 files
- **Total**: 18 files

---

## 7. Technology Decisions

### 7.1 Date Library: Native JavaScript

**Decision**: Do NOT install `date-fns`. Use native Date API.

**Rationale:**
- Project currently has NO date library dependency
- Native API is sufficient for calendar grid calculations
- Keeps bundle size small
- Existing `dateUtils.ts` already handles formatting

**Implementation Details:**
```typescript
// Get first day of month
const firstDay = new Date(year, month, 1);

// Get last day of month
const lastDay = new Date(year, month + 1, 0);

// Get day of week (0 = Sunday, 1 = Monday, ...)
const firstDayOfWeek = firstDay.getDay();

// Calculate days to show from previous month
const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

// Generate array of dates
const days = [];
for (let i = -daysFromPrevMonth; i < 35 - daysFromPrevMonth; i++) {
  const date = new Date(year, month, i + 1);
  days.push({
    date: formatDateAsNumeric(date),
    dayOfMonth: date.getDate(),
    isCurrentMonth: date.getMonth() === month,
    isToday: formatDateAsNumeric(date) === formatDateAsNumeric(new Date())
  });
}
```

### 7.2 Modal Implementation: Custom Component

**Decision**: Create custom `CalendarWorkoutModal` component.

**Rationale:**
- Project already has modal pattern in `ExerciseFormModal`
- No existing base Modal component found
- Keeps implementation simple and calendar-specific

**Alternative Considered**: Extract base `<Modal>` component
- **Pros**: Reusability
- **Cons**: Requires refactoring existing modals, scope creep
- **Recommendation**: Add to technical debt, implement in future iteration

### 7.3 Styling: SCSS Modules

**Decision**: Continue using SCSS modules with shared variables.

**Pattern:**
```scss
// src/components/calendar/CalendarGrid.module.scss
@use '../../styles/abstracts/variables';

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: variables.$spacing-xs;
}
```

### 7.4 Icon Assets

**Decision**: Use existing SVG icon system.

**Required Icons:**
- ✅ `calendar_month.svg` (already exists)
- ✅ `chevron_left.svg` (already exists)
- ✅ `chevron_right.svg` (already exists)
- ✅ `add.svg` (already exists)
- ✅ `close.svg` (already exists)
- ❓ `list.svg` or `view_list.svg` (check if exists, may need to add)

**Import Pattern:**
```tsx
import CalendarIcon from '~/assets/google-fonts/calendar_month.svg?react';
```

### 7.5 Internationalization

**Decision**: Use existing i18next setup for date formatting.

**Implementation:**
```typescript
// In Calendar component
const { t } = useTranslation();
const { i18n } = useTranslation();

// Format month/year with locale
const monthName = new Date(currentYear, currentMonth).toLocaleString(
  i18n.language, 
  { month: 'long' }
);

// Translation keys to add (not in scope for architecture, but note for implementation)
// - calendar.title
// - calendar.today
// - calendar.noWorkouts
// - calendar.createWorkout
```

---

## 8. Integration Points

### 8.1 Routing Integration

**File**: `src/routes.ts`

```typescript
import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('calendar', 'routes/calendar.tsx'),          // ADD THIS
  route('workout/:id', 'routes/WorkoutDetail.tsx'),
  route('workout/create', 'routes/createWorkout.tsx'),
  route('workout/update/:id', 'routes/updateWorkout.tsx'),
  route('workout/timer/:id', 'routes/timer.tsx'),
] satisfies RouteConfig;
```

### 8.2 LocalStorageService Integration

**Usage in Calendar:**
```typescript
import { LocalStorageService } from '~/services/LocalStorageService';

// Load workouts
const workouts = LocalStorageService.loadWorkouts() || [];

// No modifications needed to LocalStorageService
```

**Data Contract:**
- Input: None
- Output: `IWorkout[]` or `null`
- No changes required to service

### 8.3 Component Reuse

**WorkoutCard Component:**
- Used in: `home.tsx`, `calendar.tsx` (via modal)
- Props remain unchanged
- No modifications needed

**Card Components:**
- Used throughout app
- Calendar may use `Card` for modal content
- No modifications needed

**Header Component:**
- Modified to add toggle button
- Existing functionality preserved
- New prop: none (uses `useLocation` internally)

### 8.4 Utility Functions

**Existing Utils:**
```typescript
// src/utils/dateUtils.ts
import { formatDateAsNumeric } from '~/utils/dateUtils';

// Usage
const dateString = formatDateAsNumeric(new Date()); // "2025-10-07"
```

**New Utils:**
```typescript
// src/utils/calendarUtils.ts (NEW FILE)
export const computeCalendarDays = (year: number, month: number): ICalendarDay[];
export const groupWorkoutsByDate = (workouts: IWorkout[]): Map<string, IWorkout[]>;
export const getMonthName = (month: number, locale: string): string;
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

**Component Tests:**
```typescript
// CalendarDateCell.test.tsx
describe('CalendarDateCell', () => {
  it('renders date number', () => {});
  it('shows workout indicator when workouts exist', () => {});
  it('applies "today" class for current date', () => {});
  it('applies "other-month" class for dates outside current month', () => {});
  it('calls onClick when clicked', () => {});
});

// CalendarGrid.test.tsx
describe('CalendarGrid', () => {
  it('renders 35-42 date cells', () => {});
  it('renders day-of-week headers', () => {});
  it('passes correct workout data to cells', () => {});
  it('calls onDateClick with correct date', () => {});
});

// CalendarHeader.test.tsx
describe('CalendarHeader', () => {
  it('displays current month and year', () => {});
  it('calls onPreviousMonth when previous button clicked', () => {});
  it('calls onNextMonth when next button clicked', () => {});
  it('localizes month name', () => {});
});

// CalendarWorkoutModal.test.tsx
describe('CalendarWorkoutModal', () => {
  it('does not render when isOpen is false', () => {});
  it('renders when isOpen is true', () => {});
  it('displays selected date', () => {});
  it('renders WorkoutCard for each workout', () => {});
  it('calls onWorkoutClick when workout is clicked', () => {});
  it('calls onCreateWorkout when create button clicked', () => {});
  it('calls onClose when overlay or close button clicked', () => {});
});
```

**Utility Tests:**
```typescript
// calendarUtils.test.ts
describe('computeCalendarDays', () => {
  it('returns 35 or 42 days', () => {});
  it('includes correct days from previous month', () => {});
  it('includes correct days from next month', () => {});
  it('marks current month days correctly', () => {});
  it('marks today correctly', () => {});
});

describe('groupWorkoutsByDate', () => {
  it('groups workouts by date string', () => {});
  it('handles empty workout array', () => {});
  it('handles multiple workouts on same date', () => {});
});
```

### 9.2 Integration Tests

**Calendar Page Tests:**
```typescript
// calendar.test.tsx
describe('Calendar Page', () => {
  it('loads workouts from LocalStorage on mount', () => {});
  it('displays workouts on correct dates', () => {});
  it('navigates to previous/next month', () => {});
  it('opens modal when date is clicked', () => {});
  it('navigates to workout detail when workout clicked', () => {});
  it('navigates to create workout with correct date', () => {});
  it('handles empty workout data gracefully', () => {});
});
```

**Header Tests (Updated):**
```typescript
// Header.test.tsx
describe('Header', () => {
  // ... existing tests
  it('shows calendar icon on home page', () => {});
  it('navigates to /calendar when calendar icon clicked', () => {});
  it('shows list icon on calendar page', () => {});
  it('navigates to / when list icon clicked', () => {});
});
```

### 9.3 Test Data

**Mock Workouts:**
```typescript
const mockWorkouts: IWorkout[] = [
  {
    id: '1',
    date: '2025-10-07',
    description: 'Morning workout',
    exerciseList: [/* ... */],
  },
  {
    id: '2',
    date: '2025-10-07',
    description: 'Evening workout',
    exerciseList: [/* ... */],
  },
  {
    id: '3',
    date: '2025-10-15',
    description: 'Leg day',
    exerciseList: [/* ... */],
  },
];
```

### 9.4 Coverage Targets
- **Component Tests**: 100% of new components
- **Utility Functions**: 100% coverage
- **Integration Tests**: All critical user flows
- **Existing Tests**: No regressions

---

## 10. Implementation Roadmap

### Phase 1: Foundation & Utilities (Priority: High)
**Estimated Time**: 0.5 days

**Tasks:**
1. Create `src/utils/calendarUtils.ts`
   - Implement `computeCalendarDays()`
   - Implement `groupWorkoutsByDate()`
   - Implement helper functions
2. Write unit tests for `calendarUtils.ts`
3. Add calendar route to `src/routes.ts`

**Deliverables:**
- ✅ Calendar utilities with tests
- ✅ Route configured

**Dependencies**: None

---

### Phase 2: Core Calendar Components (Priority: High)
**Estimated Time**: 1.5 days

**Tasks:**
1. **CalendarDateCell Component**
   - Create `CalendarDateCell.tsx`
   - Create `CalendarDateCell.module.scss`
   - Write unit tests
   - Implement click handling

2. **CalendarGrid Component**
   - Create `CalendarGrid.tsx`
   - Create `CalendarGrid.module.scss`
   - Write unit tests
   - Integrate CalendarDateCell

3. **CalendarHeader Component**
   - Create `CalendarHeader.tsx`
   - Create `CalendarHeader.module.scss`
   - Write unit tests
   - Implement navigation handlers

**Deliverables:**
- ✅ Three core components with styles and tests
- ✅ Components render correctly in isolation

**Dependencies**: Phase 1 complete

---

### Phase 3: Calendar Page & Modal (Priority: High)
**Estimated Time**: 1.5 days

**Tasks:**
1. **CalendarWorkoutModal Component**
   - Create `CalendarWorkoutModal.tsx`
   - Create `CalendarWorkoutModal.module.scss`
   - Write unit tests
   - Integrate WorkoutCard
   - Implement navigation handlers

2. **Calendar Page Component**
   - Create `src/routes/calendar.tsx`
   - Create `calendar.module.scss`
   - Implement state management
   - Integrate all calendar components
   - Wire up LocalStorageService
   - Write integration tests

**Deliverables:**
- ✅ Working calendar page with modal
- ✅ Data loads from LocalStorage
- ✅ Date selection opens modal
- ✅ Month navigation works

**Dependencies**: Phase 2 complete

---

### Phase 4: Header Integration (Priority: High)
**Estimated Time**: 0.5 days

**Tasks:**
1. Modify `src/components/layouts/Header.tsx`
   - Add calendar toggle button
   - Implement view detection (useLocation)
   - Add navigation handler
2. Update `Header.module.scss`
   - Style toggle button
   - Ensure responsive layout
3. Update `Header.test.tsx`
   - Add tests for toggle button
   - Test navigation calls

**Deliverables:**
- ✅ Header toggle button functional
- ✅ Navigation between list and calendar views works

**Dependencies**: Phase 3 complete (to test navigation)

---

### Phase 5: CreateWorkout Integration (Priority: Medium)
**Estimated Time**: 0.5 days

**Tasks:**
1. Modify `src/routes/createWorkout.tsx`
   - Add `useSearchParams` hook
   - Pre-populate date from query parameter
2. Update `createWorkout.test.tsx`
   - Add test for query parameter handling

**Deliverables:**
- ✅ Creating workout from calendar pre-fills date
- ✅ Tests verify query param behavior

**Dependencies**: Phase 3 complete (calendar can navigate to create)

---

### Phase 6: Polish & Accessibility (Priority: Medium)
**Estimated Time**: 1 day

**Tasks:**
1. **Styling Refinements**
   - Responsive design testing (mobile, tablet, desktop)
   - Color scheme consistency
   - Hover states and transitions
   - Loading states (if needed)

2. **Accessibility**
   - Keyboard navigation (Tab, Enter, Esc)
   - ARIA labels for buttons
   - Focus management in modal
   - Screen reader testing

3. **Internationalization**
   - Add translation keys for calendar strings
   - Test with different locales
   - Date formatting verification

4. **Edge Cases**
   - Empty state (no workouts)
   - Large number of workouts on one date
   - Month with 6 weeks (42 days)
   - Year boundary navigation (Dec → Jan)

**Deliverables:**
- ✅ Fully responsive calendar
- ✅ Accessible to keyboard and screen reader users
- ✅ Internationalized strings
- ✅ Edge cases handled gracefully

**Dependencies**: Phase 5 complete

---

### Phase 7: Testing & Bug Fixes (Priority: High)
**Estimated Time**: 1 day

**Tasks:**
1. Run full test suite
   - All unit tests passing
   - All integration tests passing
   - Coverage reports reviewed
2. Manual testing
   - Test all user flows from PRD
   - Cross-browser testing (Chrome, Firefox, Safari)
   - Mobile device testing
3. Bug fixes
   - Address issues found in testing
   - Performance optimization if needed
4. Code review
   - Self-review for code quality
   - Check for TODO comments
   - Verify no console errors/warnings

**Deliverables:**
- ✅ All tests passing (target: 100% of new code)
- ✅ No critical bugs
- ✅ Performance acceptable
- ✅ Code review complete

**Dependencies**: Phase 6 complete

---

### Phase 8: Documentation (Priority: Low)
**Estimated Time**: 0.5 days

**Tasks:**
1. Update README.md (if needed)
   - Mention calendar view feature
   - Update screenshots/demo (optional)
2. Update CONTRIBUTING.md (if needed)
   - Any new patterns introduced
3. Add inline code comments
   - Complex logic in utilities
   - Component props documentation
4. Update architecture-analysis.md
   - Add calendar components to system overview

**Deliverables:**
- ✅ Documentation updated
- ✅ Code is well-commented

**Dependencies**: Phase 7 complete

---

### Total Estimated Time: 7 days (1.5 weeks)

**Critical Path:**
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8

**Parallelization Opportunities:**
- Phase 6 (Polish) can start partially during Phase 5
- Phase 8 (Documentation) can be done incrementally throughout

---

## 11. Risk Assessment & Mitigation

### Risk 1: Date Calculation Complexity
**Impact**: High | **Probability**: Medium

**Description**: Calculating correct calendar grid (especially for months with 6 weeks) can be error-prone.

**Mitigation:**
- Comprehensive unit tests for `computeCalendarDays()`
- Test edge cases (Feb in leap years, year boundaries)
- Reuse native Date API to minimize custom logic

---

### Risk 2: Performance with Large Workout Datasets
**Impact**: Medium | **Probability**: Low

**Description**: Grouping 1000+ workouts could cause render lag.

**Mitigation:**
- Use `useMemo` for computed values
- Optimize `groupWorkoutsByDate()` with Map instead of array.filter
- Lazy load workouts by month if needed (future enhancement)

---

### Risk 3: Modal Accessibility Issues
**Impact**: Medium | **Probability**: Medium

**Description**: Custom modal may not trap focus or handle keyboard correctly.

**Mitigation:**
- Follow WCAG 2.1 modal patterns
- Test with keyboard navigation
- Use `aria-modal`, `role="dialog"`, and focus trap
- Consider using existing modal library in future

---

### Risk 4: Mobile UX Challenges
**Impact**: Medium | **Probability**: Medium

**Description**: Calendar grid may be cramped on small screens.

**Mitigation:**
- Design mobile-first
- Use responsive font sizes and spacing
- Test on actual devices (iPhone, Android)
- Consider swipe gestures for month navigation (future enhancement)

---

### Risk 5: Integration with Existing Navigation
**Impact**: Low | **Probability**: Low

**Description**: Adding header button may break existing layout.

**Mitigation:**
- Test header on all pages
- Use flexbox with proper alignment
- Ensure logo/title is not pushed off-screen

---

## 12. Future Enhancements (Out of Scope)

These items are **not** included in the current implementation but are documented for future consideration:

1. **Week View & Day View**
   - Additional view modes beyond month
   - More granular scheduling

2. **Drag-and-Drop Rescheduling**
   - Drag workout to different date
   - Update workout date in LocalStorage

3. **Workout Streak Visualization**
   - Highlight consecutive workout days
   - Motivational UI elements

4. **Workout Category Color Coding**
   - Assign colors to Strength/Cardio/Weightlifting
   - Show colored indicators on calendar

5. **Calendar Export/Import**
   - Export to iCal format
   - Import workouts from external calendar

6. **Base Modal Component**
   - Extract reusable `<Modal>` component
   - Refactor all modals to use it

7. **Swipe Gestures (Mobile)**
   - Swipe left/right to change months
   - Improves mobile UX

8. **Year Selector**
   - Jump to specific month/year
   - Faster navigation for long-term planning

9. **Workout Templates on Calendar**
   - Quick-add from templates
   - Recurring workout support

10. **Dark Mode Support**
    - Already noted in Header.tsx TODO
    - Would need calendar-specific theme adjustments

---

## 13. Acceptance Criteria Mapping

This section maps PRD User Stories to architecture components:

### US-1: Header Navigation Toggle
**Components**: `Header.tsx` (modified)  
**Files**: 3 files (tsx, scss, test)  
**Status**: ✅ Designed

**Architecture Coverage:**
- Section 4.6: Header Component specification
- Section 8.3: Component integration details
- Section 10 Phase 4: Implementation plan

---

### US-2: Calendar Page Display
**Components**: `Calendar.tsx`, `CalendarHeader.tsx`, `CalendarGrid.tsx`, `CalendarDateCell.tsx`  
**Files**: 12 files (4 components × 3 files each)  
**Status**: ✅ Designed

**Architecture Coverage:**
- Section 4.1-4.4: Component specifications
- Section 5: Data flow and state management
- Section 7.1: Date calculation approach
- Section 10 Phases 1-3: Implementation plan

---

### US-3: View Workouts on Calendar
**Components**: `Calendar.tsx`, `CalendarDateCell.tsx`, `CalendarWorkoutModal.tsx`  
**Status**: ✅ Designed

**Architecture Coverage:**
- Section 4.4: DateCell workout indicator
- Section 4.5: Modal displaying workout list
- Section 5.2: Data loading from LocalStorage
- Section 5.3: Computed values (workoutsByDate)

---

### US-4: Create Workout from Calendar Date
**Components**: `CalendarWorkoutModal.tsx`, `createWorkout.tsx` (modified)  
**Files**: 4 files (modal component + createWorkout modifications)  
**Status**: ✅ Designed

**Architecture Coverage:**
- Section 4.5: Modal "Create Workout" button
- Section 4.7: CreateWorkout query param handling
- Section 8.4: Navigation integration
- Section 10 Phase 5: Implementation plan

---

### US-5: Navigate to Workout Detail from Calendar
**Components**: `CalendarWorkoutModal.tsx`  
**Status**: ✅ Designed

**Architecture Coverage:**
- Section 4.5: Modal workout click handler
- Section 5.4: handleWorkoutClick navigation
- Section 8.3: WorkoutCard reuse

---

**All PRD User Stories**: ✅ Fully covered by architecture

---

## 14. Conclusion

This architecture design provides a comprehensive blueprint for implementing the Calendar View feature in Workout Helper. The design:

✅ **Follows existing patterns** - SCSS modules, local state, component structure  
✅ **Reuses existing components** - WorkoutCard, Card, Header, LocalStorageService  
✅ **Avoids new dependencies** - Uses native Date API instead of date-fns  
✅ **Is fully testable** - Unit and integration test strategy defined  
✅ **Covers all PRD requirements** - All 5 User Stories addressed  
✅ **Provides clear implementation path** - 8-phase roadmap with time estimates  

**Next Steps:**
1. Review and approve architecture design
2. Update `check-list.md` with detailed tasks from implementation roadmap
3. Hand off to Engineer for implementation (Phase 1)

---

## Appendix A: Quick Reference

### Key Files Summary

| Category | Files | Purpose |
|----------|-------|---------|
| **Page** | `src/routes/calendar.tsx` | Main calendar page |
| **Components** | `CalendarHeader.tsx` | Month navigation |
| | `CalendarGrid.tsx` | Calendar grid container |
| | `CalendarDateCell.tsx` | Individual date cell |
| | `CalendarWorkoutModal.tsx` | Workout list modal |
| **Utilities** | `src/utils/calendarUtils.ts` | Date calculations |
| **Modified** | `src/components/layouts/Header.tsx` | Add toggle button |
| | `src/routes/createWorkout.tsx` | Accept date param |
| | `src/routes.ts` | Add calendar route |

### Component Props Reference

```typescript
// CalendarHeader
{ currentMonth, currentYear, onPreviousMonth, onNextMonth }

// CalendarGrid
{ days, workoutsByDate, onDateClick, todayDate }

// CalendarDateCell
{ day, workouts, onClick }

// CalendarWorkoutModal
{ isOpen, selectedDate, workouts, onClose, onWorkoutClick, onCreateWorkout }
```

### State Shape
```typescript
{
  currentMonth: number,
  currentYear: number,
  workouts: IWorkout[],
  selectedDate: string | null,
  isModalOpen: boolean
}
```

---

**Document Status**: ✅ Complete and Ready for Implementation  
**Approval Required**: Yes  
**Next Action**: Engineer implementation (Phase 1)
