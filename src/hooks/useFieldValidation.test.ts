import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFieldValidation } from './useFieldValidation';
import { Validator } from '~/utils/validators';

describe('useFieldValidation', () => {
  const mockTranslate = vi.fn((key, params) => {
    if (key === 'validation.required') return `${params?.label} 必填`;
    if (key === 'validation.custom') return '自定義錯誤';
    return key;
  });

  it('should return required error when value is empty', () => {
    const { result } = renderHook(() =>
      useFieldValidation({
        label: '姓名',
        validators: [Validator.required],
        translate: mockTranslate,
      })
    );
    act(() => {
      result.current.validate('');
    });
    expect(result.current.error).toBe('姓名 必填');
  });

  it('should return custom validator error', () => {
    // custom validator returns false to trigger error
    const customValidator = () => false;
    const { result } = renderHook(() =>
      useFieldValidation({
        validators: [customValidator],
        translate: key => (key === 'validation.unknown' ? '自定義錯誤' : key),
      })
    );
    act(() => {
      result.current.validate('abc');
    });
    expect(result.current.error).toBe('自定義錯誤');
  });

  it('should clear error when value is valid', () => {
    const { result, rerender } = renderHook(
      () =>
        useFieldValidation({
          label: '姓名',
          validators: [Validator.required],
          translate: mockTranslate,
        }),
      { initialProps: { value: '' } }
    );
    act(() => {
      result.current.validate('');
    });
    expect(result.current.error).toBe('姓名 必填');
    rerender({ value: 'John' });
    act(() => {
      result.current.validate('John');
    });
    expect(result.current.error).toBeUndefined();
  });

  it('should set and clear shouldShowError', () => {
    const { result } = renderHook(() =>
      useFieldValidation({
        label: '姓名',
        validators: [Validator.required],
        translate: mockTranslate,
      })
    );
    act(() => {
      result.current.setShouldShowError(true);
    });
    expect(result.current.shouldShowError).toBe(true);
    act(() => {
      result.current.setShouldShowError(false);
    });
    expect(result.current.shouldShowError).toBe(false);
  });
});
