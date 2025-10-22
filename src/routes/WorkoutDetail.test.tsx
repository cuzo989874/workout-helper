import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import WorkoutDetail from './WorkoutDetail';
import type { IWorkout } from '~/interface/workout';
import { LocalStorageService } from '~/services/LocalStorageService';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock SVG icons
vi.mock('~/assets/google-fonts/edit_square.svg?react', () => ({
  default: () => <svg data-testid="edit-icon" />,
}));
vi.mock('~/assets/google-fonts/delete.svg?react', () => ({
  default: () => <svg data-testid="delete-icon" />,
}));

// Mock Card-related components to simple pass-throughs
vi.mock('~/components/card/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Stub ExerciseCard to avoid deep rendering
vi.mock('~/components/feature/ExerciseCard', () => ({
  default: ({ exercise }: { exercise: { exerciseName: string } }) => (
    <div data-testid="exercise-card">{exercise.exerciseName}</div>
  ),
}));

// Stub SubPageHeader
vi.mock('~/components/layouts/SubPageHeader', () => ({
  default: () => <div data-testid="subpage-header" />,
}));

// Mock react-router hooks
const mockNavigate = vi.fn();
let mockParams: { id?: string } = {};
vi.mock('react-router', async () => {
  return {
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  } as unknown as typeof import('react-router');
});

describe('當：WorkoutDetail 路由頁面', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  beforeEach(() => {
    // reset params each test
    mockParams = {};
  });

  const workout: IWorkout = {
    id: 'w1',
    date: '2025-09-20',
    description: 'Push Day',
    exerciseList: [
      {
        exerciseTime: '10:00',
        exerciseName: 'Bench Press',
        category: 'Strength',
        setSettingList: [],
      },
    ],
  };

  it('應該：在找不到資料時顯示 Not found 狀態', () => {
    mockParams = { id: 'not-exist' };
    vi.spyOn(LocalStorageService, 'loadWorkouts').mockReturnValue(null);

    render(<WorkoutDetail />);

    expect(screen.getByTestId('subpage-header')).toBeInTheDocument();
    expect(screen.getByText('Workout not found.')).toBeInTheDocument();
  });

  it('應該：渲染基本資訊與運動清單', () => {
    mockParams = { id: workout.id };
    vi.spyOn(LocalStorageService, 'loadWorkouts').mockReturnValue([workout]);

    render(<WorkoutDetail />);

    // Sections
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
    expect(screen.getByText('Exercises')).toBeInTheDocument();

    // Basic info content
    expect(screen.getByText('workout.date')).toBeInTheDocument();
    expect(screen.getByText(workout.date)).toBeInTheDocument();
    expect(screen.getByText('workout.description')).toBeInTheDocument();
    expect(screen.getByText(workout.description)).toBeInTheDocument();

    // Exercise list (stubbed)
    expect(screen.getByTestId('exercise-card')).toHaveTextContent(
      'Bench Press'
    );
  });

  it('當：點擊刪除，應該：刪除並導向首頁', async () => {
    const user = userEvent.setup();
    mockParams = { id: workout.id };
    vi.spyOn(LocalStorageService, 'loadWorkouts').mockReturnValue([workout]);
    const deleteSpy = vi
      .spyOn(LocalStorageService, 'deleteWorkout')
      .mockReturnValue([]);

    render(<WorkoutDetail />);

    const deleteBtn = screen.getByRole('button', { name: 'common.delete' });
    await user.click(deleteBtn);

    expect(deleteSpy).toHaveBeenCalledWith(workout.id);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('當：點擊編輯，應該：導向更新頁', async () => {
    const user = userEvent.setup();
    mockParams = { id: workout.id };
    vi.spyOn(LocalStorageService, 'loadWorkouts').mockReturnValue([workout]);

    render(<WorkoutDetail />);

    const editBtn = screen.getByRole('button', { name: 'common.edit' });
    await user.click(editBtn);

    expect(mockNavigate).toHaveBeenCalledWith(`/workout/update/${workout.id}`);
  });

  it('當：訓練有有效的組數時，應該：顯示開始訓練按鈕', () => {
    const workoutWithSets: IWorkout = {
      ...workout,
      exerciseList: [
        {
          ...workout.exerciseList[0],
          setSettingList: [{ weightLifted: 50, reps: 5, restTime: 60 }],
        },
      ],
    };
    mockParams = { id: workoutWithSets.id };
    vi.spyOn(LocalStorageService, 'loadWorkouts').mockReturnValue([
      workoutWithSets,
    ]);

    render(<WorkoutDetail />);

    expect(
      screen.getByRole('button', { name: 'workout.startWorkout' })
    ).toBeInTheDocument();
  });

  it('當：訓練沒有有效的組數時，應該：不顯示開始訓練按鈕', () => {
    const workoutWithoutSets: IWorkout = {
      ...workout,
      exerciseList: [
        {
          ...workout.exerciseList[0],
          setSettingList: [],
        },
      ],
    };
    mockParams = { id: workoutWithoutSets.id };
    vi.spyOn(LocalStorageService, 'loadWorkouts').mockReturnValue([
      workoutWithoutSets,
    ]);

    render(<WorkoutDetail />);

    expect(
      screen.queryByRole('button', { name: 'workout.startWorkout' })
    ).not.toBeInTheDocument();
  });

  it('當：點擊開始訓練按鈕，應該：導向計時器頁面', async () => {
    const user = userEvent.setup();
    const workoutWithSets: IWorkout = {
      ...workout,
      exerciseList: [
        {
          ...workout.exerciseList[0],
          setSettingList: [{ weightLifted: 50, reps: 5, restTime: 60 }],
        },
      ],
    };
    mockParams = { id: workoutWithSets.id };
    vi.spyOn(LocalStorageService, 'loadWorkouts').mockReturnValue([
      workoutWithSets,
    ]);

    render(<WorkoutDetail />);

    const startWorkoutBtn = screen.getByRole('button', {
      name: 'workout.startWorkout',
    });
    await user.click(startWorkoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/workout/timer/${workoutWithSets.id}`
    );
  });
});
