/**
 * 驗證結果介面
 */
export interface IValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * 驗證器介面
 */
export interface IValidator<T> {
  (value: T): IValidationResult;
}

export interface IValidationResult {
  isValid: boolean;
  error?: string;
}
