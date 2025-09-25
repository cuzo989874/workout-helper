import React, { useRef } from 'react';

import FormField, { type IFormFieldRef } from './FormField';

import type { IFormFieldPropsBase } from '~/interface/form';

export interface IFormInputRef extends IFormFieldRef {}

interface IFormInputProps extends IFormFieldPropsBase {
  ref?: React.RefObject<IFormInputRef>;
  name: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'number' | 'email';
  value: string | number;
  min?: string | number;
  max?: string | number;
  suffix?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<IFormInputProps> = ({
  id,
  ref,
  type = 'text',
  name,
  className,
  label,
  placeholder,
  hint,
  error,
  errorLabel,
  value,
  min,
  max,
  onChange,
  required = false,
  disabled = false,
  validators = [],
  suffix,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
      checkValidity={() => inputRef.current?.checkValidity() ?? false}
      reportValidity={() => {
        if (inputRef.current) {
          inputRef.current.reportValidity();
          return true;
        }
        return false;
      }}
    >
      <div className="form-field__input-container">
        <input
          ref={inputRef}
          id={id || name}
          name={name}
          className={`form-field__input ${suffix ? 'form-field__input--with-suffix' : ''}`}
          type={type}
          value={value}
          placeholder={placeholder}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          onChange={onChange}
          data-testid={`form-input-${name}`}
        />
        {!!suffix && <span className="form-field__suffix">{suffix}</span>}
      </div>
    </FormField>
  );
};

export default FormInput;
export type { IFormInputProps };
