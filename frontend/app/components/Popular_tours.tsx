"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Tooltip } from "./Tooltip";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import { useTours } from "../context/ToursContext";

const formatPrice = (price: number) => price.toLocaleString("ru-RU");

export default function PopularTours() {
  const { tours, loading, error } = useTours();

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

  if (!tours.length) {
    return (
      <div className="text-center py-10 text-gray-500">Нет доступных туров</div>
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
            <span className="absolute inset-0 bg-[var(--color-arrow-button)] clip-arrow rounded-l-[8px] transition-colors hover:bg-[var(--color-arrow-hover)]">
              <svg
                width="27"
                height="40"
                viewBox="0 0 27 40"
                className="absolute top-1/2 left-1/2 w-[27px] h-[40px] -translate-x-1/2 -translate-y-1/2"
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[27px] h-[40px] -translate-y-1/2 rotate-180"
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
          {tours.map((tour) => (
            <SwiperSlide
              key={tour.id}
              className="!w-[316px] cursor-pointer rounded-[15px] !h-[316px] relative bg-[var(--color-hot_tickets-background)]"
            >
              <div className="w-full h-full rounded-[15px] relative justify-center">
                <Image
                  src={tour.image_url || "/images/hotel_def.avif"}
                  alt="hotel"
                  width={316}
                  height={316}
                  className="rounded-[15px] z-0 absolute inset-0 object-cover"
                  onError={(e) => {
                    // Fallback на стандартное изображение при ошибке загрузки
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/hotel_def.avif";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70 rounded-[15px] z-10" />
                <div className="absolute w-[284px] h-[84px] bg-[var(--color-hot_tickets-background)] z-20 left-1/2 bottom-[18px] -translate-x-1/2 rounded-[15px] pt-[10px] px-[16px]">
                  <p className="truncate">
                    {`${tour.country}, ${tour.city}, ${tour.hotel_name}`}
                  </p>
                  <div className="flex items-center gap-[10px] absolute bottom-[16px]">
                    <Tooltip content="Авиабилеты туда и обратно">
                      <Image
                        src="/images/avia_add.svg"
                        alt="Авиа"
                        width={20}
                        height={20}
                      />
                    </Tooltip>

                    {tour.food_included && (
                      <Tooltip content="Питание опционально">
                        <Image
                          src="/images/food_add.svg"
                          alt="Питание включено"
                          width={16}
                          height={16}
                        />
                      </Tooltip>
                    )}

                    {tour.pets_allowed && (
                      <Tooltip content="Можно с животными">
                        <Image
                          src="/images/pet_add.svg"
                          alt="Можно с животными"
                          width={19}
                          height={19}
                        />
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex absolute bottom-[16px] right-[16px] gap-[4px]">
                    <p>7 ночей, от</p>
                    <p className="text-[#0088E7]">{`${formatPrice(
                      tour.price
                    )} ₽`}</p>
                  </div>
                </div>
                <div className="absolute w-[55px] h-[32px] bg-[var(--color-hot_tickets-background)] z-20 top-[16px] right-[16px] rounded-[10px] flex items-center justify-center gap-1">
                  <p className="text-[14px]">{tour.rating.toFixed(1)}</p>
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
