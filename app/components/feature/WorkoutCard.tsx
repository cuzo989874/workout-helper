import { useNavigate } from "react-router";
import lodash from "lodash";

import { Card, CardBody, CardHeader } from "../card/Card";

import type { IWorkout } from "~/interface/workout";

import EditIcon from "~/assets/google-fonts/edit_square.svg?react";
import styles from "./WorkoutCard.module.scss";

export default function WorkoutCard({ workout }: { workout: IWorkout }) {
  const navigate = useNavigate();
  return (
    <Card className={styles['workout-card']}>
    <CardHeader className="flex align-center justify-between pb-md bg-primary">
      <h3>{workout.description}</h3>
      <button className="btn icon-btn icon-btn--primary" onClick={() => navigate(`/workout/update/${workout.id}`)}>
        <EditIcon width={18} height={18} fill="currentColor" />
      </button>
    </CardHeader>
    <CardBody>
      <ul>
        {lodash.map(workout.exerciseList, (exercise) => (
          <li className={styles['exercise']} key={exercise.exerciseName}>
            <span className="mr-sm">{exercise.exerciseTime}</span>
            <h4>{exercise.exerciseName}</h4>
            <p className="text--grey mb-xs">{exercise.notes}</p>
            <ul className={styles['set-setting-list']}>
              {lodash.map(exercise.setSettingList, (setSetting) => (
                <li key={setSetting.setSettingId}>{setSetting.sets} sets x {setSetting.reps} reps x {setSetting.weightLifted} kg</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
  );
};