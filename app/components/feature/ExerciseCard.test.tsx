import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';

import ExerciseCard from './ExerciseCard';
import type { IExercise } from '~/interface/workout';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock SVG icons used in the component
vi.mock('~/assets/google-fonts/edit_square.svg?react', () => ({
  default: () => <svg data-testid="edit-icon" />,
}));
vi.mock('~/assets/google-fonts/delete.svg?react', () => ({
  default: () => <svg data-testid="delete-icon" />,
}));

describe('當：ExerciseCard 組件', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const baseExercise: IExercise = {
    exerciseTime: '10:00',
    exerciseName: 'Bench Press',
    category: 'Strength',
    notes: 'Top-level exercise notes',
    setSettingList: [
      // Full detail set
      {
        weightLifted: 50,
        distance: 200,
        sets: 3,
        reps: 8,
        time: 30,
        restTime: 60,
        notes: 'First set note',
      },
      // Partial detail set
      {
        reps: 12,
      },
      // Empty set should be skipped
      {},
    ],
  };

  it('應該：正確渲染標題、備註與組數細節，並跳過空的 set', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <ExerciseCard
        exercise={baseExercise}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Header title
    expect(
      screen.getByRole('heading', { level: 4, name: 'Bench Press' })
    ).toBeInTheDocument();

    // Top-level notes
    expect(screen.getByText('Top-level exercise notes')).toBeInTheDocument();

    // Set 1 details
    expect(screen.getByText('50 kg')).toBeInTheDocument();
    expect(screen.getByText('200 m')).toBeInTheDocument();
    // Hyphen separating weight/distance and sets×reps
    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
    // Sets × Reps uses i18n keys
    expect(
      screen.getByText('3 exercise.set.sets × 8 exercise.set.reps')
    ).toBeInTheDocument();
    // Time and restTime use i18n keys
    expect(
      screen.getByText('exercise.set.time: 30 common.secondsShort')
    ).toBeInTheDocument();
    expect(
      screen.getByText('exercise.set.restTime: 60 common.secondsShort')
    ).toBeInTheDocument();
    // Set-level note
    expect(screen.getByText('First set note')).toBeInTheDocument();

    // Set 2 details (only reps)
    expect(screen.getByText('12 exercise.set.reps')).toBeInTheDocument();

    // Empty set should be skipped → only 2 list items should be rendered
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(2);

    // Icons rendered
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('當：點擊編輯與刪除，應該：呼叫對應回呼', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <ExerciseCard
        exercise={baseExercise}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    const buttons = screen.getAllByRole('button');
    // First button is edit, second is delete
    await user.click(buttons[0]);
    await user.click(buttons[1]);

    expect(onEdit).toHaveBeenCalledWith(baseExercise);
    expect(onDelete).toHaveBeenCalledWith(baseExercise);
  });
});
