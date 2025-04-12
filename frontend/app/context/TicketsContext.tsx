"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Общие интерфейсы для компаний
interface Company {
  id: number;
  name: string;
  code: string;
  logo_url: string | null;
}

// Общие свойства для всех типов билетов
interface BaseTicket {
  id: number;
  from_city: string;
  to_city: string;
  departure_time: string;
  arrival_time: string;
  current_price: number;
  old_price: number;
  date: string;
  duration: string;
}

// Специфические свойства для авиабилетов
interface AirTicket extends BaseTicket {
  transfers: string;
  airlines: Company[];
}

// Специфические свойства для ж/д билетов
interface TrainTicket extends BaseTicket {
  ticket_type: string;
  companies: Company[];
}

// Объединенный тип билета
export type Ticket = AirTicket | TrainTicket;

interface TicketsContextType {
  airTickets: Ticket[];
  trainTickets: Ticket[];
  airTicketsLoading: boolean;
  trainTicketsLoading: boolean;
  airTicketsError: string | null;
  trainTicketsError: string | null;
  refreshAirTickets: () => void;
  refreshTrainTickets: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Создание контекста с дефолтными значениями
const TicketsContext = createContext<TicketsContextType>({
  airTickets: [],
  trainTickets: [],
  airTicketsLoading: true,
  trainTicketsLoading: true,
  airTicketsError: null,
  trainTicketsError: null,
  refreshAirTickets: () => {},
  refreshTrainTickets: () => {},
});

export const useTickets = () => useContext(TicketsContext);

interface TicketsProviderProps {
  children: ReactNode;
}

export const TicketsProvider = ({ children }: TicketsProviderProps) => {
  const [airTickets, setAirTickets] = useState<Ticket[]>([]);
  const [trainTickets, setTrainTickets] = useState<Ticket[]>([]);
  const [airTicketsLoading, setAirTicketsLoading] = useState(true);
  const [trainTicketsLoading, setTrainTicketsLoading] = useState(true);
  const [airTicketsError, setAirTicketsError] = useState<string | null>(null);
  const [trainTicketsError, setTrainTicketsError] = useState<string | null>(
    null
  );

  const fetchAirTickets = async () => {
    try {
      setAirTicketsLoading(true);
      setAirTicketsError(null);

      const response = await fetch(`${API_URL}/api/tickets/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched air tickets:", data);
      setAirTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching air tickets:", err);
      setAirTicketsError(
        err instanceof Error ? err.message : "Ошибка загрузки контента"
      );
    } finally {
      setAirTicketsLoading(false);
    }
  };

  const fetchTrainTickets = async () => {
    try {
      setTrainTicketsLoading(true);
      setTrainTicketsError(null);

      const response = await fetch(`${API_URL}/api/train-tickets/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched train tickets:", data);
      setTrainTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching train tickets:", err);
      setTrainTicketsError(
        err instanceof Error ? err.message : "Ошибка загрузки контента"
      );
    } finally {
      setTrainTicketsLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchAirTickets();
    fetchTrainTickets();
  }, []);

  const value = {
    airTickets,
    trainTickets,
    airTicketsLoading,
    trainTicketsLoading,
    airTicketsError,
    trainTicketsError,
    refreshAirTickets: fetchAirTickets,
    refreshTrainTickets: fetchTrainTickets,
  };

  return (
    <TicketsContext.Provider value={value}>{children}</TicketsContext.Provider>
  );
};
