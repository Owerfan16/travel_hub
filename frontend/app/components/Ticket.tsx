"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ru, enUS, zhCN } from "date-fns/locale";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../utils/useTranslation";
import { useLanguage } from "../context/LanguageContext";
import { useCurrency } from "../context/CurrencyContext";

interface Company {
  id: number;
  name: string;
  code: string;
  logo_url?: string | null;
}

interface TicketData {
  id: number;
  from_airport?: { city: { name: string }; name: string; code: string };
  to_airport?: { city: { name: string }; name: string; code: string };
  from_station?: { city: { name: string }; name: string };
  to_station?: { city: { name: string }; name: string };
  departure_time: string;
  arrival_time: string;
  duration: string;
  has_transfer?: boolean;
  transfer_city?: { name: string } | null;
  transfer_duration?: number | null;
  economy_price?: number;
  business_price?: number;
  coupe_price?: number;
  sv_price?: number;
  platzkart_price?: number;
  sitting_price?: number;
  airlines?: Company[];
  companies?: Company[];
  economy_available?: boolean;
  business_available?: boolean;
  coupe_available?: boolean;
  sv_available?: boolean;
  platzkart_available?: boolean;
  sitting_available?: boolean;
  departure_date: string;
  train_type?: string;
}

interface TicketProps {
  ticket: TicketData;
  isTrainTicket?: boolean;
}

