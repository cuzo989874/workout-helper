import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      common: {
        back: 'Back',
        minutes: 'minutes',
        minutesShort: 'min',
        seconds: 'seconds',
        secondsShort: 'sec',
        meters: 'meters',
        submit: 'Submit',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
      },
      calendar: {
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
      },
      validation: {
        required: '{{label}} is required.',
        minLength: 'Minimum length is {{min}} characters.',
        maxLength: 'Maximum length is {{max}} characters.',
      },
    },
  },
  'zh-tw': {
    translation: {
      common: {
        back: '返回',
        minutes: '分鐘',
        minutesShort: '分',
        seconds: '秒',
        secondsShort: '秒',
        meters: '公尺',
        submit: '提交',
        edit: '編輯',
        delete: '刪除',
        save: '儲存',
      },
      calendar: {
        sun: '日',
        mon: '一',
        tue: '二',
        wed: '三',
        thu: '四',
        fri: '五',
        sat: '六',
      },
      validation: {
        required: '{{label}} 是必填的。',
        minLength: '至少需要輸入 {{min}} 個字元。',
        maxLength: '最多只能輸入 {{max}} 個字元。',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
  // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
  // if you're using a language detector, do not define the lng option

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
