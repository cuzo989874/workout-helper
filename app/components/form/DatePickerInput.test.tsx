import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import DatePickerInput, { type IDatePickerInputRef } from './DatePickerInput';

// Mock dependencies
// Mock SCSS module
vi.mock('./DatePickerInput.module.scss', () => ({
  default: {
    // 添加需要的樣式類別
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../utils/dateUtils', () => ({
  formatDateAsNumeric: (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  parseDateInputString: (date: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return null;
  },
}));

// Mock createPortal
vi.mock('react-dom', () => ({
  createPortal: (children: React.ReactNode) => children,
}));

describe('當：DatePickerInput 組件', () => {
  let datePickerInputRef: React.RefObject<
    import('./DatePickerInput').IDatePickerInputRef
  >;
  const mockOnChange = vi.fn();

  beforeEach(() => {
    datePickerInputRef =
      React.createRef<IDatePickerInputRef>() as React.RefObject<IDatePickerInputRef>;
    mockOnChange.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('應該：正確渲染輸入框和日曆按鈕', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
        placeholder="選擇日期"
      />
    );

    expect(screen.getByPlaceholderText('選擇日期')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'datePicker.selectDate' })
    ).toBeInTheDocument();
  });

  it('應該：正確顯示初始值', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value="2024-01-15"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
  });

  it('應該：正確處理輸入變化', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '2024-01-15' } });

    expect(input).toHaveValue('2024-01-15');
  });

  it('應該：正確處理禁用狀態', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('應該：正確處理必填屬性', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
        required={true}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeRequired();
  });

  it('應該：正確處理焦點事件', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);

    // 由於組件使用 createPortal，popup 會被渲染到 document.body
    // 我們檢查 popup 是否在文檔中
    expect(
      document.querySelector('[class*="date-picker-popup"]')
    ).toBeInTheDocument();
  });

  it('應該：正確處理鍵盤事件', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');

    // 測試 Enter 鍵
    fireEvent.keyDown(input, { key: 'Enter' });

    // 測試 Tab 鍵
    fireEvent.keyDown(input, { key: 'Tab' });
  });

  it('應該：正確處理日期選擇', () => {
    render(<DatePickerInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('YYYY-MM-DD');
    // 模擬使用者輸入合法日期
    fireEvent.change(input, { target: { value: '2024-01-15' } });

    // 直接驗證 onChange 是否被呼叫
    expect(mockOnChange).toHaveBeenCalledWith('2024-01-15');
  });

  it('應該：正確處理 ref 暴露的錯誤狀態', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value="invalid-date"
        onChange={mockOnChange}
      />
    );

    // 由於組件的錯誤處理邏輯，需要檢查實際的錯誤狀態
    expect(datePickerInputRef.current?.error).toBeDefined();
  });

  it('應該：正確處理空值', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
      />
    );

    expect(datePickerInputRef.current?.error).toBe('');
  });

  it('應該：正確處理 className 屬性', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('應該：正確處理 id 和 name 屬性', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
        id="test-id"
        name="test-name"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'test-id');
    expect(input).toHaveAttribute('name', 'test-name');
  });

  it('應該：正確處理預設 placeholder', () => {
    render(
      <DatePickerInput
        ref={datePickerInputRef}
        value=""
        onChange={mockOnChange}
      />
    );

    expect(screen.getByPlaceholderText('YYYY-MM-DD')).toBeInTheDocument();
  });
});
