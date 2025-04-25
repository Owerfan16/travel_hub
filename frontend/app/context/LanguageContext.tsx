"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ru" | "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Create a default context value to avoid null checks
const defaultContextValue: LanguageContextType = {
  language: "ru",
  setLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default to Russian, but check localStorage when on the client
  const [language, setLanguageState] = useState<Language>("ru");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Get stored language preference from localStorage if available
    try {
      const storedLanguage = localStorage.getItem("language") as Language;
      if (storedLanguage && ["ru", "zh", "en"].includes(storedLanguage)) {
        setLanguageState(storedLanguage);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isMounted) {
      try {
        localStorage.setItem("language", lang);
        // Update the html lang attribute
        document.documentElement.lang = lang;
      } catch (error) {
        console.error("Error setting language:", error);
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
