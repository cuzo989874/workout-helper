import { useNavigate } from 'react-router';
import styles from './Header.module.scss';

export default function Home() {
  const navigate = useNavigate();
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
  return (
    <header className={styles.header}>
      <a className="clickable" aria-label="Logo" onClick={handleLogoClick}>
        <h1>Workout Helper</h1>
      </a>
      {/* TODO: Add setting button to change language */}
      {/* TODO: Dark Mode Button */}
    </header>
  );
}
