import { useEffect, useMemo, useState } from 'react';

import lodash from 'lodash';

import Header from '~/components/layouts/Header';
import WorkoutCard from '~/components/feature/WorkoutCard';

import type { IWorkout } from '~/interface/workout';

import styles from './home.module.scss';

export function meta() {
  return [
    { title: 'Workout Helper' },
    { name: 'description', content: 'Workout Helper' },
  ];
}

export default function Home() {
  const mockWorkoutList: IWorkout[] = [
    {
      id: '1',
      date: '2025-09-20',
      description: 'Chest Day',
      exerciseList: [
        {
          exerciseTime: '10:00',
          exerciseName: 'Push ups',
          category: 'Weightlifting',
          notes: '',
          setSettingList: [
            {
              setSettingId: 'FVHJK789',
              weightLifted: 20,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
          ],
        },
        {
          exerciseTime: '10:20',
          exerciseName: 'Barbell bench press',
          category: 'Weightlifting',
          notes: 'Some notes',
          setSettingList: [
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 20,
              sets: 1,
              reps: 10,
              restTime: 120,
              notes: 'warm up',
            },
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 40,
              sets: 1,
              reps: 8,
              restTime: 120,
              notes: 'hybrid set',
            },
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 60,
              sets: 3,
              reps: 6,
              restTime: 120,
              notes: 'main set',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      date: '2025-09-21',
      description: 'Back Day',
      exerciseList: [
        {
          exerciseTime: '22:00',
          exerciseName: 'Pull ups',
          category: 'Weightlifting',
          notes: '',
          setSettingList: [
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 20,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 40,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
          ],
        },
        {
          exerciseTime: '22:20',
          exerciseName: 'Deadlift',
          category: 'Weightlifting',
          notes: '',
          setSettingList: [
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 40,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 60,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
          ],
        },
        {
          exerciseTime: '22:40',
          exerciseName: 'Squats',
          category: 'Weightlifting',
          notes: '',
          setSettingList: [
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 60,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 80,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
          ],
        },
      ],
    },
    {
      id: '3',
      date: '2025-09-21',
      description: 'Back Day(Night)',
      exerciseList: [
        {
          exerciseTime: '22:00',
          exerciseName: 'Pull ups',
          category: 'Weightlifting',
          notes: '',
          setSettingList: [
            {
              setSettingId: 'KJHGBJH7',
              weightLifted: 20,
              sets: 3,
              reps: 10,
              restTime: 30,
            },
          ],
        },
      ],
    },
  ];
  const [workoutList, setWorkoutList] = useState<IWorkout[]>(mockWorkoutList);

  const groupedWorkoutByDate = useMemo(() => {
    return lodash.groupBy(workoutList, 'date');
  }, [workoutList]);

  useEffect(() => {
    // TODO: get LocalStorage workoutList
    setWorkoutList(mockWorkoutList);
  }, []);

  return (
    <>
      <Header />
      <main className={styles['home-main']}>
        <ul>
          {lodash.map(groupedWorkoutByDate, (workout, date) => (
            <li key={date}>
              <h2 className={styles['date-chip']}>{date}</h2>
              <ul className="flex flex-column gy-md">
                {lodash.map(workout, workout => (
                  <li key={workout.id}>
                    <WorkoutCard workout={workout} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
