import React, { useRef } from 'react';

import FormField, { type IFormFieldRef } from './FormField';

import DatePickerInput, { type IDatePickerInputRef } from './DatePickerInput';

export interface IFormDatePickerRef extends IFormFieldRef {}

interface IFormDatePickerProps {
  id?: string;
  ref?: React.Ref<IFormDatePickerRef>;
  name: string;
  className?: string;
  label: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  disabledDates?: Date[];
  allowedDates?: Date[];
  onChange: (value: string) => void;
}

const FormDatePicker: React.FC<IFormDatePickerProps> = ({
  id,
  name,
  ref,
  className,
  label,
  placeholder,
  hint,
  error,
  value,
  required = false,
  disabled = false,
  disabledDates = [],
  allowedDates = [],
  onChange,
}) => {
  const datePickerInputRef = useRef<IDatePickerInputRef>(null);
  const currentError = error || datePickerInputRef?.current?.error;

  return (
    <FormField
      id={id}
      ref={ref as React.RefObject<IFormFieldRef>}
      className={className}
      label={label}
      hint={hint}
      value={value}
      error={currentError}
      required={required}
    >
      <DatePickerInput
        ref={datePickerInputRef}
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        disabledDates={disabledDates}
        allowedDates={allowedDates}
        onChange={onChange}
      />
    </FormField>
  );
};

export default FormDatePicker;
export type { IFormDatePickerProps };
