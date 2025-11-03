import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';

import CalendarGrid from './CalendarGrid';
import type { ICalendarDay } from '~/utils/calendarUtils';

// Mock SCSS module for CalendarGrid
vi.mock('./CalendarGrid.module.scss', () => ({
  default: {
    'calendar-grid': 'calendar-grid',
    'calendar-header-row': 'calendar-header-row',
    'day-header': 'day-header',
    'calendar-body': 'calendar-body',
  },
}));

// Mock CalendarDateCell to isolate CalendarGrid behavior
vi.mock('./CalendarDateCell', () => ({
  default: ({ day, onClick }: { day: ICalendarDay; onClick: () => void }) => (
    <button data-testid={`cell-${day.date}`} onClick={onClick}>
      {day.dayOfMonth}
    </button>
  ),
}));

describe('CalendarGrid', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const days: ICalendarDay[] = [
    { date: '2025-10-01', dayOfMonth: 1, isCurrentMonth: true, isToday: false },
    { date: '2025-10-02', dayOfMonth: 2, isCurrentMonth: true, isToday: false },
    { date: '2025-10-03', dayOfMonth: 3, isCurrentMonth: true, isToday: false },
  ];

  it('renders weekday headers', () => {
    render(
      <CalendarGrid
        days={days}
        workoutsByDate={new Map()}
        onDateClick={() => {}}
      />
    );

    // Expect all weekday short names
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('renders a date cell for each provided day', () => {
    render(
      <CalendarGrid
        days={days}
        workoutsByDate={new Map()}
        onDateClick={() => {}}
      />
    );

    const cells = screen.getAllByTestId(/cell-2025-10-/);
    expect(cells).toHaveLength(3);
  });

  it('invokes onDateClick with the correct date when a cell is clicked', async () => {
    const user = userEvent.setup();
    const onDateClick = vi.fn();

    render(
      <CalendarGrid
        days={days}
        workoutsByDate={new Map()}
        onDateClick={onDateClick}
      />
    );

    await user.click(screen.getByTestId('cell-2025-10-02'));
    expect(onDateClick).toHaveBeenCalledWith('2025-10-02');
  });
});
