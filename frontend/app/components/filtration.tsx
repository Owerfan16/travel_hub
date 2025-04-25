"use client";
import Image from "next/image";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "../utils/useTranslation";

interface SortOption {
  label: string;
  value: string;
}

interface FiltrationProps {
  searchType?: "air" | "train" | "tour";
}

export default function Filtration({ searchType = "air" }: FiltrationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [selected, setSelected] = useState<string>("recommended");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortingOpen, setIsSortingOpen] = useState(false);

  const getSortOptions = (): SortOption[] => {
    const base = [
      { label: t("sortingRecommended"), value: "recommended" },
      { label: t("sortingCheapFirst"), value: "price_asc" },
      { label: t("sortingExpensiveFirst"), value: "price_desc" },
    ];

    if (searchType === "air") {
      return [
        ...base,
        { label: t("sortingFastFirst"), value: "duration" },
        { label: t("sortingEarlyDeparture"), value: "early_departure" },
        { label: t("sortingEarlyArrival"), value: "early_arrival" },
      ];
    } else if (searchType === "train") {
      return [
        ...base,
        { label: t("sortingFastFirst"), value: "duration" },
        { label: t("sortingEarlyDeparture"), value: "early_departure" },
        { label: t("sortingEarlyArrival"), value: "early_arrival" },
      ];
    } else if (searchType === "tour") {
      return [
        ...base,
        { label: t("sortingByRating"), value: "rating" },
        { label: t("sortingCloserToCenter"), value: "center_distance" },
      ];
    }

    return base;
  };

  const sortOptions = getSortOptions();

  const getCheckboxLabels = (): { label: string; value: string }[] => {
    if (searchType === "air") {
      return [
        { label: t("directFlights"), value: "direct" },
        { label: t("oneTransfer"), value: "one_transfer" },
        { label: t("twoTransfers"), value: "two_transfers" },
        { label: t("noReregistration"), value: "no_reregistration" },
        { label: t("noNightTransfers"), value: "no_night_transfers" },
        { label: t("refundable"), value: "refundable" },
      ];
    } else if (searchType === "train") {
      return [
        { label: t("platzkart"), value: "platzkart" },
        { label: t("coupe"), value: "coupe" },
        { label: t("sv"), value: "sv" },
        { label: t("sitting"), value: "sitting" },
      ];
    } else if (searchType === "tour") {
      return [
        { label: t("withFood"), value: "food" },
        { label: t("withPets"), value: "pets" },
        { label: t("nearSea"), value: "near_sea" },
      ];
    }

    return [];
  };

  const checkboxLabels = getCheckboxLabels();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    Object.fromEntries(checkboxLabels.map((item) => [item.value, false]))
  );

  const toggleCheckbox = (value: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));

    const params = new URLSearchParams(searchParams.toString());

    if (!checkedItems[value]) {
      params.set(value, "true");
    } else {
      params.delete(value);
    }

    // Плавно прокручиваем страницу вверх
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Добавляем небольшую задержку перед переходом, чтобы анимация успела запуститься
    setTimeout(() => {
      router.push(`${pathname}?${params.toString()}`);
    }, 100);
  };

  const getDurationSettings = () => {
    if (searchType === "air") {
      return {
        label: t("transferDuration"),
        min: 0,
        max: 24,
        unit: t("hours"),
        param: "transfer_duration",
      };
    } else if (searchType === "train") {
      return {
        label: t("travelTime"),
        min: 1,
        max: 72,
        unit: t("hours"),
        param: "duration",
      };
    } else if (searchType === "tour") {
      return {
        label: t("rating"),
        min: 1,
        max: 5,
        unit: "",
        step: 0.1,
        param: "rating",
      };
    }

    return {
      label: t("transferDuration"),
      min: 0,
      max: 24,
      unit: t("hours"),
      param: "transfer_duration",
    };
  };

  const getPriceSettings = () => {
    if (searchType === "tour") {
      return {
        max: 200000,
        param: "price_per_night",
      };
    }

    return {
      max: 50000,
      param: searchType === "air" ? "economy_price" : "coupe_price",
    };
  };

  const durationSettings = getDurationSettings();
  const priceSettings = getPriceSettings();

  const [duration, setDuration] = useState<number>(durationSettings.min);
  const [cost, setCost] = useState<number>(0);

  // Получаем кол-во ночей для туров из URL параметров
  const getNightsFromUrl = () => {
    if (searchType === "tour") {
      const nightsParam = searchParams.get("nights");
      if (nightsParam && !isNaN(parseInt(nightsParam))) {
        return parseInt(nightsParam);
      }
    }
    return 7; // значение по умолчанию
  };

  const handleDurationChange = (value: number) => {
    setDuration(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value > durationSettings.min) {
      params.set(durationSettings.param, value.toString());
    } else {
      params.delete(durationSettings.param);
    }

    // Плавно прокручиваем страницу вверх
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Добавляем небольшую задержку перед переходом, чтобы анимация успела запуститься
    setTimeout(() => {
      router.push(`${pathname}?${params.toString()}`);
    }, 100);
  };

  const handlePriceChange = (value: number) => {
    setCost(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value > 0) {
      params.set(priceSettings.param, value.toString());
    } else {
      params.delete(priceSettings.param);
    }

    // Сохраняем параметр nights для туров при фильтрации по цене
    const nightsParam = searchParams.get("nights");
    if (searchType === "tour" && !params.has("nights") && nightsParam) {
      params.set("nights", nightsParam);
    }

    // Плавно прокручиваем страницу вверх
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Добавляем небольшую задержку перед переходом, чтобы анимация успела запуститься
    setTimeout(() => {
      router.push(`${pathname}?${params.toString()}`);
    }, 100);
  };

  const [showCompanies, setShowCompanies] = useState(false);
  const [companyList, setCompanyList] = useState<
    Array<{ id: number; name: string; code: string; logo_url?: string }>
  >([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  // Загружаем список компаний с сервера при изменении типа поиска
  useEffect(() => {
    if (searchType === "air" || searchType === "train") {
      setIsLoadingCompanies(true);
      const endpoint =
        searchType === "air" ? "/api/airlines/" : "/api/railway-companies/";

      fetch(`http://localhost:8000${endpoint}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Не удалось загрузить список компаний");
          }
          return response.json();
        })
        .then((data) => {
          setCompanyList(data);
          console.log(`Загружено ${data.length} компаний:`, data);
        })
        .catch((error) => {
          console.error("Ошибка загрузки компаний:", error);
        })
        .finally(() => {
          setIsLoadingCompanies(false);
        });
    }
  }, [searchType]);

  const getCompanies = () => {
    if (companyList && companyList.length > 0) {
      return companyList.map((company) => ({
        id: company.id,
        name: company.name,
        logo:
          company.logo_url ||
          `/images/companies/${searchType === "air" ? "aeroflot" : "rzd"}.png`,
        value: company.code,
      }));
    }

    // Запасной вариант, если компании не загрузились
    if (searchType === "air") {
      return [
        {
          id: 1,
          name: "Аэрофлот",
          logo: "/images/companies/aeroflot.png",
          value: "4",
        },
        {
          id: 2,
          name: "S7 Airlines",
          logo: "/images/companies/s7.png",
          value: "2",
        },
        {
          id: 3,
          name: "Уральские авиалинии",
          logo: "/images/companies/utair.png",
          value: "3",
        },
        {
          id: 4,
          name: "Победа",
          logo: "/images/companies/pobeda.png",
          value: "1",
        },
        {
          id: 5,
          name: "Азимут",
          logo: "/images/companies/pobeda.png",
          value: "5",
        },
      ];
    } else if (searchType === "train") {
      return [
        { id: 1, name: "РЖД", logo: "/images/companies/rzd.png", value: "1" },
      ];
    }
    return [];
  };

  const companies = getCompanies();

  const [selectedCompanies, setSelectedCompanies] = useState<
    Record<number, boolean>
  >(Object.fromEntries(companies.map((company) => [company.id, true])));

  const toggleCompany = (id: number, value: string) => {
    setSelectedCompanies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    const params = new URLSearchParams(searchParams.toString());
    const companyParam = searchType === "air" ? "airlines" : "companies";

    // Получаем все выбранные компании после переключения текущей
    const updatedCompanies = {
      ...selectedCompanies,
      [id]: !selectedCompanies[id],
    };
    const selectedValues = companies
      .filter((company) => updatedCompanies[company.id])
      .map((company) => company.value);

    // Обновляем параметр в URL
    if (selectedValues.length > 0) {
      // Передаем как массив в JSON формате для корректной обработки в page.tsx
      params.set(companyParam, JSON.stringify(selectedValues));
    } else {
      params.delete(companyParam);
    }

    // Плавно прокручиваем страницу вверх
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Добавляем небольшую задержку перед переходом, чтобы анимация успела запуститься
    setTimeout(() => {
      router.push(`${pathname}?${params.toString()}`);
    }, 100);
  };

  const getCompaniesLabel = () => {
    if (searchType === "air") {
      return t("airlines");
    } else if (searchType === "train") {
      return t("railwayCompanies");
    }
    return "";
  };

  const toggleSorting = () => {
    setIsSortingOpen(!isSortingOpen);
    setIsFilterOpen(false);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsSortingOpen(false);
  };

  const handleSortChange = (value: string) => {
    setSelected(value);

    const params = new URLSearchParams(searchParams.toString());

    // Если выбрано "recommended", преобразуем в "recommendation" для бэкенда
    // или удаляем параметр, так как "recommendation" - это значение по умолчанию
    if (value === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    // Обязательно сохраняем параметр nights для правильной сортировки туров по общей цене
    const nightsParam = searchParams.get("nights");
    if (searchType === "tour" && !params.has("nights") && nightsParam) {
      params.set("nights", nightsParam);
    }

    // Плавно прокручиваем страницу вверх
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Добавляем небольшую задержку перед переходом, чтобы анимация успела запуститься
    setTimeout(() => {
      router.push(`${pathname}?${params.toString()}`);
    }, 100);
  };

  // Initialize filters from URL params
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSelected(sortParam);
    }

    // Set price filter
    const priceParam = searchParams.get(priceSettings.param);
    if (priceParam) {
      setCost(Number(priceParam));
    }

    // Set duration filter
    const durationParam = searchParams.get(durationSettings.param);
    if (durationParam) {
      setDuration(Number(durationParam));
    }

    // Set checkboxes
    const newCheckedItems = { ...checkedItems };
    checkboxLabels.forEach((item) => {
      const isChecked = searchParams.get(item.value) === "true";
      newCheckedItems[item.value] = isChecked;
    });
    setCheckedItems(newCheckedItems);

    // Set companies
    const companyParam = searchType === "air" ? "airlines" : "companies";
    const companyParamValue = searchParams.get(companyParam);
    let selectedCompanyValues: string[] = [];

    if (companyParamValue) {
      try {
        // Пробуем распарсить как JSON
        const parsed = JSON.parse(companyParamValue);
        if (Array.isArray(parsed)) {
          selectedCompanyValues = parsed;
        }
      } catch (e) {
        // Если не получилось, обрабатываем как строку с разделителями
        selectedCompanyValues = companyParamValue.split(",");
      }
    }

    if (selectedCompanyValues.length > 0) {
      const newSelectedCompanies = { ...selectedCompanies };
      companies.forEach((company) => {
        newSelectedCompanies[company.id] = selectedCompanyValues.includes(
          company.value
        );
      });
      setSelectedCompanies(newSelectedCompanies);
    } else if (companies.length > 0) {
      // Если компании не выбраны в URL, выбираем все по умолчанию
      const allCompanies = Object.fromEntries(
        companies.map((company) => [company.id, true])
      );
      setSelectedCompanies(allCompanies);
    }
  }, [searchParams, searchType]);

  return (
    <div className="">
      <div className="flex items-center gap-2 lg:hidden mt-[16px] mx-[16px]">
        <button>
          <Image
            src={"/images/Arrowtosity.svg"}
            alt="filtration"
            width={18}
            height={18}
          />
        </button>
        <p className="truncate">
          {searchType === "air"
            ? t("airTickets")
            : searchType === "train"
            ? t("trainTickets")
            : t("tours")}{" "}
          в название
        </p>
      </div>
      <div className="flex justify-between 2xl:hidden md:justify-start md:gap-8 mt-[12px] mx-[16px] mb-[20px]">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={toggleSorting}
        >
          <Image
            src={"/images/sorting.svg"}
            alt="sort"
            width={18}
            height={18}
          />
          <p className="truncate">{t("sorting")}</p>
        </div>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={toggleFilter}
        >
          <Image
            src={"/images/filtration.svg"}
            alt="filter"
            width={18}
            height={18}
          />
          <p className="truncate">{t("filtration")}</p>
        </div>
      </div>

      {/* Мобильный блок сортировки */}
      {isSortingOpen && (
        <div className="bg-[var(--color-hot_tickets-background)] rounded-2xl mb-4 p-4 2xl:hidden">
          <h3 className="flex items-center gap-2 mb-1 text-[18px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-1"
            >
              <path
                d="M9 6H19H9ZM9 10H19H9ZM9 14H19H9ZM9 2H19H9ZM3.5 19V1V19ZM3.5 19C2.8 19 1.492 17.006 1 16.5L3.5 19ZM3.5 19C4.2 19 5.508 17.006 6 16.5L3.5 19Z"
                fill="#0D0D0F"
              />
              <path
                d="M9 6H19M9 10H19M9 14H19M9 2H19M3.5 19V1M3.5 19C2.8 19 1.492 17.006 1 16.5M3.5 19C4.2 19 5.508 17.006 6 16.5"
                stroke="var(--color-primary-text)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>{t("sorting")}</p>
          </h3>
          <ul className="space-y-1 ml-7">
            {sortOptions.map((opt) => (
              <li
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleSortChange(opt.value)}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors
                ${
                  selected === opt.value
                    ? "bg-[#2786C9] border-[#2786C9]"
                    : "border-[#2786C9]"
                }
              `}
                />
                <span
                  className={`transition-colors
                ${
                  selected === opt.value
                    ? ""
                    : "text-[var(--color--sorting--not-active)]"
                }
              `}
                >
                  {opt.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Мобильный блок фильтрации */}
      {isFilterOpen && (
        <div className="bg-[var(--color-hot_tickets-background)] rounded-2xl p-4 mb-4 2xl:hidden">
          <h3 className="flex items-center mb-2 text-[18px]">
            <svg
              width="18"
              height="15"
              viewBox="0 0 18 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M6.75 5.04981e-07C6.05177 -0.000397841 5.37061 0.234884 4.8004 0.673421C4.23018 1.11196 3.79899 1.73216 3.56625 2.44855H0V3.82567H3.56625C3.79868 4.54253 4.22971 5.16328 4.79992 5.60236C5.37014 6.04144 6.05147 6.27723 6.75 6.27723C7.44853 6.27723 8.12986 6.04144 8.70008 5.60236C9.27029 5.16328 9.70132 4.54253 9.93375 3.82567H18V2.44855H9.93375C9.70101 1.73216 9.26981 1.11196 8.6996 0.673421C8.12939 0.234884 7.44823 -0.000397841 6.75 5.04981e-07ZM11.25 8.72278C10.5518 8.72238 9.87061 8.95766 9.3004 9.3962C8.73019 9.83473 8.29899 10.4549 8.06625 11.1713H0V12.5484H8.06625C8.29868 13.2653 8.72971 13.8861 9.29992 14.3251C9.87014 14.7642 10.5515 15 11.25 15C11.9485 15 12.6299 14.7642 13.2001 14.3251C13.7703 13.8861 14.2013 13.2653 14.4338 12.5484H18V11.1713H14.4338C14.201 10.4549 13.7698 9.83473 13.1996 9.3962C12.6294 8.95766 11.9482 8.72238 11.25 8.72278Z"
                fill="var(--color-primary-text)"
              />
            </svg>
            <p>{t("filtration")}</p>
          </h3>

          {/* Чекбоксы */}
          <div className="space-y-2 mb-3 ml-6">
            {checkboxLabels.map((item) => (
              <label key={item.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedItems[item.value] ?? false}
                  onChange={() => toggleCheckbox(item.value)}
                  className="h-4 w-4 appearance-none border-2 rounded border-[#2786C9] checked:bg-[#2786C9] checked:border-[#2786C9] mr-3 relative before:content-[''] before:absolute before:inset-0 before:bg-transparent before:checked:bg-[#32A3F3]"
                />
                {item.label}
              </label>
            ))}
          </div>

          {/* Слайдер длительности */}
          <div className="mb-4">
            <div className="text-[16px] font-normal mb-2">
              {durationSettings.label}
            </div>
            <input
              type="range"
              min={durationSettings.min}
              max={durationSettings.max}
              value={duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              step={durationSettings.step || 1}
              className="
              w-full h-2 bg-[var(--color--slider--sorting)] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#2786C9]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-none
            "
            />
            <div className="text-[14px] text-right select-none mt-1">
              {searchType === "tour"
                ? t("upTo") + " " + duration.toFixed(1)
                : t("upTo") +
                  " " +
                  duration +
                  (durationSettings.unit ? ` ${durationSettings.unit}` : "")}
            </div>
          </div>

          {/* Слайдер стоимости */}
          <div className="mb-4">
            <div className="text-[16px] font-normal mb-2">
              {searchType === "tour" ? t("totalCost") : t("cost")}
            </div>
            <input
              type="range"
              min={0}
              max={priceSettings.max}
              value={cost}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="
              w-full h-2 bg-[var(--color--slider--sorting)] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#2786C9]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-none
            "
            />
            <div className="text-[14px] text-right select-none mt-1">
              {cost === 0
                ? t("priceAny")
                : t("priceUpTo", { price: cost.toString() })}
              {searchType === "tour" && cost > 0
                ? ` ${t("forNights")} ${getNightsFromUrl()} ${t("nights")}`
                : ""}
            </div>
          </div>

          {/* Кнопка выбора компаний */}
          {(searchType === "air" || searchType === "train") && (
            <button
              className="flex items-center justify-between w-full text-[16px]"
              onClick={() => setShowCompanies(!showCompanies)}
            >
              <p>{getCompaniesLabel()}</p>
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform ${
                  showCompanies ? "rotate-90" : ""
                }`}
              >
                <path
                  d="M1 13L7.5571 7.37963C7.78991 7.18008 7.78991 6.81992 7.5571 6.62037L1 1"
                  stroke="#2786C9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {/* Список компаний */}
          {showCompanies &&
            (searchType === "air" || searchType === "train") && (
              <div className="mt-3 space-y-2 ml-3">
                {companies.map((company) => (
                  <label key={company.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCompanies[company.id] ?? false}
                      onChange={() => toggleCompany(company.id, company.value)}
                      className="h-4 w-4 appearance-none border-2 rounded border-[#2786C9] checked:bg-[#2786C9] checked:border-[#2786C9] relative before:content-[''] before:absolute before:inset-0 before:bg-transparent before:checked:bg-[#32A3F3]"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-6 flex items-center justify-center overflow-hidden"></div>
                      <span>{company.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Десктопный интерфейс */}
      <div className="hidden flex-col gap-9 2xl:flex">
        <div
          className={`bg-[var(--color-hot_tickets-background)] rounded-2xl pl-6 pr-6 pb-4 pt-4 w-[400px] ${
            searchType === "tour" ? "" : ""
          } text-[20px] mr-10`}
        >
          <h3 className="flex items-center gap-2 mb-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-1"
            >
              <path
                d="M9 6H19H9ZM9 10H19H9ZM9 14H19H9ZM9 2H19H9ZM3.5 19V1V19ZM3.5 19C2.8 19 1.492 17.006 1 16.5L3.5 19ZM3.5 19C4.2 19 5.508 17.006 6 16.5L3.5 19Z"
                fill="#0D0D0F"
              />
              <path
                d="M9 6H19M9 10H19M9 14H19M9 2H19M3.5 19V1M3.5 19C2.8 19 1.492 17.006 1 16.5M3.5 19C4.2 19 5.508 17.006 6 16.5"
                stroke="var(--color-primary-text)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>{t("sorting")}</p>
          </h3>
          <ul className="space-y-1 ml-7">
            {sortOptions.map((opt) => (
              <li
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => handleSortChange(opt.value)}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors
                ${
                  selected === opt.value
                    ? "bg-[#2786C9] border-[#2786C9]"
                    : "border-[#2786C9]"
                }
              `}
                />
                <span
                  className={`transition-colors
                ${
                  selected === opt.value
                    ? ""
                    : "text-[var(--color--sorting--not-active)]"
                }
              `}
                >
                  {opt.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-[400px] bg-[var(--color-hot_tickets-background)] lg:mb-20 hidden 2xl:flex 2xl:flex-col mr-10 rounded-[15px] px-6 py-4">
          <div className="flex items-center mb-1">
            <svg
              width="18"
              height="15"
              viewBox="0 0 18 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.75 5.04981e-07C6.05177 -0.000397841 5.37061 0.234884 4.8004 0.673421C4.23018 1.11196 3.79899 1.73216 3.56625 2.44855H0V3.82567H3.56625C3.79868 4.54253 4.22971 5.16328 4.79992 5.60236C5.37014 6.04144 6.05147 6.27723 6.75 6.27723C7.44853 6.27723 8.12986 6.04144 8.70008 5.60236C9.27029 5.16328 9.70132 4.54253 9.93375 3.82567H18V2.44855H9.93375C9.70101 1.73216 9.26981 1.11196 8.6996 0.673421C8.12939 0.234884 7.44823 -0.000397841 6.75 5.04981e-07ZM11.25 8.72278C10.5518 8.72238 9.87061 8.95766 9.3004 9.3962C8.73019 9.83473 8.29899 10.4549 8.06625 11.1713H0V12.5484H8.06625C8.29868 13.2653 8.72971 13.8861 9.29992 14.3251C9.87014 14.7642 10.5515 15 11.25 15C11.9485 15 12.6299 14.7642 13.2001 14.3251C13.7703 13.8861 14.2013 13.2653 14.4338 12.5484H18V11.1713H14.4338C14.201 10.4549 13.7698 9.83473 13.1996 9.3962C12.6294 8.95766 11.9482 8.72238 11.25 8.72278Z"
                fill="var(--color-primary-text)"
              />
            </svg>
            <h2 className="ml-2 text-[20px]">{t("filtration")}</h2>
          </div>

          {/* Checkbox list */}
          <div className="space-y-2 mb-3 ml-6">
            {checkboxLabels.map((item) => (
              <label key={item.value} className="flex items-center text-[20px]">
                <input
                  type="checkbox"
                  checked={checkedItems[item.value] ?? false}
                  onChange={() => toggleCheckbox(item.value)}
                  className="h-4 w-4 appearance-none border-2 rounded border-[#2786C9] checked:bg-[#2786C9] checked:border-[#2786C9] mr-3 relative before:content-[''] before:absolute before:inset-0 before:bg-transparent before:checked:bg-[#32A3F3]"
                />
                {item.label}
              </label>
            ))}
          </div>

          {/* Duration slider */}
          <div className="relative bottom-1">
            <div className="text-[20px] font-normal mb-2">
              {durationSettings.label}
            </div>
            <input
              type="range"
              min={durationSettings.min}
              max={durationSettings.max}
              value={duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              step={durationSettings.step || 1}
              className="
              w-full h-2 bg-[var(--color--slider--sorting)] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#2786C9]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-none
            "
            />
            <div className="text-[16px] text-right select-none mt-1">
              {searchType === "tour"
                ? t("upTo") + " " + duration.toFixed(1)
                : t("upTo") +
                  " " +
                  duration +
                  (durationSettings.unit ? ` ${durationSettings.unit}` : "")}
            </div>
          </div>

          {/* Cost slider */}
          <div className="relative bottom-4">
            <div className="text-[20px] font-normal mb-2">
              {searchType === "tour" ? t("totalCost") : t("cost")}
            </div>
            <input
              type="range"
              min={0}
              max={priceSettings.max}
              value={cost}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="
              w-full h-2 bg-[var(--color--slider--sorting)] rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#2786C9]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:border-none
            "
            />
            <div className="text-[16px] text-right select-none mt-1">
              {cost === 0
                ? t("priceAny")
                : t("priceUpTo", { price: cost.toString() })}
              {searchType === "tour" && cost > 0
                ? ` ${t("forNights")} ${getNightsFromUrl()} ${t("nights")}`
                : ""}
            </div>
          </div>

          {/* Компании */}
          {(searchType === "air" || searchType === "train") && (
            <button
              className="flex items-center text-[20px] relative bottom-3"
              onClick={() => setShowCompanies(!showCompanies)}
            >
              <p>{getCompaniesLabel()}</p>
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 mt-[2px] transition-transform ${
                  showCompanies ? "rotate-90" : ""
                }`}
              >
                <path
                  d="M1 13L7.5571 7.37963C7.78991 7.18008 7.78991 6.81992 7.5571 6.62037L1 1"
                  stroke="#2786C9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}

          {/* Список компаний */}
          {showCompanies &&
            (searchType === "air" || searchType === "train") && (
              <div className="mt-3 space-y-2 ml-3">
                {companies.map((company) => (
                  <label key={company.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCompanies[company.id] ?? false}
                      onChange={() => toggleCompany(company.id, company.value)}
                      className="h-4 w-4 appearance-none border-2 rounded border-[#2786C9] checked:bg-[#2786C9] checked:border-[#2786C9] relative before:content-[''] before:absolute before:inset-0 before:bg-transparent before:checked:bg-[#32A3F3]"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-6 flex items-center justify-center overflow-hidden"></div>
                      <span>{company.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
