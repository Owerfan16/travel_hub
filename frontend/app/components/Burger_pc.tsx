"use client";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { usePathname } from "next/navigation";
import LanguageSwitcherPC from "./LanguageSwitcherPc";
interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function BurgerMenu({ isOpen, setIsOpen }: Props) {
  const { theme, toggleTheme } = useTheme();

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

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed z-30 pr-[24px] md:pr-[60px] top-0 right-0 h-[580px] w-[340px] bg-[var(--color-background--burger-pc)] shadow-lg  transform transition-transform duration-300 rounded-bl-[50px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <button
          role="switch"
          aria-checked={theme === "light"}
          onClick={toggleTheme}
          className="relative bg-[var(--color-header-button-profile)] inline-flex mt-[30px] h-[51px] w-[171px] items-center ml-[25px] rounded-full transition-colors duration-200"
        >
          <p
            className={`absolute text-white text-[14px] ${
              theme === "light" ? "pl-[18px]" : "pl-[60px]"
            }`}
          >
            {theme === "light" ? "Светлая тема" : "Темная тема"}
          </p>
          <span
            className={` h-[51px] w-[51px] flex justify-center items-center transform rounded-full shadow-md transition-transform duration-200 ${
              theme === "light"
                ? "translate-x-[120px] bg-[#3baeff]"
                : "translate-x-0 bg-[#000F18]"
            }`}
          >
            <Image
              src={theme === "light" ? "/images/sun.svg" : "/images/moon.svg"}
              width={30}
              height={30}
              className={`flex justify-center items-center ${
                theme === "light" ? "w-[30px]  h-[30px]" : "w-[24px]  h-[24px]"
              }`}
              alt={theme === "light" ? "Sun icon" : "Moon icon"}
              quality={100}
              priority
            />
          </span>
        </button>
        <button
          className="w-[60px] h-[60px] bg-[var(--color-header-button-profile)] rounded-[15px] absolute top-[24px] right-[60px] p-2 flex justify-center items-center"
          onClick={() => setIsOpen(false)}
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

        <div className="ml-[44px]">
          <Link
            href="/"
            className="flex items-center w-full h-[38px] mt-[40px]"
            role="button"
          >
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 19.4857V8.17143C0 7.77333 0.0887497 7.39619 0.26625 7.04C0.44375 6.68381 0.688333 6.39047 1 6.16L8.5 0.502857C8.9375 0.167619 9.4375 0 10 0C10.5625 0 11.0625 0.167619 11.5 0.502857L19 6.16C19.3125 6.39047 19.5575 6.68381 19.735 7.04C19.9125 7.39619 20.0008 7.77333 20 8.17143V19.4857C20 20.1771 19.755 20.7693 19.265 21.2621C18.775 21.7549 18.1867 22.0008 17.5 22H13.75C13.3958 22 13.0992 21.8793 12.86 21.6379C12.6208 21.3966 12.5008 21.0982 12.5 20.7429V14.4571C12.5 14.101 12.38 13.8026 12.14 13.5621C11.9 13.3215 11.6033 13.2008 11.25 13.2H8.75C8.39583 13.2 8.09916 13.3207 7.86 13.5621C7.62083 13.8034 7.50083 14.1018 7.5 14.4571V20.7429C7.5 21.099 7.38 21.3978 7.14 21.6392C6.9 21.8806 6.60333 22.0008 6.25 22H2.5C1.8125 22 1.22417 21.754 0.735 21.2621C0.245833 20.7701 0.000833333 20.178 0 19.4857Z"
                fill={mainStyles.fill_icons}
              />
            </svg>
            <p className="text-[24px] pl-[18px]">Главная</p>
          </Link>
          <Link
            href="/favourites"
            className="flex items-center w-full h-[38px] mt-[20px]"
            role="button"
          >
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18L8.55 16.7248C6.86667 15.2371 5.475 13.9537 4.375 12.8747C3.275 11.7956 2.4 10.8268 1.75 9.96817C1.1 9.10954 0.646 8.32087 0.388 7.60218C0.13 6.88349 0.000666667 6.14779 0 5.39509C0 3.85831 0.525 2.57493 1.575 1.54496C2.625 0.514986 3.93333 0 5.5 0C6.36667 0 7.19167 0.179836 7.975 0.539509C8.75833 0.899182 9.43333 1.40599 10 2.05995C10.5667 1.40599 11.2417 0.899182 12.025 0.539509C12.8083 0.179836 13.6333 0 14.5 0C16.0667 0 17.375 0.514986 18.425 1.54496C19.475 2.57493 20 3.85831 20 5.39509C20 6.14714 19.871 6.88283 19.613 7.60218C19.355 8.32153 18.9007 9.11019 18.25 9.96817C17.5993 10.8262 16.7243 11.795 15.625 12.8747C14.5257 13.9543 13.134 15.2377 11.45 16.7248L10 18Z"
                fill={favouritesStyles.fill_icons}
              />
            </svg>
            <p className="text-[24px] pl-[18px]">Избранное</p>
          </Link>
          <Link
            href="/orders"
            className="flex items-center w-full h-[38px] mt-[20px]"
            role="button"
          >
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 22C1.45 22 0.979335 21.8043 0.588002 21.413C0.196668 21.0217 0.000668362 20.5507 1.69491e-06 20C-0.000664972 19.4493 0.195335 18.9787 0.588002 18.588C0.980668 18.1973 1.45134 18.0013 2 18H18C18.55 18 19.021 18.196 19.413 18.588C19.805 18.98 20.0007 19.4507 20 20C19.9993 20.5493 19.8037 21.0203 19.413 21.413C19.0223 21.8057 18.5513 22.0013 18 22H2ZM2 15V12.175C2 12.0417 2.025 11.9127 2.075 11.788C2.125 11.6633 2.2 11.5507 2.3 11.45L13.2 0.575C13.3833 0.391667 13.596 0.25 13.838 0.15C14.08 0.0500001 14.334 0 14.6 0C14.866 0 15.1243 0.0500001 15.375 0.15C15.6257 0.25 15.8507 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7707 2.4 17.862 2.65C17.9533 2.9 17.9993 3.15833 18 3.425C18 3.675 17.954 3.921 17.862 4.163C17.77 4.405 17.6243 4.62567 17.425 4.825L6.55 15.7C6.45 15.8 6.33767 15.875 6.213 15.925C6.08834 15.975 5.959 16 5.825 16H3C2.71667 16 2.47934 15.904 2.288 15.712C2.09667 15.52 2.00067 15.2827 2 15Z"
                fill={orderStyles.fill_icons}
              />
            </svg>
            <p className="text-[24px] pl-[18px]">Мои заказы</p>
          </Link>
          <Link
            href="/points"
            className="flex items-center w-full h-[38px] mt-[20px]"
            role="button"
          >
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 0C4.41 0 0 2.82 0 6.46V11.04C0 14.66 4.39 17.5 10 17.5C15.61 17.5 20 14.66 20 11.04V6.47C20 2.84 15.57 0 10 0ZM18.5 11C18.5 13.69 14.61 16 10 16C5.39 16 1.5 13.73 1.5 11V9.85C3.28 11.72 6.5 12.85 10 12.85C13.5 12.85 16.73 11.67 18.5 9.85V11Z"
                fill={ticketPoints.fill_icons}
              />
            </svg>
            <p className="text-[24px] pl-[18px]">Тикет баллы</p>
          </Link>
          <Link
            href="/help"
            className="flex items-center w-full h-[38px] mt-[20px]"
            role="button"
          >
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.95 16C10.3 16 10.596 15.879 10.838 15.637C11.08 15.395 11.2007 15.0993 11.2 14.75C11.1993 14.4007 11.0787 14.1047 10.838 13.862C10.5973 13.6193 10.3013 13.4987 9.95 13.5C9.59867 13.5013 9.303 13.6223 9.063 13.863C8.823 14.1037 8.702 14.3993 8.7 14.75C8.698 15.1007 8.819 15.3967 9.063 15.638C9.307 15.8793 9.60267 16 9.95 16ZM9.05 12.15H10.9C10.9 11.6 10.9627 11.1667 11.088 10.85C11.2133 10.5333 11.5673 10.1 12.15 9.55C12.5833 9.11667 12.925 8.70401 13.175 8.31201C13.425 7.92001 13.55 7.44934 13.55 6.9C13.55 5.96667 13.2083 5.25001 12.525 4.75001C11.8417 4.25001 11.0333 4.00001 10.1 4.00001C9.15 4.00001 8.37933 4.25001 7.788 4.75001C7.19667 5.25001 6.784 5.85001 6.55 6.55001L8.2 7.20001C8.28333 6.90001 8.471 6.57501 8.763 6.22501C9.055 5.87501 9.50067 5.70001 10.1 5.70001C10.6333 5.70001 11.0333 5.846 11.3 6.138C11.5667 6.43 11.7 6.75067 11.7 7.10001C11.7 7.43334 11.6 7.746 11.4 8.038C11.2 8.33 10.95 8.60067 10.65 8.85001C9.91667 9.50001 9.46667 9.99167 9.3 10.325C9.13333 10.6583 9.05 11.2667 9.05 12.15ZM10 20C8.61667 20 7.31667 19.7377 6.1 19.213C4.88334 18.6883 3.825 17.9757 2.925 17.075C2.025 16.1743 1.31267 15.116 0.788001 13.9C0.263335 12.684 0.000667932 11.384 1.26582e-06 10C-0.000665401 8.616 0.262001 7.31601 0.788001 6.10001C1.314 4.88401 2.02633 3.82567 2.925 2.92501C3.82367 2.02434 4.882 1.31201 6.1 0.788005C7.318 0.264005 8.618 0.00133838 10 5.0505e-06C11.382 -0.00132828 12.682 0.261339 13.9 0.788005C15.118 1.31467 16.1763 2.02701 17.075 2.92501C17.9737 3.82301 18.6863 4.88134 19.213 6.10001C19.7397 7.31867 20.002 8.61867 20 10C19.998 11.3813 19.7353 12.6813 19.212 13.9C18.6887 15.1187 17.9763 16.177 17.075 17.075C16.1737 17.973 15.1153 18.6857 13.9 19.213C12.6847 19.7403 11.3847 20.0027 10 20Z"
                fill={helpStyles.fill_icons}
              />
            </svg>
            <p className="text-[24px] pl-[18px]">Центр помощи</p>
          </Link>
          <Link
            href="/business"
            className="flex items-center w-full h-[38px] mt-[20px]"
            role="button"
          >
            <svg width="22" height="22">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 0C7.54131 0 6.14236 0.579463 5.11091 1.61091C4.07946 2.64236 3.5 4.04131 3.5 5.5C3.5 6.95869 4.07946 8.35764 5.11091 9.38909C6.14236 10.4205 7.54131 11 9 11C10.4587 11 11.8576 10.4205 12.8891 9.38909C13.9205 8.35764 14.5 6.95869 14.5 5.5C14.5 4.04131 13.9205 2.64236 12.8891 1.61091C11.8576 0.579463 10.4587 0 9 0ZM5 12C3.67392 12 2.40215 12.5268 1.46447 13.4645C0.526784 14.4021 0 15.6739 0 17V20H18V17C18 15.6739 17.4732 14.4021 16.5355 13.4645C15.5979 12.5268 14.3261 12 13 12H11.618L9 17.236L6.382 12H5Z"
                fill={businessStyles.fill_icons}
              />
            </svg>
            <p className="text-[24px] pl-[18px]">Для бизнеса</p>
          </Link>
          <div className="mt-[20px] flex items-center">
            <Image
              src="/images/burger/Langue.svg"
              width={22}
              height={22}
              className="w-[22px] h-[22px]"
              alt=""
            />
            <div className="pl-[18px]">
              <LanguageSwitcherPC />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
