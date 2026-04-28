import { useState, useCallback } from 'react';

const VALID_LOCALES = ['en', 'zh'];

function useLocale() {
  const [locale, setLocaleState] = useState(() => {
    const stored = localStorage.getItem('locale');
    return VALID_LOCALES.includes(stored) ? stored : 'en';
  });

  const setLocale = useCallback((lang) => {
    localStorage.setItem('locale', lang);
    setLocaleState(lang);
  }, []);

  return { locale, setLocale };
}

export default useLocale;
