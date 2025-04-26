"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { Tooltip } from "./Tooltip";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import { useTours } from "../context/ToursContext";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../utils/useTranslation";
import { useCurrency } from "../context/CurrencyContext";

const formatPrice = (price: number) => price.toLocaleString("ru-RU");

export default function PopularTours() {
  const { t } = useTranslation("common");
  const { tours, loading, error } = useTours();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { formatCurrency } = useCurrency();
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : null;
  };

  // Load favorites on component mount
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      setFavorites({});
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return;

    try {
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        const favoritesMap: Record<number, boolean> = {};
        parsedFavorites.forEach((item: any) => {
          if (item.type === "tour") {
            favoritesMap[item.id] = true;
          }
        });
        setFavorites(favoritesMap);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, [user, isAuthenticated, isAuthLoading]);

  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent, tour: any) => {
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      console.log("User not logged in. Cannot save favorites.");
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return;

    try {
      const savedFavorites = localStorage.getItem(favoritesKey);
      let favoritesArray = savedFavorites ? JSON.parse(savedFavorites) : [];

      const isFavorite = favorites[tour.id] || false;

      if (isFavorite) {
        favoritesArray = favoritesArray.filter(
          (item: any) => !(item.id === tour.id && item.type === "tour")
        );
      } else {
        const tourData = {
          id: tour.id,
          name: tour.hotel_name,
          destination: `${tour.country}, ${tour.city}`,
          price: tour.price,
          duration: 7, // Default value
          rating: tour.rating,
          image_url: tour.image_url,
          departure_date: new Date().toISOString(), // Placeholder
          return_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // Placeholder
        };

        favoritesArray.push({
          id: tour.id,
          type: "tour",
          data: tourData,
        });
      }

      localStorage.setItem(favoritesKey, JSON.stringify(favoritesArray));

      setFavorites((prev) => ({
        ...prev,
        [tour.id]: !isFavorite,
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

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
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  if (!tours.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        {t("noAvailableTickets")}
      </div>
    );
  }

  return (
    <div className="relative z-0 mb-9">
      <h2 className="text-2xl mt-[46px] px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 max-w-[1920px] mb-5 font-medium mx-auto text-[var(--color-text-heading)]">
        {t("popularTours")}
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
                    <Tooltip content={t("airTicketsRoundTrip")}>
                      <Image
                        src="/images/avia_add.svg"
                        alt={t("airTicketsRoundTrip")}
                        width={20}
                        height={20}
                      />
                    </Tooltip>

                    {tour.food_included && (
                      <Tooltip content={t("foodIncluded")}>
                        <Image
                          src="/images/food_add.svg"
                          alt={t("foodIncluded")}
                          width={16}
                          height={16}
                        />
                      </Tooltip>
                    )}

                    {tour.pets_allowed && (
                      <Tooltip content={t("petsAllowed")}>
                        <Image
                          src="/images/pet_add.svg"
                          alt={t("petsAllowed")}
                          width={19}
                          height={19}
                        />
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex absolute bottom-[16px] right-[16px] gap-[4px]">
                    <p>
                      {t("nights7")}, {t("fromPrice")}
                    </p>
                    <p className="text-[#0088E7]">
                      {formatCurrency(tour.price)}
                    </p>
                  </div>
                </div>
                <div className="flex absolute top-[16px] right-[16px] gap-2 z-20">
                  <button
                    className="w-[55px] cursor-pointer h-[32px] bg-[var(--color-hot_tickets-background)] rounded-[10px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => toggleFavorite(e, tour)}
                    disabled={!isAuthenticated || isAuthLoading}
                    title={
                      !isAuthenticated
                        ? t("loginToAddFavorites")
                        : t("addToFavorites")
                    }
                  >
                    <svg
                      width="22"
                      height="19"
                      viewBox="0 0 26 23"
                      fill={
                        favorites[tour.id] && isAuthenticated
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
                  <div className="w-[55px] h-[32px] bg-[var(--color-hot_tickets-background)] rounded-[10px] flex items-center justify-center gap-1">
                    <p className="text-[14px]">{tour.rating.toFixed(1)}</p>
                    <Image
                      src="/images/star.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
