"use clinet"
import PageAnimation from "./PageAnimation";
import Hero from "./Hero";
import Loader from "./Loader";
import Orb from "./Orb";

export default function HeroSection() {
  return (
    <div className="bg-black">
      <Loader />
      <PageAnimation />
      <Hero />
    </div>
  );
}
