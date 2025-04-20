import Image from "next/image";

export default function ButtonShowMore() {
  return (
    <button className="lg:w-full h-[58px] bg-white rounded-[15px] mt-9 text-[var(--color--button--show-more)] text-[20px] cursor-pointer">
      Показать еще билеты
    </button>
  ); // если поиск по турам то Показать еще туры, получаем тему, если тема темная то обводка в 2px цвета 003E66, а заливки фона нету, если тема светлая то обводки нет, а заливка фона white
}
