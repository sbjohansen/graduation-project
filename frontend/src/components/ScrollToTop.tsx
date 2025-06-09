import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Immediately scroll to top when pathname changes
    window.scrollTo(0, 0);
    
    // Also force scroll to top after a small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
