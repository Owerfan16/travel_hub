"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

interface TravelIdea {
  id: number;
  name: string;
  price_per_day: number;
  image_url: string;
}

interface TravelIdeasContextType {
  travelIdeas: TravelIdea[];
  loading: boolean;
  error: string | null;
  refreshTravelIdeas: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Создание контекста с дефолтными значениями
const TravelIdeasContext = createContext<TravelIdeasContextType>({
  travelIdeas: [],
  loading: true,
  error: null,
  refreshTravelIdeas: () => {},
});

export const useTravelIdeas = () => useContext(TravelIdeasContext);

interface TravelIdeasProviderProps {
  children: ReactNode;
}

export const TravelIdeasProvider = ({ children }: TravelIdeasProviderProps) => {
  const [travelIdeas, setTravelIdeas] = useState<TravelIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTravelIdeas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/travel-ideas/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched travel ideas:", data);
      setTravelIdeas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching travel ideas:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки контента");
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchTravelIdeas();
  }, []);

  const value = {
    travelIdeas,
    loading,
    error,
    refreshTravelIdeas: fetchTravelIdeas,
  };

  return (
    <TravelIdeasContext.Provider value={value}>
      {children}
    </TravelIdeasContext.Provider>
  );
};
