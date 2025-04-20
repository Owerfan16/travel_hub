"use client";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const sortOptions = [
  { label: "Рекомендуемые", value: "recommended" },
  { label: "Сначала дешевые", value: "cheapest" },
  { label: "Сначала быстрые", value: "fastest" }, // если поиск туров то Ближе к морю, при создании тура у админа должна быть возможность поставить галочку Море и тогда должно появиться поле расстояние до моря в метрах для заполнения админом
  { label: "С ранним вылетом", value: "early-departure" }, // если поиск жд билетов то с ранним отправлением, если поиск туров то Ближе к центру города, у админа при создании экземпляра сущности должно быть поле для ввода расстояние до центра в киллометрах
  { label: "С ранним прибытием", value: "early-arrival" }, // если поиск туров то не отображаем
];
const checkboxLabels = [
  "Прямые рейсы", // если поиск жд билетов то Плацкарт, если поиск туров то С питанием
  "Одна пересадка", // если поиск жд билетов то Купе, если поиск туров то С домашними животными
  "Две пересадки", // если поиск жд билетов то СВ, если поиск туров то не отображаем
  "Без повторной регистрации", // если поиск жд билетов то Сидячий, если поиск туров то не отображаем
  "Без ночных пересадок", // если поиск жд билетов то Скоростной, если поиск туров то не отображаем
  "С возвратом", // если поиск туров то не отображаем
];

export default function Filtration() {
  const pathname = usePathname();
  const [selected, setSelected] = useState<string>("recommended");
  // Checkbox state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    Object.fromEntries(checkboxLabels.map((label) => [label, false]))
  );
  const toggleCheckbox = (label: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Range sliders state
  const [duration, setDuration] = useState<number>(60);
  const [cost, setCost] = useState<number>(0);
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
        <p className="truncate">Авиабилеты в название</p>
      </div>
      <div className="flex justify-between 2xl:hidden md:justify-start md:gap-8 mt-[12px] mx-[16px] mb-[20px]">
        <div className="flex items-center gap-2">
          {" "}
          {/* при нажатии пусть раскрывается Сортировка, при этом  если открыта фильтрация пусть она закрывается это только для экранов до 1535px*/}
          <Image
            src={"/images/sorting.svg"}
            alt="sort"
            width={18}
            height={18}
          />
          <p className="truncate">Сортировка</p>
        </div>
        <div className="flex items-center gap-2">
          {" "}
          {/* при нажатии пусть раскрывается Фильтрация, при этом  если открыта Сортировка пусть она закрывается, это только для экранов до 1535px*/}
          <Image
            src={"/images/filtration.svg"}
            alt="filter"
            width={18}
            height={18}
          />
          <p className="truncate">Фильтрация</p>
        </div>
      </div>
      <div className="hidden flex-col gap-9 2xl:flex">
        <div className="bg-[var(--color-hot_tickets-background)] rounded-2xl pl-6 pr-6 pb-4 pt-4 w-[400px] h-[237px] text-[20px] mr-10">
          {/* если результат туры то высота 672px */}
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
            <p>Сортировка</p>
          </h3>
          <ul className="space-y-1 ml-7">
            {sortOptions.map((opt) => (
              <li
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setSelected(opt.value)}
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
        <div className="w-[400px] bg-[var(--color-hot_tickets-background)] h-[510px] hidden 2xl:flex 2xl:flex-col mr-10 rounded-[15px] px-6 py-4">
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
            <h2 className="ml-2 text-[20px]">Фильтрация</h2>
          </div>
          {/* Checkbox list */}
          <div className="space-y-2 mb-3 ml-6">
            {checkboxLabels.map((label) => (
              <label key={label} className="flex items-center text-[20px]">
                <input
                  type="checkbox"
                  checked={checkedItems[label]}
                  onChange={() => toggleCheckbox(label)}
                  className="h-4 w-4 appearance-none border-2 rounded border-[#2786C9] checked:bg-[#2786C9] checked:border-[#2786C9] mr-3 relative before:content-[''] before:absolute before:inset-0 before:bg-transparent before:checked:bg-[#32A3F3]"
                />
                {label}
              </label>
            ))}
          </div>
          {/* Duration slider */}
          <div className="relative bottom-1">
            <div className="text-[20px] font-normal mb-2">
              Длительность пересадок
              {/* если поиск жд билетов то Время в пути, если поиск туров то Рейтинг */}
              {/* если поиск жд билетов то min 1, если поиск туров то min 1*/}
              {/* если поиск жд билетов то max 168, если поиск туров то max 5 */}
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
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
              До {duration} ч
            </div>
          </div>
          {/* Cost slider */}
          <div className="relative bottom-4">
            <div className="text-[20px] font-normal mb-2">Стоимость</div>
            {/* если туры то max 200000 */}
            <input
              type="range"
              min={0}
              max={50000}
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
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
              {cost === 0 ? "Любая" : "До " + cost + " ₽"}
            </div>
          </div>
          {/* Airlines button */}
          <button className="flex items-center text-[20px] relative bottom-3">
            <p>Авиакомпании</p>{" "}
            {/* Ж/Д компании если поиск по жд билетам, если туры то не отображаем*/}
            <svg
              width="9"
              height="14"
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 mt-[2px]"
            >
              <path
                d="M1 13L7.5571 7.37963C7.78991 7.18008 7.78991 6.81992 7.5571 6.62037L1 1"
                stroke="#2786C9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>{" "}
          {/* при нажатии на кнопку отображаем выбор авиакомпаний/жд компаний из нашей бд, нужно чтобы галочки ставились напротиив лого и названия авиакомпании и отображались авиабилеты тех авиакомпаний на которыъ стоят галочки, при этом по дефолту лддолжны отображаться билеты всех авиакомпаний, стилистику можно повторить например как у полей выбора класса в поиске*/}
        </div>
      </div>
    </div>
  );
}
