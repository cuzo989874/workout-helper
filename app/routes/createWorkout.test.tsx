import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import CreateWorkout from './createWorkout';

import type { IExercise } from '~/interface/workout';

// Mock SVG icons imported with ?react
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

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
// Mock useSearchParams from react-router
const mockSearchParams = [new URLSearchParams(), vi.fn()];
vi.mock('react-router', async () => {
  return {
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockSearchParams,
  } as unknown as typeof import('react-router');
});

// Mock LocalStorageService.addWorkout
const addWorkoutMock = vi.fn();
vi.mock('~/services/LocalStorageService', async () => {
  const actual = await vi.importActual<
    typeof import('~/services/LocalStorageService')
  >('~/services/LocalStorageService');
  return {
    ...actual,
    LocalStorageService: {
      ...actual.LocalStorageService,
      addWorkout: (...args: unknown[]) => addWorkoutMock(...args),
    },
  };
});

// Mock ExerciseCard to keep DOM simple/stable
vi.mock('~/components/feature/ExerciseCard', () => ({
  default: ({ exercise }: { exercise: IExercise }) => (
    <div data-testid={`exercise-card-${exercise.exerciseName}`}>
      {exercise.exerciseName}
    </div>
  ),
}));

// Mock ExerciseFormModal to immediately submit a fake exercise when opened
vi.mock('~/components/feature/ExerciseFormModal', () => {
  return {
    default: ({
      ref,
      onSubmit,
    }: {
      ref: React.RefObject<unknown>;
      onSubmit: (exercise: IExercise) => void;
    }) => {
      // assign imperative methods to ref
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

// Mock i18n hook to return default values for expected text
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue || key,
  }),
}));

describe('當：CreateWorkout 路由頁面', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    addWorkoutMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：可由基本資訊步驟前往/返回到運動清單步驟', async () => {
    const user = userEvent.setup();

    render(<CreateWorkout />);

    // 初始顯示基本資訊
    expect(screen.getByText('Basic Info')).toBeInTheDocument();

    // 前往下一步（Exercises）
    await user.click(screen.getByText('Continue to Add Workout'));
    expect(screen.getByText('Exercises')).toBeInTheDocument();

    // 返回上一步（Basic Info）
    await user.click(screen.getByText('Prev'));
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
  });

  it('應該：儲存訓練並導向首頁（Save 按鈕）', async () => {
    const user = userEvent.setup();

    render(<CreateWorkout />);

    // 在基本資訊步驟輸入描述
    const descInput = screen.getByPlaceholderText('Workout description');
    await user.type(descInput, 'Leg day');

    // 進到第二步
    await user.click(screen.getByText('Continue to Add Workout'));

    // 點擊儲存
    await user.click(screen.getByText('Save', { exact: false }));

    expect(addWorkoutMock).toHaveBeenCalledTimes(1);
    expect(addWorkoutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        date: expect.any(String),
        description: 'Leg day',
        exerciseList: [],
        id: expect.any(String),
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('應該：點擊 Add Exercise 後加入一筆運動到清單', async () => {
    const user = userEvent.setup();

    render(<CreateWorkout />);

    // 進到第二步（Exercises）
    await user.click(screen.getByText('Continue to Add Workout'));

    // 觸發打開表單（mock 會直接提交一筆資料）
    await user.click(screen.getByText('Add Exercise'));

    // 應該已渲染一張運動卡（透過我們的 ExerciseCard mock）
    expect(screen.getByTestId('exercise-card-Bench Press')).toBeInTheDocument();
  });
});
