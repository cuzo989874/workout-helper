import { useTranslation } from 'react-i18next';
import { CardBody, CardHeader } from '../card/Card';

import EditIcon from '~/assets/google-fonts/edit_square.svg?react';
import DeleteIcon from '~/assets/google-fonts/delete.svg?react';

import type { IExercise } from '~/interface/workout';

interface IExerciseCardProps {
  exercise: IExercise;
  onEdit?: (exercise: IExercise) => void;
  onDelete?: (exercise: IExercise) => void;
}

export default function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
}: IExerciseCardProps) {
  const { t } = useTranslation();

  const checkIsEmpty = (val: number | string | undefined | null) => {
    return val === null || val === undefined || val === '';
  };

  return (
    <>
      <CardHeader
        className="flex align-center justify-between"
        data-testid="exercise-card"
      >
        <h4>{exercise.exerciseName}</h4>
        {(onEdit || onDelete) && (
          <div className="flex align-center gx-sm">
            {onEdit && (
              <button
                type="button"
                className="btn icon-btn icon-btn--primary"
                onClick={() => onEdit(exercise)}
              >
                <EditIcon width={18} height={18} fill="currentColor" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="btn icon-btn icon-btn--primary"
                onClick={() => onDelete(exercise)}
              >
                <DeleteIcon width={18} height={18} fill="currentColor" />
              </button>
            )}
          </div>
        )}
      </CardHeader>
      <CardBody className="px-lg">
        {exercise.notes && <p className="text--grey mb-xs">{exercise.notes}</p>}
        <ul>
          {exercise.setSettingList.map((setSetting, index) => {
            const details: string[] = [];

            if (!checkIsEmpty(setSetting.weightLifted)) {
              details.push(`${setSetting.weightLifted} kg`);
            }
            if (!checkIsEmpty(setSetting.distance)) {
              details.push(`${setSetting.distance} m`);
            }

            const setsRepsParts: string[] = [];
            if (!checkIsEmpty(setSetting.sets)) {
              setsRepsParts.push(
                `${setSetting.sets} ${t('exercise.set.sets')}`
              );
            }
            if (!checkIsEmpty(setSetting.reps)) {
              setsRepsParts.push(
                `${setSetting.reps} ${t('exercise.set.reps')}`
              );
            }
            if (setsRepsParts.length > 0) {
              if (details.length > 0) {
                details.push('-');
              }
              details.push(setsRepsParts.join(' × '));
            }

            if (!checkIsEmpty(setSetting.time)) {
              details.push(
                `${t('exercise.set.time')}: ${setSetting.time} ${t('common.secondsShort')}`
              );
            }

            const hasContent = details.length > 0 || Boolean(setSetting.notes);
            if (!hasContent) return null;

            return (
              <li key={index} className="mb-sm">
                {details.length > 0 && (
                  <div className="flex align-center flex-wrap gx-sm">
                    {details.map((text, i) => (
                      <span key={i}>{text}</span>
                    ))}
                  </div>
                )}
                {setSetting.restTime && (
                  <p className="mt-xs">
                    {t('exercise.set.restTime')}: {setSetting.restTime}{' '}
                    {t('common.secondsShort')}
                  </p>
                )}
                {setSetting.notes && (
                  <p className="text--grey mt-xs">{setSetting.notes}</p>
                )}
              </li>
            );
          })}
        </ul>
      </CardBody>
    </>
  );
}
