import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

import { useFieldValidation } from '~/hooks/useFieldValidation';
import { Validator } from '~/utils/validators';

import type { TValidationValue } from '~/types/validation';
import type { IFormFieldProps } from '~/interface/form';
import type { IValidationResult } from '~/interface/validation';

// 驗證器 ref 介面
export interface IFormFieldRef {
  validate: () => IValidationResult;
  error: string | undefined;
  showError: () => void;
  checkValidity: () => boolean;
  reportValidity: () => boolean;
}

// 擴展 props 介面以包含 ref
interface IFormFieldPropsWithRef extends IFormFieldProps {
  ref?: React.RefObject<IFormFieldRef>;
}

const FormField: React.FC<IFormFieldPropsWithRef> = ({
  id,
  ref,
  className,
  label,
  hint,
  error,
  errorLabel,
  children,
  required = false,
  validators = [],
  validateOnChange = false,
  validateOnBlur = true,
  onValidationChange,
  checkValidity,
  reportValidity,
}) => {
  const { t } = useTranslation();
  const {
    error: validationError,
    validate,
    shouldShowError,
    setShouldShowError,
  } = useFieldValidation({
    label: errorLabel || label,
    validators,
    error,
    onValidationChange,
    translate: t,
  });

  // 如果 required 為 true 且不存在 required 驗證器，則將 required 加進去
  useEffect(() => {
    if (required && !validators.includes(Validator.required)) {
      validators.unshift(Validator.required);
    }
  }, [required, validators]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      const childElement = React.Children.toArray(
        children
      )[0] as React.ReactHTMLElement<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >;
      const value = childElement.props.value as TValidationValue;
      return validate(value);
    },
    error: validationError,
    showError: () => {
      setShouldShowError(true);
    },
    checkValidity: () => checkValidity?.() ?? true,
    reportValidity: () => reportValidity?.() ?? true,
  }));

  // 處理子元素的事件
  const enhanceChildWithValidation = useCallback(
    (
      child: React.ReactHTMLElement<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      return React.cloneElement(child, {
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          if (validateOnBlur) {
            validate(e.target.value as TValidationValue);
            setShouldShowError(true);
          }
          child.props.onBlur?.(e);
        },
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (validateOnChange) {
            validate(e.target.value as TValidationValue);
            setShouldShowError(true);
          }
          child.props.onChange?.(e);
        },
      });
    },
    [validate, validateOnBlur, validateOnChange, setShouldShowError]
  );

  const fieldClassName = [
    'form-field',
    validationError && shouldShowError && 'form-field--error',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return enhanceChildWithValidation(
        child as React.ReactHTMLElement<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      );
    }
    return child;
  });

  return (
    <div className={fieldClassName} data-testid={`form-field-${id || name}`}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      {enhancedChildren}
      {hint && !validationError && <p className="form-field__hint">{hint}</p>}
      {validationError && shouldShowError && (
        <span className="form-field__error-message">{validationError}</span>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';

export default FormField;
