import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import AboutClient from "./AboutClient";
import { getVillageProfile, getSettings } from "@/lib/data";

export function generateMetadata(): Metadata {
  const village = getVillageProfile();
  return buildMetadata({
    title: "About Nyalian Village",
    description: "Discover the history, philosophy, and cultural heritage of Nyalian Village. Learn about our vision for sustainable community-based tourism in Bali.",
    path: "/about",
    image: village.gallery[0],
    keywords: ["Nyalian Village history", "Balinese culture", "community tourism", "sustainable tourism", "Bangli heritage"],
  });
}

export default function AboutPage() {
  const village = getVillageProfile();
  const settings = getSettings();
  
  return <AboutClient village={village} settings={settings} />;
}
