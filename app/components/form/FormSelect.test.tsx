import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import FormSelect, { type IFormSelectRef } from './FormSelect';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('當：FormSelect 組件', () => {
  const mockOnChange = vi.fn();
  const simpleOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];
  const stringOptions = ['Apple', 'Banana', 'Cherry'];
  const numberOptions = [1, 2, 3, 4, 5];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('應該：正確渲染基本組件', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('應該：正確顯示簡單選項', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    // 由於組件會自動選擇第一個選項，所以值不會是空的
    expect(select).toHaveValue('apple');
    expect(select.children.length).toBe(3); // 3個選項
  });

  it('應該：正確顯示字串選項', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={stringOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    // 由於組件會自動選擇第一個選項，所以值不會是空的
    expect(select).toHaveValue('Apple');
    expect(select.children.length).toBe(3); // 3個選項
  });

  it('應該：正確顯示數字選項', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value={1}
        options={numberOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('1');
    expect(select.children.length).toBe(5); // 5個選項
  });

  it('應該：正確處理選項變化', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'banana' } });

    expect(mockOnChange).toHaveBeenCalledWith('banana');
  });

  it('應該：正確顯示選中的值', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value="banana"
        options={simpleOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('banana');
  });

  it('應該：正確處理禁用狀態', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('應該：正確處理必填屬性', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
        required={true}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
  });

  it('應該：正確處理 placeholder', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
        placeholder="請選擇選項"
      />
    );

    expect(screen.getByText('請選擇選項')).toBeInTheDocument();
  });

  it('應該：正確處理必填 placeholder', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
        placeholder="請選擇選項"
        required={true}
      />
    );

    expect(screen.getByText('請選擇選項')).toBeInTheDocument();
  });

  it('應該：正確處理 hint', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
        hint="這是提示文字"
      />
    );

    expect(screen.getByText('這是提示文字')).toBeInTheDocument();
  });

  it('應該：正確處理錯誤訊息', async () => {
    const ref = React.createRef<IFormSelectRef>();
    render(
      <FormSelect
        ref={ref as React.RefObject<IFormSelectRef>}
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
        error="這是錯誤訊息"
      />
    );

    ref.current?.showError();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(screen.getByText('這是錯誤訊息')).toBeInTheDocument();
  });

  it('應該：正確處理複雜選項格式', () => {
    const complexOptions = [
      { id: 1, name: 'Apple Fruit' },
      { id: 2, name: 'Banana Fruit' },
      { id: 3, name: 'Cherry Fruit' },
    ];

    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={complexOptions}
        onChange={mockOnChange}
        valueFormatter={(opt: { id: number; name: string }) =>
          opt.id.toString()
        }
        labelFormatter={(opt: { id: number; name: string }) => opt.name}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('1');
    expect(select.children.length).toBe(3);
  });

  it('應該：正確處理 id 和 name 屬性', () => {
    render(
      <FormSelect
        id="test-id"
        name="test-name"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'test-id');
    expect(select).toHaveAttribute('name', 'test-name');
  });

  it('應該：正確處理 className', () => {
    render(
      <FormSelect
        id="test-id"
        name="test"
        label="Test Label"
        value=""
        options={simpleOptions}
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    expect(screen.getByTestId('form-field-test-id')).toBeInTheDocument();
  });

  it('應該：正確處理空選項', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value=""
        options={[]}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select.children.length).toBe(0);
  });

  it('應該：正確處理預設選中值', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value="banana"
        options={simpleOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('banana');
  });

  it('應該：正確處理數字選項的選中值', () => {
    render(
      <FormSelect
        name="test"
        label="Test Label"
        value={2}
        options={numberOptions}
        onChange={mockOnChange}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('2');
  });

  describe('當：使用 ref 時', () => {
    it('應該：正確暴露 checkValidity 方法', () => {
      const ref = React.createRef<IFormSelectRef>();
      const mockCheckValidity = vi.fn().mockReturnValue(true);

      render(
        <FormSelect
          ref={ref as React.RefObject<IFormSelectRef>}
          name="test"
          label="Test Label"
          value=""
          options={simpleOptions}
          onChange={mockOnChange}
        />
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      Object.defineProperty(select, 'checkValidity', {
        value: mockCheckValidity,
      });

      const result = ref.current?.checkValidity();
      expect(result).toBe(true);
      expect(mockCheckValidity).toHaveBeenCalled();
    });

    it('應該：正確暴露 reportValidity 方法', () => {
      const ref = React.createRef<IFormSelectRef>();
      const mockReportValidity = vi.fn().mockReturnValue(true);

      render(
        <FormSelect
          ref={ref as React.RefObject<IFormSelectRef>}
          name="test"
          label="Test Label"
          value=""
          options={simpleOptions}
          onChange={mockOnChange}
        />
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      Object.defineProperty(select, 'reportValidity', {
        value: mockReportValidity,
      });

      const result = ref.current?.reportValidity();
      expect(result).toBe(true);
      expect(mockReportValidity).toHaveBeenCalled();
    });

    it('應該：正確處理驗證器', () => {
      const ref = React.createRef<IFormSelectRef>();
      const mockValidator = vi.fn().mockReturnValue({ isValid: true });

      render(
        <FormSelect
          ref={ref as React.RefObject<IFormSelectRef>}
          name="test"
          label="Test Label"
          value="test"
          options={simpleOptions}
          onChange={mockOnChange}
          validators={[mockValidator]}
        />
      );

      ref.current?.validate();
      expect(mockValidator).toHaveBeenCalledWith('test');
    });

    it('應該：正確處理驗證錯誤', async () => {
      const ref = React.createRef<IFormSelectRef>();
      const mockValidator = vi.fn(() => false);

      render(
        <FormSelect
          ref={ref as React.RefObject<IFormSelectRef>}
          name="test"
          label="Test Label"
          value="test"
          options={simpleOptions}
          onChange={mockOnChange}
          validators={[mockValidator]}
        />
      );

      ref.current?.validate();
      ref.current?.showError();

      expect(mockValidator).toHaveBeenCalled();
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(ref.current?.error).toBe('validation.unknown');
    });
  });
});
