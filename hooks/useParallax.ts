import { useState, useEffect } from 'react';

export const useParallax = () => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return offset;
};
