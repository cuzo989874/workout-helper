import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';

import CalendarHeader from './CalendarHeader';
import * as calendarUtils from '~/utils/calendarUtils';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'calendar.today': 'Today',
        'calendar.goToToday': 'Go to today',
        'calendar.previousMonth': 'Previous month',
        'calendar.nextMonth': 'Next month',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock SCSS module
vi.mock('./CalendarHeader.module.scss', () => ({
  default: {
    'calendar-header': 'calendar-header',
    'today-button': 'today-button',
    'nav-button': 'nav-button',
    'month-year-display': 'month-year-display',
  },
}));

// Mock SVG icons
vi.mock('~/assets/google-fonts/chevron_left.svg?react', () => ({
  default: () => <svg data-testid="chevron-left" />,
}));
vi.mock('~/assets/google-fonts/chevron_right.svg?react', () => ({
  default: () => <svg data-testid="chevron-right" />,
}));

describe('CalendarHeader', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders month and year using getMonthName with default locale', () => {
    const spy = vi
      .spyOn(calendarUtils, 'getMonthName')
      .mockImplementation(
        (month: number, locale: string) => `MockMonth(${month},${locale})`
      );
    render(
      <CalendarHeader
        currentMonth={9}
        currentYear={2025}
        onPreviousMonth={() => {}}
        onNextMonth={() => {}}
      />
    );

    expect(spy).toHaveBeenCalledWith(9, 'en');
    expect(screen.getByText('MockMonth(9,en) 2025')).toBeInTheDocument();
  });

  it('uses provided locale when given', () => {
    const spy = vi
      .spyOn(calendarUtils, 'getMonthName')
      .mockImplementation(
        (month: number, locale: string) => `MockMonth(${month},${locale})`
      );
    render(
      <CalendarHeader
        currentMonth={0}
        currentYear={2030}
        onPreviousMonth={() => {}}
        onNextMonth={() => {}}
        locale="zh-TW"
      />
    );

    expect(spy).toHaveBeenCalledWith(0, 'zh-TW');
    expect(screen.getByText('MockMonth(0,zh-TW) 2030')).toBeInTheDocument();
  });

  it('invokes navigation callbacks when clicking previous/next buttons', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();

    render(
      <CalendarHeader
        currentMonth={5}
        currentYear={2024}
        onPreviousMonth={onPrev}
        onNextMonth={onNext}
      />
    );

    await user.click(screen.getByLabelText('Previous month'));
    await user.click(screen.getByLabelText('Next month'));

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('renders Today button only when onToday is provided and triggers it on click', async () => {
    const user = userEvent.setup();
    const onToday = vi.fn();

    const { rerender } = render(
      <CalendarHeader
        currentMonth={7}
        currentYear={2026}
        onPreviousMonth={() => {}}
        onNextMonth={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: 'Go to today' })).toBeNull();

    rerender(
      <CalendarHeader
        currentMonth={7}
        currentYear={2026}
        onPreviousMonth={() => {}}
        onNextMonth={() => {}}
        onToday={onToday}
      />
    );

    const todayBtn = screen.getByRole('button', { name: 'Go to today' });
    expect(todayBtn).toBeInTheDocument();
    await user.click(todayBtn);
    expect(onToday).toHaveBeenCalledTimes(1);
  });
});
