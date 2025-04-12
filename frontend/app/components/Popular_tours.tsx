"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTickets } from "../context/TicketsContext";

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
        Популярные туры
      </h2>

      <div className="relative group !max-w-[2060px] mx-auto">
        {/* Navigation arrows - visible only on desktop */}
        <div className="hidden lg:block">
          {/* Кнопка "Назад" */}
          <button className="swiper-button-prev !ml-[18px] absolute !w-[27px] !h-[40px] !left-0 !bg-transparent !shadow-none">
            <span className="absolute inset-0 bg-[#41A3E8] clip-arrow rounded-l-[8px] transition-colors hover:bg-[#2B8ECD]">
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
            <span className="absolute inset-0 bg-[#41A3E8] clip-arrow-reverse rounded-r-[8px] transition-colors hover:bg-[#2B8ECD]">
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
              className="!w-[316px] rounded-[15px] !h-[316px] relative bg-[var(--color-hot_tickets-background)]"
            >
              <div className="w-full h-full rounded-[15px] relative justify-center">
                <Image
                  src="/images/grand_kata.avif"
                  alt=""
                  width={316}
                  height={316}
                  className="rounded-[15px] z-0 absolute inset-0 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 rounded-[15px] z-10" />
                <div className="absolute w-[284px] h-[84px] bg-white z-20 left-1/2 bottom-[18px] -translate-x-1/2 rounded-[15px] pt-[10px] px-[16px]">
                  <p>{}, {}, {}</p>
                  <div className="flex items-center gap-[10px] absolute bottom-[16px]">
                    <Image
                      src="/images/avia_add.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/images/food_add.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                    <Image
                      src="/images/pet_add.svg"
                      alt=""
                      width={19}
                      height={19}
                    />
                  </div>
                  <div className="flex absolute bottom-[16px] right-[16px] gap-[4px]">
                    <p>7 ночей, от</p>
                    <p>70 845 ₽</p>
                  </div>
                </div>
                <div className="absolute w-[55px] h-[32px] bg-white z-20 top-[16px] right-[16px] rounded-[10px] flex items-center justify-center gap-1">
                  <p className="text-[14px]">4.9</p>
                  <Image src="/images/star.svg" alt="" width={16} height={16} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
