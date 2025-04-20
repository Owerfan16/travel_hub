import Search from "../components/Search";
import Filtration from "../components/filtration";
import Ticket from "../components/Ticket";
import ButtonShowMore from "../components/Button_show_more";
import TourCard from "../components/Tours_card";
export default function Home() {
  return (
    <>
      <Search />
      <div className="2xl:flex min-h-screen px-[24px] md:px-[60px] [@media(min-width:2040px)]:px-0 mx-auto max-w-[1920px]">
        <Filtration />
        <div className="w-full">
          <Ticket />
          <TourCard />
          {/*Отображаем TourCard если поиск по турам, если по билетам то Ticket*/}
          {/* отображаем 10 билетов, дополнитенльно по 10 при нажатии на кнопку, т.к сортировка по дефолту Рекомендуемые то у билета при создании должен указываться приоритет рекомендации, от 1 до 100, могут быть и одинаковые значения рекомендации у разных билетов, сортировка вся должна работать как и фильтрация, фильтрация по авиакомпаниям, при нажатии должен открыватьсЯ выбор ава/жд компаний, авиа/жд компании берем с бд*/}
          <ButtonShowMore />
        </div>
      </div>
    </>
  );
}
