import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Timer() {
  const { t } = useTranslation();
  const params = useParams();
  const workoutId = params.id;

  return (
    <div>
      <h1>{t('workout.timer')}</h1>
      <p>Workout ID: {workoutId}</p>
      {/* Timer implementation will go here */}
    </div>
  );
}
