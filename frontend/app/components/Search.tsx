"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  usePathname,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { format, parseISO } from "date-fns";
import { ru, enUS, zhCN } from "date-fns/locale";
import { useTranslation } from "../utils/useTranslation";
import { useLanguage } from "../context/LanguageContext";

export default function Search() {
  const pathname = usePathname();
  const nextSearchParams = useNextSearchParams();
  const { t } = useTranslation("common");
  const { language } = useLanguage();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [nights, setNights] = useState(7);
  const [showNightsDropdown, setShowNightsDropdown] = useState(false);
  const [travelClass, setTravelClass] = useState("");
  const [travelClassKey, setTravelClassKey] = useState<string>("");
  const [showPassengersDropdown, setShowPassengersDropdown] = useState(false);
  const [actualSearchType, setActualSearchType] = useState<
    "air" | "train" | "tour"
  >("air");

  const dateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const passengerContainerRef = useRef<HTMLDivElement>(null);
  const nightsContainerRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Локализованные дни недели
  const getWeekdays = () => {
    switch (language) {
      case "en":
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      case "zh":
        return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      case "ru":
      default:
        return ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    }
  };

  const weekdays = getWeekdays();

  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [isToFocused, setIsToFocused] = useState(false);

  // Определяем тип поиска на основе URL и устанавливаем класс обслуживания
  useEffect(() => {
    let type: "air" | "train" | "tour" = "air"; // По умолчанию - авиабилеты

    // Для страницы поиска берем тип из URL-параметра
    if (pathname === "/search") {
      const searchTypeParam = nextSearchParams.get("search_type");
      if (
        searchTypeParam === "air" ||
        searchTypeParam === "train" ||
        searchTypeParam === "tour"
      ) {
        type = searchTypeParam;
      }
    }
    // Для других страниц определяем по pathname
    else if (pathname === "/trains") {
      type = "train";
    } else if (pathname === "/tours") {
      type = "tour";
    }

    // Устанавливаем актуальный тип поиска
    setActualSearchType(type);

    // Устанавливаем соответствующий класс обслуживания в зависимости от типа
    if (type === "air") {
      setTravelClassKey("economy");
    } else if (type === "train") {
      setTravelClassKey("all");
    }
  }, [pathname, nextSearchParams]);

  // Обновление travelClass на основе ключа и текущего языка
  useEffect(() => {
    if (travelClassKey) {
      setTravelClass(t(travelClassKey));
    }
  }, [travelClassKey, language, t]);

  // Загружаем данные из URL для страницы поиска
  useEffect(() => {
    if (pathname === "/search") {
      // Получаем параметры из URL
      const fromParam = nextSearchParams.get("from");
      const toParam = nextSearchParams.get("to");
      const dateParam = nextSearchParams.get("date");
      const returnDateParam = nextSearchParams.get("return_date");
      const passengersParam = nextSearchParams.get("passengers");
      const classParam = nextSearchParams.get("class");
      const nightsParam = nextSearchParams.get("nights");

      // Заполняем форму значениями из URL
      if (fromParam) setFrom(fromParam);
      if (toParam) setTo(toParam);
      if (dateParam) setDate(dateParam);
      if (returnDateParam) setReturnDate(returnDateParam);
      if (passengersParam) setPassengers(parseInt(passengersParam) || 1);
      if (classParam) {
        setTravelClass(classParam);

        // Установим соответствующий ключ для перевода на основе значения classParam
        if (
          classParam === "Эконом" ||
          classParam === "Economy" ||
          classParam === "经济舱"
        ) {
          setTravelClassKey("economy");
        } else if (
          classParam === "Бизнес" ||
          classParam === "Business" ||
          classParam === "商务舱"
        ) {
          setTravelClassKey("business");
        } else if (
          classParam === "Все" ||
          classParam === "All" ||
          classParam === "全部"
        ) {
          setTravelClassKey("all");
        } else if (
          classParam === "Плацкарт" ||
          classParam === "Open sleeper" ||
          classParam === "开放式卧铺"
        ) {
          setTravelClassKey("platzkart");
        } else if (
          classParam === "Купе" ||
          classParam === "Compartment" ||
          classParam === "包厢"
        ) {
          setTravelClassKey("coupe");
        } else if (
          classParam === "СВ" ||
          classParam === "First class" ||
          classParam === "头等舱"
        ) {
          setTravelClassKey("sv");
        } else if (
          classParam === "Сидячий" ||
          classParam === "Sitting" ||
          classParam === "座位"
        ) {
          setTravelClassKey("sitting");
        } else {
          // Если не удалось определить ключ, сохраняем оригинальное значение
          setTravelClass(classParam);
        }
      }
      if (nightsParam) setNights(parseInt(nightsParam) || 7);
    }
  }, [pathname, nextSearchParams, t]);

  const fetchCitySuggestions = async (
    query: string,
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (!query) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/search/suggestions/?query=${encodeURIComponent(
          query
        )}&page_type=${actualSearchType}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      if (data?.results) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Ошибка при загрузке городов:", err);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchCitySuggestions(from, setFromSuggestions);
  }, [from]);

  useEffect(() => {
    fetchCitySuggestions(to, setToSuggestions);
  }, [to]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsidePassengers =
        passengerContainerRef.current &&
        !passengerContainerRef.current.contains(event.target as Node);
      const isOutsideNights =
        nightsContainerRef.current &&
        !nightsContainerRef.current.contains(event.target as Node);

      if (isOutsidePassengers) setShowPassengersDropdown(false);
      if (isOutsideNights) setShowNightsDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isMounted) return null;

  const getPassengerLabel = () => {
    if (actualSearchType === "tour") {
      if (passengers === 1) return t("tourist");
      return t("tourists");
    }

    if (passengers === 1) return t("passengers") + ", ";
    return t("passengers") + ", ";
  };

  // Динамически определяем надписи и опции в зависимости от типа поиска
  let typePerson =
    actualSearchType === "tour" ? t("passengers") : t("passengers");
  let classServices = actualSearchType === "tour" ? "" : t("serviceClass");
  let textSearchDate =
    actualSearchType === "tour" ? t("nights") : t("returnDate");

  // Определяем классы обслуживания в зависимости от типа
  let classOptions: string[] = [];
  if (actualSearchType === "air") {
    classOptions = [t("all"), t("economy"), t("business")];
  } else if (actualSearchType === "train") {
    classOptions = [
      t("all"),
      t("platzkart"),
      t("coupe"),
      t("sitting"),
      t("sv"),
    ];
  }

  let searchButtonText = "";
  if (actualSearchType === "air") {
    searchButtonText = t("searchAirTickets");
  } else if (actualSearchType === "tour") {
    searchButtonText = t("searchTours");
  } else if (actualSearchType === "train") {
    searchButtonText = t("searchTrainTickets");
  }

  const formatDate = (raw: string) => {
    if (!raw) return "";
    const dateObj = parseISO(raw);
    const day = weekdays[dateObj.getDay()];

    // Выбираем локаль в зависимости от текущего языка
    let dateLocale = ru;
    if (language === "en") dateLocale = enUS;
    else if (language === "zh") dateLocale = zhCN;

    const formatted = format(dateObj, "d MMMM", { locale: dateLocale });
    return `${formatted}, ${day}`;
  };

  let backgroundImage = "";
  if (pathname === "/") {
    backgroundImage =
      theme === "light"
        ? "/images/background_airplanes_light.avif"
        : "/images/background_airplanes_night.avif";
  } else if (pathname === "/tours") {
    backgroundImage =
      theme === "light"
        ? "/images/background_tours_light.avif"
        : "/images/background_tours_night.avif";
  } else if (pathname === "/trains") {
    backgroundImage =
      theme === "light"
        ? "/images/background_trains_light.avif"
        : "/images/background_trains_night.avif";
  }

  return (
    <div
      className={`relative ${
        pathname === "/search"
          ? "lg:mb-[36px]"
          : "min-h-[464px] lg:min-h-[690px] md:min-h-[248px]"
      }`}
    >
      {(pathname === "/" ||
        pathname === "/tours" ||
        pathname === "/trains") && (
        <div className="absolute inset-0 z-10">
          <Image
            src={backgroundImage}
            width={2168}
            height={787}
            className="w-full h-[464px] object-cover object-center md:h-[248px] lg:h-[690px]"
            style={{ objectPosition: "center 36%" }}
            alt="Background"
            quality={100}
            priority
          />
        </div>
      )}

      <div
        className={`w-full relative z-20 ${
          pathname === "/search"
            ? "py-[20px] bg-[var(--color--search-result)]"
            : "py-6 lg:pt-[570px] px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 max-w-[1920px] mx-auto"
        }`}
      >
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 ${
            pathname === "/search"
              ? "px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 max-w-[1920px] mx-auto"
              : ""
          }`}
        >
          {/* Откуда с подсказками */}
          <div className="relative h-full">
            <div
              className="relative opacity-95 h-full bg-[var(--color-search-background)] rounded-2xl p-4 flex items-center cursor-text"
              onClick={() => fromInputRef.current?.focus()}
            >
              <input
                ref={fromInputRef}
                type="text"
                placeholder={t("from")}
                className="w-full outline-none truncate opacity-95 placeholder:text-[var(--color-primary-text)]"
                value={from}
                onFocus={() => setIsFromFocused(true)}
                onBlur={() => setTimeout(() => setIsFromFocused(false), 200)}
                onChange={(e) => setFrom(e.target.value)}
              />
              <Image
                src="/images/Search/pointer.svg"
                width={14}
                height={14}
                alt=""
                className="mr-[10px] opacity-95"
              />
            </div>

            {isFromFocused && fromSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white shadow-md rounded-md mt-1 w-full max-h-48 overflow-y-auto">
                {fromSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                    onClick={() => {
                      setFrom(suggestion);
                      setFromSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Куда с подсказками */}
          <div className="relative h-full">
            <div
              className="relative h-full opacity-95 bg-[var(--color-search-background)] rounded-2xl p-4 flex items-center cursor-text"
              onClick={() => toInputRef.current?.focus()}
            >
              <input
                ref={toInputRef}
                type="text"
                placeholder={t("to")}
                className="w-full outline-none truncate placeholder:text-[var(--color-primary-text)]"
                value={to}
                onFocus={() => setIsToFocused(true)}
                onBlur={() => setTimeout(() => setIsToFocused(false), 200)}
                onChange={(e) => setTo(e.target.value)}
              />
              <Image
                src="/images/Search/pointer.svg"
                width={14}
                height={14}
                alt=""
                className="mr-[10px]"
              />
            </div>

            {isToFocused && toSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white shadow-md rounded-md mt-1 w-full max-h-48 overflow-y-auto">
                {toSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-black"
                    onClick={() => {
                      setTo(suggestion);
                      setToSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Дата */}
          <div
            className="relative bg-[var(--color-search-background)] truncate opacity-95 rounded-2xl p-4 flex justify-between items-center cursor-pointer"
            onClick={() => dateRef.current?.showPicker()}
          >
            <span className="">{date ? formatDate(date) : t("date")}</span>
            <input
              ref={dateRef}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Image
              src="/images/Search/date.svg"
              width={18}
              height={18}
              alt=""
              className="mr-2"
            />
          </div>

          {/* Обратно / Ночи - показываем в зависимости от типа поиска */}
          {actualSearchType === "tour" ? (
            <div
              ref={nightsContainerRef}
              className="relative z-50 opacity-95 bg-[var(--color-search-background)] rounded-2xl p-4 flex justify-between items-center cursor-pointer"
            >
              <div
                className="w-full flex justify-between items-center"
                onClick={() => setShowNightsDropdown((prev) => !prev)}
              >
                <span>
                  {nights} {getNightsLabel(nights)}
                </span>
                <Image
                  src="/images/Search/date.svg"
                  width={18}
                  height={18}
                  alt=""
                  className="mr-2"
                />
              </div>

              {showNightsDropdown && (
                <div className="absolute z-20 top-full left-0 mt-2 bg-[var(--color-search-background)] rounded-xl shadow-md w-60 p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{t("nights")}:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNights((prev) => Math.max(1, prev - 1));
                        }}
                        className="px-2 py-1 bg-[var(--color--search--passengers)] w-[24px] rounded"
                      >
                        <p>-</p>
                      </button>
                      <span>{nights}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNights((prev) => Math.min(30, prev + 1));
                        }}
                        className="px-2 py-1 bg-[var(--color--search--passengers)] w-[24px] rounded"
                      >
                        <p>+</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="relative opacity-95 bg-[var(--color-search-background)] rounded-2xl p-4 flex justify-between items-center cursor-pointer"
              onClick={() => returnDateRef.current?.showPicker()}
            >
              <p className="truncate">
                {returnDate ? formatDate(returnDate) : t("returnDate")}
              </p>
              <input
                ref={returnDateRef}
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Image
                src="/images/Search/date.svg"
                width={18}
                height={18}
                alt=""
                className="mr-2"
              />
            </div>
          )}

          {/* Пассажиры + класс */}
          <div
            ref={passengerContainerRef}
            className="relative opacity-95 z-10 bg-[var(--color-search-background)] flex justify-between items-center rounded-2xl p-4 cursor-pointer"
            onClick={() => setShowPassengersDropdown((prev) => !prev)}
          >
            <div className="truncate">
              {passengers} {getPassengerLabel()}
              {actualSearchType !== "tour" && travelClass}
            </div>

            {showPassengersDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-20 !opacity-100 top-full left-0 mt-2 bg-[var(--color-search-background)] rounded-xl shadow-md w-60 p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span>{typePerson}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setPassengers((prev) => Math.max(1, prev - 1))
                      }
                      className="px-2 py-1 bg-[var(--color--search--passengers)] w-[24px] rounded flex justify-center items-center"
                    >
                      <p>-</p>
                    </button>
                    <span>{passengers}</span>
                    <button
                      onClick={() =>
                        setPassengers((prev) => Math.min(10, prev + 1))
                      }
                      className="px-2 py-1 bg-[var(--color--search--passengers)] w-[24px] rounded flex justify-center items-center"
                    >
                      <p>+</p>
                    </button>
                  </div>
                </div>

                {actualSearchType !== "tour" && (
                  <div>
                    <label className="block mb-1">{classServices}</label>
                    <select
                      value={travelClass}
                      onChange={(e) => {
                        setTravelClass(e.target.value);

                        // Устанавливаем ключ для перевода при выборе нового значения
                        classOptions.forEach((option, idx) => {
                          if (option === e.target.value) {
                            if (actualSearchType === "air") {
                              if (idx === 0) setTravelClassKey("all");
                              else if (idx === 1) setTravelClassKey("economy");
                              else if (idx === 2) setTravelClassKey("business");
                            } else if (actualSearchType === "train") {
                              if (idx === 0) setTravelClassKey("all");
                              else if (idx === 1)
                                setTravelClassKey("platzkart");
                              else if (idx === 2) setTravelClassKey("coupe");
                              else if (idx === 3) setTravelClassKey("sitting");
                              else if (idx === 4) setTravelClassKey("sv");
                            }
                          }
                        });
                      }}
                      className="w-full border rounded px-2 py-1"
                    >
                      {classOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            <Image
              src="/images/Search/arrow_menu.svg"
              width={12.7}
              height={16.94}
              alt=""
              className="mr-2"
            />
          </div>

          {/* Кнопка поиска */}
          <div className="w-full h-full z-0 opacity-95">
            <button
              className="bg-[var(--color-btn-search-background)] hover:bg-[var(--color-btn-search-background-hover)] text-white p-4 rounded-2xl h-full w-full truncate"
              onClick={handleSearch}
            >
              {searchButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function getNightsLabel(n: number) {
    if (n === 1) return t("night");
    if (n >= 2 && n <= 4) return t("nights2to4");
    return t("nights5plus");
  }

  function handleSearch() {
    if (!from || !to || !date) {
      if (actualSearchType === "tour" && !to) {
        alert(t("pleaseSpecifyDestination"));
      } else {
        alert(t("pleaseFillRequiredFields"));
      }
      return;
    }

    let searchParams: Record<string, string> = {};

    // Базовые параметры для всех типов поиска
    searchParams.from = from;
    searchParams.to = to;
    searchParams.date = date;
    searchParams.passengers = passengers.toString();
    searchParams.search_type = actualSearchType;

    // Специфические параметры для каждого типа
    if (actualSearchType === "air" || actualSearchType === "train") {
      searchParams.class = travelClass;
      if (returnDate) searchParams.return_date = returnDate;
    } else if (actualSearchType === "tour") {
      searchParams.nights = nights.toString();
    }

    // Формируем URL для перехода на страницу результатов
    const queryString = new URLSearchParams(searchParams).toString();

    if (pathname === "/search") {
      // На странице поиска обновляем текущий URL и перезагружаем данные
      window.history.pushState({}, "", `/search?${queryString}`);
      // Перезагружаем страницу для обновления результатов поиска
      window.location.reload();
    } else {
      // На других страницах переходим на страницу поиска
      window.location.href = `/search?${queryString}`;
    }
  }
}
