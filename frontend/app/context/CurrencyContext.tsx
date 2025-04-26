"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

// Тип для курсов валют
type ExchangeRates = {
  USD: number; // Курс доллара к рублю
  CNY: number; // Курс юаня к рублю
  lastUpdated: Date | null;
};

// Интерфейс для контекста
interface CurrencyContextType {
  exchangeRates: ExchangeRates;
  formatCurrency: (priceInRub: number) => string;
  getCurrencySymbol: () => string;
  convertPrice: (priceInRub: number) => number;
}

// Значения по умолчанию
const defaultExchangeRates: ExchangeRates = {
  USD: 82.65, // Примерный курс по умолчанию
  CNY: 11.35, // Примерный курс по умолчанию
  lastUpdated: null,
};

const CurrencyContext = createContext<CurrencyContextType>({
  exchangeRates: defaultExchangeRates,
  formatCurrency: () => "",
  getCurrencySymbol: () => "₽",
  convertPrice: (price) => price,
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [exchangeRates, setExchangeRates] =
    useState<ExchangeRates>(defaultExchangeRates);
  const { language } = useLanguage();

  // Получаем курсы валют с сервера ЦБ России
  const fetchExchangeRates = async () => {
    try {
      // Проверяем, нужно ли обновлять курсы (раз в сутки)
      const now = new Date();
      if (
        exchangeRates.lastUpdated &&
        now.getDate() === exchangeRates.lastUpdated.getDate() &&
        now.getMonth() === exchangeRates.lastUpdated.getMonth() &&
        now.getFullYear() === exchangeRates.lastUpdated.getFullYear()
      ) {
        return; // Уже обновляли сегодня
      }

      // Запрашиваем XML с курсами валют
      const response = await fetch("/api/exchange-rates");

      if (!response.ok) {
        throw new Error("Не удалось получить курсы валют");
      }

      const data = await response.json();

      setExchangeRates({
        USD: data.USD,
        CNY: data.CNY,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Ошибка при получении курсов валют:", error);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
    // Устанавливаем интервал обновления раз в день (24 часа)
    const interval = setInterval(fetchExchangeRates, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Функция для получения символа валюты
  const getCurrencySymbol = (): string => {
    switch (language) {
      case "en":
        return "$";
      case "zh":
        return "¥";
      case "ru":
      default:
        return "₽";
    }
  };

  // Функция для конвертации цены в нужную валюту
  const convertPrice = (priceInRub: number): number => {
    switch (language) {
      case "en":
        return priceInRub / exchangeRates.USD;
      case "zh":
        return priceInRub / exchangeRates.CNY;
      case "ru":
      default:
        return priceInRub;
    }
  };

  // Функция для форматирования цены в строку с символом валюты
  const formatCurrency = (priceInRub: number): string => {
    const convertedPrice = convertPrice(priceInRub);
    const roundedPrice = Math.round(convertedPrice * 100) / 100;

    switch (language) {
      case "en":
        return `$${roundedPrice.toLocaleString("en-US")}`;
      case "zh":
        return `¥${roundedPrice.toLocaleString("zh-CN")}`;
      case "ru":
      default:
        return `${roundedPrice.toLocaleString("ru-RU")} ₽`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{ exchangeRates, formatCurrency, getCurrencySymbol, convertPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
