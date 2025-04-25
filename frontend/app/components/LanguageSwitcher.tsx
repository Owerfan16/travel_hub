"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

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

export default function LanguageSwitcher() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  // Always call hooks at the top level
  const { language, setLanguage } = useSafeLanguage();

  // Calculate these values outside of effects
  const languages = Object.keys(languageMap) as LanguageCode[];
  const activeIndex = languages.indexOf(language);

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
    <div
      className={`relative w-[106px] h-[30px] rounded-full overflow-hidden text-[14px] font-medium ${
        theme === "light" ? "bg-[#287DC4]" : "bg-[#002238]"
      }`}
    >
      <div
        className={`absolute top-[2px] left-[2px] h-[26px] w-[34px] rounded-full transition-transform duration-300 border-1 ${
          theme === "light"
            ? "bg-white border-[#287DC4]"
            : "bg-[#a2d4fd] border-[#002238]"
        }`}
        style={{ transform: `translateX(${activeIndex * 34}px)` }}
      />

      <div className="relative flex h-full pl-[2px]">
        {languages.map((langCode) => (
          <div
            key={langCode}
            className="w-[34px] h-[30px] flex items-center justify-center cursor-pointer"
            onClick={() => handleLanguageChange(langCode)}
          >
            <span
              className={`transition-colors duration-300 z-10 ${
                language === langCode
                  ? theme === "light"
                    ? "text-[#0070BF]"
                    : "text-[#09283F]"
                  : "text-white"
              }`}
            >
              {languageMap[langCode]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
