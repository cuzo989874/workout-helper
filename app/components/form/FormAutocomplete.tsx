import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';

import FormField from './FormField';

import styles from './FormAutocomplete.module.scss';

// 選項介面，支援 value 和 label 分離
interface IAutocompleteOption {
  value: string;
  label: string;
}

interface IFormAutocompleteProps {
  id?: string;
  name: string;
  className?: string;
  placeholder?: string;
  emptyPlaceholder?: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  options: string[] | IAutocompleteOption[];
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  // 新增的格式化函數
  valueFormat?: (option: IAutocompleteOption | string) => string;
  labelFormat?: (option: IAutocompleteOption | string) => string;
}

const FormAutocomplete: React.FC<IFormAutocompleteProps> = ({
  id,
  name,
  className,
  value,
  label,
  placeholder,
  emptyPlaceholder,
  hint,
  error,
  options,
  required = false,
  disabled = false,
  onChange,
  onSelect,
  valueFormat,
  labelFormat,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<IAutocompleteOption[]>(
    []
  );
  const [inputValue, setInputValue] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);

  // 標準化的選項列表
  const normalizedOptions = useMemo(() => {
    return options.map(option => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      }
      return option;
    });
  }, [options]);

  // 根據當前 value 找到選中的選項
  const selectedOption = useMemo(() => {
    return normalizedOptions.find(option => option.value === value);
  }, [normalizedOptions, value]);

  // 滾動到選中的選項
  const scrollToSelectedOption = useCallback((index: number) => {
    if (!dropdownRef.current) return;

    const selectedElement = dropdownRef.current.getElementsByClassName(
      'form-autocomplete__option'
    )?.[index] as HTMLElement;
    if (!selectedElement) return;

    // 計算滾動位置
    const containerRect = dropdownRef.current.getBoundingClientRect();
    const elementRect = selectedElement.getBoundingClientRect();

    // 如果選項在容器上方不可見
    if (elementRect.top < containerRect.top) {
      dropdownRef.current.scrollTop -= containerRect.top - elementRect.top;
    }
    // 如果選項在容器下方不可見
    else if (elementRect.bottom > containerRect.bottom) {
      dropdownRef.current.scrollTop +=
        elementRect.bottom - containerRect.bottom;
    }
  }, []);

  const filterOptions = useCallback(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (inputValue) {
      const filtered = normalizedOptions.filter(
        option =>
          option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          option.value.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);

      // 找到完全匹配的選項索引
      const exactMatchIndex = filtered.findIndex(
        option => option.value === inputValue || option.label === inputValue
      );
      setSelectedIndex(exactMatchIndex);
    } else {
      setFilteredOptions(normalizedOptions);
    }
  }, [
    isSelectingRef,
    inputValue,
    normalizedOptions,
    setFilteredOptions,
    setSelectedIndex,
  ]);

  // 當下拉選單打開時，如果有選中選項則滾動到該選項
  useEffect(() => {
    if (isOpen && selectedIndex >= 0) {
      setTimeout(() => scrollToSelectedOption(selectedIndex), 0);
    }
  }, [isOpen, selectedIndex, scrollToSelectedOption]);

  useEffect(() => {
    if (inputValue || normalizedOptions.length > 0) {
      filterOptions();
    }
  }, [inputValue, normalizedOptions, filterOptions]);

  // 同步外部 value
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  // 處理輸入變化
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // 檢查是否有匹配的選項
      const matchedOption = normalizedOptions.find(
        option => option.value === newValue || option.label === newValue
      );

      if (matchedOption) {
        // 如果有匹配的選項，使用 valueFormat 或預設值
        const formattedValue = valueFormat
          ? valueFormat(matchedOption)
          : matchedOption.value;
        onChange(formattedValue);
      } else {
        // 如果沒有匹配的選項，直接輸出用戶輸入的內容
        onChange(newValue);
      }

      setIsOpen(true);
    },
    [onChange, normalizedOptions, valueFormat]
  );

  // 處理選項選擇
  const handleOptionSelect = useCallback(
    (option: IAutocompleteOption) => {
      isSelectingRef.current = true;

      // 使用 valueFormat 或預設值
      const formattedValue = valueFormat ? valueFormat(option) : option.value;
      const displayLabel = labelFormat ? labelFormat(option) : option.label;

      setInputValue(displayLabel);
      onChange(formattedValue);
      onSelect?.(formattedValue);
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    [
      setInputValue,
      onChange,
      onSelect,
      setIsOpen,
      setSelectedIndex,
      valueFormat,
      labelFormat,
    ]
  );

  // 處理鍵盤導航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || filteredOptions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
            // 延遲滾動，確保 DOM 已更新
            setTimeout(() => scrollToSelectedOption(newIndex), 0);
            return newIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
            // 延遲滾動，確保 DOM 已更新
            setTimeout(() => scrollToSelectedOption(newIndex), 0);
            return newIndex;
          });
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleOptionSelect(filteredOptions[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [
      isOpen,
      filteredOptions,
      selectedIndex,
      handleOptionSelect,
      scrollToSelectedOption,
    ]
  );

  // 處理滑鼠懸停時也滾動到選中選項
  const handleOptionMouseEnter = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      scrollToSelectedOption(index);
    },
    [scrollToSelectedOption]
  );

  // 處理點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      const currentIndex = filteredOptions.findIndex(
        option => option.value === inputValue || option.label === inputValue
      );
      setSelectedIndex(currentIndex);
      setTimeout(() => scrollToSelectedOption(currentIndex), 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, filteredOptions, inputValue, scrollToSelectedOption]);

  const dropdownPosition = useMemo(() => {
    if (!inputRef.current || !isOpen)
      return { top: '0px', left: '0px', width: '0px' };

    const rect = inputRef.current.getBoundingClientRect();
    const scrollTop = document.documentElement.scrollTop;
    const scrollLeft = document.documentElement.scrollLeft;

    return {
      top: `${rect.bottom + scrollTop}px`,
      left: `${rect.left + scrollLeft}px`,
      width: `${rect.width}px`,
    };
  }, [inputRef, isOpen]);

  return (
    <>
      <FormField
        id={id}
        className={className}
        label={label}
        hint={hint}
        error={error}
        required={required}
      >
        <input
          ref={inputRef}
          id={id || name}
          type="text"
          className="form-field__input"
          name={name}
          value={selectedOption?.label ?? inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredOptions.length > 0) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          required={required}
          autoComplete="off"
        />
      </FormField>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={styles.autocomplete__dropdown}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            <ul className={styles.autocomplete__options}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const displayLabel = labelFormat
                    ? labelFormat(option)
                    : option.label;
                  return (
                    <li
                      key={`${option.value}-${index}`}
                      className={`form-autocomplete__option ${styles.autocomplete__option} ${
                        index === selectedIndex
                          ? styles['autocomplete__option--selected']
                          : ''
                      }`}
                      onClick={() => handleOptionSelect(option)}
                      onMouseEnter={() => handleOptionMouseEnter(index)}
                    >
                      {displayLabel}
                    </li>
                  );
                })
              ) : (
                <li className={styles['autocomplete__option--no-results']}>
                  {emptyPlaceholder || 'No Results'}
                </li>
              )}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
};

export default FormAutocomplete;
