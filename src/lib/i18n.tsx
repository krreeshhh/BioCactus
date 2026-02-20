import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en.json';
import ta from '../translations/ta.json';
import hi from '../translations/hi.json';
// Import others as needed

type TranslationType = typeof en;

const translations: Record<string, TranslationType> = {
    en,
    ta,
    hi,
    // te, ml, kn fallback to en for now
    te: en,
    ml: en,
    kn: en
};

interface I18nContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState(localStorage.getItem('preferredLanguage') || 'en');

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem('preferredLanguage', lang);
    };

    const t = (path: string) => {
        const keys = path.split('.');
        let current: any = translations[language] || translations['en'];

        for (const key of keys) {
            if (current[key] !== undefined) {
                current = current[key];
            } else {
                // Fallback to English if key missing in current language
                let fallback: any = translations['en'];
                for (const fkey of keys) {
                    if (fallback[fkey] !== undefined) fallback = fallback[fkey];
                    else return path;
                }
                return fallback;
            }
        }
        return current;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
};
