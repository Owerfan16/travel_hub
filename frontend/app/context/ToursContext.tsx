"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface Tour {
  id: number;
  image_url: string;
  rating: number;
  country: string;
  city: string;
  hotel_name: string;
  food_included: boolean;
  pets_allowed: boolean;
  price: number;
}

interface ToursContextType {
  tours: Tour[];
  loading: boolean;
  error: string | null;
  refreshTours: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Создание контекста с дефолтными значениями
const ToursContext = createContext<ToursContextType>({
  tours: [],
  loading: true,
  error: null,
  refreshTours: () => {},
});

export const useTours = () => useContext(ToursContext);

interface ToursProviderProps {
  children: ReactNode;
}

export const ToursProvider = ({ children }: ToursProviderProps) => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/popular-tours/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched tours:", data);
      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки контента");
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchTours();
  }, []);

  const value = {
    tours,
    loading,
    error,
    refreshTours: fetchTours,
  };

  return (
    <ToursContext.Provider value={value}>{children}</ToursContext.Provider>
  );
};
