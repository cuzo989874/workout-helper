import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import UpdateWorkout from './updateWorkout';

import type { IExercise, IWorkout } from '~/interface/workout';

// Mock SVG icons
vi.mock('~/assets/google-fonts/add.svg?react', () => ({
  default: () => <svg data-testid="add-icon" />,
}));
vi.mock('~/assets/google-fonts/chevron_left.svg?react', () => ({
  default: () => <svg data-testid="chevron-left-icon" />,
}));
vi.mock('~/assets/google-fonts/save.svg?react', () => ({
  default: () => <svg data-testid="save-icon" />,
}));
vi.mock('~/assets/google-fonts/calendar_month.svg?react', () => ({
  default: () => <svg data-testid="calendar-icon" />,
}));

// Mock react-router
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
vi.mock('react-router', async () => {
  return {
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

// Mock LocalStorageService
const mockWorkout: IWorkout = {
  id: 'test-workout-id',
  date: '2025-09-25',
  description: 'Initial Description',
  exerciseList: [
    {
      exerciseName: 'Squats',
      category: 'Weightlifting',
      exerciseTime: '00:00',
      notes: '',
      setSettingList: [{ reps: 10, weight: 100 }],
    },
  ],
};
const loadWorkoutsMock = vi.fn().mockReturnValue([mockWorkout]);
const updateWorkoutMock = vi.fn();
vi.mock('~/services/LocalStorageService', async () => {
  const actual = await vi.importActual<
    typeof import('~/services/LocalStorageService')
  >('~/services/LocalStorageService');
  return {
    ...actual,
    LocalStorageService: {
      ...actual.LocalStorageService,
      loadWorkouts: (...args: unknown[]) => loadWorkoutsMock(...args),
      updateWorkout: (...args: unknown[]) => updateWorkoutMock(...args),
    },
  };
});

// Mock ExerciseCard
vi.mock('~/components/feature/ExerciseCard', () => ({
  default: ({ exercise }: { exercise: IExercise }) => (
    <div data-testid={`exercise-card-${exercise.exerciseName}`}>
      {exercise.exerciseName}
    </div>
  ),
}));

// Mock ExerciseFormModal
vi.mock('~/components/feature/ExerciseFormModal', () => {
  return {
    default: ({
      ref,
      onSubmit,
    }: {
      ref: React.RefObject<unknown>;
      onSubmit: (exercise: IExercise) => void;
    }) => {
      if (ref && 'current' in ref) {
        (
          ref as React.MutableRefObject<{
            open: () => void;
            close: () => void;
          } | null>
        ).current = {
          open: () =>
            onSubmit({
              exerciseName: 'Bench Press',
              category: 'Weightlifting',
              exerciseTime: '10:00',
              notes: 'Warm up',
              setSettingList: [],
            }),
          close: () => {},
        };
      }
      return null;
    },
  };
});

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue || key,
    i18n: { language: 'en' },
  }),
}));

describe('當：UpdateWorkout 路由頁面', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    updateWorkoutMock.mockClear();
    loadWorkoutsMock.mockClear();
    mockUseParams.mockReturnValue({ id: 'test-workout-id' });
    loadWorkoutsMock.mockReturnValue([mockWorkout]);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：載入 workout 資料並顯示在表單中', async () => {
    render(<UpdateWorkout />);

    // 驗證 `loadWorkouts` 被呼叫
    expect(loadWorkoutsMock).toHaveBeenCalledTimes(1);

    const user = userEvent.setup();

    // 驗證描述已正確載入
    await waitFor(() => {
      expect(
        screen.getByDisplayValue('Initial Description')
      ).toBeInTheDocument();
    });

    // 前往下一步驟
    await user.click(screen.getByText('Continue to Edit Workout'));

    // 驗證運動項目已正確載入
    expect(screen.getByTestId('exercise-card-Squats')).toBeInTheDocument();
  });

  it('應該：若找不到 workout ID 則導向首頁', () => {
    mockUseParams.mockReturnValue({ id: 'non-existent-id' });
    render(<UpdateWorkout />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('應該：可由基本資訊步驟前往/返回到運動清單步驟', async () => {
    const user = userEvent.setup();
    render(<UpdateWorkout />);

    await waitFor(() => {
      expect(screen.getByText('Basic Info')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Continue to Edit Workout'));
    expect(screen.getByText('Exercises')).toBeInTheDocument();

    await user.click(screen.getByText('Prev'));
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
  });

  it('應該：更新訓練並導向首頁（Save 按鈕）', async () => {
    const user = userEvent.setup();
    render(<UpdateWorkout />);

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('Initial Description')
      ).toBeInTheDocument();
    });

    const descInput = screen.getByDisplayValue('Initial Description');
    await user.clear(descInput);
    await user.type(descInput, 'Updated Chest Day');

    await user.click(screen.getByText('Continue to Edit Workout'));
    await user.click(screen.getByText('Save', { exact: false }));

    expect(updateWorkoutMock).toHaveBeenCalledTimes(1);
    expect(updateWorkoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-workout-id',
        description: 'Updated Chest Day',
        exerciseList: expect.any(Array),
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('應該：點擊 Add Exercise 後加入一筆新運動到清單', async () => {
    const user = userEvent.setup();
    render(<UpdateWorkout />);

    await waitFor(() => {
      expect(screen.getByText('Basic Info')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Continue to Edit Workout'));

    // 初始只有一個運動
    expect(screen.getByTestId('exercise-card-Squats')).toBeInTheDocument();
    expect(
      screen.queryByTestId('exercise-card-Bench Press')
    ).not.toBeInTheDocument();

    // 新增運動
    await user.click(screen.getByText('Add Exercise'));

    // 驗證新運動已加入
    expect(screen.getByTestId('exercise-card-Bench Press')).toBeInTheDocument();

    // 儲存
    await user.click(screen.getByText('Save', { exact: false }));

    // 驗證 updateWorkout 被呼叫且包含兩種運動
    expect(updateWorkoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        exerciseList: expect.arrayContaining([
          expect.objectContaining({ exerciseName: 'Squats' }),
          expect.objectContaining({ exerciseName: 'Bench Press' }),
        ]),
      })
    );
  });
});
