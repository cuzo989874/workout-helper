import React from 'react';

import styles from './Switch.module.scss';

interface ISwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Switch component for toggling between two states (e.g., light/dark mode)
 */
const Switch: React.FC<ISwitchProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  className,
}) => {
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
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled ? 'true' : undefined}
      className={`${styles.switch} ${checked ? styles['switch--checked'] : ''} ${
        disabled ? styles['switch--disabled'] : ''
      } ${className || ''}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.switch__track} />
      <span className={styles.switch__thumb} />
    </button>
  );
};

export default Switch;
