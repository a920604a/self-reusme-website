import React, { createContext, useContext } from 'react';
import useLocale from '../hooks/useLocale';
import zh from '../i18n/zh';
import en from '../i18n/en';

const strings = { zh, en };

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const { locale, setLocale } = useLocale();

  const t = (key) => {
    const parts = key.split('.');
    let val = strings[locale];
    for (const part of parts) {
      val = val?.[part];
    }
    return val ?? key;
  };

  return (
    <LocaleContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}
