"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "../utils/useTranslation";
import { useAuth } from "../context/AuthContext";

export default function ProfileMobile() {
  const { theme, toggleTheme } = useTheme(); // Получаем тему и функцию переключения из контекста
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation("common");
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const IconColor = "#287DC4";

  useEffect(() => {
    // Убедимся, что компонент монтируется только на клиенте
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="mx-[24px] md:mx-[60px] pt-[12px] flex flex-col gap-[20px] h-[470px] mt-[24px] mb-[124px] rounded-2xl px-[24px] max-w-[1920px] [@media(min-width:2040px)]:mx-auto bg-[var(--color-burger-mobile--background)]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <Image
              src="/images/profile_icon.svg"
              alt="profile"
              width={32}
              height={32}
            />
            <p className="text-[16px] font-medium">
              {user?.name || t("profile")}
            </p>
          </div>
          <div className="flex items-center gap-[8px]" onClick={handleLogout}>
            <Image src="/images/logout.svg" alt="" width={18} height={18} />
            <p>{t("logout")}</p>
          </div>
        </div>
        <p>{user?.email || "email@example.com"}</p>
        <p>{user?.phone || t("phoneNotLinked")}</p>
      </div>
      <div className="w-full h-[2px] bg-[var(--color-line-mobile--burger)]"></div>
      <Link href="/change-email" className="flex items-center gap-[12px]">
        <Image src="/images/email.svg" alt="" width={16} height={16} />
        <p className="hidden [@media(min-width:360px)]:flex">
          {t("changeEmail")}
        </p>
        <p className="flex [@media(min-width:360px)]:hidden">
          {t("changeEmailShort")}
        </p>
      </Link>
      <Link href="/link-phone" className="flex items-center gap-[12px]">
        <Image src="/images/phone_number.svg" alt="" width={16} height={16} />
        <p className="hidden [@media(min-width:360px)]:flex">
          {t("linkPhone")}
        </p>
        <p className="flex [@media(min-width:360px)]:hidden">
          {t("linkPhoneShort")}
        </p>
      </Link>
      <Link href="/social-networks" className="flex items-center gap-[12px]">
        <Image src="/images/social_network.svg" alt="" width={16} height={16} />
        <p>{t("linkedSocialNetworks")}</p>
      </Link>
      <Link href="/change-password" className="flex items-center gap-[12px]">
        <Image src="/images/password.svg" alt="" width={16} height={16} />
        <p>{t("changePassword")}</p>
      </Link>
      <div className="w-full h-[2px] bg-[var(--color-line-mobile--burger)]"></div>
      <Link href="/documents" className="flex items-center gap-[12px]">
        <Image src="/images/document.svg" alt="" width={16} height={16} />
        <p>{t("myDocuments")}</p>
      </Link>
      <Link href="/payments" className="flex items-center gap-[12px]">
        <Image src="/images/payment.svg" alt="" width={16} height={16} />
        <p>{t("paymentsAndPurchases")}</p>
      </Link>
    </div>
  );
}
