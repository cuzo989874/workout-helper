import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SubPageLayout from '~/components/layouts/SubPageLayout';
import { Card } from '~/components/card/Card';
import ExerciseCard from '~/components/feature/ExerciseCard';

import type { IWorkout } from '~/interface/workout';

import EditIcon from '~/assets/google-fonts/edit_square.svg?react';
import DeleteIcon from '~/assets/google-fonts/delete.svg?react';

import { LocalStorageService } from '~/services/LocalStorageService';

export default function WorkoutDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const workoutId = useMemo(() => params.id ?? '', [params.id]);

  const [workout, setWorkout] = useState<IWorkout | null>(null);

  const hasValidSets = useMemo(() => {
    if (!workout || !workout.exerciseList) {
      return false;
    }
    return workout.exerciseList.some(
      exercise => exercise.setSettingList && exercise.setSettingList.length > 0
    );
  }, [workout]);

  useEffect(() => {
    const list = LocalStorageService.loadWorkouts() || [];
    const found = list.find(w => w.id === workoutId) || null;
    setWorkout(found);
  }, [workoutId]);

  const handleDelete = (id: string) => {
    LocalStorageService.deleteWorkout(id);
    navigate('/');
  };

  if (!workout) {
    return (
      <SubPageLayout>
        <p className="text--grey">
          {t('workout.notFound', { defaultValue: 'Workout not found.' })}
        </p>
      </SubPageLayout>
    );
  }

  return (
    <SubPageLayout>
      <>
        <div className="flex justify-end g-md">
          <button
            className="btn btn--cancel"
            onClick={() => handleDelete(workout.id)}
          >
            <DeleteIcon width={18} height={18} fill="currentColor" />
            {t('common.delete')}
          </button>
          {hasValidSets && (
            <button
              className="btn btn--primary"
              onClick={() => navigate(`/workout/timer/${workout.id}`)}
            >
              {t('workout.startWorkout')}
            </button>
          )}
          <button
            className="btn btn-flat--primary"
            onClick={() => navigate(`/workout/update/${workout.id}`)}
          >
            <EditIcon width={18} height={18} fill="currentColor" />
            {t('common.edit')}
          </button>
        </div>
        <section className="mb-lg">
          <h2 className="mb-md">Basic Info</h2>
          <div className="flex flex-column px-md g-md">
            <div>
              <h4>{t('workout.date')}</h4>
              <p>{workout.date}</p>
            </div>
            <div>
              <h4>{t('workout.description')}</h4>
              <p className="text--grey">{workout.description || '-'}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-md">Exercises</h2>
          {workout.exerciseList.length > 0 ? (
            <ul className="flex flex-column g-md px-md mb-lg">
              {workout.exerciseList.map((exercise, index) => (
                <li key={`${index}-${exercise.exerciseName}-${exercise.notes}`}>
                  <Card>
                    <ExerciseCard exercise={exercise} />
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text--grey px-md">{t('workout.noExercises')}</p>
          )}
        </section>
      </>
    </SubPageLayout>
  );
}
