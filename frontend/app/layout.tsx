import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

// Используем шрифт Roboto
const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "TravelHub",
  description: "A service for purchasing airline tickets, train tickets, and hotel rentals",
};

// Импортируем клиентский компонент
import ClientLayout from "./client-layout";

// Серверный компонент Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${roboto.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
