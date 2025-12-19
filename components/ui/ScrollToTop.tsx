
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Force scroll to top immediately
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
};
