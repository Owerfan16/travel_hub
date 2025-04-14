"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePathname, useRouter } from "next/navigation";
import BurgerMenu from "./Burger_pc";
import ProfileMenu from "./Profile_pc";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);

  // Цвета для иконок и текста (одинаковые для всех тем)
  const svgTextColor = "#F2F2F2";
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, profileIsOpen] = useState(false);

  // Функция для определения стилей кнопок
  const getButtonStyles = (buttonPath: string) => {
    const isActive = pathname === buttonPath;

    if (isActive) {
      return {
        bgColor: theme === "light" ? "#F2F2F2" : "#003E66",
        textColor: theme === "light" ? "#0271BD" : "#F2F2F2",
        svgColor: theme === "light" ? "#0271BD" : "#F2F2F2",
      };
    } else {
      return {
        bgColor: theme === "light" ? "#0271BD" : "#002238",
        textColor: "#F2F2F2",
        svgColor: "#F2F2F2",
      };
    }
  };

  // Стили для каждой кнопки
  const aviaStyles = getButtonStyles("/");
  const trainsStyles = getButtonStyles("/trains");
  const toursStyles = getButtonStyles("/tours");

  useEffect(() => {
    setIsMounted(true);

    // Initialize window width and set up resize listener
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  if (!isMounted) return null;

  const profile_Color = theme === "light" ? "#0271BD" : "#D6D6D6";

  const handleProfileClick = () => {
    if (windowWidth < 1024) {
      // Mobile view - navigate to profile page
      router.push("/profile");
    } else {
      // Desktop view - open profile menu
      profileIsOpen(true);
    }
  };

  return (
    <header className="w-full h-[72px] md:h-[95px] lg:h-[110px] justify-center flex bg-[var(--color-header-background)]">
      <ul className="flex justify-between items-center h-full w-full px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 max-w-[1920px]">
        <li className="flex justify-center items-center">
          <ul className="flex justify-center items-center">
            <li className="flex justify-center items-center">
              <Link href="/" role="button">
                <Image
                  src="/images/mobile/logo_mobile2.avif"
                  width={158}
                  height={60}
                  className="w-[105px] h-[40px] md:w-[134px] md:h-[51px] lg:h-[60px] lg:w-[158px] rounded-[4px]"
                  alt="Logo"
                  quality={100}
                  priority
                />
              </Link>
            </li>

            {/* Авиа */}
            <li className="pl-[56px] hidden lg:block">
              <Link
                href="/"
                className="flex flex-col items-center justify-end w-[60px] h-[60px] rounded-[15px]"
                style={{ backgroundColor: aviaStyles.bgColor }}
                role="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill={aviaStyles.svgColor}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.2256 0.162332C23.7798 0.697024 22.7084 2.72295 22.3298 3.20879C21.1497 4.72334 19.3398 6.21724 17.8542 7.72172C18.033 8.42017 18.3399 9.24237 18.5186 9.94107C18.6497 9.83193 18.812 9.65683 18.9661 9.53797C19.6957 8.97619 20.89 9.88482 20.0857 10.7031C19.7197 11.0756 19.3532 11.4478 18.9869 11.8201C19.6023 14.3395 20.6945 17.4405 21.3099 19.9599C21.2873 20.1482 20.6931 20.8301 19.9885 21.3764C18.1881 18.3468 15.9091 14.4907 14.1088 11.461C12.1096 13.2769 10.6768 14.9615 7.90233 16.792C8.1686 18.0935 8.69097 19.6422 8.95723 20.9437C8.97149 21.117 8.52757 21.6339 8.03792 21.9716C7.36954 20.8099 6.47483 19.4149 5.8068 18.2533C5.80431 18.2491 5.42848 18.4801 4.95149 18.6387C3.58424 19.0932 3.65956 18.9649 4.07291 17.802C4.23747 17.3382 4.47922 16.9705 4.47494 16.9682C3.27091 16.3237 1.82495 15.4603 0.621094 14.8157C0.970884 14.3431 1.50671 13.9148 1.68642 13.9286C3.03531 14.1855 4.64057 14.6895 5.98954 14.9465C7.88673 12.2698 9.63274 10.8872 11.5148 8.95847C8.3746 7.22135 4.50382 4.90085 1.36373 3.16381C1.93004 2.48395 2.51062 2.03234 2.70593 2.01058C5.31714 2.60436 8.53131 3.65825 11.1426 4.25194C11.5286 3.89855 11.9144 3.54482 12.3005 3.19168C13.1486 2.41575 14.0903 3.56795 13.5079 4.27182C13.3848 4.42069 13.2033 4.57731 13.0903 4.70356C13.8143 4.87609 14.6665 5.17229 15.3906 5.34472C16.9498 3.91137 18.498 2.16495 20.0679 1.02642C20.5714 0.661244 22.6396 -0.403063 23.2256 0.162332Z"
                  />
                </svg>
                <span
                  className="text-[13px] mt-[3px] mb-[6px]"
                  style={{ color: aviaStyles.textColor }}
                >
                  Авиа
                </span>
              </Link>
            </li>

            {/* Ж/д */}
            <li className="pl-[20px] hidden lg:block">
              <Link
                href="/trains"
                className="flex flex-col items-center justify-end w-[60px] h-[60px] rounded-[15px]"
                style={{ backgroundColor: trainsStyles.bgColor }}
                role="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="12"
                  fill={trainsStyles.svgColor}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M38.4731 9.17311C38.4426 9.10017 38.2098 7.90186 38.2156 7.8777C38.2323 7.80861 38.5179 7.52378 38.5769 7.46203L38.8632 7.1698C38.941 7.10556 38.9011 7.13606 38.963 7.1032C39.0467 7.21104 39.1293 7.52751 39.1741 7.68518C39.247 7.94187 39.2083 8.09159 39.1138 8.31754C39.0309 8.51565 38.6963 9.09334 38.4731 9.17311ZM33.228 6.93745C33.2657 7.09947 33.4244 7.39928 33.4882 7.56795C33.6331 7.95132 33.5921 7.84745 33.944 8.03021C34.6884 8.42178 35.3334 8.78626 36.0595 9.20448C36.0524 8.80359 36.0016 8.35115 35.9096 7.99325C35.8488 7.7565 35.7766 7.76451 35.5925 7.67884C35.183 7.4883 33.4963 6.83507 33.228 6.93745ZM0.00195312 8.74284C0.166753 8.8605 1.21445 8.47266 1.3691 8.42029C2.58124 8.00965 4.15197 7.61448 5.41836 7.20291C7.01295 6.68467 9.18973 6.06598 10.7877 5.58483C12.5653 5.04957 14.3284 4.51791 16.1526 3.96569C17.0388 3.69744 17.9761 3.4533 18.8345 3.15945C20.4801 2.59611 22.5238 2.10502 24.1974 1.54355C26.0638 0.917398 27.9335 1.65207 29.4323 2.84094C29.6797 3.03725 30.1549 3.42285 30.3817 3.6716L30.8036 4.11578C31.9935 5.49779 33.0987 7.53819 33.5084 9.34469C33.7912 10.5912 33.6985 11.3968 32.3501 11.4327C31.1927 11.4635 30.0925 11.5042 28.9313 11.5142L29.1309 12.0083C31.988 12.0161 34.9483 11.9381 37.778 11.7821C39.5873 11.6824 40.096 11.4821 39.8604 9.42818C39.7036 8.06003 39.3679 7.01051 38.8612 5.91377C38.5984 5.34503 38.3177 4.86034 38.0376 4.44454C35.8506 1.19876 30.9667 -0.423795 27.0413 0.0953119C25.8463 0.253355 24.66 0.766499 23.5613 1.08954C21.8826 1.58318 20.1756 2.20256 18.4878 2.71626L15.1275 3.79206C14.5913 3.97762 13.9745 4.16281 13.4443 4.33005C11.2412 5.02497 8.85813 5.82854 6.68505 6.48836C6.08928 6.66926 5.5483 6.84961 4.96377 7.03461C4.11373 7.30367 2.34129 7.92777 1.61757 8.12122C1.33123 8.19782 1.04814 8.30691 0.773096 8.3891C0.492368 8.47303 0.0469589 8.56572 0.00195312 8.74284Z"
                  />
                  <path d="M18.8537 10.7465L19.072 11.5565L14.5424 11.6569L14.4481 10.9678L18.8537 10.7465ZM4.14483 11.9487L4.30238 12.3161C4.72598 12.4157 14.9706 12.1777 15.7325 12.1683C15.7325 12.1683 23.3881 12.1468 27.1384 11.9901C27.1381 11.6819 25.7381 9.15086 25.3451 9.17801L0.910564 11.8492C0.910564 11.8492 0.296676 11.888 0 11.9618L0.00458978 12.119L4.14483 11.9487Z" />
                  <path d="M25.6328 4.58375C25.7671 4.6816 28.2217 5.62029 28.5696 5.74839L31.5252 6.91762L31.2761 6.40622C30.6669 5.33297 30.0754 4.64215 29.1815 3.81528C28.4685 3.15584 26.6127 1.8731 25.6328 2.08855V4.58375Z" />
                  <path d="M20.1457 4.54005C20.1457 4.54005 22.7665 3.86246 23.4285 3.84351C22.8734 4.07934 20.9078 4.54477 20.1406 4.77003L20.1464 5.70835L24.7514 4.65417V2.20264C24.3904 2.27812 23.8939 2.43852 23.5559 2.54929C23.0273 2.72249 20.1457 3.56601 20.1457 3.56601V4.54005Z" />
                  <path d="M12.2425 6.49804C12.4381 6.49686 15.3651 5.70776 15.9091 5.60004L18.655 4.9127C18.8776 4.85201 19.3806 4.77876 19.5936 4.67054L19.5975 3.72607L13.1128 5.63135C12.8682 5.69819 12.4927 5.80343 12.2383 5.9042L12.2425 6.49804Z" />
                  <path d="M12.2375 7.51397C12.5123 7.53366 14.4574 7.01672 14.9973 6.90012L19.5931 5.86153L19.6021 4.93408C19.1251 5.01789 12.3812 6.91266 12.2363 6.98398L12.2375 7.51397Z" />
                  <path d="M8.77539 8.30975C9.20074 8.24203 11.2561 7.77654 11.7843 7.61402V7.08398L8.77539 7.90209V8.30975Z" />
                  <path d="M11.7833 6.63393V6.03369L9.84766 6.64388V7.12434L11.7833 6.63393Z" />
                </svg>
                <span
                  className="text-[13px] mt-[8px] mb-[6px]"
                  style={{ color: trainsStyles.textColor }}
                >
                  Ж/д
                </span>
              </Link>
            </li>

            {/* Туры */}
            <li className="pl-[20px] hidden lg:block">
              <Link
                href="/tours"
                className="flex flex-col items-center justify-end w-[60px] h-[60px] rounded-[15px]"
                style={{ backgroundColor: toursStyles.bgColor }}
                role="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill={toursStyles.svgColor}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.66046 17.1847C9.63503 14.064 9.23574 12.1218 8.29678 9.01648C8.11472 8.41424 7.06239 5.46551 7.70727 5.05813C6.18438 5.54034 5.53366 6.8684 5.28058 7.61234C5.2212 7.78685 5.04785 8.50956 4.99013 8.59944C4.85495 8.34461 4.89816 8.03157 4.86955 7.74101C4.65157 8.06813 4.43666 8.74277 4.34893 9.20571C4.16278 10.1876 4.33654 10.3541 4.29867 11.0547C3.04388 9.85811 2.82554 7.65156 4.11116 6.1908C4.30471 5.97089 4.45464 5.81638 4.71433 5.63532L5.41354 5.2003C5.10334 5.24308 4.34435 5.61113 4.07857 5.75491C3.6821 5.96943 3.23682 6.29384 2.93372 6.45092C3.006 6.1167 3.2811 5.96812 3.40026 5.74224C2.69097 5.90257 1.7016 6.68462 1.2468 7.20276C1.14789 7.31541 0.818551 7.80404 0.712986 7.83366C0.698481 5.98512 1.85264 4.59665 3.49273 4.16823C4.31443 3.95362 4.64231 4.06408 5.42145 4.13755C5.14162 3.96391 4.6411 3.87267 4.25006 3.79523C4.01818 3.74929 3.83364 3.71938 3.59894 3.68952C3.42624 3.66757 3.22106 3.67694 3.05244 3.62761L2.99381 3.6027C2.98857 3.59022 2.97387 3.59401 2.9649 3.58799C3.10325 3.54851 3.20928 3.49762 3.3715 3.45888C3.50391 3.42722 3.64966 3.41896 3.79587 3.389C3.21436 3.24751 2.85808 3.132 2.1778 3.12015C1.47143 3.10781 1.11399 3.24183 0.509766 3.33467C0.695612 2.95569 1.4871 2.43905 1.99321 2.24113C2.65375 1.98286 3.4402 1.91056 4.18202 2.09654C7.19304 2.85134 6.50878 5.97191 6.78629 3.63674C7.06466 1.29341 9.76457 0.0130786 11.7829 1.10754C11.6767 1.15789 11.1411 1.24315 10.9725 1.29249C10.3818 1.46525 9.27487 1.94149 8.99394 2.40001C9.2726 2.34408 9.40265 2.29489 9.71859 2.29974C9.60476 2.43915 9.08484 2.69446 8.92055 2.80007C8.36024 3.1603 7.30036 4.01994 6.9947 4.57611C7.22784 4.31784 7.32162 4.18912 7.63751 3.94619C9.47386 2.53364 11.9575 2.96807 13.2349 4.80525C13.3687 4.99767 13.6167 5.45959 13.6642 5.73189C13.5216 5.66892 13.442 5.59283 13.3072 5.50519C12.4557 4.95121 11.5025 4.60646 10.4414 4.5663L10.4906 4.61423C10.4981 4.62068 10.5068 4.62898 10.5152 4.63559L10.6361 4.71104C10.6925 4.7428 10.7388 4.76747 10.7988 4.81049C10.9353 4.90857 11.0219 4.95742 11.0934 5.09867C10.0488 4.91955 9.71516 4.67021 8.42954 4.68065L8.68122 4.7599C8.76231 4.77364 8.83901 4.78709 8.90892 4.8036C9.3265 4.90241 9.74805 5.08206 10.0965 5.30236C11.0647 5.91451 11.687 6.90137 11.7698 8.07182C11.8056 8.57739 11.6807 9.5742 11.4132 9.88695C11.314 9.59503 11.2702 9.3202 11.1541 9.0076C10.9321 8.40977 10.3017 7.24908 9.77474 6.9492C9.85885 7.26627 9.93772 7.3762 9.94809 7.75426C9.7766 7.64292 9.45024 7.07574 9.31128 6.90244C8.77515 6.23397 8.17264 5.64274 7.45317 5.13834C7.2777 5.02069 7.21716 5.0069 7.04733 4.89954C7.16156 5.10178 7.2712 5.22108 7.42436 5.42376C9.45397 8.10994 11.1868 13.8557 11.8611 17.126C14.1025 17.195 19.5554 19.2985 20.4209 20.9388L2.05294 20.8878C3.23541 19.0485 6.46949 17.3627 9.66046 17.1847Z"
                  />
                </svg>
                <span
                  className="text-[13px] mt-[3px] mb-[6px]"
                  style={{ color: toursStyles.textColor }}
                >
                  Туры
                </span>
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <ul className="flex">
            <li className="flex items-center">
              <button
                className="relative cursor-pointer bg-[var(--color-header-button-profile)] text-white text-sm rounded-full h-[40px] w-[133px] md:h-[51px] md:w-[171px]"
                onClick={handleProfileClick}
              >
                <span
                  className={`
                    text-[var(--color-header-text-profile)] 
                    ${
                      isAuthenticated
                        ? "pr-[18px] md:pr-[36px]"
                        : "pl-[18px] md:pl-[42px]"
                    }
                  `}
                >
                  {isAuthenticated ? "Профиль" : "Вход"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="absolute transition-all duration-300 md:w-[51px] md:h-[51px]"
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: isAuthenticated ? "calc(100% - 40px)" : "0px",
                  }}
                >
                  <circle
                    cx="20"
                    cy="20"
                    r="20"
                    style={{ fill: "var(--color-round-profile)" }}
                  />
                  <circle
                    cx="20"
                    cy="15"
                    r="5.14538"
                    strokeWidth="1.70924"
                    style={{ stroke: profile_Color }}
                  />
                  <path
                    d="M19.9988 22.8546C23.7414 22.8546 25.7404 24.8551 26.8494 26.9064C27.4114 27.946 27.7386 28.9944 27.9246 29.7887C27.9542 29.9049 27.9801 30.0341 28.0027 30.1454H11.997C12.0196 30.0341 12.0455 29.9147 12.075 29.7885C12.2609 28.9942 12.5878 27.9458 13.1488 26.9063C14.2578 24.8551 16.2561 22.8546 19.9988 22.8546Z"
                    style={{ stroke: profile_Color }}
                    strokeWidth="1.70924"
                  />
                </svg>
              </button>
            </li>
            <li className="items-center justify-center hidden lg:flex">
              <button
                className="w-[60px] cursor-pointer h-[60px] bg-[var(--color-header-button-profile)] rounded-[15px] ml-[24px] flex items-center justify-center"
                onClick={() => setIsOpen(true)} // Открываем меню
              >
                <Image
                  src="/images/pc/burger_button.svg"
                  width={32}
                  height={19}
                  className="w-[32px] h-[19px]"
                  alt="Menu"
                  quality={100}
                  priority
                />
              </button>

              {/* Передаём пропсы в BurgerMenu */}
              <div className="">
                <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
              </div>
              <div className="">
                <ProfileMenu
                  profileOpen={profileOpen}
                  profileIsOpen={profileIsOpen}
                />
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </header>
  );
}
