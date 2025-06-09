import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopOptions {
  smooth?: boolean;
  delay?: number;
  exceptions?: string[]; // Routes where we don't want to scroll to top
}

export function useScrollToTop(options: ScrollToTopOptions = {}) {
  const { smooth = true, delay = 0, exceptions = [] } = options;
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip scroll restoration for exception routes
    if (exceptions.includes(pathname)) {
      return;
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? 'smooth' : 'auto',
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [pathname, smooth, delay, exceptions]);
}

// Alternative component-based approach with more options
interface ScrollToTopComponentProps {
  smooth?: boolean;
  delay?: number;
  exceptions?: string[];
  onlyOnRouteChange?: boolean;
}

export function ScrollToTopComponent({ 
  smooth = true, 
  delay = 0, 
  exceptions = [],
  onlyOnRouteChange = true 
}: ScrollToTopComponentProps) {
  useScrollToTop({ smooth, delay, exceptions });
  return null;
}

// Export the simple version as default
export { ScrollToTop } from './ScrollToTop';
