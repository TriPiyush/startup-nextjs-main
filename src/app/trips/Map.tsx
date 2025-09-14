"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import temples from "@/data/temples.json"; // adjust path
import type { Icon } from "leaflet";
import type { MapContainerProps } from "react-leaflet";


// Dynamically import react-leaflet components
const MapContainer = dynamic<MapContainerProps>(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function Map() {
  const [L, setL] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "jyotirlinga",
    "jyotipeeth",
    "shaktipeeth",
    "krishna",
  ]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([
    "visited",
    "notVisited",
  ]);

  const categories = [
    { key: "jyotirlinga", label: "Jyotirlinga", icon: "🕉️" },
    { key: "jyotipeeth", label: "Jyotipeeth", icon: "🌸" },
    { key: "shaktipeeth", label: "Shaktipeeth", icon: "🕉️" },
    { key: "krishna", label: "Krishna", icon: "🎵" },
  ];

  const statuses = [
    { key: "visited", label: "Visited", icon: "✅" },
    { key: "notVisited", label: "Not Visited", icon: "❌" },
  ];

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!L) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  const toggleCategory = (key: string) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const toggleStatus = (key: string) => {
    setSelectedStatus((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  // ✅ Return type properly typed as Leaflet Icon
  const getIcon = (category: string, visited: boolean): Icon => {
    let iconUrl = "";

    if (category === "jyotirlinga") {
      iconUrl = visited ? "/icons/jyotirlinga-visited.png" : "/icons/jyotirlinga.png";
    } else if (category === "jyotipeeth") {
      iconUrl = visited ? "/icons/jyotipeeth-visited.png" : "/icons/jyotipeeth.png";
    } else if (category === "shaktipeeth") {
      iconUrl = visited ? "/icons/shaktipeeth-visited.png" : "/icons/shaktipeeth.png";
    } else if (category === "krishna") {
      iconUrl = visited ? "/icons/krishna-visited.png" : "/icons/krishna.png";
    }

    return new L.Icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-lg relative">
      {/* Filter Panel */}
      <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-xl shadow-lg flex flex-col gap-3 z-[1000]">
        {/* Category Filters */}
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => toggleCategory(cat.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-sm font-semibold transition ${selectedCategories.includes(cat.key)
                ? "bg-blue-600 text-white"
                : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Visited Filters */}
        <div className="flex gap-2">
          {statuses.map((st) => (
            <button
              key={st.key}
              onClick={() => toggleStatus(st.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-sm font-semibold transition ${selectedStatus.includes(st.key)
                ? "bg-green-600 text-white"
                : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              <span className="text-lg">{st.icon}</span>
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        // @ts-ignore
        center={[22.9734, 78.6569]} // Center of India
        zoom={5}
        style={{ width: "100%", height: "100%" }}

      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {temples
          .filter(
            (loc) =>
              selectedCategories.includes(loc.category) &&
              selectedStatus.includes(loc.visited ? "visited" : "notVisited")
          )
          .map((loc) => (
            <Marker
              key={loc.id}
              position={loc.coords as [number, number]}
              // @ts-ignore
              icon={getIcon(loc.category, loc.visited)} // ✅ now properly typed
            >
              <Popup>
                <strong>{loc.name}</strong> <br />
                Category: {loc.category} <br />
                Status: {loc.visited ? "✅ Visited" : "❌ Not Visited"}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
