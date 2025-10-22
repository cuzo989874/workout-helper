import { useState, useCallback } from 'react';
import { type TValidationValue } from '~/types/validation';
import { Validator } from '~/utils/validators';

interface IUseFieldValidationProps {
  required?: boolean;
  label?: string;
  validators?: Array<(value: TValidationValue) => boolean>;
  error?: string;
  onValidationChange?: (isValid: boolean) => void;
  translate: (key: string, params?: Record<string, string | number>) => string;
}

/**
 * useFieldValidation - 支援 i18n 的單一欄位驗證 React hook。
 *
 * @param {Object} params - Hook 參數
 * @param {string} [params.label] - 錯誤訊息用的欄位標籤
 * @param {Array} [params.validators] - 自訂驗證器函式陣列
 * @param {string} [params.error] - 外部錯誤訊息
 * @param {(isValid: boolean) => void} [params.onValidationChange] - 驗證狀態變更時的 callback
 * @param {(key: string, params?: Record<string, string | number>) => string} params.translate - i18n 翻譯函式
 *
 * @returns {Object} { error, validate, shouldShowError, setShouldShowError }
 */
export function useFieldValidation({
  label = '',
  validators = [],
  error: externalError,
  onValidationChange,
  translate,
}: IUseFieldValidationProps) {
  const [error, setError] = useState<string | undefined>(externalError);
  const [shouldShowError, setShouldShowError] = useState(false);

  const validate = useCallback(
    (val: TValidationValue) => {
      // 將 required 驗證器移到最前面
      if (validators.includes(Validator.required)) {
        validators.splice(validators.indexOf(Validator.required), 1);
        validators.unshift(Validator.required);
      }

      // 執行驗證
      for (const validator of validators) {
        const result = validator(val);
        let errorMessage = '';
        if (!result) {
          switch (validator) {
            case Validator.required:
              errorMessage = translate('validation.required', { label });
              break;
            case Validator.email:
              errorMessage = translate('validation.email', { label });
              break;
            case Validator.minLength:
              errorMessage = translate('validation.minLength', {
                label,
                min: 1,
              });
              break;
            case Validator.noXSS:
            case Validator.noSQLInjection:
            case Validator.pattern:
              errorMessage = translate('validation.pattern', { label });
              break;
            default:
              errorMessage = translate('validation.unknown', { label });
          }
          onValidationChange?.(false);
          setError(errorMessage);
          return {
            isValid: false,
            error: errorMessage,
          };
        }
      }
      setError(undefined);
      onValidationChange?.(true);
      return {
        isValid: true,
      };
    },
    [label, validators, onValidationChange, translate]
  );

  return {
    error,
    validate,
    shouldShowError,
    setShouldShowError,
  };
}
