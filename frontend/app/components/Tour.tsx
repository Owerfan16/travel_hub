"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../utils/useTranslation";

interface TourData {
  id: number;
  name: string;
  destination: string;
  price: number;
  duration: number;
  rating: number;
  image_url?: string;
  description?: string;
  departure_date: string;
  return_date: string;
}

interface TourProps {
  tour: TourData;
}

export default function Tour({ tour }: TourProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useTranslation("common");

  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : null;
  };

  // Check if this tour is in favorites
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      setIsFavorite(false); // Not logged in or loading, not a favorite
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return;

    try {
      const savedFavorites = localStorage.getItem(favoritesKey);
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        const isInFavorites = favorites.some(
          (item: any) => item.id === tour.id && item.type === "tour"
        );
        setIsFavorite(isInFavorites);
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  }, [tour.id, user, isAuthenticated, isAuthLoading]);

  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click handlers from firing

    if (!isAuthenticated || !user) {
      console.log("User not logged in. Cannot save favorites.");
      return;
    }

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return;

    try {
      // Get current favorites
      const savedFavorites = localStorage.getItem(favoritesKey);
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(
          (item: any) => !(item.id === tour.id && item.type === "tour")
        );
      } else {
        // Add to favorites
        favorites.push({
          id: tour.id,
          type: "tour",
          data: tour,
        });
      }

      // Save to localStorage
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="lg:flex overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Tour Image */}
        <div className="relative w-full lg:w-[300px] h-[264px] overflow-hidden lg:rounded-tl-[15px] lg:rounded-bl-[15px] rounded-t-[15px] lg:rounded-t-[0px]">
          <Image
            src={tour.image_url || "/images/tour_default.jpg"}
            alt={tour.name}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/tour_default.jpg";
            }}
          />
        </div>
      </div>
      <div className="bg-[var(--color--ticket-right)] relative px-[16px] py-[16px] lg:px-[40px] rounded-b-[15px] lg:rounded-b-[0px] lg:py-[24px] mb-4 lg:mb-9 lg:w-[650px] lg:rounded-tr-[15px] lg:h-[264px] lg:rounded-br-[15px] overflow-hidden max-w-[950px]">
        {/* Tour Information */}
        <div className="flex-1">
          <div className="flex justify-between lg:justify-end items-center">
            <p className="font-medium text-[24px] text-[var(--color--price-ticket)] lg:text-[32px] lg:mr-[107px] leading-none">
              {tour.price} ₽
            </p>
            <button
              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={toggleFavorite}
              disabled={!isAuthenticated || isAuthLoading}
              title={
                !isAuthenticated
                  ? t("loginToAddFavorites")
                  : t("addToFavorites")
              }
            >
              <svg
                width="26"
                height="23"
                viewBox="0 0 26 23"
                fill={
                  isFavorite && isAuthenticated
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
          </div>
          <div className="flex items-center mt-2 justify-between">
            <h3 className="text-xl lg:text-[24px] lg:mt-0 font-medium lg:absolute lg:top-[24px]">
              {tour.name}
            </h3>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={star <= tour.rating ? "#FFD700" : "none"}
                    stroke="#FFD700"
                    strokeWidth="1"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2">{tour.rating}/5</span>
            </div>
          </div>
          <p className="text-lg mt-2">{tour.destination}</p>

          <div className="mt-4 flex flex-col lg:flex-row justify-between items-start lg:items-end">
            <div className="lg:w-[400px]">
              <p className="text-sm">
                {t("duration")}: {tour.duration} {t("days")}
              </p>
              <p className="text-sm">
                {t("dates")}:{" "}
                {new Date(tour.departure_date).toLocaleDateString("ru-RU")} -{" "}
                {new Date(tour.return_date).toLocaleDateString("ru-RU")}
              </p>
            </div>

            <div className="mt-4 lg:mt-0 flex flex-col w-full justify-end h-full items-end">
              <button className="bg-[var(--color--ticket-button)] lg:absolute lg:bottom-[24px] text-[var(--color-header-text-profile)] text-[20px] h-[48px] px-6 py-2 w-full lg:w-[260px] rounded-xl mt-2 lg:mt-0">
                {t("choose")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
