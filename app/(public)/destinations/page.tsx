import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import DestinationsClient from "./DestinationsClient";
import { getDestinations } from "@/lib/data";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Jelajahi Destinasi",
    description: "Temukan keindahan alam dan warisan budaya Desa Nyalian. Jelajahi air terjun, persawahan, kuil, dan atraksi tradisional.",
    path: "/destinations",
    keywords: ["destinasi Nyalian", "air terjun Bali", "persawahan", "kuil", "situs budaya", "atraksi alam"],
  });
}

export default function DestinationsPage() {
  const destinations = getDestinations();
  return <DestinationsClient destinations={destinations} />;
}
