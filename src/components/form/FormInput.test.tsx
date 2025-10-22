import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import FormInput, { type IFormInputRef } from './FormInput';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('當：FormInput 組件', () => {
  const onChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('應該：正確渲染輸入欄位', () => {
    render(
      <FormInput name="test" label="測試標籤" value="" onChange={onChange} />
    );

    expect(screen.getByTestId('form-input-test')).toBeInTheDocument();
    expect(screen.getByText('測試標籤')).toBeInTheDocument();
  });

  it('應該：正確套用 props', () => {
    render(
      <FormInput
        name="test"
        label="測試標籤"
        value="test value"
        type="email"
        placeholder="請輸入"
        onChange={onChange}
      />
    );

    const input = screen.getByTestId('form-input-test');
    expect(input).toHaveAttribute('name', 'test');
    expect(input).toHaveAttribute('value', 'test value');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', '請輸入');
  });

  it('應該：正確處理 onChange 事件', () => {
    render(
      <FormInput name="test" label="測試標籤" value="" onChange={onChange} />
    );

    const input = screen.getByTestId('form-input-test');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('應該：正確顯示必填標記', () => {
    render(
      <FormInput
        id="test"
        name="test"
        label="測試標籤"
        value=""
        required
        onChange={onChange}
      />
    );
    expect(
      screen
        .getByTestId('form-field-test')
        .querySelector('.form-field__required')
    ).toBeInTheDocument();
  });

  it('應該：正確顯示提示文字', () => {
    const hint = '這是提示文字';
    render(
      <FormInput
        name="test"
        label="測試標籤"
        value=""
        hint={hint}
        onChange={onChange}
      />
    );
    expect(screen.getByText(hint)).toBeInTheDocument();
  });

  it('應該：正確顯示錯誤訊息', async () => {
    const error = '這是錯誤訊息';
    render(
      <FormInput
        name="test"
        label="測試標籤"
        value=""
        error={error}
        onChange={onChange}
      />
    );
    const ref = React.createRef<IFormInputRef>();
    render(
      <FormInput
        ref={ref as React.RefObject<IFormInputRef>}
        name="test"
        label="測試標籤"
        value=""
        error={error}
        onChange={onChange}
      />
    );
    await act(async () => {
      ref.current?.showError();
    });
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('應該：正確處理禁用狀態', () => {
    render(
      <FormInput
        name="test"
        label="測試標籤"
        value=""
        disabled
        onChange={onChange}
      />
    );

    const input = screen.getByTestId('form-input-test');
    expect(input).toBeDisabled();
  });

  it('應該：正確處理數字類型輸入', () => {
    render(
      <FormInput
        name="test"
        label="測試標籤"
        value={0}
        type="number"
        min={0}
        max={100}
        onChange={onChange}
      />
    );

    const input = screen.getByTestId('form-input-test');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  describe('當：使用 ref 時', () => {
    it('應該：正確暴露 checkValidity 方法', () => {
      const ref = React.createRef<IFormInputRef>();
      const mockCheckValidity = vi.fn().mockReturnValue(true);

      render(
        <FormInput
          ref={ref as React.RefObject<IFormInputRef>}
          name="test"
          label="測試標籤"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByTestId('form-input-test') as HTMLInputElement;
      Object.defineProperty(input, 'checkValidity', {
        value: mockCheckValidity,
      });

      const result = ref.current?.checkValidity();
      expect(result).toBe(true);
      expect(mockCheckValidity).toHaveBeenCalled();
    });

    it('應該：正確暴露 reportValidity 方法', () => {
      const ref = React.createRef<IFormInputRef>();
      const mockReportValidity = vi.fn().mockReturnValue(true);

      render(
        <FormInput
          ref={ref as React.RefObject<IFormInputRef>}
          name="test"
          label="測試標籤"
          value=""
          onChange={onChange}
        />
      );

      const input = screen.getByTestId('form-input-test') as HTMLInputElement;
      Object.defineProperty(input, 'reportValidity', {
        value: mockReportValidity,
      });

      const result = ref.current?.reportValidity();
      expect(result).toBe(true);
      expect(mockReportValidity).toHaveBeenCalled();
    });

    it('應該：正確處理驗證器', () => {
      const ref = React.createRef<IFormInputRef>();
      const mockValidator = vi.fn().mockReturnValue({ isValid: true });

      render(
        <FormInput
          ref={ref as React.RefObject<IFormInputRef>}
          name="test"
          label="測試標籤"
          value="test"
          onChange={onChange}
          validators={[mockValidator]}
        />
      );

      ref.current?.validate();
      expect(mockValidator).toHaveBeenCalledWith('test');
    });

    it('應該：正確處理驗證錯誤', async () => {
      const ref = React.createRef<IFormInputRef>();
      const mockValidator = vi.fn().mockReturnValue(false);

      render(
        <FormInput
          ref={ref as React.RefObject<IFormInputRef>}
          name="test"
          label="測試標籤"
          value="test"
          onChange={onChange}
          validators={[mockValidator]}
        />
      );

      await act(async () => {
        ref.current?.validate();
        ref.current?.showError();
      });

      expect(mockValidator).toHaveBeenCalledWith('test');
      expect(screen.getByText('validation.unknown')).toBeInTheDocument();
    });
  });
});
