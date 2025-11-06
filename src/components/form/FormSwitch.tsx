import React from 'react';

import { type IFormFieldRef } from './FormField';

export interface IFormSwitchRef extends IFormFieldRef {}

interface IFormSwitchProps {
  ref?: React.RefObject<IFormSwitchRef>;
  id?: string;
  name: string;
  className?: string;
  label?: string;
  disabled?: boolean;
  checked: boolean;
  suffix?: React.ReactNode;
  onChange: (checked: boolean) => void;
}

const FormSwitch: React.FC<IFormSwitchProps> = ({
  id,
  name,
  label,
  className,
  disabled = false,
  checked,
  suffix,
  onChange,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const switchId = id || name;

  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={`form-switch-container ${className || ''}`}>
      {!!label && (
        <label htmlFor={id} className="form-field__label mr-md mb-none">
          {label}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled ? 'true' : undefined}
        className={`form-switch${disabled ? ' form-switch--disabled' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        data-testid={`form-switch-${name}`}
      >
        <input
          ref={inputRef}
          tabIndex={-1}
          aria-hidden="true"
          type="checkbox"
          name={name}
          checked={checked}
          readOnly
          hidden
        />
        <span className="form-switch__track" />
        <span className="form-switch__thumb" />
      </button>
      {suffix}
    </div>
  );
};

export default FormSwitch;
export type { IFormSwitchProps };
