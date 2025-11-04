import { useNavigate, useLocation } from 'react-router-dom';
import CalendarIcon from '~/assets/google-fonts/calendar_month.svg?react';
import styles from './Header.module.scss';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCalendarView = location.pathname === '/calendar';

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      navigate('/');
    }
  };

  const handleViewToggle = () => {
    if (isCalendarView) {
      navigate('/');
    } else {
      navigate('/calendar');
    }
  };

  return (
    <header className={styles.header}>
      <a className="clickable" aria-label="Logo" onClick={handleLogoClick}>
        <h1>Workout Helper</h1>
      </a>

      <div className={styles['header-actions']}>
        <button
          type="button"
          className={`btn icon-btn ${styles['view-toggle-btn']}`}
          onClick={handleViewToggle}
          aria-label={
            isCalendarView ? 'Switch to list view' : 'Switch to calendar view'
          }
          title={isCalendarView ? 'List View' : 'Calendar View'}
        >
          <CalendarIcon
            width={24}
            height={24}
            fill="currentColor"
            className={isCalendarView ? styles['icon-active'] : ''}
          />
        </button>
        {/* TODO: Add setting button to change language */}
        {/* TODO: Dark Mode Button */}
      </div>
    </header>
  );
}
