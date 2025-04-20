"use client";

import Image from "next/image";

interface Tour {
  id: number;
  hotel_name: string;
  hotel_stars: number;
  rating: number;
  price_per_night: number;
  food_included: boolean;
  pets_allowed: boolean;
  image: string;
  city: {
    name: string;
    country: {
      name: string;
    };
  };
}

interface TourCardProps {
  tours?: Tour[];
  nights?: number;
}

export default function TourCard({ tours = [], nights = 7 }: TourCardProps) {
  if (!tours || tours.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [@media(min-width:1920px)]:grid-cols-4 gap-[38px] w-[100%]">
      {tours.map((tour) => (
        <div key={tour.id} className="rounded-[15px] overflow-hidden">
          {/* Контейнер для изображения с оверлеем */}
          <div className="relative">
            {/* Черный полупрозрачный оверлей */}
            <div className="absolute left-[24px] bottom-[18px] rounded-[10px] bg-white z-20 w-[142px] xl:w-[162px] h-[38px] flex justify-center items-center text-[#0088E7] font-medium">
              <p>
                Отель, {tour.hotel_stars}{" "}
                {tour.hotel_stars === 1
                  ? "звезда"
                  : tour.hotel_stars < 5
                  ? "звезды"
                  : "звезд"}
              </p>
            </div>
            <div className="w-[70px] h-[38px] absolute bg-white rounded-[10px] right-[24px] top-[18px] z-20 flex justify-center items-center text-[#0088E7] pt-[2px]">
              <div className="flex gap-[6px] font-medium">
                <p>{tour.rating}</p>
                <Image
                  src="/images/star.svg"
                  alt="Rating"
                  width={20}
                  height={20}
                  className="pb-1"
                />
              </div>
            </div>
            <div className="w-[94px] h-[38px] absolute bg-white rounded-[10px] gap-2 right-[24px] bottom-[18px] z-20 flex justify-center items-center">
              <Image
                src="/images/avia_add.svg"
                alt="Авиа"
                width={20}
                height={20}
              />
              {tour.food_included && (
                <Image
                  src="/images/food_add.svg"
                  alt="Питание"
                  width={14}
                  height={14}
                />
              )}
              {tour.pets_allowed && (
                <Image
                  src="/images/pet_add.svg"
                  alt="Можно с животными"
                  width={20}
                  height={20}
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-10"></div>
            {/* Изображение */}
            <Image
              src={tour.image}
              alt={tour.hotel_name}
              width={500}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Нижняя часть карточки */}
          <div className="h-[152px] bg-white px-[24px] pb-[22px] pt-[10px] flex flex-col justify-between items-center text-[20px]">
            <div>
              <p className="flex justify-center">{tour.hotel_name}</p>
              <div className="flex justify-center gap-1">
                <p className="">{nights} ночей, от</p>
                <p className="text-[#0088E7]">
                  {new Intl.NumberFormat("ru-RU").format(
                    tour.price_per_night * nights
                  )}{" "}
                  ₽
                </p>
              </div>
            </div>
            <button className="h-[48px] w-full bg-[#148BDF] text-white rounded-[15px] hover:bg-[#0f7bc5] transition-colors">
              Выбрать
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
