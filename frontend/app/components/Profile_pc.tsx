"use client";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { usePathname } from "next/navigation";
import LanguageSwitcherPC from "./LanguageSwitcherPc";
import { useAuth } from "../context/AuthContext";

interface Props {
  profileOpen: boolean;
  profileIsOpen: (value: boolean) => void;
}

export default function ProfilePC({ profileOpen, profileIsOpen }: Props) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const getButtonStyles = (buttonPath: string) => {
    const pathname = usePathname();
    const isActive = pathname === buttonPath;

    if (isActive) {
      return {
        fill_icons: theme === "light" ? "#3BAEFF" : "#99D5FF",
      };
    } else {
      return {
        fill_icons: "#287DC4",
      };
    }
  };

  // Стили для каждой кнопки
  const mainStyles = getButtonStyles("/");
  const favouritesStyles = getButtonStyles("/favourites");
  const orderStyles = getButtonStyles("/orders");
  const ticketPoints = getButtonStyles("/points");
  const helpStyles = getButtonStyles("/help");
  const businessStyles = getButtonStyles("/business");

  const handleLogout = async () => {
    try {
      await logout();
      profileIsOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      {profileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => profileIsOpen(false)}
        />
      )}
      <div
        className={`fixed z-30 pt-[24px] px-[24px] md:px-[60px] top-0 right-0 h-[330px] w-[660px] bg-[var(--color-background--burger-pc)] shadow-lg  transform transition-transform duration-300 rounded-bl-[50px] ${
          profileOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="flex justify-between">
          <div className="flex">
            <Image
              src="/images/profile_icon.svg"
              width={80}
              height={80}
              alt=""
            />
            <div className="ml-[24px]">
              <p className="text-[28px] font-medium">
                {user?.name || "Пользователь"}
              </p>
              <p>{user?.email || "email@example.com"}</p>
              <p>{user?.phone || "Номер не привязан"}</p>
            </div>
          </div>
          <button
            className="flex mt-[18px] mr-[106px] items-start"
            onClick={handleLogout}
          >
            <Image
              src="/images/logout.svg"
              width={20}
              height={20}
              alt=""
              className="mr-[10px] mt-[2px]"
            />
            <p className="text-[18px]">Выйти</p>
          </button>
          <button
            className="w-[60px] h-[60px] bg-[var(--color-header-button-profile)] rounded-[15px] absolute top-[24px] right-[60px] p-2 flex justify-center items-center"
            onClick={() => profileIsOpen(false)}
          >
            <Image
              src="/images/burger/close.svg"
              width={32}
              height={19}
              className="w-[32px] h-[19px]"
              alt="Menu"
              quality={100}
              priority
            />
          </button>
        </div>
        <div className="w-full h-[2px] mt-[24px] mb-[24px] bg-[var(--color-line-mobile--burger)]"></div>
        <div className="flex justify-between">
          <ul className="flex flex-col gap-[10px]">
            <li className="h-[36px] flex items-center">
              <Link href="/change-email" className="flex items-center h-full">
                <Image
                  src="/images/email.svg"
                  width={20}
                  height={20}
                  alt="Иконка email"
                  className="mr-[16px] mb-[4px]"
                />
                <span className="text-[18px]">Сменить электронную почту</span>
              </Link>
            </li>

            <li className="h-[36px] flex items-center">
              <Link href="/link-phone" className="flex items-center h-full">
                <Image
                  src="/images/phone_number.svg"
                  width={20}
                  height={20}
                  alt="Иконка телефона"
                  className="mr-[16px] pb-[8px]"
                />
                <span className="text-[18px]">Привязать номер телефона</span>
              </Link>
            </li>

            <li className="h-[36px] flex items-center">
              <Link
                href="/social-networks"
                className="flex items-center h-full"
              >
                <Image
                  src="/images/social_network.svg"
                  width={20}
                  height={20}
                  alt="Иконка соцсетей"
                  className="mr-[16px] pb-[2px]"
                />
                <span className="text-[18px]">Привязанные соцсети</span>
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col gap-[10px]">
            <li className="h-[36px] flex items-center">
              <Link
                href="/change-password"
                className="flex items-center h-full"
              >
                <Image
                  src="/images/password.svg"
                  width={18}
                  height={18}
                  alt="Иконка пароля"
                  className="mr-[16px] pb-[10px]"
                />
                <span className="text-[18px]">Сменить пароль</span>
              </Link>
            </li>

            <li className="h-[36px] flex items-center">
              <Link href="/documents" className="flex items-center h-full">
                <Image
                  src="/images/document.svg"
                  width={18}
                  height={18}
                  alt="Иконка документов"
                  className="mr-[16px] pb-[6px]"
                />
                <span className="text-[18px]">Мои документы</span>
              </Link>
            </li>

            <li className="h-[36px] flex items-center">
              <Link href="/payments" className="flex items-center h-full">
                <Image
                  src="/images/payment.svg"
                  width={20}
                  height={20}
                  alt="Иконка платежей"
                  className="mr-[14px]  pb-[2px]"
                />
                <span className="text-[18px]">Платежи и покупки</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
