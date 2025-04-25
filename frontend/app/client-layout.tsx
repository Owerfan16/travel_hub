"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TicketsProvider } from "./context/TicketsContext";
import { ToursProvider } from "./context/ToursContext";
import { TravelIdeasProvider } from "./context/TravelIdeasContext";
import { LanguageProvider } from "./context/LanguageContext";
import Menu_mobile from "./components/Menu_mobile";
import { useState, useEffect } from "react";
import { Spinner } from "./components/Spinner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем задержку загрузки
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TicketsProvider>
              <ToursProvider>
                <TravelIdeasProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                    <Menu_mobile />
                  </div>
                </TravelIdeasProvider>
              </ToursProvider>
            </TicketsProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}
