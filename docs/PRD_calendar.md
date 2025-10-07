# PRD: Calendar View Feature

**Document Version**: 1.0  
**Created**: 2025-10-07  
**Project**: Workout Helper - Calendar Display Mode  
**Author**: AI Agent (PM Role)

---

## 1. Project Overview & Goals

### 1.1 Background
Currently, Workout Helper displays workouts in a chronological list view grouped by date. While this is functional, users may benefit from a visual calendar interface to better understand their workout patterns, plan future sessions, and quickly navigate to specific dates.

### 1.2 Project Goals
- Provide an alternative **Calendar View** for visualizing workout data
- Enable quick navigation between list and calendar display modes
- Allow users to create workouts directly from calendar dates
- Maintain consistency with existing workout management workflows

### 1.3 Success Metrics
- Users can seamlessly switch between list and calendar views
- Calendar view displays all workouts correctly by date
- Workout creation from calendar is intuitive and works as expected
- Zero regression in existing functionality

---

## 2. User Personas

### Primary Persona: Active Fitness Tracker
- **Name**: Alex
- **Age**: 25-45
- **Goals**: Track workout consistency, identify patterns, plan weekly routines
- **Pain Points**: Difficult to see workout frequency at a glance in list view
- **Needs**: Visual representation of workout schedule, easy date navigation

---

## 3. Feature List & Prioritization

### 3.1 Must-Have Features (P0)
1. **Calendar View Toggle in Header**
   - Icon/button to switch between list and calendar views
   - Clear visual indication of current view mode

2. **Calendar Page/Route**
   - Monthly calendar view displaying current month
   - Display workout indicators on dates with workouts
   - Month navigation (previous/next)

3. **View Workouts on Calendar**
   - Visual indicators showing dates with workouts
   - Display workout count or basic info on calendar dates
   - Click date to see workout details for that day

4. **Create Workout from Calendar**
   - Click on empty date to create new workout
   - Pre-populate workout date based on selected calendar date
   - Redirect to existing workout creation flow

5. **Navigate to Workout Detail**
   - Click workout item in calendar to view full details
   - Use existing workout detail page (`/workout/:id`)

### 3.2 Should-Have Features (P1)
- Today's date highlighting
- Visual differentiation for past vs. future dates
- Return to current month button
- Keyboard navigation support

### 3.3 Could-Have Features (P2)
- Week view option
- Workout category color coding on calendar
- Drag-and-drop workout rescheduling
- Multi-day workout streaks visualization

---

## 4. Detailed User Stories & Acceptance Criteria

### US-1: Header Navigation Toggle
**As a** user  
**I want** to see a calendar view option in the header  
**So that** I can switch between list and calendar display modes

**Acceptance Criteria:**
- [ ] AC1.1: A calendar icon/button is visible in the Header component
- [ ] AC1.2: Clicking the button navigates to `/calendar` route
- [ ] AC1.3: Button has appropriate hover and active states
- [ ] AC1.4: Button includes aria-label for accessibility
- [ ] AC1.5: When on calendar page, button shows visual indication (optional: list icon to return)

---

### US-2: Calendar Page Display
**As a** user  
**I want** to view a monthly calendar  
**So that** I can see my workouts in a calendar format

**Acceptance Criteria:**
- [ ] AC2.1: Calendar page renders at `/calendar` route
- [ ] AC2.2: Current month and year are displayed prominently
- [ ] AC2.3: All dates of the current month are visible in a grid format
- [ ] AC2.4: Week days (Mon-Sun) are labeled
- [ ] AC2.5: Previous and next month navigation buttons are functional
- [ ] AC2.6: Calendar layout is responsive on mobile and desktop
- [ ] AC2.7: Today's date is visually highlighted

---

### US-3: View Workouts on Calendar
**As a** user  
**I want** to see which dates have workouts  
**So that** I can quickly identify my training schedule

**Acceptance Criteria:**
- [ ] AC3.1: Dates with workouts show a visual indicator (dot, badge, or count)
- [ ] AC3.2: Indicator shows number of workouts if multiple exist on same date
- [ ] AC3.3: Clicking a date with workouts displays workout list for that date
- [ ] AC3.4: Workout list shows workout descriptions/summaries
- [ ] AC3.5: Empty dates show no indicator
- [ ] AC3.6: Workouts from `LocalStorageService` are correctly mapped to calendar dates

---

### US-4: Create Workout from Calendar Date
**As a** user  
**I want** to click on a calendar date to create a workout  
**So that** I can quickly add workouts for specific dates

**Acceptance Criteria:**
- [ ] AC4.1: Clicking on a date (with or without existing workouts) opens creation interface
- [ ] AC4.2: User can choose to create new workout or view existing ones (if any exist)
- [ ] AC4.3: When creating, navigate to `/workout/create` with date pre-filled
- [ ] AC4.4: Date parameter is passed via URL query string or state
- [ ] AC4.5: Create workout form initializes with the selected date
- [ ] AC4.6: After creation, user returns to calendar view or workout detail

