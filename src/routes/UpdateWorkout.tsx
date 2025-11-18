import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { LocalStorageService } from '~/services/LocalStorageService';
import {
  formatDateAsNumeric,
  formatTimestampWithLanguage,
} from '~/utils/dateUtils';

import SubPageLayout from '~/components/layouts/SubPageLayout';
import FormInput from '~/components/form/FormInput';
import FormDatePicker, {
  type IFormDatePickerRef,
} from '~/components/form/FormDatePicker';
import {
  Stepper,
  Step,
  StepLabel,
  StepActions,
} from '~/components/stepper/Stepper';
import { Card } from '~/components/card/Card';
import ExerciseFormModal, {
  type IExerciseFormModalRef,
} from '~/components/feature/ExerciseFormModal';
import ExerciseCard from '~/components/feature/ExerciseCard';

import type { IExercise, IWorkout } from '~/interface/workout';

import AddIcon from '~/assets/google-fonts/add.svg?react';
import ChevronLeftIcon from '~/assets/google-fonts/chevron_left.svg?react';
import SaveIcon from '~/assets/google-fonts/save.svg?react';

export default function UpdateWorkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: workoutId } = useParams();

  const workoutDateInputRef = useRef<IFormDatePickerRef>(null);

  const exerciseFormModalRef = useRef<IExerciseFormModalRef>(null);
  const exerciseFormEditIndexRef = useRef<number>(-1);

  const [workout, setWorkout] = useState<IWorkout | null>(null);
  const [date, setDate] = useState(formatDateAsNumeric(new Date()));
  const [description, setDescription] = useState('');
  const [exerciseList, setExerciseList] = useState<IExercise[]>([]);

  useEffect(() => {
    if (!workoutId) {
      navigate('/');
      return;
    }

    const workouts = LocalStorageService.loadWorkouts();
    const targetWorkout = workouts?.find(w => w.id === workoutId);

    if (targetWorkout) {
      setWorkout(targetWorkout);
      setDate(targetWorkout.date);
      setDescription(targetWorkout.description);
      setExerciseList(targetWorkout.exerciseList);
    } else {
      // if workout not found, redirect to home
      navigate('/');
    }
  }, [workoutId, navigate]);

  const validateWorkoutInfo = () => {
    if (!workoutDateInputRef.current) {
      return true;
    }
    const workoutDateValidateResult = workoutDateInputRef.current.validate();

    if (!workoutDateValidateResult.isValid) {
      workoutDateInputRef.current.showError();
    }

    return workoutDateValidateResult.isValid;
  };

  const addExercise = () => {
    exerciseFormModalRef.current?.open();
    exerciseFormEditIndexRef.current = -1;
  };

  const editExerciseByIndex = (index: number) => {
    const target = exerciseList[index];
    if (!target) return;
    exerciseFormModalRef.current?.open(target);
    exerciseFormEditIndexRef.current = index;
  };

  const deleteExerciseByIndex = (index: number) => {
    setExerciseList(exerciseList.filter((_, i) => i !== index));
  };

  const handleExerciseSubmit = (exercise: IExercise) => {
    if (exerciseFormEditIndexRef.current === -1) {
      // index is -1, add exercise
      setExerciseList([...exerciseList, exercise]);
    } else {
      setExerciseList(
        exerciseList.map((e, index) =>
          index === exerciseFormEditIndexRef.current ? exercise : e
        )
      );
    }
  };

  const submit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (!validateWorkoutInfo() || !workout) {
      return;
    }

    LocalStorageService.updateWorkout({
      ...workout,
      date,
      description:
        description ||
        `${formatTimestampWithLanguage(new Date(), i18n.language, 'datetime')} created`,
      exerciseList,
    });
    navigate('/');
  };

  if (!workout) {
    // TODO: can show a loading indicator
    return null;
  }

  return (
    <SubPageLayout>
      <Stepper>
        <Step>
          <StepLabel>
            {t('workout.basicInfo', { defaultValue: 'Basic Info' })}
          </StepLabel>
          <p className="text--grey mb-md">
            {t('workout.fillInWorkoutDateAndDescription', {
              defaultValue: 'Fill in workout date and description below.',
            })}
          </p>
          <form onSubmit={e => e.preventDefault()}>
            <main className="stepper__main">
              <FormDatePicker
                ref={workoutDateInputRef as React.RefObject<IFormDatePickerRef>}
                name="date"
                label={t('workout.date')}
                value={date}
                required
                onChange={value => setDate(value)}
              />
              <FormInput
                name="description"
                label={t('workout.description')}
                placeholder={t('workout.descriptionPlaceholder', {
                  defaultValue: 'Workout description',
                })}
                value={description}
                onChange={e => {
                  setDescription(e.target.value);
                }}
              />
            </main>
            <StepActions
              className="stepper__actions--fixed flex-column g-md"
              onBeforeNext={validateWorkoutInfo}
            >
              <button
                type="submit"
                className="btn btn-flat btn-flat--primary w-100 stepper__button--next"
              >
                {t('workout.continueToEditExercises', {
                  defaultValue: 'Continue to Edit Workout',
                })}
              </button>
            </StepActions>
          </form>
        </Step>
        <Step>
          <StepLabel>
            {t('workout.exercises', { defaultValue: 'Exercises' })}
          </StepLabel>
          <p className="text--grey mb-md">
            {t('workout.addOrEditExercises', {
              defaultValue: 'Add or edit exercises for this workout.',
            })}
          </p>
          <form onSubmit={submit}>
            <ul className="flex flex-column g-md mb-lg">
              {exerciseList.map((exercise, index) => (
                <li key={`${index}-${exercise.exerciseName}-${exercise.notes}`}>
                  <Card>
                    <ExerciseCard
                      exercise={exercise}
                      onEdit={() => editExerciseByIndex(index)}
                      onDelete={() => deleteExerciseByIndex(index)}
                    />
                  </Card>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-outline btn-outline--info w-100"
              onClick={() => addExercise()}
            >
              <AddIcon
                width={18}
                height={18}
                fill="currentColor"
                aria-hidden="true"
              />
              {t('workout.addExercise', { defaultValue: 'Add Exercise' })}
            </button>

            <StepActions className="stepper__actions--fixed align-center justify-between gx-md mt-md">
              <button
                type="button"
                className="btn btn-primary stepper__button--back"
              >
                <ChevronLeftIcon
                  width={18}
                  height={18}
                  fill="currentColor"
                  aria-hidden="true"
                />
                {t('common.prev', { defaultValue: 'Prev' })}
              </button>
              <button type="submit" className="btn btn-flat btn-flat--primary">
                <SaveIcon
                  width={18}
                  height={18}
                  fill="currentColor"
                  aria-hidden="true"
                />
                {t('common.save', { defaultValue: 'Save' })}
              </button>
            </StepActions>
          </form>
          <ExerciseFormModal
            ref={exerciseFormModalRef as React.RefObject<IExerciseFormModalRef>}
            onSubmit={handleExerciseSubmit}
          />
        </Step>
      </Stepper>
    </SubPageLayout>
  );
}
