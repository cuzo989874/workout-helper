// workout-helper/app/services/LocalStorageService.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { type IWorkout } from '~/interface/workout';
import { type IStorageData } from '~/interface/storage';
import { LocalStorageService } from './LocalStorageService';

const MOCK_WORKOUTS: IWorkout[] = [
  {
    id: '1',
    date: '2025-09-20',
    description: 'Chest Day',
    exerciseList: [
      {
        exerciseTime: '10:00',
        exerciseName: 'Push ups',
        category: 'Weightlifting',
        setSettingList: [{ weightLifted: 20, sets: 3, reps: 10 }],
      },
    ],
  },
  {
    id: '2',
    date: '2025-09-21',
    description: 'Leg Day',
    exerciseList: [
      {
        exerciseTime: '11:00',
        exerciseName: 'Squats',
        category: 'Weightlifting',
        setSettingList: [{ weightLifted: 60, sets: 5, reps: 5 }],
      },
    ],
  },
];

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(localStorage, 'setItem');
    vi.spyOn(localStorage, 'getItem');
    vi.spyOn(localStorage, 'removeItem');
  });

  it('should load empty workouts if local storage is empty', () => {
    const result = LocalStorageService.loadWorkouts();
    expect(result).toEqual(null);
    expect(localStorage.getItem).toHaveBeenCalledWith('workout_data');
  });

  it('should save workouts to local storage', () => {
    LocalStorageService.saveWorkouts(MOCK_WORKOUTS);
    const expectedData: IStorageData<IWorkout[]> = {
      version: '0.0.1',
      data: MOCK_WORKOUTS,
    };
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workout_data',
      JSON.stringify(expectedData)
    );
  });

  it('should load existing workouts from local storage', () => {
    const storedData: IStorageData<IWorkout[]> = {
      version: '0.0.1',
      data: MOCK_WORKOUTS,
    };
    localStorage.setItem('workout_data', JSON.stringify(storedData));

    const result = LocalStorageService.loadWorkouts();
    expect(result).toEqual(storedData.data);
    expect(localStorage.getItem).toHaveBeenCalledWith('workout_data');
  });

  it('should add a new workout', () => {
    const newWorkout: IWorkout = {
      id: '', // ID will be generated
      date: '2025-09-22',
      description: 'Arm Day',
      exerciseList: [],
    };
    vi.spyOn(Date, 'now').mockReturnValue(123456789);

    const updatedWorkouts = LocalStorageService.addWorkout(newWorkout);
    expect(updatedWorkouts.length).toBe(1);
    expect(updatedWorkouts[0].description).toBe('Arm Day');
    expect(updatedWorkouts[0].id).toBe('123456789');

    const storedData = JSON.parse(localStorage.getItem('workout_data') || '{}');
    expect(storedData.data.length).toBe(1);
    expect(storedData.data[0].id).toBe('123456789');
  });

  it('should update an existing workout', () => {
    LocalStorageService.saveWorkouts(MOCK_WORKOUTS);
    const updatedDescription = 'Updated Chest Day';
    const workoutToUpdate = {
      ...MOCK_WORKOUTS[0],
      description: updatedDescription,
    };

    const updatedWorkouts = LocalStorageService.updateWorkout(workoutToUpdate);
    expect(updatedWorkouts.length).toBe(MOCK_WORKOUTS.length);
    expect(updatedWorkouts[0].description).toBe(updatedDescription);

    const storedData = JSON.parse(localStorage.getItem('workout_data') || '{}');
    expect(storedData.data[0].description).toBe(updatedDescription);
  });

  it('should delete a workout', () => {
    LocalStorageService.saveWorkouts(MOCK_WORKOUTS);

    const updatedWorkouts = LocalStorageService.deleteWorkout('1');
    expect(updatedWorkouts.length).toBe(MOCK_WORKOUTS.length - 1);
    expect(updatedWorkouts.some(w => w.id === '1')).toBeFalsy();

    const storedData = JSON.parse(localStorage.getItem('workout_data') || '{}');
    expect(storedData.data.some((w: IWorkout) => w.id === '1')).toBeFalsy();
  });

  it('should handle local storage data version mismatch', () => {
    const oldVersionData: IStorageData<IWorkout[]> = {
      version: '0.0.0',
      data: MOCK_WORKOUTS,
    };
    localStorage.setItem('workout_data', JSON.stringify(oldVersionData));

    const result = LocalStorageService.loadWorkouts();
    expect(result).toEqual(null); // Expecting default empty data due to version mismatch
  });

  it('should return default if local storage data is corrupted', () => {
    localStorage.setItem('workout_data', 'invalid json');
    const result = LocalStorageService.loadWorkouts();
    expect(result).toEqual(null);
  });
});
