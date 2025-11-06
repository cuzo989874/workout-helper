import React, { useCallback } from 'react';

import FormField, { type IFormFieldRef } from './FormField';

import type { IFormFieldPropsBase } from '~/interface/form';

// 簡單選項介面（向後兼容）
interface ISelectOption {
  value: string | number;
  label: string;
}

export interface IFormSelectRef extends IFormFieldRef {}

// 主要的泛型介面
interface IFormSelectProps<
  Option = ISelectOption,
  T extends string | number = string | number,
> extends IFormFieldPropsBase {
  ref?: React.RefObject<IFormSelectRef>;
  name: string;
  placeholder?: string;
  value: T;
  options: Option[];
  valueFormatter?: (opt: Option) => T;
  labelFormatter?: (opt: Option) => string;
  onChange: (value: string) => void; // 統一輸出 string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSelectOption(obj: any): obj is ISelectOption {
  return obj && typeof obj === 'object' && 'value' in obj && 'label' in obj;
}

function FormSelect<
  Option = ISelectOption,
  T extends string | number = string | number,
>({
  id,
  name,
  className,
  value,
  label,
  placeholder,
  hint,
  error,
  errorLabel,
  options,
  valueFormatter,
  labelFormatter,
  required = false,
  disabled = false,
  validators = [],
  onChange,
  ref,
}: IFormSelectProps<Option, T>): React.ReactElement {
  const selectRef = React.useRef<HTMLSelectElement>(null);

  // 默認格式化函數，兼容簡單選項格式
  const formatValue = useCallback(
    (opt: Option): T => {
      if (valueFormatter) {
        return valueFormatter(opt);
      }
      // 如果是簡單選項格式，直接取 value
      if (isSelectOption(opt)) {
        return opt.value as T;
      }
      return opt as unknown as T;
    },
    [valueFormatter]
  );

  const formatLabel = useCallback(
    (opt: Option): string => {
      if (labelFormatter) {
        return labelFormatter(opt);
      }
      // 如果是簡單選項格式，直接取 label
      if (isSelectOption(opt)) {
        return opt.label;
      }
      return String(opt);
    },
    [labelFormatter]
  );

  return (
    <FormField
      ref={ref}
      id={id}
      className={className}
      label={label}
      value={value}
      hint={hint}
      error={error}
      errorLabel={errorLabel}
      required={required}
      validators={validators}
      checkValidity={() => selectRef.current?.checkValidity() ?? false}
      reportValidity={() => {
        if (selectRef.current) {
          selectRef.current.reportValidity();
          return true;
        }
        return false;
      }}
    >
      <select
        ref={selectRef}
        id={id || name}
        className="form-field__input"
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        onChange={e => onChange(e.target.value)}
        data-testid={`form-select-${name}`}
      >
        {placeholder && (
          <option value="" disabled={required}>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={String(formatValue(option))} value={formatValue(option)}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export default FormSelect;
export type { IFormSelectProps, ISelectOption };
