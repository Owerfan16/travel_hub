"use client";
import { useTheme } from "../context/ThemeContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import { useTravelIdeas } from "../context/TravelIdeasContext";

const formatPrice = (price: number) => price.toLocaleString("ru-RU");

export default function TravelIdeas() {
  const { travelIdeas, loading, error } = useTravelIdeas();
  const { theme } = useTheme();

  if (loading) {
    return <div></div>;
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

  if (!travelIdeas || !travelIdeas.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        Нет доступных локаций
      </div>
    );
  }

  return (
    <div className="relative z-0 mb-[120px]">
      <h2 className="text-2xl mt-[46px] px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 max-w-[1920px] mb-5 font-medium mx-auto text-[var(--color-text-heading)]">
        Идеи для поездок
      </h2>

      <div className="relative group !max-w-[2060px] mx-auto">
        {/* Navigation arrows - visible only on desktop */}
        <div className="hidden lg:block">
          {/* Кнопка "Назад" */}
          <button
            type="button"
            className="travel-ideas-button-prev w-[27px] h-[40px] hidden lg:flex absolute top-1/2 left-[18px] -translate-y-1/2 z-20 items-center justify-center cursor-pointer transition-opacity"
          >
            <span className="absolute inset-0 bg-[var(--color-arrow-button)] clip-arrow rounded-l-[8px] transition-colors hover:bg-[var(--color-arrow-hover)]">
              <svg
                width="27"
                height="40"
                viewBox="0 0 27 40"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[27px] h-[40px]"
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
          <button
            type="button"
            className="travel-ideas-button-next w-[27px] h-[40px] hidden lg:flex absolute top-1/2 right-[18px] -translate-y-1/2 z-20 items-center justify-center cursor-pointer transition-opacity"
          >
            <span className="absolute inset-0 bg-[var(--color-arrow-button)] clip-arrow-reverse rounded-r-[8px] transition-colors hover:bg-[var(--color-arrow-hover)]">
              <svg
                width="27"
                height="40"
                viewBox="0 0 27 40"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[27px] h-[40px] rotate-180"
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
            prevEl: ".travel-ideas-button-prev",
            nextEl: ".travel-ideas-button-next",
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
          {travelIdeas.map((idea) => (
            <SwiperSlide
              key={idea.id}
              className="!w-[316px] cursor-pointer rounded-[15px] !h-[316px] relative bg-[var(--color-hot_tickets-background)]"
            >
              <div className="w-full h-full rounded-[15px] relative justify-center">
                <Image
                  src={idea.image_url || "/images/travel_def.avif"}
                  alt={idea.name}
                  width={316}
                  height={316}
                  className="rounded-[15px] z-0 absolute inset-0 object-cover"
                  onError={(e) => {
                    // Fallback на стандартное изображение при ошибке загрузки
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/travel_def.avif";
                  }}
                />
                {theme !== "light" && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60 rounded-[15px] z-10" />
                )}
                <div className="absolute w-[270px] h-[48px] bg-[var(--color--travel-ideas)] z-20 left-1/2 bottom-[28px] -translate-x-1/2 rounded-[15px] justify-between items-center flex px-[16px]">
                  <p>{idea.name}</p>
                  <p>от {formatPrice(idea.price_per_day)} ₽/сутки</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
