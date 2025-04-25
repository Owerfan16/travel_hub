"use client";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";

type LanguageCode = "ru" | "zh" | "en";

const languageMap: Record<LanguageCode, string> = {
  ru: "RU",
  zh: "ZH",
  en: "EN",
};

// Safe version of useLanguage that won't throw errors
const useSafeLanguage = () => {
  try {
    return useLanguage();
  } catch (error) {
    // Return default language if context is not available
    return { language: "ru" as LanguageCode, setLanguage: () => {} };
  }
};

export default function LanguageSwitcherPC() {
  const [isMounted, setIsMounted] = useState(false);
  // Always call hooks at the top level
  const { language, setLanguage } = useSafeLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
  };

  return (
    <div className="flex space-x-6">
      {(Object.keys(languageMap) as LanguageCode[]).map((langCode) => (
        <button
          key={langCode}
          onClick={() => handleLanguageChange(langCode)}
          className="relative text-[24px] transition pb-2 pt-[10px] cursor-pointer"
        >
          {languageMap[langCode]}
          {language === langCode && (
            <span className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[30px] h-[3px] bg-[#3baeff] rounded-full transition-all duration-300" />
          )}
        </button>
      ))}
    </div>
  );
}
