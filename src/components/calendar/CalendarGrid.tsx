import type { ICalendarDay } from '~/utils/calendarUtils';
import type { IWorkout } from '~/interface/workout';
import CalendarDateCell from './CalendarDateCell';
import styles from './CalendarGrid.module.scss';

export interface ICalendarGridProps {
  days: ICalendarDay[];
  workoutsByDate: Map<string, IWorkout[]>;
  onDateClick: (date: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarGrid({
  days,
  workoutsByDate,
  onDateClick,
}: ICalendarGridProps) {
  return (
    <div className={styles['calendar-grid']}>
      {/* Week day headers */}
      <div className={styles['calendar-header-row']}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles['day-header']}>
            {day}
          </div>
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
  );
}
