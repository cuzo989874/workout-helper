import { useEffect } from 'react';

import { useTheme } from './hooks/useTheme';
import Router from './routes/Router';
import PWABadge from './PWABadge';

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <Router />
      <PWABadge />
    </>
  );
}

export default App;
