"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePathname } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export default function Search() {
  const [from, setFrom] = useState("");
  const pathname = usePathname();
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [nights, setNights] = useState(7);
  const [showNightsDropdown, setShowNightsDropdown] = useState(false);
  const [travelClass, setTravelClass] = useState(
    pathname === "/trains" ? "все" : pathname === "/" ? "эконом" : ""
  );
  const [showPassengersDropdown, setShowPassengersDropdown] = useState(false);

  const dateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  const passengerContainerRef = useRef<HTMLDivElement>(null);
  const nightsContainerRef = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const weekdays = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [isToFocused, setIsToFocused] = useState(false);

  const fetchCitySuggestions = async (
    query: string,
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5&languageCode=ru&types=CITY`,
        {
          headers: {
            "X-RapidAPI-Key":
              "7fff0fe389msh5682c0ea3be013ap1e0da3jsna31ca7e53999",
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );

      const data = await response.json();
      if (data?.data) {
        const cities = data.data.map(
          (city: any) => `${city.name}, ${city.country}`
        );
        setSuggestions(cities);
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
    if (pathname === "/tours") {
      if (passengers === 1) return "турист";
      if (passengers >= 2 && passengers <= 4) return "туриста";
      return "туристов";
    }

    if (passengers === 1) return "пассажир, ";
    if (passengers >= 2 && passengers <= 4) return "пассажира, ";
    return "пассажиров, ";
  };

  let typePerson: string = "";
  let classServices: string = "";
  let textSearchDate: string = "";
  let class1: string = "";
  let class2: string = "";
  let class3: string = "купе";
  let class4: string = "сидячий";
  let class5: string = "СВ";

  if (pathname === "/tours") {
    textSearchDate = "7 ночей";
    typePerson = "Количество туристов";
    classServices = "";
  } else {
    textSearchDate = "Обратно";
    typePerson = "Количество пассажиров";
    classServices = "Класс обслуживания";
  }

  let searchButton: string = "";
  if (pathname === "/") {
    class1 = "эконом";
    class2 = "бизнес";
    searchButton = "авиабилеты";
  } else if (pathname === "/tours") {
    searchButton = "туры";
  } else if (pathname === "/trains") {
    class1 = "все";
    class2 = "плацкарт";
    searchButton = "ж/д билеты";
  }

  const formatDate = (raw: string) => {
    if (!raw) return "";
    const dateObj = parseISO(raw);
    const day = weekdays[dateObj.getDay()];
    const formatted = format(dateObj, "d MMMM", { locale: ru });
    return `${formatted}, ${day}`;
  };

  let Background_Image: string = "";
  if (pathname === "/") {
    Background_Image =
      theme === "light"
        ? "/images/background_airplanes_light.avif"
        : "/images/background_airplanes_night.avif";
  } else if (pathname === "/tours") {
    Background_Image =
      theme === "light"
        ? "/images/background_tours_light.avif"
        : "/images/background_tours_night.avif";
  } else if (pathname === "/trains") {
    Background_Image =
      theme === "light"
        ? "/images/background_trains_light.avif"
        : "/images/background_trains_night.avif";
  }

  return (
    <div className="relative min-h-[464px] lg:min-h-[690px] md:min-h-[248px]">
      <div className="absolute inset-0 z-10">
        <Image
          src={Background_Image}
          width={2168}
          height={787}
          className="w-full h-[464px] object-cover object-center md:h-[248px] lg:h-[690px]"
          style={{ objectPosition: "center 36%" }}
          alt="Background"
          quality={100}
          priority
        />
      </div>

      <div className="w-full relative z-20 px-[24px] lg:pt-[570px] md:px-[36px] [@media(min-width:1992px)]:px-0 max-w-[1920px] mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Откуда с подсказками */}
          <div className="relative h-full">
            <div
              className="relative opacity-95 h-full bg-[var(--color-search-background)] rounded-2xl p-4 flex items-center cursor-text"
              onClick={() => fromInputRef.current?.focus()}
            >
              <input
                ref={fromInputRef}
                type="text"
                placeholder="Откуда"
                className="w-full outline-none opacity-95 placeholder:text-[var(--color-primary-text)]"
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
                placeholder="Куда"
                className="w-full outline-none placeholder:text-[var(--color-primary-text)]"
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

          {/* Остальные элементы остаются без изменений */}
          {/* Дата */}
          <div
            className="relative bg-[var(--color-search-background)] opacity-95 rounded-2xl p-4 flex justify-between items-center cursor-pointer"
            onClick={() => dateRef.current?.showPicker()}
          >
            <span className="">{date ? formatDate(date) : "Когда"}</span>
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

          {/* Обратно / Ночи */}
          {pathname === "/tours" ? (
            <div
              ref={nightsContainerRef}
              className="relative opacity-95 bg-[var(--color-search-background)] rounded-2xl p-4 flex justify-between items-center cursor-pointer"
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
                <div className="absolute border-[0.5px] z-20 border-[#6B6B6B] top-full left-0 mt-2 bg-[var(--color-search-background)] rounded-xl shadow-md w-60 p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Количество ночей:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNights((prev) => Math.max(1, prev - 1));
                        }}
                        className="px-2 py-1 bg-gray-200 w-[24px] rounded"
                      >
                        <p className="text-[#0D0D0F]">-</p>
                      </button>
                      <span>{nights}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNights((prev) => Math.min(30, prev + 1));
                        }}
                        className="px-2 py-1 bg-gray-200 w-[24px] rounded"
                      >
                        <p className="text-[#0D0D0F]">+</p>
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
              <span className="">
                {returnDate ? formatDate(returnDate) : textSearchDate}
              </span>
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
            <div>
              {passengers} {getPassengerLabel()}
              {travelClass}
            </div>

            {showPassengersDropdown && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute border-[0.5px] z-20 !opacity-100 border-[#6B6B6B] top-full left-0 mt-2 bg-[var(--color-search-background)] rounded-xl shadow-md w-60 p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span>{typePerson}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setPassengers((prev) => Math.max(1, prev - 1))
                      }
                      className="px-2 py-1 bg-gray-200 w-[24px] rounded flex justify-center items-center"
                    >
                      <p className="text-[#0D0D0F]">-</p>
                    </button>
                    <span>{passengers}</span>
                    <button
                      onClick={() =>
                        setPassengers((prev) => Math.min(10, prev + 1))
                      }
                      className="px-2 py-1 bg-gray-200 w-[24px] rounded flex justify-center items-center"
                    >
                      <p className="text-[#0D0D0F]">+</p>
                    </button>
                  </div>
                </div>

                {pathname !== "/tours" && (
                  <div>
                    <label className="block mb-1">Класс обслуживания</label>
                    <select
                      value={travelClass}
                      onChange={(e) => setTravelClass(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option>{class1}</option>
                      <option>{class2}</option>
                      {pathname !== "/" && (
                        <>
                          <option>{class3}</option>
                          <option>{class4}</option>
                          <option>{class5}</option>
                        </>
                      )}
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
            <button className="bg-[var(--color-btn-search-background)] hover:bg-[var(--color-btn-search-background-hover)] text-white p-4 rounded-2xl h-full w-full">
              Найти {searchButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function getNightsLabel(n: number) {
    const last = n % 10;
    if (n >= 11 && n <= 14) return "ночей";
    if (last === 1) return "ночь";
    if (last >= 2 && last <= 4) return "ночи";
    return "ночей";
  }
}
