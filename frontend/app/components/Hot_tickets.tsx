"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTickets, Ticket } from "../context/TicketsContext";
import { Tooltip } from "./Tooltip";

const formatPrice = (price: number) => price.toLocaleString("ru-RU");

export default function HotTickets() {
  const pathname = usePathname();
  const {
    airTickets,
    trainTickets,
    airTicketsLoading,
    trainTicketsLoading,
    airTicketsError,
    trainTicketsError,
  } = useTickets();

  // Определяем тип билетов и заголовок в зависимости от страницы
  const isTrainsPage = pathname === "/trains";
  const title = isTrainsPage ? "Горячие ж/д билеты" : "Горячие авиабилеты";

  // Используем соответствующие данные в зависимости от страницы
  const tickets = isTrainsPage ? trainTickets : airTickets;
  const isLoading = isTrainsPage ? trainTicketsLoading : airTicketsLoading;
  const error = isTrainsPage ? trainTicketsError : airTicketsError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[var(--color-btn-search-background)] hover:bg-[var(--color-btn-search-background-hover)] text-white rounded-2xl"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        Нет доступных билетов
      </div>
    );
  }

  return (
    <div className="relative z-0 mb-9">
      <h2 className="text-2xl mt-[46px] px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 max-w-[1920px] mb-5 font-medium mx-auto text-[var(--color-text-heading)]">
        {title}
      </h2>

      <div className="relative group !max-w-[2060px] mx-auto">
        {/* Navigation arrows - visible only on desktop */}
        <div className="hidden lg:block">
          {/* Кнопка "Назад" */}
          <button className="swiper-button-prev !ml-[18px] absolute !w-[27px] !h-[40px] !left-0 !bg-transparent !shadow-none">
            <span className="absolute inset-0 bg-[var(--color-arrow-button)] clip-arrow rounded-l-[8px] transition-colors hover:bg-[var(--color-arrow-hover)]">
              <svg
                width="27"
                height="40"
                viewBox="0 0 27 40"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4"
              >
                <path
                  d="M17 25L10.5696 20.4069C10.2904 20.2075 10.2904 19.7925 10.5696 19.5931L17 15"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </button>

          {/* Кнопка "Вперед" */}
          <button className="swiper-button-next mr-[18px] relative !w-[27px] !h-[40px] !right-0 !bg-transparent !shadow-none">
            <span className="absolute inset-0 bg-[var(--color-arrow-button)] clip-arrow-reverse rounded-r-[8px] transition-colors hover:bg-[var(--color-arrow-hover)]">
              <svg
                width="27"
                height="40"
                viewBox="0 0 27 40"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rotate-180"
              >
                <path
                  d="M17 25L10.5696 20.4069C10.2904 20.2075 10.2904 19.7925 10.5696 19.5931L17 15"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </button>
        </div>

        <Swiper
          modules={[FreeMode, Navigation]}
          spaceBetween={16}
          navigation={{
            enabled: true,
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          cssMode={true}
          mousewheel={true}
          keyboard={true}
          slidesPerView="auto"
          freeMode={true}
          className="!overflow-visible !px-[24px] md:!px-[60px] [@media(min-width:2040px)]:!px-0 !max-w-[1920px]"
          breakpoints={{
            320: {
              slidesPerView: 1.1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2.1,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1440: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
        >
          {tickets.map((ticket) => (
            <SwiperSlide
              key={ticket.id}
              className="!w-[316px] rounded-[15px] !h-[176px] bg-[var(--color-hot_tickets-background)] transition-shadow duration-300 p-4 select-none cursor-pointer"
            >
              <div className="flex flex-col h-full justify-between position: relative">
                <div className="flex justify-between">
                  <div className="flex items-start gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 153 153"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.9761 126.397V60.5542H142.024V126.397C142.024 134.843 134.839 142.026 126.391 142.026H26.6087C18.1878 142.026 10.9761 134.849 10.9761 126.397ZM109.851 3.97587L109.979 14.3314H110.426H127.056C140.577 14.3314 153 26.1623 153 42.2646V124.402C153 130.549 151.463 136.749 148.206 141.224C147.63 142.016 147.221 142.572 146.595 143.271C143.415 146.827 141.22 148.702 136.468 150.77C133.042 152.261 129.181 153 124.396 153H28.6043C20.7085 153 13.2126 150.404 7.90458 145.097C2.61165 139.805 0 132.277 0 124.402V42.5972C0 33.9044 2.99589 27.078 7.39766 22.7251C12.1698 18.0056 18.4906 14.3314 25.9435 14.3314H42.574H42.9988L42.8725 4.09424C42.8451 1.87874 44.6311 0.0496691 46.847 0.0235305L48.8195 0.000280966C51.0339 -0.025732 52.8613 1.75785 52.8887 3.97172L53.0165 14.3314H53.55H99.45H99.9615L99.8352 4.09839C99.8078 1.88289 101.594 0.053814 103.81 0.0276754L105.782 0.00442894C107.997 -0.021584 109.824 1.762 109.851 3.97587ZM110.115 25.3051L110.238 35.2837C110.265 37.4992 108.479 39.3281 106.263 39.3543L104.291 39.3775C102.076 39.4036 100.249 37.6199 100.222 35.4061L100.097 25.3051H99.45H53.55H53.152L53.2751 35.2795C53.3024 37.495 51.5165 39.324 49.3005 39.3501L47.3282 39.3734C45.1137 39.3995 43.2863 37.6158 43.2589 35.4019L43.1343 25.3051H42.574H25.6109C18.4682 25.3051 10.8504 32.3785 10.8504 40.9345L10.9761 49.913H142.024L142.15 40.9345C142.15 32.3587 134.52 25.3051 127.389 25.3051H110.426H110.115Z"
                        fill="var(--color-primary-text)"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M27.5867 71H35.4133C37.3887 71 39 72.8261 39 75.0649V83.9351C39 86.1739 37.3887 88 35.4133 88H27.5867C25.6113 88 24 86.1739 24 83.9351V75.0649C24 72.8261 25.6113 71 27.5867 71Z"
                        fill="var(--color-primary-text)"
                      />
                    </svg>
                    <p className="mt-[2px] pt-0 leading-none">{ticket.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      {isTrainsPage
                        ? "companies" in ticket &&
                          ticket.companies.map((company) => (
                            <div
                              key={company.id}
                              className="w-[35px] h-[35px] rounded-full overflow-hidden bg-gray-100"
                            >
                              {company.logo_url ? (
                                <Tooltip content={company.name}>
                                  <Image
                                    src={company.logo_url}
                                    alt={company.name}
                                    width={35}
                                    height={35}
                                    className="object-cover w-full h-full"
                                  />
                                </Tooltip>
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                  {company.code}
                                </div>
                              )}
                            </div>
                          ))
                        : "airlines" in ticket &&
                          ticket.airlines.map((airline) => (
                            <div
                              key={airline.id}
                              className="w-[35px] h-[35px] rounded-full overflow-hidden bg-gray-100"
                            >
                              {airline.logo_url ? (
                                <Tooltip content={airline.name}>
                                  <Image
                                    src={airline.logo_url}
                                    alt={airline.name}
                                    width={35}
                                    height={35}
                                    className="object-cover w-full h-full"
                                  />
                                </Tooltip>
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                  {airline.code}
                                </div>
                              )}
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start absolute bottom-[84px]">
                    <div className="flex">
                      <p className="text-[20px] mr-[12px] font-medium text-[#0271BD]">
                        {formatPrice(ticket.current_price)} ₽
                      </p>
                      <p className="text-[20px] text-[var(--color-crossed_out-text)] line-through">
                        {formatPrice(ticket.old_price)} ₽
                      </p>
                    </div>
                  </div>

                  <div className="mt-[12px]">
                    <div className="inline-flex items-baseline gap-2">
                      {/* Блок отправления */}
                      <div className="flex flex-col items-center">
                        <p className="text-[18px] font-medium">
                          {ticket.from_city}
                        </p>
                        <p className="text-sm">{ticket.departure_time}</p>
                      </div>

                      {/* Дефис */}
                      <span className="text-[18px] font-medium">—</span>

                      {/* Блок прибытия */}
                      <div className="flex flex-col items-center">
                        <p className="text-[18px] font-medium">
                          {ticket.to_city}
                        </p>
                        <p className="text-sm">{ticket.arrival_time}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-[15px]">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="7.5"
                        cy="7.5"
                        r="7.03846"
                        stroke="var(--color-primary-text)"
                        strokeWidth="0.923077"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.85502 6.85779V4.13015C7.85502 3.81152 7.59672 3.55322 7.27809 3.55322V3.55322C6.95947 3.55322 6.70117 3.81152 6.70117 4.13015V7.74553V7.80032C6.70117 8.08869 6.93494 8.32245 7.22331 8.32245V8.32245C7.25973 8.32245 7.29606 8.31864 7.33169 8.31108L7.40349 8.29584C7.47595 8.28047 7.54686 8.25853 7.61535 8.23031L10.3958 7.08455C10.6973 6.96033 10.8368 6.61185 10.7044 6.31391V6.31391C10.5778 6.02903 10.2484 5.8955 9.95915 6.01179L7.85502 6.85779Z"
                        fill="var(--color-primary-text)"
                      />
                    </svg>
                    <span>{ticket.duration}</span>
                  </div>
                  {isTrainsPage
                    ? "ticket_type" in ticket && (
                        <span>{ticket.ticket_type}</span>
                      )
                    : "transfers" in ticket && <span>{ticket.transfers}</span>}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
