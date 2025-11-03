import { useImperativeHandle, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import type {
  IExercise,
  ISetSetting,
  ISetSettingForm,
} from '~/interface/workout';

import FormInput from '../form/FormInput';
import FormAutocomplete from '../form/FormAutocomplete';
import FormSelect from '../form/FormSelect';
import SetSettingFormList from './SetSettingFormList';

import type { TExerciseCategory } from '~/types/workoutType';

import SaveIcon from '~/assets/google-fonts/save.svg?react';
import CloseIcon from '~/assets/google-fonts/close.svg?react';
import { filterObjectDeep } from '~/format/object';

interface IExerciseFormModalProps {
  ref: React.RefObject<IExerciseFormModalRef>;
  onSubmit: (exercise: IExercise) => void;
}

interface IExerciseFormModalRef {
  open: (exercise?: IExercise) => void;
  close: () => void;
}

export default function ExerciseFormModal({
  ref,
  onSubmit,
}: IExerciseFormModalProps) {
  const { t } = useTranslation();

  // modal state
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // form state
  const [exerciseName, setExerciseName] = useState('');
  const [category, setCategory] = useState<TExerciseCategory | ''>('');
  const [exerciseTime, setExerciseTime] = useState('');
  const [notes, setNotes] = useState('');
  const [setSettingList, setSetSettingList] = useState<ISetSettingForm[]>([]);
  const exerciseNameOptions = useMemo(
    () => [
      // Weightlifting
      {
        label: t('exercise.options.BenchPress'),
        value: 'Bench Press',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.Deadlift'),
        value: 'Deadlift',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.Squats'),
        value: 'Squats',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.OverheadPress'),
        value: 'Overhead Press',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.BarbellRow'),
        value: 'Barbell Row',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.PullUps'),
        value: 'Pull ups',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.PushUps'),
        value: 'Push ups',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.DumbbellCurl'),
        value: 'Dumbbell Curl',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.TricepExtension'),
        value: 'Tricep Extension',
        category: 'Weightlifting',
      },
      {
        label: t('exercise.options.LateralRaise'),
        value: 'Lateral Raise',
        category: 'Weightlifting',
      },

      // Strength
      {
        label: t('exercise.options.Plank'),
        value: 'Plank',
        category: 'Strength',
      },
      {
        label: t('exercise.options.FarmerSWalk'),
        value: "Farmer's Walk",
        category: 'Strength',
      },
      {
        label: t('exercise.options.TurkishGetUp'),
        value: 'Turkish Get-Up',
        category: 'Strength',
      },
      {
        label: t('exercise.options.KettlebellSwing'),
        value: 'Kettlebell Swing',
        category: 'Strength',
      },
      {
        label: t('exercise.options.WeightedPullUp'),
        value: 'Weighted Pull-Up',
        category: 'Strength',
      },
      {
        label: t('exercise.options.WeightedDip'),
        value: 'Weighted Dip',
        category: 'Strength',
      },
      {
        label: t('exercise.options.SingleLegDeadlift'),
        value: 'Single-Leg Deadlift',
        category: 'Strength',
      },
      {
        label: t('exercise.options.BulgarianSplitSquat'),
        value: 'Bulgarian Split Squat',
        category: 'Strength',
      },
      {
        label: t('exercise.options.GluteBridge'),
        value: 'Glute Bridge',
        category: 'Strength',
      },
      {
        label: t('exercise.options.MedicineBallSlam'),
        value: 'Medicine Ball Slam',
        category: 'Strength',
      },

      // Cardio
      { label: t('exercise.options.Run'), value: 'Run', category: 'Cardio' },
      { label: t('exercise.options.Bike'), value: 'Bike', category: 'Cardio' },
      { label: t('exercise.options.Swim'), value: 'Swim', category: 'Cardio' },
      { label: t('exercise.options.Row'), value: 'Row', category: 'Cardio' },
      {
        label: t('exercise.options.Elliptical'),
        value: 'Elliptical',
        category: 'Cardio',
      },
      {
        label: t('exercise.options.Stairs'),
        value: 'Stairs',
        category: 'Cardio',
      },
      {
        label: t('exercise.options.JumpRope'),
        value: 'Jump Rope',
        category: 'Cardio',
      },
      { label: t('exercise.options.HIIT'), value: 'HIIT', category: 'Cardio' },
      {
        label: t('exercise.options.StairClimber'),
        value: 'Stair Climber',
        category: 'Cardio',
      },
      {
        label: t('exercise.options.Treadmill'),
        value: 'Treadmill',
        category: 'Cardio',
      },
    ],
    [t]
  );

  const exerciseLabelCategoryMap = useMemo(
    () =>
      new Map(
        exerciseNameOptions.map(option => [option.label, option.category])
      ),
    [exerciseNameOptions]
  );

  const categoryOptions = [
    { label: t('exercise.category.Strength'), value: 'Strength' },
    { label: t('exercise.category.Cardio'), value: 'Cardio' },
    { label: t('exercise.category.Weightlifting'), value: 'Weightlifting' },
  ];

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const clearForm = () => {
    setExerciseName('');
    setCategory('');
    setExerciseTime('');
    setNotes('');
    setSetSettingList([]);
  };

  const open = (exercise?: IExercise) => {
    clearForm();
    setIsOpen(true);
    setIsEdit(!!exercise);
    if (exercise) {
      setExerciseName(exercise.exerciseName ?? '');
      setCategory(exercise.category ?? '');
      setExerciseTime(exercise.exerciseTime ?? '');
      setNotes(exercise.notes ?? '');
      setSetSettingList(exercise.setSettingList ?? []);
    }
  };

  const close = () => {
    setIsOpen(false);
    clearForm();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!exerciseName || !category) {
      return;
    }
    onSubmit({
      exerciseName,
      category,
      exerciseTime,
      notes,
      setSettingList: filterObjectDeep(setSettingList) as ISetSetting[],
    });
    close();
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="modal-overlay">
      <div
        className="modal-container modal-container--lg modal-container--fix-header"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header bg-light">
          <h2>
            {isEdit
              ? t('exercise.form.title.edit')
              : t('exercise.form.title.create')}
          </h2>
          <button
            className="modal-close-btn"
            aria-label="Close"
            onClick={close}
          >
            <CloseIcon width={18} height={18} fill="currentColor" />
          </button>
        </div>
        <form className="modal-body p-md" onSubmit={handleSubmit}>
          <FormAutocomplete
            name="exerciseName"
            label={t('workout.exercise.name')}
            placeholder="e.g. Bench Press"
            value={exerciseName}
            options={exerciseNameOptions}
            required
            onChange={value => {
              setExerciseName(value);
              setCategory(
                (exerciseLabelCategoryMap.get(value) as TExerciseCategory) ??
                  category ??
                  ''
              );
            }}
          />
          <FormSelect
            name="category"
            label={t('workout.exercise.category')}
            options={categoryOptions}
            value={category}
            onChange={value => setCategory(value as TExerciseCategory)}
          />
          <FormInput
            name="exerciseTime"
            label={t('workout.exercise.exerciseTime')}
            type="text"
            placeholder="e.g. 10:00"
            value={exerciseTime}
            onChange={e => setExerciseTime(e.target.value)}
          />
          <FormInput
            name="exerciseNotes"
            label={t('workout.exercise.exerciseNotes')}
            placeholder="Notes for this exercise"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <section className="mb-md">
            <h3 className="mb-md">{t('exercise.setSetting')}</h3>
            <SetSettingFormList
              setSettingList={setSettingList}
              onChange={setSetSettingList}
            />
          </section>
          <button type="submit" className="btn btn-flat--primary w-100">
            <SaveIcon width={18} height={18} fill="currentColor" />
            {isEdit ? t('common.save') : t('exercise.form.create')}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export type { IExerciseFormModalRef };
