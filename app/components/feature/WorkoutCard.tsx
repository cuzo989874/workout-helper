import { Card, CardHeader } from '~/components/card/Card';

import type { IWorkout } from '~/interface/workout';

import ExerciseCard from './ExerciseCard';

import EditIcon from '~/assets/google-fonts/edit_square.svg?react';
import styles from './WorkoutCard.module.scss';

export default function WorkoutCard({ workout }: { workout: IWorkout }) {
  return (
    <Card className={styles['workout-card']}>
      <CardHeader className="flex align-center justify-between pb-md bg-primary">
        <h3>{workout.description}</h3>
        <button className="btn icon-btn icon-btn--primary">
          <EditIcon width={18} height={18} fill="currentColor" />
        </button>
      </CardHeader>
      <div>
        <ul>
          {workout.exerciseList.map((exercise, index) => (
            <li key={`${index}-${exercise.exerciseName}-${exercise.notes}`}>
              <ExerciseCard exercise={exercise} />
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
