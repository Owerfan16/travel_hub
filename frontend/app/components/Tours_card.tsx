"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useTranslation } from "../utils/useTranslation";

interface Tour {
  id: number;
  hotel_name: string;
  hotel_stars: number;
  rating: number;
  price_per_night: number;
  food_included: boolean;
  pets_allowed: boolean;
  near_sea: boolean;
  image: string;
  city: {
    name: string;
    country: {
      name: string;
    };
  };
}

interface TourCardProps {
  tours: any[];
  nights: number;
  className?: string;
}

export default function TourCard({
  tours,
  nights,
  className = "",
}: TourCardProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("common");
  // State to track favorites status for each tour
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : null;
  };

  // Load favorites on component mount
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      setFavorites({}); // Clear favorites if not logged in or loading
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return;

    try {
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // Create a map of tourId -> isFavorite
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
  }, [user, isAuthenticated, isAuthLoading]); // Depend on user and auth status

  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent, tour: Tour) => {
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      console.log("User not logged in. Cannot save favorites.");
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return;

    try {
      // Get current favorites
      const savedFavorites = localStorage.getItem(favoritesKey);
      let favoritesArray = savedFavorites ? JSON.parse(savedFavorites) : [];

      // Check if this tour is already a favorite
      const isFavorite = favorites[tour.id] || false;

      if (isFavorite) {
        // Remove from favorites
        favoritesArray = favoritesArray.filter(
          (item: any) => !(item.id === tour.id && item.type === "tour")
        );
      } else {
        // Add to favorites
        // Convert to the expected Tour format for favorites
        const tourData = {
          id: tour.id,
          name: tour.hotel_name,
          destination: `${tour.city.name}, ${tour.city.country.name}`,
          price: tour.price_per_night * nights,
          duration: nights,
          rating: tour.rating,
          image_url: tour.image,
          departure_date: new Date().toISOString(), // Placeholder
          return_date: new Date(
            Date.now() + nights * 24 * 60 * 60 * 1000
          ).toISOString(), // Placeholder
        };

        favoritesArray.push({
          id: tour.id,
          type: "tour",
          data: tourData,
        });
      }

      // Save to localStorage
      localStorage.setItem(favoritesKey, JSON.stringify(favoritesArray));

      // Update local state
      setFavorites((prev) => ({
        ...prev,
        [tour.id]: !isFavorite,
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (!tours || tours.length === 0) {
    return null;
  }

  // Функция для правильного склонения слова "ночь"
  const getNightsWord = (count: number): string => {
    // Особые случаи для чисел от 11 до 19 - всегда "ночей"
    if (count % 100 >= 11 && count % 100 <= 19) {
      return "ночей";
    }

    // Для остальных чисел смотрим на последнюю цифру
    switch (count % 10) {
      case 1: // 1, 21, 31, ...
        return "ночь";
      case 2: // 2, 22, 32, ...
      case 3: // 3, 23, 33, ...
      case 4: // 4, 24, 34, ...
        return "ночи";
      default: // 5-9, 0
        return "ночей";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [@media(min-width:1920px)]:grid-cols-4 gap-[38px] w-[100%]">
      {tours.map((tour, index) => (
        <div
          key={tour.id}
          className={`${className} rounded-[15px] overflow-hidden`}
          style={{
            animationDelay: `${
              className.includes("enter") ? index * 0.05 : 0
            }s`,
            animationDuration: "0.3s",
          }}
        >
          {/* Контейнер для изображения с оверлеем */}
          <div className="relative h-[280px] overflow-hidden">
            {/* Черный полупрозрачный оверлей */}
            <div className="absolute left-[24px] bottom-[18px] rounded-[10px] bg-[var(--color--component--tours--card)] z-20 w-[142px] xl:w-[162px] h-[38px] flex justify-center items-center text-[#0088E7] font-medium">
              <p>
                Отель, {tour.hotel_stars}{" "}
                {tour.hotel_stars === 1
                  ? "звезда"
                  : tour.hotel_stars < 5
                  ? "звезды"
                  : "звезд"}
              </p>
            </div>
            <div className="w-[70px] h-[38px] absolute bg-[var(--color--component--tours--card)] rounded-[10px] left-[24px] top-[18px] z-20 flex justify-center items-center text-[#0088E7] pt-[2px]">
              <div className="flex gap-[6px] font-medium">
                <p>{tour.rating}</p>
                <Image
                  src="/images/star.svg"
                  alt="Rating"
                  width={20}
                  height={20}
                  className="pb-1"
                />
              </div>
            </div>
            <button
              className="w-[60px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed h-[38px] absolute bg-[var(--color--component--tours--card)] rounded-[10px] right-[24px] top-[18px] z-20 flex justify-center items-center text-[#0088E7] pt-[2px]"
              onClick={(e) => toggleFavorite(e, tour)}
              disabled={!isAuthenticated || isAuthLoading}
              title={
                !isAuthenticated
                  ? "Войдите, чтобы добавить в избранное"
                  : "Добавить в избранное"
              }
            >
              <svg
                width="20"
                height="20"
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
            <div className="w-[94px] h-[38px] absolute bg-[var(--color--component--tours--card)] rounded-[10px] gap-2 right-[24px] bottom-[18px] z-18 flex justify-center items-center">
              <Image
                src="/images/avia_add.svg"
                alt="Авиа"
                width={20}
                height={20}
              />
              {tour.food_included && (
                <Image
                  src="/images/food_add.svg"
                  alt="Питание"
                  width={14}
                  height={14}
                />
              )}
              {tour.pets_allowed && (
                <Image
                  src="/images/pet_add.svg"
                  alt="Можно с животными"
                  width={20}
                  height={20}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-10"></div>
            {/* Изображение */}
            <Image
              src={tour.image}
              alt={tour.hotel_name}
              width={500}
              height={500}
              className="w-full h-[280px] object-cover"
            />
          </div>

          {/* Нижняя часть карточки */}
          <div className="h-[152px] bg-[var(--color--tours--card)] px-[24px] pb-[22px] pt-[10px] flex flex-col justify-between items-center text-[20px]">
            <div>
              <p className="flex justify-center">{tour.hotel_name}</p>
              <div className="flex justify-center gap-1">
                <p className="">
                  {nights} {getNightsWord(nights)}, от
                </p>
                <p className="text-[#0088E7]">
                  {formatCurrency(tour.price_per_night * nights)}
                </p>
              </div>
            </div>
            <button className="h-[48px] w-full bg-[var(--color--button--tours--card)] text-white rounded-[15px] hover:bg-[#0f7bc5] transition-colors">
              {t("choose")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
