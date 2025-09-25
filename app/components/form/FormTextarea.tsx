import React, { useRef } from 'react';

import FormField, { type IFormFieldRef } from './FormField';

import type { IFormFieldPropsBase } from '~/interface/form';

interface IFormTextareaRef extends IFormFieldRef {}

interface IFormTextareaProps extends IFormFieldPropsBase {
  ref?: React.RefObject<IFormTextareaRef>;
  name: string;
  placeholder?: string;
  value: string;
  rows?: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const FormTextarea: React.FC<IFormTextareaProps> = ({
  id,
  ref,
  name,
  value,
  label,
  className,
  placeholder,
  hint,
  error,
  errorLabel,
  onChange,
  required = false,
  disabled = false,
  rows = 3,
  validators = [],
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      checkValidity={() => textareaRef.current?.checkValidity() ?? false}
      reportValidity={() => {
        if (textareaRef.current) {
          textareaRef.current.reportValidity();
          return true;
        }
        return false;
      }}
    >
      <textarea
        ref={textareaRef}
        id={id || name}
        className="form-field__input"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        data-testid={`form-textarea-${name}`}
      />
    </FormField>
  );
};

export default FormTextarea;
export type { IFormTextareaRef };
