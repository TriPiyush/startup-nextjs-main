import { Metadata } from "next";
import Map from "./Map";

export const metadata: Metadata = {
  title: "Trip Page | OpenStreetMap with Pins",
  description: "This page shows OpenStreetMap with pinned locations.",
};

export default function TripPage() {
  return (
    <section className="relative z-10 pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <h2 className="mb-6 text-3xl font-bold text-center">Trip Locations</h2>
        <Map />
      </div>
    </section>
  );
}
