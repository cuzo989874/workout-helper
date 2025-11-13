import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Switch from '~/components/form/Switch';
import SubPageHeader from '~/components/layouts/SubPageHeader';
import { useTheme } from '~/hooks/useTheme';

import styles from './Settings.module.scss';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' },
] as const;

export default function Settings() {
  const { t, i18n } = useTranslation();
  const version = APP_VERSION;
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const { theme, toggleTheme } = useTheme();

  // 监听语言变化
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      console.log('Settings: Language changed event received:', lng);
      console.log('Settings: Current i18n.language:', i18n.language);
      console.log('Settings: Translation test:', t('settings.language'));
      setCurrentLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, t]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = e.target.value;
    // 直接使用选中的语言代码（已经是标准格式 zh-TW）
    i18n.changeLanguage(langCode);
  };

  // 确保 select value 匹配当前语言（处理大小写差异）
  const currentLanguage = currentLang || 'en';
  const selectValue =
    LANGUAGE_OPTIONS.find(
      opt =>
        opt.value === currentLanguage ||
        opt.value.toLowerCase() === currentLanguage.toLowerCase()
    )?.value || 'en';

  return (
    <div>
      <SubPageHeader />
      <main className="main main--sm pt-md px-lg">
        <ul className={styles['settings__list']}>
          <li className={styles['settings__item']}>
            <label className={styles['settings__label']}>
              {t('settings.language')}
            </label>
            <div className={styles['settings__select-wrapper']}>
              <select
                className={styles['settings__select']}
                value={selectValue}
                onChange={handleLanguageChange}
                aria-label={t('settings.language')}
              >
                {LANGUAGE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </li>
          <li className={styles['settings__item']}>
            <label className={styles['settings__label']}>
              {t('settings.theme')}
            </label>
            <div className={styles['settings__switch-wrapper']}>
              <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                ariaLabel={t('settings.theme')}
              />
            </div>
          </li>
          <li className={styles['settings__item']}>
            <label className={styles['settings__label']}>
              {t('settings.version')}
            </label>
            <div className={styles['settings__version']}>v{version}</div>
          </li>
        </ul>
      </main>
    </div>
  );
}
