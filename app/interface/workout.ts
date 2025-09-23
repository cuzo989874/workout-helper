
/**
 * Represents a single set configuration for an exercise.
 * @interface
 */
export interface ISetSetting {
  /** Unique identifier for the set setting */
  setSettingId: string;
  /** Weight lifted in this set (optional) */
  weightLifted?: number;
  /** Number of sets (optional) */
  sets?: number;
  /** Number of repetitions (optional) */
  reps?: number;
  /** Rest time between sets, in seconds (optional) */
  restTime?: number;
  /** Distance covered in this set, for cardio exercises (optional) */
  distance?: number;
  /** Time taken for this set, as a string (e.g., "2min") (optional) */
  time?: string;
  /** Additional notes for this set (optional) */
  notes?: string;
}

/**
 * Represents a single exercise within a workout.
 * @interface
 */
export interface IExercise {
  /** Time when the exercise was performed (e.g., "10:00") */
  exerciseTime: string;
  /** Name of the exercise */
  exerciseName: string;
  /** Category of the exercise */
  category: "Strength" | "Cardio" | "Weightlifting";
  /** Additional notes for the exercise (optional) */
  notes?: string;
  /** List of set settings for this exercise */
  setSettingList: ISetSetting[];
}

/**
 * Represents a workout session. if date | description diff with others, it will be a new workout.
 * @interface
 */
export interface IWorkout {
  /** Unique identifier for the workout */
  id: string;
  /** Date of the workout (e.g., "2025-09-20") */
  date: string;
  /** Description of the workout */
  description: string;
  /** List of exercises performed in this workout */
  exerciseList: IExercise[];
}