---

### US-5: Navigate to Workout Detail from Calendar
**As a** user  
**I want** to click on a workout in the calendar  
**So that** I can view its full details

**Acceptance Criteria:**
- [ ] AC5.1: Clicking a workout item navigates to `/workout/:id`
- [ ] AC5.2: Correct workout ID is used in navigation
- [ ] AC5.3: Existing WorkoutDetail page displays correctly
- [ ] AC5.4: Back navigation returns to calendar view (browser history)
- [ ] AC5.5: Multiple workouts on same date can all be accessed individually

---

## 5. Technical Specifications

### 5.1 New Routes
```typescript
// app/routes.ts
route('calendar', 'routes/calendar.tsx')
```

### 5.2 Component Architecture

#### New Components:
1. **`Calendar.tsx`** (`app/routes/calendar.tsx`)
   - Main calendar page component
   - Manages month state
   - Loads workout data from LocalStorageService
   - Handles navigation and date selection

2. **`CalendarGrid.tsx`** (`app/components/calendar/CalendarGrid.tsx`)
   - Renders the calendar grid (7x5 or 7x6)
   - Displays dates and workout indicators
   - Handles date click events

3. **`CalendarDateCell.tsx`** (`app/components/calendar/CalendarDateCell.tsx`)
   - Individual date cell component
   - Shows date number and workout indicators
   - Handles click to view/create workouts

4. **`CalendarWorkoutList.tsx`** (`app/components/calendar/CalendarWorkoutList.tsx`)
   - Modal or panel showing workouts for selected date
   - Lists workout summaries
   - Provides create new workout button

#### Modified Components:
5. **`Header.tsx`** (`app/components/layouts/Header.tsx`)
   - Add calendar view toggle button/icon
   - Conditionally show based on current route

### 5.3 Data Flow
```
LocalStorageService.loadWorkouts()
  ↓
Calendar Component (filter/group by month)
  ↓
CalendarGrid (map workouts to dates)
  ↓
CalendarDateCell (display indicators)
  ↓
User clicks date
  ↓
CalendarWorkoutList (show workouts) OR navigate to /workout/create
```

### 5.4 State Management
- **Local State**: Current month, year, selected date
- **Workout Data**: Loaded once on mount, refreshed on navigation back
- **Date Selection**: Modal/panel state for showing workout list

### 5.5 Dependencies
- **date-fns**: For date manipulation and calendar calculations
  - `startOfMonth`, `endOfMonth`, `eachDayOfInterval`, `format`, `isSameDay`, `isToday`
- **Existing**: LocalStorageService, IWorkout interface, navigation utilities

---

## 6. UI/UX Specifications

### 6.1 Header Changes
- Add calendar icon button next to logo (right side of header)
- Icon: Material Icons "calendar_month" or similar
- Toggle between list icon (when on calendar) and calendar icon (when on home)

### 6.2 Calendar Layout
```
┌─────────────────────────────────────┐
│  ← October 2025 →      [List View]  │
├─────────────────────────────────────┤
│ Mon Tue Wed Thu Fri Sat Sun         │
├─────────────────────────────────────┤
│     01  02  03  04  05  06          │
│ 07  08● 09  10● 11  12  13          │
│ 14  15  16● 17  18  19  20          │
│ 21  22  23  24  25  26  27          │
│ 28  29  30  31                      │
└─────────────────────────────────────┘

● = Has workout(s)
```

### 6.3 Interaction Flows

**Flow 1: View Workouts for a Date**
1. User clicks date with indicator
2. Modal/panel appears showing workout list
3. Each workout shows: time, description, exercise count
4. Click workout → Navigate to detail
5. Click "Create New" → Navigate to create form

**Flow 2: Create Workout on Empty Date**
1. User clicks empty date
2. Navigate to `/workout/create?date=2025-10-15`
3. Date field pre-filled with selected date
4. User completes form and saves
5. Redirect to `/workout/:id` or back to calendar

---

## 7. Edge Cases & Error Handling

### 7.1 Edge Cases
- **No Workouts**: Display empty calendar with helpful message
- **Many Workouts in One Day**: Show count (e.g., "3 workouts"), list all in modal
- **Future Dates**: Allow creation, no special restrictions
- **Past Dates**: Allow both viewing and creating (users may log retroactively)
- **Month with 6 Weeks**: Grid should expand to accommodate

### 7.2 Error Handling
- **LocalStorage Failure**: Show error message, fallback to empty state
- **Invalid Date**: Validate date parameters, default to today
- **Navigation Errors**: Standard React Router error boundaries

---

## 8. Testing Requirements

