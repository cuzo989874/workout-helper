import { useTranslation } from 'react-i18next';
import { getMonthName } from '~/utils/calendarUtils';
import ChevronLeftIcon from '~/assets/google-fonts/chevron_left.svg?react';
import ChevronRightIcon from '~/assets/google-fonts/chevron_right.svg?react';
import styles from './CalendarHeader.module.scss';

export interface ICalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday?: () => void;
  locale?: string;
}

export default function CalendarHeader({
  currentMonth,
  currentYear,
  onPreviousMonth,
  onNextMonth,
  onToday,
  locale = 'en',
}: ICalendarHeaderProps) {
  const { t } = useTranslation();
  const monthName = getMonthName(currentMonth, locale);

  return (
    <div className={styles['calendar-header']}>
      {onToday && (
        <button
          type="button"
          className={`btn btn-outline ${styles['today-button']}`}
          onClick={onToday}
          aria-label={t('calendar.goToToday')}
        >
          {t('calendar.today')}
        </button>
      )}
      <div className="flex gx-sm">
        <button
          type="button"
          className={`icon-btn ${styles['nav-button']}`}
          onClick={onPreviousMonth}
          aria-label={t('calendar.previousMonth')}
        >
          <ChevronLeftIcon width={24} height={24} fill="currentColor" />
        </button>
        <button
          type="button"
          className={`icon-btn ${styles['nav-button']}`}
          onClick={onNextMonth}
          aria-label={t('calendar.nextMonth')}
        >
          <ChevronRightIcon width={24} height={24} fill="currentColor" />
        </button>
      </div>

      <h2 className={styles['month-year-display']}>
        {monthName} {currentYear}
      </h2>
    </div>
  );
}
