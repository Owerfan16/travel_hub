"use client";
import { useState, useEffect } from "react";
import Ticket from "../components/Ticket";
import Tour from "../components/Tour";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../utils/useTranslation";

interface FavoriteItem {
  id: number;
  type: "air" | "train" | "tour";
  data: any;
}

export default function FavoritesPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");

  const getFavoritesKey = () => {
    return user ? `favorites_${user.id}` : null;
  };

  useEffect(() => {
    if (isAuthLoading) return; // Wait for authentication check

    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) {
      // User not logged in, clear favorites and stop loading
      setFavorites([]);
      setLoading(false);
      return;
    }

    // Load favorites from localStorage using the user-specific key
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem(favoritesKey);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user, isAuthLoading]); // Re-run when user or auth status changes

  const removeFavorite = (id: number) => {
    const favoritesKey = getFavoritesKey();
    if (!favoritesKey) return; // Should not happen if button is shown

    const updatedFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
  };

  if (loading || isAuthLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <p className="text-lg">{t("loading")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex flex-col h-screen justify-center items-center min-h-[400px]">
        <h1 className="text-2xl font-medium mb-6">{t("favorites")}</h1>
        <div className="text-center">
          <p className="text-lg mb-8">{t("loginToViewFavorites")}</p>
          <Link
            href="/auth"
            className="bg-[var(--color--ticket-button)] text-[var(--color-header-text-profile)] px-6 py-3 rounded-xl"
          >
            {t("login")}
          </Link>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col justify-center min-h-[calc(100vh-200px)] items-center">
        <h1 className="text-2xl font-medium mb-6">{t("favorites")}</h1>
        <div className="text-center">
          <p className="text-lg mb-4">{t("noFavoritesYet")}</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="bg-[var(--color--ticket-button)] text-[var(--color-header-text-profile)] px-6 py-3 rounded-xl"
            >
              {t("searchTickets")}
            </Link>
            <Link
              href="/tours"
              className="bg-[var(--color--ticket-button)] text-[var(--color-header-text-profile)] px-6 py-3 rounded-xl"
            >
              {t("searchTours")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-4 min-h-[calc(100vh-200px)] px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 max-w-[1920px]">
      <h1 className="text-2xl font-medium mb-6 text-[var(--color-text-heading)]">
        {t("favorites")}
      </h1>
      <div className="mb-10">
        {favorites.map((item) => (
          <div key={`${item.type}-${item.id}`} className="relative">
            {item.type === "tour" ? (
              <div className="relative">
                <Tour tour={item.data} />
              </div>
            ) : (
              <div className="relative">
                <Ticket
                  ticket={item.data}
                  isTrainTicket={item.type === "train"}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
