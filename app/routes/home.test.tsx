import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';

import Home from './home';

import type { IWorkout } from '~/interface/workout';

// Mock SVG as React component (vite handles in app; test needs mock)
vi.mock('~/assets/google-fonts/add.svg?react', () => ({
  default: () => <svg data-testid="add-icon" />,
}));

// Mock WorkoutCard to keep Home tests focused on integration behavior
vi.mock('~/components/feature/WorkoutCard', () => ({
  default: ({ workout }: { workout: IWorkout }) => (
    <div data-testid={`workout-card-${workout.id}`}>
      <h3>{workout.description}</h3>
    </div>
  ),
}));

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  return {
    useNavigate: () => mockNavigate,
  } as unknown as typeof import('react-router');
});

// Mock LocalStorageService
const loadWorkoutsMock = vi.fn();
vi.mock('~/services/LocalStorageService', async () => {
  const actual = await vi.importActual<
    typeof import('~/services/LocalStorageService')
  >('~/services/LocalStorageService');
  return {
    ...actual,
    LocalStorageService: {
      ...actual.LocalStorageService,
      loadWorkouts: (...args: unknown[]) => loadWorkoutsMock(...args),
    },
  };
});

describe('當：Home 路由頁面', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockNavigate.mockReset();
    loadWorkoutsMock.mockReset();
  });

  const workouts: IWorkout[] = [
    {
      id: 'w1',
      date: '2025-09-20',
      description: 'Push Day',
      exerciseList: [],
    },
    {
      id: 'w2',
      date: '2025-09-20',
      description: 'Back Day',
      exerciseList: [],
    },
    {
      id: 'w3',
      date: '2025-09-21',
      description: 'Leg Day',
      exerciseList: [],
    },
  ];

  it('應該：根據日期分組顯示清單與日期標籤', () => {
    loadWorkoutsMock.mockReturnValue(workouts);

    render(<Home />);

    // Date chips
    expect(screen.getByText('2025-09-20')).toBeInTheDocument();
    expect(screen.getByText('2025-09-21')).toBeInTheDocument();

    // Cards rendered via mocked WorkoutCard
    expect(screen.getByTestId('workout-card-w1')).toBeInTheDocument();
    expect(screen.getByTestId('workout-card-w2')).toBeInTheDocument();
    expect(screen.getByTestId('workout-card-w3')).toBeInTheDocument();
  });

  it('當：點擊某項 workout，應該：導向到詳情頁', async () => {
    loadWorkoutsMock.mockReturnValue(workouts);
    const user = userEvent.setup();

    render(<Home />);

    const target = screen.getByTestId('workout-card-w2');
    await user.click(target.closest('li') ?? target);

    expect(mockNavigate).toHaveBeenCalledWith('/workout/w2');
  });

  it('當：點擊新增懸浮按鈕，應該：導向建立頁', async () => {
    loadWorkoutsMock.mockReturnValue(workouts);
    const user = userEvent.setup();

    render(<Home />);

    const fab = screen.getByTestId('add-icon');
    await user.click(fab.closest('div') ?? fab);

    expect(mockNavigate).toHaveBeenCalledWith('/workout/create');
  });
});
