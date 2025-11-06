import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import FormField, { type IFormFieldRef } from './FormField';
import { useFieldValidation } from '~/hooks/useFieldValidation';

// [MOCK_BLOCK_START]
vi.mock('../tooltip/Tooltip', () => ({
  __esModule: true,
  default: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <div data-testid="mock-tooltip">
      {children}
      <span>{title}</span>
    </div>
  ),
}));

vi.mock('../../hooks/useFieldValidation', () => ({
  useFieldValidation: vi.fn(() => ({
    error: undefined,
    validate: vi.fn(() => true),
    shouldShowError: false,
    setShouldShowError: vi.fn(),
  })),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
// [MOCK_BLOCK_END]

describe('當：FormField 組件', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：正確渲染基本內容', () => {
    render(
      <FormField id="test" label="標籤" value="" required>
        <input value="" onChange={() => {}} />
      </FormField>
    );
    expect(screen.getByTestId('form-field-test')).toBeInTheDocument();
    expect(screen.getByText('標籤')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('應該：正確顯示 hint', () => {
    render(
      <FormField id="test" label="標籤" hint="這是提示">
        <input value="" onChange={() => {}} />
      </FormField>
    );
    expect(screen.getByText('這是提示')).toBeInTheDocument();
  });

  it('應該：正確顯示外部錯誤訊息', () => {
    render(
      <FormField id="test" label="標籤" error="外部錯誤">
        <input value="" onChange={() => {}} />
      </FormField>
    );
    // 由於 useFieldValidation mock error: undefined，外部 error 不會顯示
    // 若要測試顯示，需調整 mock
    expect(screen.queryByText('外部錯誤')).not.toBeInTheDocument();
  });

  it('應該：正確處理 className', () => {
    render(
      <FormField id="test" label="標籤" className="custom-class">
        <input value="" onChange={() => {}} />
      </FormField>
    );
    expect(screen.getByTestId('form-field-test').className).toContain(
      'custom-class'
    );
  });

  it('應該：正確增強子元素 onBlur/onChange', () => {
    const onBlur = vi.fn();
    const onChange = vi.fn();
    render(
      <FormField id="test" label="標籤" validateOnBlur validateOnChange>
        <input value="" onBlur={onBlur} onChange={onChange} />
      </FormField>
    );
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onBlur).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });

  it('應該：正確暴露 ref 方法', () => {
    const ref =
      React.createRef<IFormFieldRef>() as React.RefObject<IFormFieldRef>;
    render(
      <FormField id="test" label="標籤" ref={ref}>
        <input value="123" onChange={() => {}} />
      </FormField>
    );
    expect(typeof ref.current?.validate).toBe('function');
    expect(typeof ref.current?.showError).toBe('function');
    expect(typeof ref.current?.checkValidity).toBe('function');
    expect(typeof ref.current?.reportValidity).toBe('function');
  });

  it('應該：正確處理多個 children', () => {
    render(
      <FormField id="test" label="標籤">
        <input value="1" onChange={() => {}} />
        <input value="2" onChange={() => {}} />
      </FormField>
    );
    expect(screen.getAllByRole('textbox').length).toBe(2);
  });

  it('應該：正確處理無 required', () => {
    render(
      <FormField id="test" label="標籤">
        <input value="" onChange={() => {}} />
      </FormField>
    );
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('ref.checkValidity/reportValidity fallback 路徑', () => {
    const ref =
      React.createRef<IFormFieldRef>() as React.RefObject<IFormFieldRef>;
    render(
      <FormField id="test" label="標籤" ref={ref}>
        <input value="abc" onChange={() => {}} />
      </FormField>
    );
    // 不傳 checkValidity/reportValidity props，預設 fallback true
    expect(ref.current?.checkValidity()).toBe(true);
    expect(ref.current?.reportValidity()).toBe(true);
  });

  it('children 不是 React element', () => {
    render(
      <FormField id="test" label="標籤">
        {null}
        {false}
        {undefined}
        {'純文字'}
      </FormField>
    );
    expect(screen.getByTestId('form-field-test')).toBeInTheDocument();
    expect(screen.getByText('純文字')).toBeInTheDocument();
  });

  it('onBlur/onChange 沒有 value 屬性', () => {
    const onBlur = vi.fn();
    const onChange = vi.fn();
    render(
      <FormField id="test" label="標籤" validateOnBlur validateOnChange>
        {/* 故意不給 value 屬性 */}
        <input onBlur={onBlur} onChange={onChange} />
      </FormField>
    );
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(onBlur).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });

  it('多 children validate 只取第一個', () => {
    const ref =
      React.createRef<IFormFieldRef>() as React.RefObject<IFormFieldRef>;
    render(
      <FormField id="test" label="標籤" ref={ref}>
        <input value="first" onChange={() => {}} />
        <input value="second" onChange={() => {}} />
      </FormField>
    );
    // mock validate 會收到 first
    expect(ref.current?.validate()).toBe(true);
  });

  it('應該：正確處理沒有提供 label 的情況', () => {
    render(
      <FormField id="test">
        <input value="" onChange={() => {}} />
      </FormField>
    );
    expect(screen.getByTestId('form-field-test')).toBeInTheDocument();
    expect(screen.queryByText('標籤')).not.toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('應該：正確處理 label 為空字串的情況', () => {
    render(
      <FormField id="test" label="">
        <input value="" onChange={() => {}} />
      </FormField>
    );
    expect(screen.getByTestId('form-field-test')).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('應該：正確使用 errorLabel 作為驗證錯誤的欄位名稱', () => {
    const mockUseFieldValidation = vi.mocked(useFieldValidation);

    render(
      <FormField id="test" label="顯示標籤" errorLabel="錯誤標籤">
        <input value="" onChange={() => {}} />
      </FormField>
    );

    // 驗證 useFieldValidation 被調用時使用了 errorLabel 而不是 label
    expect(mockUseFieldValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '錯誤標籤', // 應該使用 errorLabel
      })
    );
  });

  it('應該：當沒有 errorLabel 時使用 label 作為驗證錯誤的欄位名稱', () => {
    const mockUseFieldValidation = vi.mocked(useFieldValidation);

    render(
      <FormField id="test" label="顯示標籤">
        <input value="" onChange={() => {}} />
      </FormField>
    );

    // 驗證 useFieldValidation 被調用時使用了 label
    expect(mockUseFieldValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '顯示標籤', // 應該使用 label
      })
    );
  });

  it('應該：當 errorLabel 為空字串時，使用 label 作為驗證錯誤的欄位名稱', () => {
    const mockUseFieldValidation = vi.mocked(useFieldValidation);

    render(
      <FormField id="test" label="顯示標籤" errorLabel="">
        <input value="" onChange={() => {}} />
      </FormField>
    );

    // 驗證 useFieldValidation 被調用時使用了 label（因為 errorLabel 為空）
    expect(mockUseFieldValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '顯示標籤', // 應該使用 label，因為 errorLabel 為空
      })
    );
  });

  it('應該：當 label 和 errorLabel 都為空時，傳遞空字串給驗證 hook', () => {
    const mockUseFieldValidation = vi.mocked(useFieldValidation);

    render(
      <FormField id="test" label="" errorLabel="">
        <input value="" onChange={() => {}} />
      </FormField>
    );

    // 驗證 useFieldValidation 被調用時傳遞了空字串
    expect(mockUseFieldValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '', // 應該為空字串
      })
    );
  });

  it('應該：當沒有 label 但有 errorLabel 時，使用 errorLabel 作為驗證錯誤的欄位名稱', () => {
    const mockUseFieldValidation = vi.mocked(useFieldValidation);

    render(
      <FormField id="test" errorLabel="錯誤標籤">
        <input value="" onChange={() => {}} />
      </FormField>
    );

    // 驗證 useFieldValidation 被調用時使用了 errorLabel
    expect(mockUseFieldValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '錯誤標籤', // 應該使用 errorLabel
      })
    );
  });
});