### 8.1 Unit Tests
- [ ] Calendar date calculation logic (month boundaries, week rows)
- [ ] Workout filtering by date
- [ ] Date cell rendering with/without workouts
- [ ] Header toggle button functionality

### 8.2 Integration Tests
- [ ] Navigation between list and calendar views
- [ ] Creating workout from calendar date
- [ ] Viewing workout detail from calendar
- [ ] Month navigation updates displayed workouts

### 8.3 E2E Tests (Optional)
- [ ] Full user flow: Home → Calendar → Create Workout → View Detail
- [ ] Calendar displays workouts from LocalStorage correctly

---

## 9. Timeline & Milestones

### Phase 1: Foundation (Days 1-2)
- [ ] Create calendar route and basic page structure
- [ ] Update Header component with toggle button
- [ ] Set up routing

### Phase 2: Calendar Components (Days 3-4)
- [ ] Build CalendarGrid component
- [ ] Build CalendarDateCell component
- [ ] Implement date calculations using date-fns
- [ ] Add month navigation

### Phase 3: Integration (Days 5-6)
- [ ] Load and display workouts on calendar
- [ ] Implement date selection and workout list display
- [ ] Wire up navigation to create and detail pages

### Phase 4: Polish & Testing (Days 7-8)
- [ ] Add styling and responsive design
- [ ] Write unit and integration tests
- [ ] Accessibility improvements
- [ ] Bug fixes and refinements

---

## 10. Open Questions & Assumptions

### Assumptions
1. Calendar should start week on Monday (can be configurable later)
2. Use existing workout creation form without modifications
3. Browser's back button is sufficient for "return to calendar" navigation
4. LocalStorage data structure remains unchanged

### Open Questions
1. Should calendar support year navigation or just month-by-month?
   - **Decision**: Start with month-only, add year selector if needed
2. Should we show partial workout info on calendar cells (e.g., exercise names)?
   - **Decision**: Start with simple indicator/count, can enhance later
3. Should clicking a date always open a modal, or navigate to a new page?
   - **Decision**: Use modal/panel for better UX, keeps user in calendar context

---

## 11. Acceptance Checklist

### Feature Completion
- [ ] All US-1 acceptance criteria met (Header Toggle)
- [ ] All US-2 acceptance criteria met (Calendar Display)
- [ ] All US-3 acceptance criteria met (View Workouts)
- [ ] All US-4 acceptance criteria met (Create from Date)
- [ ] All US-5 acceptance criteria met (Navigate to Detail)

### Quality Gates
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] No console errors or warnings
- [ ] Responsive design verified on mobile and desktop
- [ ] Accessibility audit passed (keyboard navigation, screen readers)
- [ ] Code review completed
- [ ] Documentation updated (README if necessary)

### Regression Testing
- [ ] Existing home page (list view) works unchanged
- [ ] Workout creation flow unaffected
- [ ] Workout detail page unaffected
- [ ] LocalStorage functionality intact

---

## 12. Future Enhancements (Out of Scope)

- Week view and day view modes
- Workout templates assignable from calendar
- Calendar sharing/export (iCal format)
- Workout reminders/notifications
- Multi-user/sync capabilities
- Workout analytics dashboard from calendar view
- Print calendar view

---

## Appendix A: Technical Reference

### Key Files to Modify/Create

**New Files:**
- `app/routes/calendar.tsx`
- `app/routes/calendar.module.scss`
- `app/routes/calendar.test.tsx`
- `app/components/calendar/CalendarGrid.tsx`
- `app/components/calendar/CalendarGrid.module.scss`
- `app/components/calendar/CalendarGrid.test.tsx`
- `app/components/calendar/CalendarDateCell.tsx`
- `app/components/calendar/CalendarDateCell.module.scss`
- `app/components/calendar/CalendarDateCell.test.tsx`
- `app/components/calendar/CalendarWorkoutList.tsx`
- `app/components/calendar/CalendarWorkoutList.module.scss`
- `app/components/calendar/CalendarWorkoutList.test.tsx`

**Modified Files:**
- `app/routes.ts` (add calendar route)
- `app/components/layouts/Header.tsx` (add calendar toggle)
- `app/components/layouts/Header.module.scss` (style calendar toggle)
- `app/components/layouts/Header.test.tsx` (test new button)
- `app/routes/createWorkout.tsx` (handle date parameter from calendar)

### Existing Interfaces to Use
- `IWorkout` from `~/interface/workout`
- `LocalStorageService` from `~/services/LocalStorageService`

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-07 | AI Agent (PM) | Initial PRD creation |

---

**PRD Status**: ✅ Ready for Review  
**Next Steps**: 
1. Review and approve PRD
2. Break down into implementation tasks in check-list.md
3. Hand off to Architect for technical design
4. Begin implementation phase
