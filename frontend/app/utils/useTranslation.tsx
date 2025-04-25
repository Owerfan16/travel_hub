"use client";

import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";

type TranslationKey = string;
type Namespace = "common" | string;

// Safe version of useLanguage that won't throw errors
const useSafeLanguage = () => {
  try {
    return useLanguage();
  } catch (error) {
    // Return default language if context is not available
    return { language: "ru", setLanguage: () => {} };
  }
};

export const useTranslation = (namespace: Namespace = "common") => {
  // Always call hooks at the top level, never conditionally
  const { language } = useSafeLanguage();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        // Dynamic import of the translation file based on language and namespace
        const translationModule = await import(
          `../../messages/${language}/${namespace}.json`
        );
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.error(
          `Failed to load translations for ${language}/${namespace}:`,
          error
        );
        // Fallback to empty translations if file not found
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language, namespace, isMounted]);

  const t = (
    key: TranslationKey,
    replacements: Record<string, string> = {}
  ) => {
    if (isLoading) return key; // Return key if translations are still loading

    let text = translations[key] || key;

    // Replace any placeholders with values from replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(new RegExp(`{{${placeholder}}}`, "g"), value);
    });

    return text;
  };

  return { t, isLoading };
};
