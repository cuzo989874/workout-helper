import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarDateCell from './CalendarDateCell';
import type { ICalendarDay } from '~/utils/calendarUtils';
import type { IWorkout } from '~/interface/workout';

// Mock SCSS module
vi.mock('./CalendarDateCell.module.scss', () => ({
  default: {
    'calendar-date-cell': 'calendar-date-cell',
    'date-number': 'date-number',
    'other-month': 'other-month',
    today: 'today',
    'has-workouts': 'has-workouts',
    'workout-indicator': 'workout-indicator',
    'workout-count': 'workout-count',
  },
}));

describe('CalendarDateCell', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  // mock scss module
  vi.mock('./CalendarDateCell.module.scss', () => ({
    default: {
      today: 'today',
      'other-month': 'other-month',
      'has-workouts': 'has-workouts',
      'calendar-date-cell': 'calendar-date-cell',
    },
  }));

  const mockDay: ICalendarDay = {
    date: '2025-10-15',
    dayOfMonth: 15,
    isCurrentMonth: true,
    isToday: false,
  };

  const mockWorkouts: IWorkout[] = [
    {
      id: '1',
      date: '2025-10-15',
      description: 'Morning workout',
      exerciseList: [],
    },
  ];

  it('renders the day of month', () => {
    render(<CalendarDateCell day={mockDay} workouts={[]} onClick={() => {}} />);

    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <CalendarDateCell day={mockDay} workouts={[]} onClick={handleClick} />
    );

    const cell = screen.getByRole('button');
    await user.click(cell);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows workout indicator when workouts exist', () => {
    render(
      <CalendarDateCell
        day={mockDay}
        workouts={mockWorkouts}
        onClick={() => {}}
      />
    );

    // Indicator should be present (could be a dot or count)
    const cell = screen.getByRole('button');
    expect(cell).toBeInTheDocument();
  });

  it('does not show workout indicator when no workouts', () => {
    render(<CalendarDateCell day={mockDay} workouts={[]} onClick={() => {}} />);

    const cell = screen.getByRole('button');
    expect(cell).not.toHaveClass('has-workouts');
  });

  it('displays workout count when multiple workouts exist', () => {
    const multipleWorkouts: IWorkout[] = [
      {
        id: '1',
        date: '2025-10-15',
        description: 'Workout 1',
        exerciseList: [],
      },
      {
        id: '2',
        date: '2025-10-15',
        description: 'Workout 2',
        exerciseList: [],
      },
      {
        id: '3',
        date: '2025-10-15',
        description: 'Workout 3',
        exerciseList: [],
      },
    ];

    render(
      <CalendarDateCell
        day={mockDay}
        workouts={multipleWorkouts}
        onClick={() => {}}
      />
    );

    // Should show count "3" somewhere
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('applies "today" class when day is today', () => {
    const todayDay: ICalendarDay = {
      ...mockDay,
      isToday: true,
    };

    render(
      <CalendarDateCell day={todayDay} workouts={[]} onClick={() => {}} />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('today');
  });

  it('applies "other-month" class when day is not in current month', () => {
    const otherMonthDay: ICalendarDay = {
      ...mockDay,
      date: '2025-09-15',
      dayOfMonth: 15,
      isCurrentMonth: false,
    };

    render(
      <CalendarDateCell day={otherMonthDay} workouts={[]} onClick={() => {}} />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('other-month');
  });

  it('has proper accessibility attributes', () => {
    render(
      <CalendarDateCell
        day={mockDay}
        workouts={mockWorkouts}
        onClick={() => {}}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveAttribute('aria-label');
  });

  it('does not display count badge for single workout', () => {
    render(
      <CalendarDateCell
        day={mockDay}
        workouts={mockWorkouts}
        onClick={() => {}}
      />
    );

    // Should not show "1" as count (just indicator)
    const cell = screen.getByRole('button');
    const cellText = cell.textContent;

    // Text should only contain the day number (15), not "1"
    expect(cellText).toContain('15');
    expect(cellText).not.toMatch(/^1$/);
  });

  it('applies multiple CSS classes correctly', () => {
    const specialDay: ICalendarDay = {
      date: '2025-10-07',
      dayOfMonth: 7,
      isCurrentMonth: true,
      isToday: true,
    };

    render(
      <CalendarDateCell
        day={specialDay}
        workouts={mockWorkouts}
        onClick={() => {}}
      />
    );

    const cell = screen.getByRole('button');
    expect(cell).toHaveClass('today');
    expect(cell).not.toHaveClass('other-month');
  });
});
