import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import { formatDateAsNumeric } from '~/utils/dateUtils';

import DatePickerPopup, { type IDatePickerPopupRef } from './DatePickerPopup';

import styles from './DatePickerInput.module.scss';

export interface IDatePickerInputRef {
  error: string;
}

interface IDatePickerInputProps {
  id?: string;
  name?: string;
  ref?: React.Ref<IDatePickerInputRef>;
  className?: string;
  placeholder?: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  disabledDates?: Date[];
  allowedDates?: Date[];
  onChange: (value: string) => void;
}

const DatePickerInput: React.FC<IDatePickerInputProps> = ({
  id,
  name,
  ref,
  className,
  placeholder,
  value,
  required = false,
  disabled = false,
  disabledDates = [],
  allowedDates = [],
  onChange,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const datePickerPopupRef = useRef<IDatePickerPopupRef>(null);

  const [inputValue, setInputValue] = useState(value);
  const [isValidDate, setIsValidDate] = useState(true);

  const dateInputChangeDebounce = 800;
  const dateInputChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const toDisplayByLanguage = (isoValue: string): string => {
      if (!isoValue) return '';
      return isoValue;
    };
    setInputValue(toDisplayByLanguage(value));
  }, [value]);

  useImperativeHandle(ref, (): IDatePickerInputRef => {
    return {
      error: !isValidDate && inputValue ? t('datePicker.invalidDate') : '',
    };
  });

  const validateAndFormatDate = useCallback(
    (dateString: string): string | null => {
      if (!dateString.trim()) {
        setIsValidDate(true);
        return '';
      }

      const date = new Date(dateString);
      const isValid = Boolean(date);
      setIsValidDate(isValid);

      if (isValid && date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      return null;
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (dateInputChangeTimeoutRef.current) {
      clearTimeout(dateInputChangeTimeoutRef.current);
    }

    const fullPatternMatches = /^\d{4}-\d{2}-\d{2}$/.test(newValue.trim());

    const attemptValidateAndEmit = () => {
      const normalized = validateAndFormatDate(newValue);
      if (normalized !== null) {
        // normalized is '' for empty or ISO string for valid date
        if (normalized === '') {
          // Emit empty string so parent can clear value if needed
          onChange('');
        } else {
          onChange(normalized);
        }
      }
    };

    if (fullPatternMatches) {
      attemptValidateAndEmit();
    } else {
      dateInputChangeTimeoutRef.current = setTimeout(
        attemptValidateAndEmit,
        dateInputChangeDebounce
      );
    }
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDateAsNumeric(date); // ISO YYYY-MM-DD
    const displayValue = formattedDate;
    setInputValue(displayValue);
    setIsValidDate(true);
    onChange(formattedDate);
  };

  const handleCalendarClick = () => {
    if (!disabled) {
      datePickerPopupRef.current?.toggle(containerRef.current as HTMLElement);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      datePickerPopupRef.current?.close();
    }
  };

  return (
    <>
      <div
        className={`${styles['form-date-picker']} ${className ?? ''}`}
        ref={containerRef}
      >
        <input
          id={id || name}
          name={name}
          ref={inputRef}
          className={styles['form-date-picker__input']}
          type="text"
          value={inputValue}
          placeholder={placeholder || 'YYYY-MM-DD'}
          required={required}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleCalendarClick}
        />
        <button
          type="button"
          className={styles['form-date-picker__calendar-button']}
          disabled={disabled}
          tabIndex={-1}
          aria-label={t('datePicker.selectDate')}
          onClick={handleCalendarClick}
        >
          <i className="fas fa-calendar-alt"></i>
        </button>
      </div>

      <DatePickerPopup
        ref={datePickerPopupRef}
        selectedDate={isValidDate && inputValue ? new Date(inputValue) : null}
        disabledDates={disabledDates}
        allowedDates={allowedDates}
        triggerRef={containerRef as React.RefObject<HTMLElement>}
        onDateSelect={handleDateSelect}
      />
    </>
  );
};

export default DatePickerInput;
