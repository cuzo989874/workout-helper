import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import lodash from 'lodash';

import { LocalStorageService } from '~/services/LocalStorageService';

import Header from '~/components/layouts/Header';
import WorkoutCard from '~/components/feature/WorkoutCard';

import type { IWorkout } from '~/interface/workout';

import AddIcon from '~/assets/google-fonts/add.svg?react';
import styles from './Home.module.scss';

export function meta() {
  return [
    { title: 'Workout Helper' },
    { name: 'description', content: 'Workout Helper' },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const [workoutList, setWorkoutList] = useState<IWorkout[]>([]);

  const groupedWorkoutByDate = useMemo(() => {
    return lodash
      .map(lodash.groupBy(workoutList, 'date'), (workout, date) => ({
        date,
        workout,
      }))
      .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
  }, [workoutList]);

  useEffect(() => {
    setWorkoutList(LocalStorageService.loadWorkouts() || []);
  }, []);

  return (
    <div>
      <Header />
      <main className={`main ${styles['home-main']}`}>
        <ul className="flex flex-column align-center">
          {groupedWorkoutByDate.map(({ workout, date }) => (
            <li key={date}>
              <h2 className={styles['date-chip']}>{date}</h2>
              <ul className="flex flex-column gy-md">
                {lodash.map(workout, workout => (
                  <li
                    key={workout.id}
                    onClick={() => navigate(`/workout/${workout.id}`)}
                  >
                    <WorkoutCard workout={workout} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div
          className={styles['floating-action-button']}
          onClick={() => navigate('/workout/create')}
        >
          <AddIcon width={32} height={32} fill="currentColor" />
        </div>
      </main>
    </div>
  );
}
