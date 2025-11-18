import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '~/i18n';
import type { IWorkout } from '~/interface/workout';
import WorkoutCard from '~/components/feature/WorkoutCard';
import CloseIcon from '~/assets/google-fonts/close.svg?react';
import AddIcon from '~/assets/google-fonts/add.svg?react';
import styles from './CalendarWorkoutModal.module.scss';

export interface ICalendarWorkoutModalProps {
  isOpen: boolean;
  selectedDate: string | null;
  workouts: IWorkout[];
  onClose: () => void;
  onCreateWorkout: () => void;
}

export default function CalendarWorkoutModal({
  isOpen,
  selectedDate,
  workouts,
  onClose,
  onCreateWorkout,
}: ICalendarWorkoutModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen || !selectedDate) {
    return null;
  }

  const handleWorkoutClick = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format date for display (e.g., "2025-10-15" -> "October 15, 2025")
  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'zh-TW' ? 'zh-TW' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
      <div
        className={styles['modal-content']}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles['modal-header']}>
          <h3 id="modal-title">{formatDisplayDate(selectedDate)}</h3>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <CloseIcon width={24} height={24} fill="currentColor" />
          </button>
        </div>

        <div className={styles['modal-body']}>
          {workouts.length === 0 ? (
            <p className={styles['no-workouts-message']}>
              {t('calendar.noWorkoutsOnDate')}
            </p>
          ) : (
            <ul className={styles['workout-list']}>
              {workouts.map(workout => (
                <li
                  key={workout.id}
                  onClick={() => handleWorkoutClick(workout.id)}
                  className={styles['workout-item']}
                >
                  <WorkoutCard workout={workout} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles['modal-footer']}>
          <button
            type="button"
            className="btn btn-flat btn-flat--primary w-100"
            onClick={onCreateWorkout}
          >
            <AddIcon width={18} height={18} fill="currentColor" />
            {t('workout.createWorkout')}
          </button>
        </div>
      </div>
    </div>
  );
}
