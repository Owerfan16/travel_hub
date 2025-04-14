"use client";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function Filtration() {
  const pathname = usePathname();
  return (
    <div className="h-full mx-[24px] md:mx-[60px] [@media(min-width:2040px)]:mx-auto max-w-[1920px]">
      <div className="flex items-center gap-2 lg:hidden mt-[16px] mx-[16px]">
        <button>
          <Image
            src={"/images/Arrowtosity.svg"}
            alt="filtration"
            width={18}
            height={18}
          />
        </button>
        <p>Авиабилеты в название города</p>
      </div>
      <div className="flex justify-between lg:hidden mt-[12px] mx-[16px]">
        <div className="flex items-center gap-2">
          <Image
            src={"/images/sorting.svg"}
            alt="sort"
            width={18}
            height={18}
          />
          <p>Сортировка</p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={"/images/filtration.svg"}
            alt="filter"
            width={18}
            height={18}
          />
          <p>Фильтрация</p>
        </div>
      </div>
    </div>
  );
}
