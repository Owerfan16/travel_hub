"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

export default function HotTickets() {
  return (
    <div className="px-[24px] relative z-0 md:px-[36px] [@media(min-width:1992px)]:px-0 max-w-[1920px] mx-auto mb-[36px]">
      <p className="text-[24px] mt-[46px] mb-[20px] font-medium text-[var(--color-text-heading)]">
        Горячие ж/д билеты
      </p>
      <Swiper
        modules={[FreeMode, Navigation]}
        spaceBetween={16}
        navigation={true}
        cssMode={true}
        pagination={true}
        mousewheel={true}
        keyboard={true}
        slidesPerView="auto"
        freeMode={true}
        className=""
        touchEventsTarget="container"
        breakpoints={{
          320: {
            // Mobile
            slidesPerView: 1.1,
          },
          768: {
            // Tablet
            slidesPerView: 2.1,
            spaceBetween: 24,
          },
          1024: {
            // Desktop
            slidesPerView: 3,
          },
        }}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <SwiperSlide
            key={item}
            className="!w-[316px] rounded-[15px] !h-[176px] bg-white select-none"
          ></SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
