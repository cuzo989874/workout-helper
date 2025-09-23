import { type TValidationValue } from '~/types/validation';

export interface IFormFieldPropsBase {
  id?: string;
  className?: string;
  label?: string;
  labelTooltip?: string;
  onLabelTooltipClick?: () => void;
  hint?: string;
  error?: string;
  errorLabel?: string;
  required?: boolean;
  disabled?: boolean;
  validators?: Array<(value: TValidationValue) => boolean>;
}

export interface IFormFieldProps extends IFormFieldPropsBase {
  children: React.ReactNode;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  checkValidity?: () => boolean;
  reportValidity?: () => boolean;
}
