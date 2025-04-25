"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Search from "../components/Search";
import Filtration from "../components/filtration";
import Ticket from "../components/Ticket";
import ButtonShowMore from "../components/Button_show_more";
import TourCard from "../components/Tours_card";

interface SearchResult {
  id: number;
  [key: string]: any;
}

interface SearchTourResult extends SearchResult {
  hotel_name: string;
  hotel_stars: number;
  rating: number;
  price_per_night: number;
  food_included: boolean;
  pets_allowed: boolean;
  image: string;
  city: {
    name: string;
    country: {
      name: string;
    };
  };
}

interface SearchTicketResult extends SearchResult {
  departure_time: string;
  arrival_time: string;
  duration: string;
  departure_date: string;
  from_airport?: { city: { name: string }; name: string; code: string };
  to_airport?: { city: { name: string }; name: string; code: string };
  from_station?: { city: { name: string }; name: string };
  to_station?: { city: { name: string }; name: string };
  has_transfer?: boolean;
  transfer_city?: { name: string } | null;
  transfer_duration?: number | null;
  economy_price?: number;
  business_price?: number;
  coupe_price?: number;
  sv_price?: number;
  platzkart_price?: number;
  sitting_price?: number;
  airlines?: {
    id: number;
    name: string;
    code: string;
    logo_url?: string | null;
  }[];
  companies?: {
    id: number;
    name: string;
    code: string;
    logo_url?: string | null;
  }[];
  economy_available?: boolean;
  business_available?: boolean;
  coupe_available?: boolean;
  sv_available?: boolean;
  platzkart_available?: boolean;
  sitting_available?: boolean;
  [key: string]: any;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchType, setSearchType] = useState<"air" | "train" | "tour">("air"); // По умолчанию - авиабилеты
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterChange, setIsFilterChange] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nights, setNights] = useState<number>(7); // Значение по умолчанию - 7 ночей
  const [scrollPosition, setScrollPosition] = useState(0);
  const [prevParams, setPrevParams] = useState<string>("");
  const resultsRef = useRef<HTMLDivElement>(null);
  // Состояние для анимации
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  // Добавляем CSS для анимации в head
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
      
      .search-result-item {
        animation-duration: 0.3s;
        animation-fill-mode: both;
      }
      
      .search-result-item-enter {
        animation-name: fadeIn;
      }
      
      .search-result-item-exit {
        animation-name: fadeOut;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Эффект для анимации при изменении searchParams
  useEffect(() => {
    if (page === 1 && !isLoading && results.length > 0) {
      // Анимация выхода
      setIsAnimatingOut(true);

      // После завершения анимации, обновляем searchParams
      const animationTimeout = setTimeout(() => {
        setIsAnimatingOut(false);
        setIsAnimatingIn(true);

        // После появления элементов, снимаем класс анимации
        const appearTimeout = setTimeout(() => {
          setIsAnimatingIn(false);
        }, 500);

        return () => {
          clearTimeout(appearTimeout);
        };
      }, 300);

      return () => {
        clearTimeout(animationTimeout);
      };
    }
  }, [searchParams]);

  // Сохраняем позицию скролла при изменении фильтров
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Этот эффект выполняется только при изменении фильтров для восстановления скролла
  useEffect(() => {
    if (isFilterChange && !isLoading && scrollPosition > 0) {
      window.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    }
  }, [isLoading, isFilterChange, scrollPosition]);

  // Эффект для плавного скролла при изменении параметров поиска
  useEffect(() => {
    // Если это не первая загрузка страницы (searchParams изменились)
    // и это не загрузка следующей страницы пагинации
    if (page === 1 && !isLoading) {
      // Плавно прокручиваем страницу вверх
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // Проверяем, изменились ли только фильтры или сортировка
    const currentParams = searchParams.toString();
    const baseParams = new URLSearchParams(searchParams);

    // Удаляем параметры фильтрации и сортировки для сравнения базовых параметров
    [
      "sort",
      "transfer_duration",
      "max_transfer_duration",
      "duration",
      "rating",
      "economy_price",
      "coupe_price",
      "price_per_night",
      "direct",
      "one_transfer",
      "two_transfers",
      "no_reregistration",
      "no_night_transfers",
      "refundable",
      "airlines",
      "platzkart",
      "coupe",
      "sv",
      "sitting",
      "companies",
      "with_food",
      "with_pets",
      "near_sea",
    ].forEach((param) => {
      baseParams.delete(param);
    });

    const isOnlyFilterChange =
      prevParams !== "" &&
      baseParams.toString() === new URLSearchParams(prevParams).toString() &&
      currentParams !== prevParams;

    setPrevParams(currentParams);

    // Сохраняем текущую позицию скролла перед загрузкой новых результатов
    if (isOnlyFilterChange) {
      setScrollPosition(window.scrollY);
      setIsFilterChange(true);
    } else {
      setIsFilterChange(false);
    }

    // Определяем тип поиска на основе параметров URL
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";
    const nightsParam = searchParams.get("nights");
    const referer = document.referrer;
    const explicitSearchType = searchParams.get("search_type");

    // Устанавливаем количество ночей из параметров URL, если есть
    if (nightsParam) {
      const nightsValue = parseInt(nightsParam, 10);
      if (!isNaN(nightsValue) && nightsValue > 0) {
        setNights(nightsValue);
      }
    }

    let type: "air" | "train" | "tour" = "air"; // По умолчанию - авиабилеты

    // Проверяем явно указанный тип поиска
    if (
      explicitSearchType &&
      ["air", "train", "tour"].includes(explicitSearchType)
    ) {
      type = explicitSearchType as "air" | "train" | "tour";
    }
    // Если тип не указан явно, определяем его по параметрам
    else if (nightsParam) {
      type = "tour"; // Если указаны ночи - это поиск туров
    } else {
      // Анализируем from и to для определения типа (авиа или ж/д)
      if (from.includes("вокзал") || to.includes("вокзал")) {
        type = "train";
      } else if (referer.includes("/trains")) {
        // Если пользователь пришел со страницы поезда
        type = "train";
      }
    }

    setSearchType(type);

    // Если нам дали только город (например "Москва, Россия") без указания
    // конкретного вокзала или аэропорта, и мы не определили тип явно,
    // попробуем сначала найти поезда, а если не найдем - самолеты
    if (
      type === "air" &&
      !explicitSearchType &&
      !from.includes("(") &&
      !to.includes("(") &&
      !nights
    ) {
      // Сначала попытаемся найти поезда
      fetchSearchResults("train", 1).then((hasResults) => {
        if (!hasResults) {
          // Если поезда не найдены, ищем самолеты
          fetchSearchResults("air", 1);
        }
      });
    } else {
      fetchSearchResults(type, 1);
    }
  }, [searchParams]);

  const fetchSearchResults = async (
    type: "air" | "train" | "tour",
    currentPage: number
  ): Promise<boolean> => {
    // При смене фильтров показываем анимацию исчезновения
    if (currentPage === 1 && results.length > 0) {
      setIsAnimatingOut(true);

      // Небольшая задержка перед началом загрузки, чтобы анимация была видна
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsAnimatingOut(false);
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      // Базовые параметры
      const fromParam = searchParams.get("from");
      const toParam = searchParams.get("to");

      if (fromParam) {
        // Для поиска по городам и аэропортам/вокзалам
        if (type === "air") {
          // Проверяем, содержит ли параметр код аэропорта в скобках
          const airportCodeMatch = fromParam.match(/\(([A-Z]{3})\)/);
          if (airportCodeMatch) {
            params.append("from_airport", airportCodeMatch[1]);
          } else {
            // Иначе ищем по городу
            const cityName = fromParam.split(",")[0].trim();
            params.append("from_city", cityName);
          }
        } else if (type === "train") {
          // Для поиска по вокзалам проверяем, содержит ли параметр название вокзала
          const stationMatch = fromParam.match(/\(([^)]+)\)/);
          if (stationMatch) {
            params.append("from_station_name", stationMatch[1]);
          } else {
            // Иначе ищем по городу
            const cityName = fromParam.split(",")[0].trim();
            params.append("from_city", cityName);
          }
        }
      }

      if (toParam) {
        // Аналогичная логика для параметра "to"
        if (type === "air") {
          const airportCodeMatch = toParam.match(/\(([A-Z]{3})\)/);
          if (airportCodeMatch) {
            params.append("to_airport", airportCodeMatch[1]);
          } else {
            const cityName = toParam.split(",")[0].trim();
            params.append("to_city", cityName);
          }
        } else if (type === "train") {
          const stationMatch = toParam.match(/\(([^)]+)\)/);
          if (stationMatch) {
            params.append("to_station_name", stationMatch[1]);
          } else {
            const cityName = toParam.split(",")[0].trim();
            params.append("to_city", cityName);
          }
        } else if (type === "tour") {
          // Для туров используем город назначения (to) для поиска
          const cityName = toParam.split(",")[0].trim();
          params.append("city", cityName);
        }
      }

      const dateParam = searchParams.get("date");
      if (dateParam) params.append("date", dateParam);

      const passengersParam = searchParams.get("passengers");
      if (passengersParam) params.append("passengers", passengersParam);

      // Специфичные параметры
      if (type === "air" || type === "train") {
        const classParam = searchParams.get("class");
        if (classParam && classParam !== "все")
          params.append("class", classParam);

        const returnDateParam = searchParams.get("return_date");
        if (returnDateParam) params.append("return_date", returnDateParam);
      } else if (type === "tour") {
        const nightsParam = searchParams.get("nights");
        if (nightsParam) params.append("nights", nightsParam);
      }

      // Adding filter parameters
      // Sort parameter
      const sortParam = searchParams.get("sort");
      if (sortParam) {
        // Передаем параметр сортировки как есть, без преобразования
        // API должен поддерживать значения early_departure и early_arrival напрямую
        params.append("sort", sortParam);

        // Добавляем отладочную информацию
        console.log(`Applying sort: ${sortParam}`);
      }

      // Duration filters
      if (type === "air") {
        const transferDuration = searchParams.get("transfer_duration");
        if (transferDuration && parseInt(transferDuration) > 0) {
          params.append("max_transfer_duration", transferDuration);
        }
      } else if (type === "train") {
        const duration = searchParams.get("duration");
        if (duration && parseInt(duration) > 0) {
          params.append("max_duration", duration);
        }
      } else if (type === "tour") {
        const rating = searchParams.get("rating");
        if (rating) {
          params.append("min_rating", rating);
        }
      }

      // Price filters
      if (type === "air") {
        const economyPrice = searchParams.get("economy_price");
        if (economyPrice && parseInt(economyPrice) > 0) {
          params.append("max_economy_price", economyPrice);
        }
      } else if (type === "train") {
        const coupePrice = searchParams.get("coupe_price");
        if (coupePrice && parseInt(coupePrice) > 0) {
          params.append("max_coupe_price", coupePrice);
        }
      } else if (type === "tour") {
        const pricePerNight = searchParams.get("price_per_night");
        if (pricePerNight && parseInt(pricePerNight) > 0) {
          // Передаем max_price_per_night как есть - бэкенд теперь интерпретирует его как общую стоимость
          params.append("max_price_per_night", pricePerNight);
          console.log(
            `Применен фильтр по общей стоимости тура: ${pricePerNight} руб.`
          );
        }
      }

      // Type filters (checkbox filters)
      if (type === "air") {
        // Direct flights and transfers filters
        const direct = searchParams.get("direct");
        if (direct === "true") params.append("direct", "true");

        const oneTransfer = searchParams.get("one_transfer");
        if (oneTransfer === "true") params.append("max_transfers", "1");

        const twoTransfers = searchParams.get("two_transfers");
        if (twoTransfers === "true") params.append("max_transfers", "2");

        const noReregistration = searchParams.get("no_reregistration");
        if (noReregistration === "true")
          params.append("no_reregistration", "true");

        const noNightTransfers = searchParams.get("no_night_transfers");
        if (noNightTransfers === "true")
          params.append("no_night_transfers", "true");

        const refundable = searchParams.get("refundable");
        if (refundable === "true") params.append("refundable", "true");

        // Airlines filter with proper handling
        const airlines = searchParams.get("airlines");
        if (airlines) {
          try {
            // Проверяем, возможно, это строка в формате JSON
            const parsedAirlines = JSON.parse(airlines);
            if (Array.isArray(parsedAirlines) && parsedAirlines.length > 0) {
              // Теперь parsedAirlines содержит сразу коды авиакомпаний,
              // которые используются в API
              const airlinesCodes = parsedAirlines.join(",");
              console.log(
                "Applying airlines filter with codes:",
                airlinesCodes
              );
              params.append("airlines", airlinesCodes);
            }
          } catch (e) {
            // Если не удалось распарсить как JSON, используем как обычную строку
            if (airlines.length > 0) {
              console.log("Applying airlines filter as string:", airlines);
              params.append("airlines", airlines);
            }
          }
        }
      } else if (type === "train") {
        // Train class filters
        const platzkart = searchParams.get("platzkart");
        if (platzkart === "true") params.append("platzkart", "true");

        const coupe = searchParams.get("coupe");
        if (coupe === "true") params.append("coupe", "true");

        const sv = searchParams.get("sv");
        if (sv === "true") params.append("sv", "true");

        const sitting = searchParams.get("sitting");
        if (sitting === "true") params.append("sitting", "true");

        // Train companies filter with proper handling
        const companies = searchParams.get("companies");
        if (companies) {
          try {
            // Проверяем, возможно, это строка в формате JSON
            const parsedCompanies = JSON.parse(companies);
            if (Array.isArray(parsedCompanies) && parsedCompanies.length > 0) {
              // Теперь parsedCompanies содержит сразу коды компаний,
              // которые используются в API
              const companiesCodes = parsedCompanies.join(",");
              console.log(
                "Applying companies filter with codes:",
                companiesCodes
              );
              params.append("companies", companiesCodes);
            }
          } catch (e) {
            // Если не удалось распарсить как JSON, используем как обычную строку
            if (companies.length > 0) {
              console.log("Applying companies filter as string:", companies);
              params.append("companies", companies);
            }
          }
        }
      } else if (type === "tour") {
        // Tour filters
        const food = searchParams.get("food");
        if (food === "true") params.append("food", "true");

        const pets = searchParams.get("pets");
        if (pets === "true") params.append("pets", "true");

        const nearSea = searchParams.get("near_sea");
        if (nearSea === "true") params.append("near_sea", "true");
      }

      params.append("page", currentPage.toString());

      let endpoint = "";
      if (type === "air") {
        endpoint = "/api/search/air-tickets/";
      } else if (type === "train") {
        endpoint = "/api/search/train-tickets/";
      } else if (type === "tour") {
        endpoint = "/api/search/tours/";
      }

      console.log("API request params:", params.toString()); // Отладочный вывод для проверки параметров

      const response = await fetch(
        `http://localhost:8000${endpoint}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data); // Отладочный вывод

      // Обработка разных форматов ответа API
      let resultsData: SearchResult[] = [];
      let hasNextPage = false;

      if (data && typeof data === "object") {
        if (Array.isArray(data)) {
          // Если ответ - массив
          resultsData = data;
        } else if (data.results && Array.isArray(data.results)) {
          // Если ответ имеет структуру { results: [...] }
          resultsData = data.results;
          hasNextPage = !!data.next;
        } else {
          // Если ответ - объект не стандартной структуры
          resultsData = Object.values(data).filter(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              typeof item.id === "number"
          ) as SearchResult[];
        }
      }

      // Адаптация данных для соответствующих интерфейсов
      const adaptedResults = resultsData.map((item) => {
        if (type === "tour") {
          // Адаптация для структуры тура
          return {
            ...item,
            hotel_name: item.hotel_name || item.name || "",
            hotel_stars: item.hotel_stars || 0,
            rating: item.rating || 0,
            price_per_night: item.price_per_night || 0,
            food_included: !!item.food_included,
            pets_allowed: !!item.pets_allowed,
            image: item.image_url || item.image || "/images/tour_prev.png",
          };
        } else {
          // Адаптация для структуры билета
          return {
            ...item,
            departure_time: item.departure_time || "00:00",
            arrival_time: item.arrival_time || "00:00",
            duration: item.duration || "0ч",
            departure_date:
              item.departure_date ||
              item.date ||
              new Date().toISOString().slice(0, 10),
          };
        }
      });

      if (currentPage === 1) {
        // Устанавливаем новые результаты с анимацией появления
        setResults(adaptedResults);
        setIsAnimatingIn(true);

        // Через некоторое время убираем класс анимации
        setTimeout(() => {
          setIsAnimatingIn(false);
        }, 500);

        // Если это был первичный поиск, обновим тип поиска
        if (type !== searchType) {
          setSearchType(type);
        }
      } else {
        setResults((prev) => [...prev, ...adaptedResults]);
      }

      setHasMore(hasNextPage || adaptedResults.length >= 10); // Предполагаем, что есть следующая страница, если получили 10+ элементов
      setPage(currentPage);

      return adaptedResults.length > 0;
    } catch (error) {
      console.error("Error fetching search results:", error);
      if (currentPage === 1) {
        setResults([]);
      }
      setHasMore(false);
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить результаты. Пожалуйста, попробуйте позже."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchSearchResults(searchType, page + 1);
    }
  };

  const renderResults = () => {
    if (isLoading && page === 1) {
      // Не показываем ничего во время загрузки
      return null;
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-500">
          <p className="mb-4">Ошибка: {error}</p>
          <button
            onClick={() => fetchSearchResults(searchType, 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    if (!results || results.length === 0) {
      return (
        <div className="text-center py-10">
          Нет результатов для вашего запроса
        </div>
      );
    }

    const animationClass = isAnimatingOut
      ? "search-result-item search-result-item-exit"
      : isAnimatingIn
      ? "search-result-item search-result-item-enter"
      : "";

    if (searchType === "tour") {
      return (
        <TourCard
          tours={results as SearchTourResult[]}
          nights={nights}
          className={animationClass}
        />
      );
    } else {
      return (
        <>
          {results.map((ticket, index) => (
            <div
              key={ticket.id}
              className={animationClass}
              style={{
                animationDelay: `${isAnimatingIn ? index * 0.05 : 0}s`,
                animationDuration: "0.3s",
              }}
            >
              <Ticket
                ticket={ticket as SearchTicketResult}
                isTrainTicket={searchType === "train"}
              />
            </div>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <Search />
      <div className="2xl:flex min-h-screen px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 mx-auto max-w-[1920px]">
        <Filtration searchType={searchType} />
        <div className="w-full" ref={resultsRef}>
          {renderResults()}
          {hasMore && results.length > 0 && !isLoading && (
            <ButtonShowMore onClick={loadMore} isLoading={isLoading} />
          )}
        </div>
      </div>
    </>
  );
}
