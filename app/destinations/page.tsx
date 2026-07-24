import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import DestinationsClient from "./DestinationsClient";
import { getDestinations } from "@/lib/data";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Explore Destinations",
    description: "Discover the natural beauty and cultural heritage of Nyalian Village. Explore waterfalls, rice terraces, temples, and traditional attractions.",
    path: "/destinations",
    keywords: ["Nyalian destinations", "Bali waterfalls", "rice terraces", "temples", "cultural sites", "nature attractions"],
  });
}

export default function DestinationsPage() {
  const destinations = getDestinations();
  return <DestinationsClient destinations={destinations} />;
}
