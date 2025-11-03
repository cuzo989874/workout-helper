import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { LocalStorageService } from '~/services/LocalStorageService';
import {
  computeCalendarDays,
  groupWorkoutsByDate,
} from '~/utils/calendarUtils';
import type { IWorkout } from '~/interface/workout';
import Header from '~/components/layouts/Header';
import CalendarHeader from '~/components/calendar/CalendarHeader';
import CalendarGrid from '~/components/calendar/CalendarGrid';
import CalendarWorkoutModal from '~/components/calendar/CalendarWorkoutModal';
import styles from './calendar.module.scss';

export function meta() {
  return [
    { title: 'Calendar - Workout Helper' },
    { name: 'description', content: 'View your workouts in calendar format' },
  ];
}

export default function Calendar() {
  const navigate = useNavigate();

  // State
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load workouts from LocalStorage
  useEffect(() => {
    const loadedWorkouts = LocalStorageService.loadWorkouts() || [];
    setWorkouts(loadedWorkouts);
  }, []);

  // Compute calendar days for current month
  const calendarDays = useMemo(() => {
    return computeCalendarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Group workouts by date for quick lookup
  const workoutsByDate = useMemo(() => {
    return groupWorkoutsByDate(workouts);
  }, [workouts]);

  // Get workouts for selected date
  const selectedDateWorkouts = useMemo(() => {
    return selectedDate ? workoutsByDate.get(selectedDate) || [] : [];
  }, [selectedDate, workoutsByDate]);

  // Navigation handlers
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

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Date selection handlers
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Clear selected date after animation
    setTimeout(() => setSelectedDate(null), 300);
  };

  const handleCreateWorkout = () => {
    if (selectedDate) {
      navigate(`/workout/create?date=${selectedDate}`);
    }
  };

  return (
    <>
      <Header />
      <main className={styles['calendar-main']}>
        <div className={styles['calendar-container']}>
          <CalendarHeader
            currentMonth={currentMonth}
            currentYear={currentYear}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarGrid
            days={calendarDays}
            workoutsByDate={workoutsByDate}
            onDateClick={handleDateClick}
          />
        </div>
      </main>

      <CalendarWorkoutModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        workouts={selectedDateWorkouts}
        onClose={handleCloseModal}
        onCreateWorkout={handleCreateWorkout}
      />
    </>
  );
}
