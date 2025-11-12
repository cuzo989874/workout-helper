import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SubPageLayout from '~/components/layouts/SubPageLayout';

export default function Timer() {
  const { t } = useTranslation();
  const params = useParams();
  const workoutId = params.id;

  return (
    <SubPageLayout>
      <h1>{t('workout.timer')}</h1>
      <p>Workout ID: {workoutId}</p>
      {/* Timer implementation will go here */}
    </SubPageLayout>
  );
}
