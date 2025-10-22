import { useNavigate } from 'react-router';

import ChevronLeftIcon from '~/assets/google-fonts/chevron_left.svg?react';
import styles from './Header.module.scss';
import { useTranslation } from 'react-i18next';

export default function SubPageHeader() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const goBack = () => {
    if (navigate.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  return (
    <header className={styles.header}>
      <button className="btn btn--primary pl-sm" onClick={goBack}>
        <ChevronLeftIcon className="icon icon--sm" />
        <span>{t('common.back')}</span>
      </button>
    </header>
  );
}
