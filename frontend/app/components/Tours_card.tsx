import Image from "next/image";

export default function TourCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [@media(min-width:1920px)]:grid-cols-4 gap-[38px] w-[100%]">
      <div className="rounded-[15px] overflow-hidden">
        {/* Контейнер для изображения с оверлеем */}
        <div className="relative">
          {/* Черный полупрозрачный оверлей */}
          <div className="absolute left-[24px] bottom-[18px] rounded-[10px] bg-white z-20 w-[142px] xl:w-[162px] h-[38px] flex justify-center items-center text-[#0088E7] font-medium">
            <p>Отель, 4 звезды</p>
          </div>
          <div className="w-[70px] h-[38px] absolute bg-white rounded-[10px] right-[24px] top-[18px] z-20 flex justify-center items-center text-[#0088E7] pt-[2px]">
            <div className="flex gap-[6px] font-medium">
              <p>4.9</p>
              <Image
                src="/images/star.svg"
                alt="Banyan Tree Samui"
                width={20}
                height={20}
                className="pb-1"
              />
            </div>
          </div>
          <div className="w-[94px] h-[38px] absolute bg-white rounded-[10px] gap-2 right-[24px] bottom-[18px] z-20 flex justify-center items-center"> {/* если 2 картинки то w-[70px], если одна то w-[46px] */}
            <Image
              src="/images/avia_add.svg"
              alt="Авиа"
              width={20}
              height={20} // отображаем всегда
            />
            <Image
              src="/images/food_add.svg" // отображаем если в админ панели при создании поставлена галочка Питание опционально
              alt="Питание"
              width={14}
              height={14}
            />
            <Image
              src="/images/pet_add.svg" // отображаем если в админ панели при создании поставлена галочка Можно с животными
              alt="Питание"
              width={20}
              height={20}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-10"></div>
          {/* Изображение */}
          <Image
            src="/images/tour_prev.png"
            alt="Banyan Tree Samui"
            width={500}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Нижняя часть карточки */}
        <div className="h-[152px] bg-white px-[24px] pb-[22px] pt-[10px] flex flex-col justify-between items-center text-[20px]">
          <div>
            <p className="flex justify-center">Banyan Tree Samui</p>
            <div className="flex justify-center gap-1">
              <p className="text-[#0088E7]">7 ночей, от</p>
              <p>280 673 ₽</p>
            </div>
          </div>
          <button className="h-[48px] w-full bg-[#148BDF] text-white rounded-[15px] hover:bg-[#0f7bc5] transition-colors">
            Выбрать
          </button>
        </div>
      </div>
    </div>
  );
}
