import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import FormSwitch from './FormSwitch';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('當：FormSwitch 組件', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：正確渲染基礎結構與可及性屬性', () => {
    render(
      <FormSwitch
        id="notify"
        name="notify"
        label="是否通知"
        checked={false}
        onChange={onChange}
      />
    );

    const switchRoot = screen.getByTestId('form-switch-notify');
    expect(switchRoot).toBeInTheDocument();
    expect(switchRoot).toHaveAttribute('role', 'switch');
    expect(switchRoot).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText('是否通知')).toBeInTheDocument();
  });

  it('應該：點擊能切換狀態並呼叫 onChange', () => {
    render(
      <FormSwitch
        id="notify"
        name="notify"
        label="是否通知"
        checked={false}
        onChange={onChange}
      />
    );

    const switchRoot = screen.getByTestId('form-switch-notify');
    fireEvent.click(switchRoot);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('應該：支援鍵盤操作 (Space/Enter) 切換', () => {
    render(
      <FormSwitch
        id="notify"
        name="notify"
        label="是否通知"
        checked={false}
        onChange={onChange}
      />
    );

    const switchRoot = screen.getByTestId('form-switch-notify');
    fireEvent.keyDown(switchRoot, { key: 'Enter' });
    fireEvent.keyDown(switchRoot, { key: ' ' });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('應該：disabled 時不可互動', () => {
    render(
      <FormSwitch
        id="notify"
        name="notify"
        label="是否通知"
        checked={false}
        disabled
        onChange={onChange}
      />
    );

    const switchRoot = screen.getByTestId('form-switch-notify');
    expect(switchRoot).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(switchRoot);
    expect(onChange).not.toHaveBeenCalled();
  });
});
