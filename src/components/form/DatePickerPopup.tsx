import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { formatDateAsNumeric } from '~/utils/dateUtils';

import ChevronLeftIcon from '~/assets/google-fonts/chevron_left.svg?react';
import ChevronRightIcon from '~/assets/google-fonts/chevron_right.svg?react';
import styles from './DatePickerPopup.module.scss';

export interface IDatePickerPopupRef {
  open: (target: HTMLElement) => void;
  close: () => void;
  toggle: (target: HTMLElement) => void;
}

interface IDatePickerPopupProps {
  ref?: React.Ref<IDatePickerPopupRef>;
  selectedDate: Date | null;
  disabledDates?: Date[];
  allowedDates?: Date[];
  triggerRef: React.RefObject<HTMLElement>;
  onDateSelect: (date: Date) => void;
}

const DatePickerPopup: React.FC<IDatePickerPopupProps> = ({
  ref,
  selectedDate,
  disabledDates = [],
  allowedDates = [],
  triggerRef,
  onDateSelect,
}) => {
  const { t } = useTranslation();
  const popupRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      );
    }
  }, [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, triggerRef]);

  useImperativeHandle(ref, () => ({
    open,
    close,
    toggle: (target: HTMLElement) => (isOpen ? close() : open(target)),
  }));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const dateString = formatDateAsNumeric(date);

    // Check if date is in disabledDates
    if (
      disabledDates.some(
        disabledDate => formatDateAsNumeric(disabledDate) === dateString
      )
    ) {
      return true;
    }

    // Check if allowedDates is specified and date is not in it
    if (
      allowedDates.length > 0 &&
      !allowedDates.some(
        allowedDate => formatDateAsNumeric(allowedDate) === dateString
      )
    ) {
      return true;
    }

    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return formatDateAsNumeric(date) === formatDateAsNumeric(selectedDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDateAsNumeric(date) === formatDateAsNumeric(today);
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date);
      close();
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const formatMonthYear = (date: Date) => {
    const locale = i18n.language;
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
  };

  const days = getDaysInMonth(currentDate);

  const close = () => setIsOpen(false);

  const open = (target: HTMLElement) => {
    const triggerRect = target.getBoundingClientRect();
    const popupRect = popupRef.current?.getBoundingClientRect();
    const scrollLeft = window.scrollX;
    const scrollTop = window.scrollY;

    setPosition({
      top:
        triggerRect.top +
        triggerRect.height +
        scrollTop -
        (popupRect?.height ?? 0),
      left: triggerRect.left + scrollLeft - (popupRect?.width ?? 0),
    });
    setIsOpen(true);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles['date-picker-popup']}
      ref={popupRef}
      style={position}
    >
      <div className={styles['date-picker-popup__header']}>
        <button
          type="button"
          className={styles['date-picker-popup__nav-button']}
          aria-label={t('datePicker.previousMonth')}
          onClick={goToPreviousMonth}
        >
          <ChevronLeftIcon width={16} height={16} />
        </button>
        <span className={styles['date-picker-popup__month-year']}>
          {formatMonthYear(currentDate)}
        </span>
        <button
          type="button"
          className={styles['date-picker-popup__nav-button']}
          aria-label={t('datePicker.nextMonth')}
          onClick={goToNextMonth}
        >
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      <div className={styles['date-picker-popup__weekdays']}>
        {[
          t('calendar.sun'),
          t('calendar.mon'),
          t('calendar.tue'),
          t('calendar.wed'),
          t('calendar.thu'),
          t('calendar.fri'),
          t('calendar.sat'),
        ].map(day => (
          <div key={day} className={styles['date-picker-popup__weekday']}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles['date-picker-popup__days']}>
        {days.map((date, index) => (
          <div
            key={index}
            className={[
              styles['date-picker-popup__day'],
              !date && styles['date-picker-popup__day--empty'],
              date &&
                isDateDisabled(date) &&
                styles['date-picker-popup__day--disabled'],
              date &&
                isDateSelected(date) &&
                styles['date-picker-popup__day--selected'],
              date && isToday(date) && styles['date-picker-popup__day--today'],
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => date && handleDateClick(date)}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

DatePickerPopup.displayName = 'DatePickerPopup';

export default DatePickerPopup;
