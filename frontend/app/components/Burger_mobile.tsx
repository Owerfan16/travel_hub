"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../utils/useTranslation";

export default function BurgerMobile() {
  const { theme, toggleTheme } = useTheme(); // Получаем тему и функцию переключения из контекста
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const IconColor = "#287DC4";
  const { t } = useTranslation("common");

  useEffect(() => {
    // Убедимся, что компонент монтируется только на клиенте
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="mx-[24px] md:mx-[60px] h-[420px] mt-[24px] mb-[124px] rounded-2xl px-[24px] max-w-[1920px] [@media(min-width:2040px)]:mx-auto bg-[var(--color-burger-mobile--background)]">
      <div className="pt-[12px]">
        <Link
          href="/favourites"
          className="flex items-center w-full h-[38px] justify-between"
          role="button"
        >
          <div className="flex items-center grid-cols-2 gap-3">
            <Image
              src="/images/burger/favourites.svg"
              width={20}
              height={18}
              className="w-[20px] h-[18px] mb-[4px]"
              alt=""
            />
            <span>{t("favorites")}</span>
          </div>
          <div>
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 16.5L13.5973 9.37755C13.813 9.17535 13.807 8.83117 13.5846 8.63649L6 2"
                strokeWidth="2.3"
                strokeLinecap="round"
                stroke={IconColor}
                fill="none"
                transform="translate(3.5, 1)"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/orders"
          className="flex items-center w-full h-[38px] mt-[16px] justify-between"
          role="button"
        >
          <div className="flex items-center grid-cols-2 gap-3">
            <Image
              src="/images/burger/order.svg"
              width={20}
              height={18}
              className="w-[20px] h-[18px] mb-[4px]"
              alt=""
            />
            <span>{t("myOrders")}</span>
          </div>
          <div>
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 16.5L13.5973 9.37755C13.813 9.17535 13.807 8.83117 13.5846 8.63649L6 2"
                strokeWidth="2.3"
                strokeLinecap="round"
                stroke={IconColor}
                fill="none"
                transform="translate(3.5, 1)"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/ticket-points"
          className="flex items-center w-full h-[38px] mt-[16px] justify-between"
          role="button"
        >
          <div className="flex items-center grid-cols-2 gap-3">
            <Image
              src="/images/burger/ticket_points.svg"
              width={20}
              height={18}
              className="w-[20px] h-[18px]"
              alt=""
            />
            <span>{t("ticketPoints")}</span>
          </div>
          <div>
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 16.5L13.5973 9.37755C13.813 9.17535 13.807 8.83117 13.5846 8.63649L6 2"
                strokeWidth="2.3"
                strokeLinecap="round"
                stroke={IconColor}
                fill="none"
                transform="translate(3.5, 1)"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/help"
          className="flex items-center w-full h-[38px] mt-[16px] justify-between"
          role="button"
        >
          <div className="flex items-center grid-cols-2 gap-3">
            <Image
              src="/images/burger/help.svg"
              width={20}
              height={18}
              className="w-[20px] h-[18px]"
              alt=""
            />
            <span>{t("helpCenter")}</span>
          </div>
          <div>
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 16.5L13.5973 9.37755C13.813 9.17535 13.807 8.83117 13.5846 8.63649L6 2"
                strokeWidth="2.3"
                strokeLinecap="round"
                stroke={IconColor}
                fill="none"
                transform="translate(3.5, 1)"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/business"
          className="flex items-center w-full h-[38px] mt-[16px] justify-between"
          role="button"
        >
          <div className="flex items-center grid-cols-2 gap-3">
            <Image
              src="/images/burger/business.svg"
              width={20}
              height={18}
              className="w-[20px] h-[18px] mb-[4px]"
              alt=""
            />
            <span>{t("forBusiness")}</span>
          </div>
          <div>
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 16.5L13.5973 9.37755C13.813 9.17535 13.807 8.83117 13.5846 8.63649L6 2"
                strokeWidth="2.3"
                strokeLinecap="round"
                stroke={IconColor}
                fill="none"
                transform="translate(3.5, 1)"
              />
            </svg>
          </div>
        </Link>
        <div className="h-[2px] w-full bg-[var(--color-line-mobile--burger)] my-[20px]"></div>
        <div className="flex items-center w-full h-[38px] mt-[16px] justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/burger/theme.svg"
              width={20}
              height={18}
              className="w-[20px] h-[18px]"
              alt=""
            />
            <span>{t("theme")}</span>
          </div>
          <button
            role="switch"
            aria-checked={theme === "light"}
            onClick={toggleTheme}
            className={`relative inline-flex h-[16px] w-[46px] items-center rounded-full transition-colors duration-200 ${
              theme === "light" ? "bg-[#287DC4]" : "bg-[#002238]"
            }`}
          >
            <span
              className={`inline-block h-[12px] w-[12px] transform rounded-full shadow-md transition-transform duration-200 ${
                theme === "light"
                  ? "translate-x-[30px] bg-[#ffff]"
                  : "translate-x-[2px] bg-[#67B3F2]"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center w-full h-[38px] mt-[16px] justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/burger/langue.svg"
              width={20}
              height={18}
              className="w-[20px] h-[18px]"
              alt=""
            />
            <span>{t("language")}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
