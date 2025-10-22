import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';

import SubPageHeader from './SubPageHeader';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock SVG icon
vi.mock('~/assets/google-fonts/chevron_left.svg?react', () => ({
  default: () => <svg data-testid="chevron-left" />,
}));

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  return {
    useNavigate: () => mockNavigate,
  } as unknown as typeof import('react-router');
});

describe('當：SubPageHeader 組件', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  it('當：history 長度大於 1，點擊返回，應該：navigate(-1)', async () => {
    const user = userEvent.setup();
    // Simulate navigate function having length > 1
    (mockNavigate as unknown as { length: number }).length = 2;

    render(<SubPageHeader />);

    const backBtn = screen.getByRole('button');
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('當：history 長度不大於 1，點擊返回，應該：navigate("/")', async () => {
    const user = userEvent.setup();
    (mockNavigate as unknown as { length: number }).length = 1;

    render(<SubPageHeader />);

    const backBtn = screen.getByRole('button');
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
