import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-footer-background)] mt-auto bottom-0">
      <div className="mx-auto max-w-[1920px] pt-[38px] pb-[100px] md:pb-[112px] px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8 xl:gap-12">
          {/* Компания */}
          <div className="hidden lg:flex flex-col items-center space-y-2 text-[var(--color-footer-text)]">
            <div>
              <h3 className="text-base font-medium">Компания</h3>
              <Link
                href="/about"
                className="block text-sm mt-[7px] cursor-pointer"
              >
                О нас
              </Link>
              <Link
                href="/careers"
                className="block text-sm mt-[7px] cursor-pointer"
              >
                Вакансии
              </Link>
              <Link
                href="/documents"
                className="block text-sm mt-[7px] cursor-pointer"
              >
                Документы
              </Link>
            </div>
          </div>
          {/* Поддержка */}
          <div className="hidden md:flex flex-col items-center space-y-2 text-[var(--color-footer-text)]">
            <div>
              <h3 className="text-base font-medium">Поддержка</h3>
              <Link
                href="/help-center"
                className="block text-sm mt-[7px] cursor-pointer"
              >
                Центр помощи
              </Link>
              <Link
                href="/refund"
                className="block text-sm mt-[7px] cursor-pointer"
              >
                Возврат билетов
              </Link>
              <Link
                href="mailto:help@travel-hub.ru"
                className="block text-sm mt-[7px] cursor-pointer"
              >
                help@travel-hub.ru
              </Link>
            </div>
          </div>
          {/* Путешественникам */}
          <div className="hidden lg:flex flex-col items-center space-y-2 text-[var(--color-footer-text)]">
            <div>
              <h3 className="text-base font-medium">Путешественникам</h3>
              <Link
                href="/loyalty-program"
                className="block text-sm mt-[7px] cursor-pointer"
              >
                Программа лояльности
              </Link>
              <Link
                href="/gift-certificates"
                className="block text-sm mt-[7px] cursor-pointer whitespace-nowrap"
              >
                Подарочные сертификаты
              </Link>
            </div>
          </div>
          {/* Соцсети */}
          <div className="flex flex-col items-center space-y-2 text-[var(--color-footer-text)]">
            <div>
              <h3 className="text-[14px] md:text-base font-medium mb-2 flex [@media(min-width:1165px)]:hidden">
                Мы в соцсетях
              </h3>
              <h3 className="text-base font-medium mb-2 hidden [@media(min-width:1165px)]:flex">
                Мы в социальных сетях
              </h3>
              <ul className="flex gap-3">
                {[
                  {
                    name: "Vk",
                    url: "https://vk.com/ardor_gaming?from=groups",
                    icon: "/images/vk.svg",
                  },
                  {
                    name: "Tg",
                    url: "https://web.telegram.org/k/#@NikitaChebotov",
                    icon: "/images/tg.svg",
                  },
                  {
                    name: "Tiktok",
                    url: "https://www.tiktok.com/@aviasales?_t=ZS-8vKvbTEecye&_r=1",
                    icon: "/images/tiktok.svg",
                  },
                ].map((social, index) => (
                  <li key={index}>
                    <Link href={social.url} passHref legacyBehavior>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 rounded-[30%] cursor-pointer md:h-[42px] md:w-[42px] bg-[var(--color-footer-link)] flex items-center justify-center"
                      >
                        <Image
                          src={social.icon}
                          width={17}
                          height={19}
                          alt={social.name}
                          className="w-[17px] h-auto md:w-[20px]"
                        />
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Приложение */}
          <div className="flex flex-col items-center space-y-2 text-[var(--color-footer-text)]">
            <div>
              <h3 className="text-[14px] md:text-base font-medium mb-2 whitespace-nowrap">
                Наше приложение
              </h3>
              <ul className="flex gap-3">
                {[
                  {
                    name: "google_play",
                    url: "https://play.google.com/store/apps",
                    icon: "/images/google_play.svg",
                  },
                  {
                    name: "appgallery",
                    url: "https://appgallery.huawei.com",
                    icon: "/images/appgallery.svg",
                  },
                  {
                    name: "apple",
                    url: "https://apps.apple.com",
                    icon: "/images/apple.svg",
                  },
                ].map((store, index) => (
                  <li key={index}>
                    <Link href={store.url} passHref legacyBehavior>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 cursor-pointer rounded-[30%] md:h-[42px] md:w-[42px] bg-[var(--color-footer-link)] flex items-center justify-center"
                      >
                        <Image
                          src={store.icon}
                          width={17}
                          height={19}
                          alt={store.name}
                          className="w-[17px] h-auto md:w-[20px]"
                        />
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
