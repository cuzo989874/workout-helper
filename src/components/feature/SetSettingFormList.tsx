import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FormInput from '../form/FormInput';

import type { ISetSettingForm } from '~/interface/workout';

import AddIcon from '~/assets/google-fonts/add.svg?react';
import DeleteIcon from '~/assets/google-fonts/delete.svg?react';
import styles from './SetSettingFormList.module.scss';

function SetSettingForm({
  setSetting,
  onChange,
}: {
  setSetting: ISetSettingForm;
  onChange: (setSetting: ISetSettingForm) => void;
}) {
  const { t } = useTranslation();
  const [setAmount, setSetAmount] = useState(setSetting.sets ?? '');
  const [reps, setReps] = useState(setSetting.reps ?? '');
  const [weightLifted, setWeightLifted] = useState(
    setSetting.weightLifted ?? ''
  );
  const [distance, setDistance] = useState(setSetting.distance ?? '');
  const [restTime, setRestTime] = useState(setSetting.restTime ?? '');
  const [time, setTime] = useState(setSetting.time ?? '');
  const [notes, setNotes] = useState(setSetting.notes ?? '');

  const changeByField = <T extends keyof ISetSettingForm>(
    field: T,
    value: ISetSettingForm[T]
  ) => {
    (setSetting as unknown as ISetSettingForm)[field] =
      value as ISetSettingForm[T];
    onChange(setSetting);
  };

  const numberAllowEmpty = (value: string | number) =>
    value === '' ? '' : Number(value);

  return (
    <div>
      <div className="flex gx-sm">
        <FormInput
          type="number"
          className="grid-col-6"
          name="sets"
          label={t('exercise.set.sets')}
          placeholder="-"
          value={setAmount}
          min="0"
          onChange={e => {
            const value = numberAllowEmpty(e.target.value);
            setSetAmount(value);
            changeByField('sets', value);
          }}
        />
        <FormInput
          type="number"
          className="grid-col-6"
          name="reps"
          label={t('exercise.set.reps')}
          placeholder="-"
          value={reps}
          min="0"
          onChange={e => {
            const value = numberAllowEmpty(e.target.value);
            setReps(value);
            changeByField('reps', value);
          }}
        />
      </div>
      <div className="flex gx-sm">
        <FormInput
          type="number"
          name="weightLifted"
          className="grid-col-6"
          label={t('exercise.set.weightLifted')}
          placeholder="-"
          value={weightLifted}
          min="0"
          suffix="kg"
          onChange={e => {
            const value = numberAllowEmpty(e.target.value);
            setWeightLifted(value);
            changeByField('weightLifted', value);
          }}
        />
        <FormInput
          type="number"
          name="distance"
          className="grid-col-6"
          label={t('exercise.set.distance')}
          placeholder="-"
          value={distance}
          min="0"
          suffix="m"
          onChange={e => {
            const value = numberAllowEmpty(e.target.value);
            setDistance(value);
            changeByField('distance', value);
          }}
        />
      </div>
      <div className="flex gx-sm">
        <FormInput
          type="number"
          name="restTime"
          className="grid-col-6"
          label={t('exercise.set.restTime')}
          placeholder="-"
          value={restTime}
          suffix={t('common.secondsShort')}
          min="0"
          onChange={e => {
            const value = numberAllowEmpty(e.target.value);
            setRestTime(value);
            changeByField('restTime', value);
          }}
        />
        {/* TODO: 時間選擇器，選擇時間後，時間會自動填入，value 為秒數 */}
        <FormInput
          name="time"
          type="number"
          className="grid-col-6"
          label={t('exercise.set.time')}
          placeholder="-"
          value={time}
          min="0"
          suffix={t('common.secondsShort')}
          onChange={e => {
            const value = numberAllowEmpty(e.target.value);
            setTime(value);
            changeByField('time', value);
          }}
        />
      </div>
      <FormInput
        name="setNotes"
        label={t('exercise.set.notes')}
        placeholder={t('exercise.set.notesPlaceholder')}
        value={notes}
        onChange={e => {
          setNotes(e.target.value);
          changeByField('notes', e.target.value);
        }}
      />
    </div>
  );
}

interface ISetSettingFormListProps {
  setSettingList: ISetSettingForm[];
  onChange: (setSettingList: ISetSettingForm[]) => void;
}

export default function SetSettingFormList({
  setSettingList,
  onChange,
}: ISetSettingFormListProps) {
  const { t } = useTranslation();

  const [localSetSettingList, setLocalSetSettingList] =
    useState<ISetSettingForm[]>(setSettingList);

  const addSetSetting = () => {
    setLocalSetSettingList([
      ...localSetSettingList,
      {
        notes: '',
      },
    ]);
  };

  const deleteSetSetting = (setSetting: ISetSettingForm) => {
    setLocalSetSettingList(
      localSetSettingList.splice(localSetSettingList.indexOf(setSetting), 1)
    );
    onChange(localSetSettingList);
  };

  useEffect(() => {
    setLocalSetSettingList(setSettingList);
  }, [setSettingList]);

  return (
    <div>
      <ul>
        {localSetSettingList.map((setSetting, index) => (
          <li key={index} className={styles['set-setting-form-card']}>
            <div className="flex align-center justify-between mb-sm">
              <h4 className="text--grey">#{index + 1}</h4>
              <button
                type="button"
                className="btn btn-outline btn-outline--cancel btn--sm"
                onClick={() => deleteSetSetting(setSetting)}
              >
                <DeleteIcon width={18} height={18} fill="currentColor" />
                {t('common.delete')}
              </button>
            </div>
            <SetSettingForm
              setSetting={setSetting}
              onChange={() => onChange(localSetSettingList)}
            />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`btn btn-outline btn-outline--info ${styles['add-set-setting-button']}`}
        onClick={addSetSetting}
      >
        <AddIcon width={18} height={18} fill="currentColor" />
      </button>
    </div>
  );
}
