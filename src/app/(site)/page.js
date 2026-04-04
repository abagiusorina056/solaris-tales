import Hero from "../components/home/Hero";
import Benefits from "../components/home/Benefits";
import NewArrivals from "../components/home/NewArrivals";
import HomeCarousel from "../components/home/HomeCarousel";

export default function Home() {

  return (
    <>
      <Hero />
      <div className="px-6 w-full">
        <Benefits />
        <hr className="w-full border-1 border-gray-200" />
        <NewArrivals />
      </div>
      <div className="w-full">
        <HomeCarousel />
      </div>
    </>
  );
}