export default function Ticket({ ticket, isTrainTicket = false }: TicketProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { t } = useTranslation("common");
  const { language } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    if (isTrainTicket) {
      return ticket.platzkart_available
        ? "platzkart"
        : ticket.coupe_available
        ? "coupe"
        : ticket.sv_available
        ? "sv"
        : "sitting";
    } else {
      return ticket.economy_available ? "economy" : "business";
    }
  });

  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate number of available classes
  const availableTrainClasses = [
    ticket.platzkart_available,
    ticket.coupe_available,
    ticket.sv_available,
    ticket.sitting_available,
  ].filter(Boolean);
  const numTrainClasses = availableTrainClasses.length;

  const availableAirClasses = [
    ticket.economy_available,
    ticket.business_available,
  ].filter(Boolean);
  const numAirClasses = availableAirClasses.length;

  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : null;
  };

  // Check if this ticket is in favorites
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      setIsFavorite(false); // Not logged in or loading, not a favorite
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return; // Should not happen if authenticated

    try {
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        const isInFavorites = favorites.some(
          (item: any) =>
            item.id === ticket.id &&
            (isTrainTicket ? item.type === "train" : item.type === "air")
        );
        setIsFavorite(isInFavorites);
      }
    } catch (error) {
      console.error(t("errorCheckingFavorites"), error);
    }
  }, [ticket.id, isTrainTicket, user, isAuthenticated, isAuthLoading, t]);

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!isAuthenticated || !user) {
      // Optionally: Redirect to login or show a message
      console.log(t("userNotLoggedInCannotSaveFavorites"));
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return;

    try {
      // Get current favorites
      const savedFavorites = localStorage.getItem(favoritesKey);
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      const type = isTrainTicket ? "train" : "air";

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(
          (item: any) => !(item.id === ticket.id && item.type === type)
        );
      } else {
        // Add to favorites
        favorites.push({
          id: ticket.id,
          type,
          data: ticket,
        });
      }

      // Save to localStorage
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(t("errorTogglingFavorite"), error);
    }
  };

  // Получаем локализованные дни недели
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

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      const weekdays = getWeekdays();
      const day = weekdays[date.getDay()];

      // Выбираем локаль в зависимости от текущего языка
      let dateLocale = ru;
      if (language === "en") dateLocale = enUS;
      else if (language === "zh") dateLocale = zhCN;

      // Форматируем как число, месяц, день недели
      return `${format(date, "d MMMM", { locale: dateLocale })}, ${day}`;
    } catch (e) {
      // В случае ошибки возвращаем исходную строку
      return dateString;
    }
  };

  // Получаем цену в зависимости от выбранного класса
  const getPrice = () => {
    if (isTrainTicket) {
      switch (selectedClass) {
        case "sitting":
          return ticket.sitting_price;
        case "platzkart":
          return ticket.platzkart_price;
        case "coupe":
          return ticket.coupe_price;
        case "sv":
          return ticket.sv_price;
        default:
          return ticket.coupe_price;
      }
    } else {
      return selectedClass === "economy"
        ? ticket.economy_price
        : ticket.business_price;
    }
  };

  // Получаем название города отправления
  const getFromCity = () => {
    if (isTrainTicket && ticket.from_station) {
      return ticket.from_station.city.name;
    } else if (!isTrainTicket && ticket.from_airport) {
      return ticket.from_airport.city.name;
    }
    // Если нет данных о станции/аэропорте, пытаемся извлечь город из строки
    if (typeof ticket.from === "string") {
      return ticket.from.split(",")[0].trim();
    }
    return "";
  };

  // Получаем название города прибытия
  const getToCity = () => {
    if (isTrainTicket && ticket.to_station) {
      return ticket.to_station.city.name;
    } else if (!isTrainTicket && ticket.to_airport) {
      return ticket.to_airport.city.name;
    }
    // Если нет данных о станции/аэропорте, пытаемся извлечь город из строки
    if (typeof ticket.to === "string") {
      return ticket.to.split(",")[0].trim();
    }
    return "";
  };

  // Получаем код аэропорта или название вокзала
  const getFromCode = () => {
    if (isTrainTicket && ticket.from_station) {
      return ticket.from_station.name;
    } else if (!isTrainTicket && ticket.from_airport) {
      return ticket.from_airport.code;
    }
    // В случае отсутствия данных, возвращаем пустую строку
    // или можно попытаться извлечь код из строки с названием
    if (typeof ticket.from === "string" && ticket.from.includes("(")) {
      const match = ticket.from.match(/\(([^)]+)\)/);
      return match ? match[1] : "";
    }
    return "";
  };

  const getToCode = () => {
    if (isTrainTicket && ticket.to_station) {
      return ticket.to_station.name;
    } else if (!isTrainTicket && ticket.to_airport) {
      return ticket.to_airport.code;
    }
    // В случае отсутствия данных, возвращаем пустую строку
    // или можно попытаться извлечь код из строки с названием
    if (typeof ticket.to === "string" && ticket.to.includes("(")) {
      const match = ticket.to.match(/\(([^)]+)\)/);
      return match ? match[1] : "";
    }
    return "";
  };

  // Получаем компании
  const getCompanies = () => {
    return isTrainTicket ? ticket.companies || [] : ticket.airlines || [];
  };

  // Получаем текст о пересадке
  const getTransferText = () => {
    if (
      !ticket.has_transfer ||
      !ticket.transfer_city ||
      !ticket.transfer_duration
    ) {
      return t("noTransfers");
    }

    const hours = Math.floor(ticket.transfer_duration / 60);
    const minutes = ticket.transfer_duration % 60;

    if (hours > 0 && minutes > 0) {
      return `${t("transfer")} ${ticket.transfer_city.name}, ${hours} ${t(
        "hours"
      )} ${minutes} ${t("minutes")}`;
    } else if (hours > 0) {
      return `${t("transfer")} ${ticket.transfer_city.name}, ${hours} ${t(
        "hours"
      )}`;
    } else {
      return `${t("transfer")} ${ticket.transfer_city.name}, ${minutes} ${t(
        "minutes"
      )}`;
    }
  };

  return (
    <div className="flex flex-col mb-4 lg:mb-9">
      <div className="overflow-hidden w-full rounded-[15px] flex flex-col lg:flex-row lg:w-[initial]">
        <div className="h-[168px] bg-[var(--color--ticket)] lg:rounded-l-[15px] px-[16px] lg:pl-[40px] lg:pr-[30px] py-[16px] lg:py-[24px] text-[var(--color-header-text-profile)] lg:w-[609px] lg:h-[237px] flex flex-col justify-between">
          <div className="flex justify-between relative">
            <div className="flex items-center gap-2">
              <Image
                src={"/images/calendar_stroke.svg"}
                alt="calendar"
                width={18}
                height={18}
              />
              <p className="text-[var(--color-header-text-profile)] lg:text-[20px]">
                {formatDate(ticket.departure_date)}
              </p>
            </div>
            <div className="absolute right-[0px] gap-3 flex lg:flex-col">
              {getCompanies()
                .slice(0, 2)
                .map((company, index) => (
                  <div key={company.id} className="flex gap-3 lg:justify-end">
                    <p className="hidden lg:flex items-center text-[20px]">
                      {company.name}
                    </p>
                    {company.logo_url ? (
                      <Image
                        src={company.logo_url}
                        alt={company.name}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-[30px] h-[30px] bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">{company.code}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center pt-[14px]">
            <div>
              <div className="flex">
                <div>
                  <p className="justify-center hidden lg:flex">
                    {getFromCode()}
                  </p>
                  <p className="font-medium lg:text-[24px] flex justify-center">
                    {getFromCity()}
                  </p>
                  <p className="flex justify-center lg:text-[18px]">
                    {ticket.departure_time}
                  </p>
                </div>
                <p className="px-2 font-medium lg:flex lg:items-center lg:text-[24px]">
                  —
                </p>
              </div>
            </div>
            <div>
              <p className="justify-center hidden lg:flex">{getToCode()}</p>
              <p className="font-medium lg:text-[24px] flex justify-center">
                {getToCity()}
              </p>
              <p className="flex justify-center lg:text-[18px]">
                {ticket.arrival_time}
              </p>
            </div>
          </div>
          <div className="flex justify-between pt-[18px]">
            <div className="flex gap-2">
              <Image
                src="/images/clock_card.svg"
                alt="duration"
                width={16}
                height={16}
              />
              <p className="lg:text-[20px] truncate">
                {ticket.duration} в пути
              </p>
            </div>
            <div className="inline">
              {/* Версия для мобильных */}
              <span className="inline lg:hidden truncate flex items-center">
                {isTrainTicket ? (
                  <>
                    <span>
                      {getTransferText().length > 15
                        ? `${getTransferText().substring(0, 15)}...`
                        : getTransferText()}
                    </span>
                  </>
                ) : (
                  getTransferText().split(" ").slice(0, 2).join(" ")
                )}
              </span>

              {/* Версия для десктопов */}
              <span className="hidden lg:inline text-[20px] lg:flex items-center">
                {isTrainTicket ? <></> : null}
                {getTransferText()}
              </span>
            </div>
          </div>
        </div>
        <div className="h-[124px] bg-[var(--color--ticket-right)] lg:rounded-r-[15px] px-[16px] py-[16px] justify-between flex flex-col lg:w-[341px] lg:h-[237px] lg:px-[40px] lg:py-[24px]">
          <div className="flex justify-between items-center">
            <p className="font-medium text-[24px] text-[var(--color--price-ticket)] lg:text-[32px] leading-none">
              {formatCurrency(getPrice() || 0)}
            </p>
            <button
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={toggleFavorite}
              disabled={!isAuthenticated || isAuthLoading}
              title={
                !isAuthenticated
                  ? "Войдите, чтобы добавить в избранное"
                  : "Добавить в избранное"
              }
            >
              <svg
                width="26"
                height="23"
                viewBox="0 0 26 23"
                fill={
                  isFavorite && isAuthenticated
                    ? "var(--color--favourites-color)"
                    : "none"
                }
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.618 15.7315C18.206 17.0945 16.4113 18.7216 14.2304 20.6146C14.2301 20.6149 14.2298 20.6151 14.2295 20.6154L13 21.6782L11.7708 20.6156C11.7705 20.6154 11.7703 20.6152 11.77 20.6149C9.58976 18.721 7.79474 17.0936 6.38159 15.7311C4.97316 14.3731 3.87249 13.1724 3.06726 12.1269C2.26088 11.0799 1.7328 10.1623 1.44371 9.37083C1.14774 8.56044 1.00081 7.73624 1 6.89329C1.0001 5.1905 1.57986 3.8141 2.74159 2.694C3.90555 1.57176 5.35113 1 7.15 1C8.13606 1 9.06822 1.20012 9.95614 1.60085C10.8455 2.00221 11.6074 2.56467 12.2499 3.29346L13 4.14432L13.7501 3.29345C14.3926 2.56467 15.1545 2.00221 16.0439 1.60085C16.9318 1.20012 17.8639 1 18.85 1C20.6489 1 22.0944 1.57176 23.2584 2.694C24.4202 3.81419 25 5.19074 25 6.89373C25 7.7356 24.8535 8.55975 24.5575 9.37111C24.2685 10.163 23.7403 11.0803 22.9333 12.1262C22.1268 13.1715 21.0258 14.3725 19.618 15.7315Z"
                  stroke="var(--color--favourites-color)"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex w-[260px] h-[68px] justify-between items-center gap-2">
            {isTrainTicket ? (
              <>
                {/* Классы для ж/д билетов */}
                {ticket.platzkart_available && (
                  <div
                    className={`h-[42px] border-2 w-full ${
                      selectedClass === "platzkart"
                        ? "border-[var(--color--ticket-choise-active)]"
                        : "border-[var(--color--ticket-choise)]"
                    } rounded-[15px] flex flex-col items-center justify-center cursor-pointer ${
                      numTrainClasses === 1 ? "w-full" : "px-2"
                    }`}
                    onClick={() => setSelectedClass("platzkart")}
                  >
                    <p>Плацкарт</p>
                  </div>
                )}
                {ticket.coupe_available && (
                  <div
                    className={`h-[42px] border-2 w-full ${
                      selectedClass === "coupe"
                        ? "border-[var(--color--ticket-choise-active)]"
                        : "border-[var(--color--ticket-choise)]"
                    } rounded-[15px] flex flex-col items-center justify-center cursor-pointer ${
                      numTrainClasses === 1 ? "w-full" : "px-2"
                    }`}
                    onClick={() => setSelectedClass("coupe")}
                  >
                    <p>Купе</p>
                  </div>
                )}
                {ticket.sv_available && (
                  <div
                    className={`h-[42px] border-2 w-full ${
                      selectedClass === "sv"
                        ? "border-[var(--color--ticket-choise-active)]"
                        : "border-[var(--color--ticket-choise)]"
                    } rounded-[15px] flex flex-col items-center justify-center cursor-pointer ${
                      numTrainClasses === 1 ? "w-full" : "px-2"
                    }`}
                    onClick={() => setSelectedClass("sv")}
                  >
                    <p>СВ</p>
                  </div>
                )}
                {ticket.sitting_available && (
                  <div
                    className={`h-[42px] border-2 w-full ${
                      selectedClass === "sitting"
                        ? "border-[var(--color--ticket-choise-active)]"
                        : "border-[var(--color--ticket-choise)]"
                    } rounded-[15px] flex flex-col items-center justify-center cursor-pointer ${
                      numTrainClasses === 1 ? "w-full" : "px-2"
                    }`}
                    onClick={() => setSelectedClass("sitting")}
                  >
                    <p>Сидячий</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Классы для авиабилетов */}
                {ticket.economy_available && (
                  <div
                    className={`h-[42px] border-2 ${
                      selectedClass === "economy"
                        ? "border-[var(--color--ticket-choise-active)]"
                        : "border-[var(--color--ticket-choise)]"
                    } rounded-[15px] flex flex-col items-center justify-center cursor-pointer ${
                      numAirClasses === 1 ? "w-full" : "w-[122px]"
                    }`}
                    onClick={() => setSelectedClass("economy")}
                  >
                    <p>Эконом</p>
                  </div>
                )}
                {ticket.business_available && (
                  <div
                    className={`h-[42px] border-2 ${
                      selectedClass === "business"
                        ? "border-[var(--color--ticket-choise-active)]"
                        : "border-[var(--color--ticket-choise)]"
                    } rounded-[15px] flex flex-col items-center justify-center cursor-pointer ${
                      numAirClasses === 1 ? "w-full" : "w-[122px]"
                    }`}
                    onClick={() => setSelectedClass("business")}
                  >
                    <p>Бизнес</p>
                  </div>
                )}
              </>
            )}
          </div>
          <button className="bg-[var(--color--ticket-button)] h-[48px] cursor-pointer w-full rounded-2xl text-[var(--color-header-text-profile)] lg:text-[20px]">
            <p>{t("choose")}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
