import { useState, useCallback } from 'react';

function useLocale() {
  const [locale, setLocaleState] = useState(
    () => localStorage.getItem('locale') || 'en'
  );

  const setLocale = useCallback((lang) => {
    localStorage.setItem('locale', lang);
    setLocaleState(lang);
  }, []);

  return { locale, setLocale };
}

export default useLocale;
