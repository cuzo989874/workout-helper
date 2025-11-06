import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import WorkoutCard from './WorkoutCard';
import type { IWorkout } from '~/interface/workout';

// Mock SVG as React component (handled by vite in-app, but mock for tests)
vi.mock('~/assets/google-fonts/edit_square.svg?react', () => ({
  default: () => <svg data-testid="edit-icon" />,
}));

// Mock child component to isolate WorkoutCard behavior and simplify assertions
vi.mock('./ExerciseCard', () => ({
  default: ({ exercise }: { exercise: { exerciseName: string } }) => (
    <div data-testid="exercise-card">{`Exercise: ${exercise.exerciseName}`}</div>
  ),
}));

describe('當：WorkoutCard 組件', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const baseWorkout: IWorkout = {
    id: 'w1',
    date: '2025-09-20',
    description: 'Upper Body Workout',
    exerciseList: [
      {
        exerciseTime: '10:00',
        exerciseName: 'Bench Press',
        category: 'Strength',
        notes: 'Chest day',
        setSettingList: [{ weightLifted: 60, sets: 3, reps: 8 }],
      },
      {
        exerciseTime: '10:20',
        exerciseName: 'Pull Up',
        category: 'Strength',
        setSettingList: [{ sets: 3, reps: 10 }],
      },
    ],
  };

  it('應該：顯示訓練描述為標題並渲染編輯按鈕與圖示', () => {
    const { container } = render(<WorkoutCard workout={baseWorkout} />);

    // Card wrapper exists
    expect(container.querySelector('.card')).toBeInTheDocument();

    // Header title (h3)
    expect(
      screen.getByRole('heading', { level: 3, name: 'Upper Body Workout' })
    ).toBeInTheDocument();

    // Edit button and icon
    const editButton = screen.getByRole('button');
    expect(editButton).toHaveClass('btn');
    expect(editButton).toHaveClass('icon-btn');
    expect(editButton).toHaveClass('icon-btn--primary');
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('應該：為每個 exercise 渲染一個清單項並傳遞正確資料', () => {
    const { container } = render(<WorkoutCard workout={baseWorkout} />);

    // Top-level list items count equals exerciseList length
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    const topLevelItems = list ? list.querySelectorAll(':scope > li') : [];
    expect(topLevelItems.length).toBe(baseWorkout.exerciseList.length);

    // Child component receives props (assert via rendered text)
    expect(screen.getAllByTestId('exercise-card')).toHaveLength(
      baseWorkout.exerciseList.length
    );
    expect(screen.getByText('Exercise: Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Exercise: Pull Up')).toBeInTheDocument();
  });
});
