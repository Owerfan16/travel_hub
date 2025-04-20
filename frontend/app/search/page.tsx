"use client";

import { useEffect, useState } from "react";
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Определяем тип поиска на основе параметров URL
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";
    const nights = searchParams.get("nights");
    const referer = document.referrer;
    const explicitSearchType = searchParams.get("search_type");

    let type: "air" | "train" | "tour" = "air"; // По умолчанию - авиабилеты

    // Проверяем явно указанный тип поиска
    if (
      explicitSearchType &&
      ["air", "train", "tour"].includes(explicitSearchType)
    ) {
      type = explicitSearchType as "air" | "train" | "tour";
    }
    // Если тип не указан явно, определяем его по параметрам
    else if (nights) {
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

      params.append("page", currentPage.toString());

      let endpoint = "";
      if (type === "air") {
        endpoint = "/api/search/air-tickets/";
      } else if (type === "train") {
        endpoint = "/api/search/train-tickets/";
      } else if (type === "tour") {
        endpoint = "/api/search/tours/";
      }

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
            image: item.image || "/images/tour_prev.png",
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
        setResults(adaptedResults);
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
      return <div className="text-center py-10">Загрузка результатов...</div>;
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

    if (searchType === "tour") {
      return <TourCard tours={results as SearchTourResult[]} />;
    } else {
      return (
        <>
          {results.map((ticket) => (
            <Ticket
              key={ticket.id}
              ticket={ticket as SearchTicketResult}
              isTrainTicket={searchType === "train"}
            />
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
        <div className="w-full">
          {renderResults()}
          {hasMore && results.length > 0 && (
            <ButtonShowMore onClick={loadMore} isLoading={isLoading} />
          )}
        </div>
      </div>
    </>
  );
}
