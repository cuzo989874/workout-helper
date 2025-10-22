import type { ICalendarDay } from '~/utils/calendarUtils';
import type { IWorkout } from '~/interface/workout';
import styles from './CalendarDateCell.module.scss';

export interface ICalendarDateCellProps {
  day: ICalendarDay;
  workouts: IWorkout[];
  onClick: () => void;
}

export default function CalendarDateCell({
  day,
  workouts,
  onClick,
}: ICalendarDateCellProps) {
  const hasWorkouts = workouts.length > 0;
  const workoutCount = workouts.length;

  // Build class names
  const classNames = [
    styles['calendar-date-cell'],
    !day.isCurrentMonth && styles['other-month'],
    day.isToday && styles['today'],
    hasWorkouts && styles['has-workouts'],
  ]
    .filter(Boolean)
    .join(' ');

  // Build aria-label for accessibility
  const ariaLabel = `${day.dayOfMonth}${
    hasWorkouts ? `, ${workoutCount} workout${workoutCount > 1 ? 's' : ''}` : ''
  }${day.isToday ? ', today' : ''}`;

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className={styles['date-number']}>{day.dayOfMonth}</span>
      {hasWorkouts && (
        <div className={styles['workout-indicator']}>
          {workoutCount > 1 && (
            <span className={styles['workout-count']}>{workoutCount}</span>
          )}
        </div>
      )}
    </button>
  );
}
