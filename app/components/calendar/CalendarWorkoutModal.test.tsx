import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';

import CalendarWorkoutModal from './CalendarWorkoutModal';
import type { IWorkout } from '~/interface/workout';

// Mock SCSS module
vi.mock('./CalendarWorkoutModal.module.scss', () => ({
  default: {
    'modal-overlay': 'modal-overlay',
    'modal-content': 'modal-content',
    'modal-header': 'modal-header',
    'modal-body': 'modal-body',
    'no-workouts-message': 'no-workouts-message',
    'workout-list': 'workout-list',
    'workout-item': 'workout-item',
    'modal-footer': 'modal-footer',
  },
}));

// Mock icons
vi.mock('~/assets/google-fonts/close.svg?react', () => ({
  default: () => <svg data-testid="close-icon" />,
}));
vi.mock('~/assets/google-fonts/add.svg?react', () => ({
  default: () => <svg data-testid="add-icon" />,
}));

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  return {
    useNavigate: () => mockNavigate,
  } as unknown as typeof import('react-router');
});

// Mock WorkoutCard to keep test lightweight
vi.mock('~/components/feature/WorkoutCard', () => ({
  default: ({ workout }: { workout: IWorkout }) => (
    <div data-testid={`workout-card-${workout.id}`}>{workout.description}</div>
  ),
}));

describe('CalendarWorkoutModal', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  const sampleWorkouts: IWorkout[] = [
    {
      id: 'w1',
      date: '2025-10-15',
      description: 'Workout 1',
      exerciseList: [],
    },
    {
      id: 'w2',
      date: '2025-10-15',
      description: 'Workout 2',
      exerciseList: [],
    },
  ];

  it('returns null when not open', () => {
    const { container } = render(
      <CalendarWorkoutModal
        isOpen={false}
        selectedDate={'2025-10-15'}
        workouts={sampleWorkouts}
        onClose={() => {}}
        onCreateWorkout={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when selectedDate is null', () => {
    const { container } = render(
      <CalendarWorkoutModal
        isOpen={true}
        selectedDate={null}
        workouts={sampleWorkouts}
        onClose={() => {}}
        onCreateWorkout={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders formatted date and handles close actions', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <CalendarWorkoutModal
        isOpen={true}
        selectedDate={'2025-10-15'}
        workouts={[]}
        onClose={onClose}
        onCreateWorkout={() => {}}
      />
    );

    // formatted date per en-US
    expect(
      screen.getByRole('heading', { name: 'October 15, 2025' })
    ).toBeInTheDocument();

    // clicking content should not close (event.stopPropagation)
    await user.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();

    // clicking the overlay should close
    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);

    // re-render fresh instance (avoid duplicates)
    rerender(
      <CalendarWorkoutModal
        isOpen={true}
        selectedDate={'2025-10-15'}
        workouts={[]}
        onClose={onClose}
        onCreateWorkout={() => {}}
      />
    );
    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    await user.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('shows empty message when no workouts, and renders list when provided', () => {
    const { rerender } = render(
      <CalendarWorkoutModal
        isOpen={true}
        selectedDate={'2025-10-15'}
        workouts={[]}
        onClose={() => {}}
        onCreateWorkout={() => {}}
      />
    );
    expect(screen.getByText('No workouts on this date.')).toBeInTheDocument();

    rerender(
      <CalendarWorkoutModal
        isOpen={true}
        selectedDate={'2025-10-15'}
        workouts={sampleWorkouts}
        onClose={() => {}}
        onCreateWorkout={() => {}}
      />
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByTestId('workout-card-w1')).toBeInTheDocument();
  });

  it('navigates to workout detail when clicking a workout item', async () => {
    const user = userEvent.setup();

    render(
      <CalendarWorkoutModal
        isOpen={true}
        selectedDate={'2025-10-15'}
        workouts={sampleWorkouts}
        onClose={() => {}}
        onCreateWorkout={() => {}}
      />
    );

    const firstItem = screen.getAllByRole('listitem')[0];
    await user.click(firstItem);
    expect(mockNavigate).toHaveBeenCalledWith('/workout/w1');
  });

  it('invokes onCreateWorkout when clicking Create Workout button', async () => {
    const user = userEvent.setup();
    const onCreateWorkout = vi.fn();

    render(
      <CalendarWorkoutModal
        isOpen={true}
        selectedDate={'2025-10-15'}
        workouts={[]}
        onClose={() => {}}
        onCreateWorkout={onCreateWorkout}
      />
    );

    await user.click(screen.getByRole('button', { name: /Create Workout/i }));
    expect(onCreateWorkout).toHaveBeenCalledTimes(1);
  });
});
