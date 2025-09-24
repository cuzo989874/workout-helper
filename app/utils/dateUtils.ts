import i18n from 'i18next';

/**
 * 格式化時間戳（不使用 hook 的版本，用於非 React 組件）
 * @param timestamp 時間戳
 * @param language 語系
 * @param format Intl.DateTimeFormatOptions | 'time' | 'date' | 'datetime' 預設為 'time'
 * @returns 格式化後的日期
 */
export const formatTimestampWithLanguage = (
  timestamp: Date | string | number,
  language: string,
  format: Intl.DateTimeFormatOptions | 'time' | 'date' | 'datetime' = 'time'
) => {
  const date = new Date(timestamp);
  let options: Intl.DateTimeFormatOptions = {};

  if (typeof format === 'object') {
    options = format;
  } else {
    switch (format) {
      case 'time':
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = false;
        break;
      case 'date':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      case 'datetime':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = false;
        break;
    }
  }

  return (new Intl.DateTimeFormat(language, options).format(date) as string).replace(
    /\//g,
    '-'
  );
};

/**
 * 使用 hook 的版本，用於 React 組件
 * @param timestamp 時間戳
 * @param format 格式 Intl.DateTimeFormatOptions | 'time' | 'date' | 'datetime'
 * @returns 使用 hook 的版本，用於 React 組件
 */
export const useFormatTimestamp = () => {
  return (
    timestamp: Date | string | number,
    format: Intl.DateTimeFormatOptions | 'time' | 'date' | 'datetime' = 'time'
  ) => {
    return formatTimestampWithLanguage(timestamp, i18n.language, format);
  };
};

/**
 * 獲取當前時區的日期（不使用 hook 的版本）
 * @param language 語系
 * @returns 當前時區的日期
 */
export const getCurrentDateWithLanguage = () => {
  return new Date().toLocaleString('en-US');
};

/**
 * 獲取當前時區的日期
 * @returns 當前時區的日期
 */
export const useGetCurrentDate = () => {
  return () => getCurrentDateWithLanguage();
};

/**
 * 格式化日期為 YYYY-MM-DD
 * @param date Date
 * @returns YYYY-MM-DD
 */
export const formatDateAsNumeric = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};
