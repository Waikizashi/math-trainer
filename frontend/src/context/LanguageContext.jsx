import React, { createContext, useState, useEffect } from 'react';
import sklocal from '../data/locales/sk.json'
import enlocal from '../data/locales/en.json'

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        const local = language === 'en' ? enlocal : sklocal;
        setTranslations(local)
    }, [language]);

    const changeLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ translations, changeLanguage, language }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => React.useContext(LanguageContext);
