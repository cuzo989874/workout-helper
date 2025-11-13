import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import Header from './Header';

// Mock i18n (not used directly here but keep consistency)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
let mockPathname = '/';
vi.mock('react-router-dom', async () => {
  return {
    useLocation: () => ({ pathname: mockPathname }),
    useNavigate: () => mockNavigate,
  };
});

// mock CalendarIcon
vi.mock('~/assets/google-fonts/calendar_month.svg?react', () => ({
  default: () => <svg data-testid="calendar-icon" />,
}));

// mock SettingsIcon
vi.mock('~/assets/google-fonts/settings.svg?react', () => ({
  default: () => <svg data-testid="settings-icon" />,
}));

// mock scss module
vi.mock('./Header.module.scss', () => ({
  default: {
    header: 'header',
    'header-actions': 'header-actions',
    'view-toggle-btn': 'view-toggle-btn',
    'icon-active': 'icon-active',
  },
}));

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
    mockPathname = '/';
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
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
    mockPathname = '/any';
    Object.defineProperty(window, 'location', {
      value: { pathname: '/any' },
      writable: true,
    });

    render(<Header />);

    const logo = screen.getByLabelText('Logo');
    await user.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('在首頁時顯示日曆圖標，應該：點擊後導向到 /calendar', async () => {
    const user = userEvent.setup();
    mockPathname = '/';
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true,
    });

    render(<Header />);

    const toggleButton = screen.getByLabelText('Switch to calendar view');
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);

    expect(mockNavigate).toHaveBeenCalledWith('/calendar');
  });

  it('在日曆頁面時顯示日曆圖標（active狀態），應該：點擊後導向到首頁', async () => {
    const user = userEvent.setup();
    mockPathname = '/calendar';
    Object.defineProperty(window, 'location', {
      value: { pathname: '/calendar' },
      writable: true,
    });

    render(<Header />);

    const toggleButton = screen.getByLabelText('Switch to list view');
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('應該：正確渲染日曆圖標', () => {
    mockPathname = '/';

    render(<Header />);

    const calendarIcon = screen.getByTestId('calendar-icon');
    expect(calendarIcon).toBeInTheDocument();
  });
});
