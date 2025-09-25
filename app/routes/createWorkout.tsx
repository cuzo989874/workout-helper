import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { LocalStorageService } from '~/services/LocalStorageService';
import {
  formatDateAsNumeric,
  formatTimestampWithLanguage,
} from '~/utils/dateUtils';

import SubPageHeader from '~/components/layouts/SubPageHeader';
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

import type { IExercise } from '~/interface/workout';

import AddIcon from '~/assets/google-fonts/add.svg?react';
import ChevronLeftIcon from '~/assets/google-fonts/chevron_left.svg?react';
import SaveIcon from '~/assets/google-fonts/save.svg?react';

export default function CreateWorkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const workoutDateInputRef = useRef<IFormDatePickerRef>(null);

  const exerciseFormModalRef = useRef<IExerciseFormModalRef>(null);
  const exerciseFormEditIndexRef = useRef<number>(-1);

  const [date, setDate] = useState(formatDateAsNumeric(new Date()));
  const [description, setDescription] = useState('');
  const [exerciseList, setExerciseList] = useState<IExercise[]>([]);

  const validateWorkoutInfo = () => {
    if (!workoutDateInputRef.current) {
      return true;
    }
    const workoutDateValidateResult = workoutDateInputRef.current.validate();

    workoutDateInputRef.current.showError();

    return workoutDateValidateResult.isValid;
  };

  const addExercise = () => {
    exerciseFormModalRef.current?.open();
    exerciseFormEditIndexRef.current = -1;
  };

  const editExercise = (exercise: IExercise) => {
    exerciseFormModalRef.current?.open(exercise);
    exerciseFormEditIndexRef.current = exerciseList.indexOf(exercise);
  };

  const deleteExercise = (exercise: IExercise) => {
    console.log('delete exercise', exercise);
    setExerciseList(exerciseList.filter(e => e !== exercise));
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
    if (!validateWorkoutInfo()) {
      return;
    }

    LocalStorageService.addWorkout({
      id: Date.now().toString(16),
      date,
      description:
        description ||
        `${formatTimestampWithLanguage(new Date(), i18n.language, 'datetime')} created`,
      exerciseList,
    });
    navigate('/');
  };

  return (
    <div>
      <SubPageHeader />
      <main className="p-md">
        <Stepper onComplete={() => console.log('Stepper completed')}>
          <Step>
            <StepLabel>Basic Info</StepLabel>
            <p className="text--grey mb-md">
              Fill in workout date and description below.
            </p>
            <form>
              <main className="stepper__main">
                <FormDatePicker
                  ref={
                    workoutDateInputRef as React.RefObject<IFormDatePickerRef>
                  }
                  name="date"
                  label={t('workout.date')}
                  value={date}
                  required
                  onChange={value => setDate(value)}
                />
                <FormInput
                  name="description"
                  label={t('workout.description')}
                  placeholder="Workout description"
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
                  className="btn btn-flat--primary w-100 stepper__button--next"
                >
                  Continue to Add Workout
                </button>
                <button
                  type="button"
                  className="btn btn--info w-100"
                  onClick={() => submit()}
                >
                  Skip & Add Later
                </button>
              </StepActions>
            </form>
          </Step>
          <Step>
            <StepLabel>Exercises</StepLabel>
            <p className="text--grey mb-md">
              Add or edit exercises for this workout.
            </p>
            <form onSubmit={submit}>
              <ul className="flex flex-column g-md mb-lg">
                {exerciseList.map((exercise, index) => (
                  <li
                    key={`${index}-${exercise.exerciseName}-${exercise.notes}`}
                  >
                    <Card>
                      <ExerciseCard
                        exercise={exercise}
                        onEdit={editExercise}
                        onDelete={deleteExercise}
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
                <AddIcon width={18} height={18} fill="currentColor" />
                Add Exercise
              </button>

              <StepActions className="stepper__actions--fixed align-center justify-between gx-md mt-md">
                <button
                  type="button"
                  className="btn btn-primary stepper__button--back"
                >
                  <ChevronLeftIcon width={18} height={18} fill="currentColor" />
                  Prev
                </button>
                <button type="submit" className="btn btn-flat--primary">
                  <SaveIcon width={18} height={18} fill="currentColor" />
                  Save
                </button>
              </StepActions>
            </form>
            <ExerciseFormModal
              ref={
                exerciseFormModalRef as React.RefObject<IExerciseFormModalRef>
              }
              onSubmit={handleExerciseSubmit}
            />
          </Step>
        </Stepper>
      </main>
    </div>
  );
}
