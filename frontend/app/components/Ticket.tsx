"use client";
import Image from "next/image";

import { usePathname } from "next/navigation";

export default function Ticket() {
  const pathname = usePathname();
  const textTransfer = "1 пересадка в название, 2 ч";
  return (
    <div className="flex flex-col gap-4 lg:gap-9">
      {/* первый билет */}
      <div className="overflow-hidden w-full rounded-[15px] flex flex-col lg:flex-row lg:w-[initial]">
        <div className="h-[168px] bg-[var(--color--ticket)] lg:rounded-l-[15px] px-[16px] lg:pl-[40px] lg:pr-[30px] py-[16px] lg:py-[24px] text-[var(--color-header-text-profile)] lg:w-[609px] lg:h-[237px] flex flex-col justify-between">
          <div className="flex justify-between relative">
            <div className="flex items-center gap-2">
              <Image
                src={"/images/calendar_stroke.svg"}
                alt="arrow"
                width={18}
                height={18}
              />
              <p className="text-[var(--color-header-text-profile)] lg:text-[20px]">
                1 Марта, суббота
              </p>
            </div>
            <div className="absolute right-[0px] gap-3 flex lg:flex-col">
              <div className="flex gap-3">
                <p className="hidden lg:flex items-center text-[20px]">
                  Название
                </p>
                {/* используем экземпляры из существующих сущностей, админ выбирает при создании, если он выбрал создать авиабилет то выбирает из авиакомпаний, если жд то из жд компаний*/}
                <Image
                  src="/images/company_defolt.svg"
                  alt="arrow"
                  width={30}
                  height={30}
                />
              </div>
              <div className="flex gap-3">
                <p className="hidden lg:flex items-center text-[20px]">
                  Название
                </p>
                {/* отображается если админ при создании добавил 2 авиа/жд компании*/}
                <Image
                  src="/images/company_defolt.svg"
                  alt="arrow"
                  width={30}
                  height={30}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center pt-[14px]">
            <div>
              <div className="flex">
                <div>
                  <p className="justify-center hidden lg:flex">DME</p>{" "}
                  {/* если жд билет то название вокзала*/}
                  <p className="font-medium lg:text-[24px] flex justify-center">
                    Иркутск
                  </p>
                  <p className="flex justify-center lg:text-[18px]">13:00</p>
                </div>
                <p className="px-2 font-medium lg:flex lg:items-center lg:text-[24px]">
                  —
                </p>
              </div>
            </div>
            <div>
              <p className="justify-center hidden lg:flex">IKT</p>{" "}
              {/* если жд билет то название вокзала*/}
              <p className="font-medium lg:text-[24px] flex justify-center">
                Москва
              </p>
              <p className="flex justify-center lg:text-[18px]">13:00</p>
            </div>
          </div>
          <div className="flex justify-between pt-[18px]">
            <div className="flex gap-2">
              <Image
                src="/images/clock_card.svg"
                alt="arrow"
                width={16}
                height={16}
              />
              <p className="lg:text-[20px] truncate">8 ч 35 м в пути</p>
            </div>
            <div className="inline">
              {/* Версия для мобильных */}
              <span className="inline lg:hidden truncate">
                {textTransfer.split(" ").slice(0, 2).join(" ")}{" "}
                {/* если жд билет то тип состава, например "026Г (двухэтажный состав)", тип состава должен должен быть отдельной сущностью у которого должна быть возможность поставить галочку "Скоростной, версии для мобильных и для десктопов для жд билетов не нужны, нужна одна общая в которой в стилях нужно добавить truncate*/}
              </span>

              {/* Версия для десктопов */}
              <span className="hidden lg:inline text-[20px]">
                {textTransfer}
              </span>
            </div>
          </div>
        </div>
        <div className="h-[124px] bg-[var(--color--ticket-right)] lg:rounded-r-[15px] px-[16px] py-[16px] justify-between flex flex-col lg:w-[341px] lg:h-[237px] lg:px-[40px] lg:py-[24px]">
          <div className="flex justify-between items-center">
            <p className="font-medium text-[24px] text-[var(--color--price-ticket)] lg:text-[32px] leading-none">
              8 600 ₽
            </p>
            <button className="cursor-pointer">
              <svg
                width="26"
                height="23"
                viewBox="0 0 26 23"
                fill="none"
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
          <div className="hidden lg:flex w-[260px] h-[68px] justify-between items-center">
            <div className="w-[122px] h-[42px] border-2 border-[var(--color--ticket-choise-active)] rounded-[15px] flex flex-col items-center justify-center cursor-pointer">
              <p>Эконом</p>{" "}
              {/* если в поиске все то отображаем все доступные типы (макс 3), типы добавляет админ при создании билета, если в поиске Плацкарт то отображаем только плацкарт на всю ширину (260px) и тд, с авиа аналогично, если типа два то 122 на 42, отступы между 17px, если три то отступы между по 16px, размер в зависимости от длины текста, но чтобы заполняли полностью (260px) */}
              {/* если жд билет то Плацкарт, при создании билета в админ панели должны добавляться типы плацкарт Купе СВ сидячий и для каждого типа админ должен вводить цену, при этом тип может хоть один хоть три, нужно чтобы тип переключался*/}
            </div>
            <div className="w-[122px] h-[42px] border-2 border-[var(--color--ticket-choise)] rounded-[15px] flex flex-col items-center justify-center cursor-pointer">
              <p>Бизнес</p> {/* если жд билет то Купе */}
            </div>
          </div>
          <button className="bg-[var(--color--ticket-button)] h-[48px] cursor-pointer w-full rounded-2xl text-[var(--color-header-text-profile)] lg:text-[20px]">
            <p>Выбрать</p>
          </button>
        </div>
      </div>
    </div>
  );
}
