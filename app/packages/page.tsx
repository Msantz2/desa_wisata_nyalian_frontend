import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PackagesClient from "./PackagesClient";
import { getPackages } from "@/lib/data";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Tour Packages",
    description: "Curated experiences combining the best of Nyalian Village. Choose from full-day adventures, cultural immersion, spiritual journeys, and more.",
    path: "/packages",
    keywords: ["Bali tour packages", "Nyalian tours", "village tour", "cultural tour", "adventure package", "spiritual tour"],
  });
}

export default function PackagesPage() {
  const packages = getPackages();
  return <PackagesClient packages={packages} />;
}
