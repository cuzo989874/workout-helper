import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import Header from './Header';

// Mock i18n (not used directly here but keep consistency)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock useNavigate from react-router
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  return {
    useNavigate: () => mockNavigate,
  } as unknown as typeof import('react-router');
});

describe('當：Header 組件', () => {
  beforeEach(() => {
    // Ensure a scrollTo mock exists on documentElement
    Object.defineProperty(document.documentElement, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    mockNavigate.mockReset();
  });

  it('在首頁時點擊 Logo，應該：滾動到頂部而非導航', async () => {
    const user = userEvent.setup();
    // Simulate on home page
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
    });

    render(<Header />);

    const logo = screen.getByLabelText('Logo');
    await user.click(logo);

    expect(document.documentElement.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('不在首頁時點擊 Logo，應該：導向到根路由 /', async () => {
    const user = userEvent.setup();
    // Simulate on other page
    Object.defineProperty(window, 'location', {
      value: { pathname: '/any' },
    });

    render(<Header />);

    const logo = screen.getByLabelText('Logo');
    await user.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
