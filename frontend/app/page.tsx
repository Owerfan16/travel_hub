import HotTickets from "./components/Hot_tickets";
import Search from "./components/Search";
import TravelIdeas from "./components/travel_ideas";

export default function Home() {
  return (
    <>
      <Search />
      <HotTickets />
      <TravelIdeas />
    </>
  );
}
