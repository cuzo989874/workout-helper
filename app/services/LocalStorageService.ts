import { type IStorageData } from '~/interface/storage';
import { type IWorkout } from '~/interface/workout';

type TWorkoutStorageData = IStorageData<IWorkout[]>;

const WORKOUT_STORAGE_KEY = 'workout_data';
const CURRENT_VERSION = '0.0.1';

/**
 * Service for managing workout data in localStorage with versioning support.
 */
export const LocalStorageService = {
  /**
   * Compare two semantic version strings.
   * @private
   * @param {string} version1 - The first version string.
   * @param {string} version2 - The second version string.
   * @returns {number} Returns 0 if equal, a positive number if version1 > version2, or a negative number if version1 < version2.
   */
  _versionCompare(version1: string, version2: string): number {
    const v1 = version1.split('.');
    const v2 = version2.split('.');
    for (let i = 0; i < v1.length && i < v2.length; i++) {
      const diff = parseInt(v1[i]) - parseInt(v2[i]);
      if (diff !== 0) return diff;
    }
    return v1.length - v2.length;
  },

  /**
   * Retrieve and validate data from localStorage for a given key and version.
   * If the stored version is older than the required version, the item is removed and null is returned.
   * @template T
   * @param {string} key - The localStorage key.
   * @param {string} version - The required version string.
   * @returns {IStorageData<T> | null} The parsed storage data or null if not found/invalid.
   */
  getLocalStorageFormat<T extends object>(
    key: string,
    version: string
  ): IStorageData<T> | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      const data = JSON.parse(item);
      if (!data?.version) {
        return null;
      }
      if (this._versionCompare(data.version, version) < 0) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
      return null;
    }
  },

  /**
   * Load all workouts from localStorage.
   * @returns {TWorkoutStorageData | null} The stored workouts data or null if not found.
   */
  loadWorkouts(): IWorkout[] | null {
    return (
      this.getLocalStorageFormat<IWorkout[]>(
        WORKOUT_STORAGE_KEY,
        CURRENT_VERSION
      )?.data || null
    );
  },

  /**
   * Save the provided workouts array to localStorage.
   * @param {IWorkout[]} workouts - The array of workouts to save.
   * @returns {void}
   */
  saveWorkouts(workouts: IWorkout[]): void {
    const dataToSave: TWorkoutStorageData = {
      version: CURRENT_VERSION,
      data: workouts,
    };
    localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(dataToSave));
  },

  /**
   * Add a new workout to localStorage. Generates a unique ID for the workout.
   * @param {IWorkout} workout - The workout to add.
   * @returns {IWorkout[]} The updated array of workouts.
   */
  addWorkout(workout: IWorkout): IWorkout[] {
    const currentData = this.loadWorkouts() || [];
    const newWorkout = { ...workout, id: Date.now().toString() }; // Simple ID generation
    const updatedWorkouts = [...currentData, newWorkout];
    this.saveWorkouts(updatedWorkouts);
    return updatedWorkouts;
  },

  /**
   * Update an existing workout in localStorage.
   * @param {IWorkout} updatedWorkout - The workout with updated data.
   * @returns {IWorkout[]} The updated array of workouts, or an empty array if not found.
   */
  updateWorkout(updatedWorkout: IWorkout): IWorkout[] {
    const currentData = this.loadWorkouts();
    if (!currentData) return [];
    const updatedWorkouts = currentData.map(w =>
      w.id === updatedWorkout.id ? updatedWorkout : w
    );
    this.saveWorkouts(updatedWorkouts);
    return updatedWorkouts;
  },

  /**
   * Delete a workout by its ID from localStorage.
   * @param {string} id - The ID of the workout to delete.
   * @returns {IWorkout[]} The updated array of workouts, or an empty array if not found.
   */
  deleteWorkout(id: string): IWorkout[] {
    const currentData = this.loadWorkouts();
    if (!currentData) return [];
    const updatedWorkouts = currentData.filter(w => w.id !== id);
    this.saveWorkouts(updatedWorkouts);
    return updatedWorkouts;
  },
};
