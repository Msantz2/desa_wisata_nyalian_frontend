import { Destination } from "@/types/destination";
import { TourPackage } from "@/types/package";
import { Article } from "@/types/article";
import { Review } from "@/types/review";
import { FAQ } from "@/types/faq";
import { Video } from "@/types/video";
import { NavigationItem } from "@/types/navigation";
import { SiteSettings } from "@/types/settings";
import { VillageProfile } from "@/types/village";

import destinationsData from "@/data/destinations.json";
import packagesData from "@/data/packages.json";
import articlesData from "@/content/articles.json";
import reviewsData from "@/data/reviews.json";
import faqData from "@/data/faq.json";
import videosData from "@/data/videos.json";
import navigationData from "@/data/navigation.json";
import settingsData from "@/data/settings.json";
import villageData from "@/data/village.json";

export function getDestinations(): Destination[] {
  return destinationsData as Destination[];
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinationsData.find((dest) => dest.slug === slug) as Destination | undefined;
}

export function getFeaturedDestinations(): Destination[] {
  return destinationsData.filter((dest) => dest.featured) as Destination[];
}

export function getPackages(): TourPackage[] {
  return packagesData as TourPackage[];
}

export function getPackageBySlug(slug: string): TourPackage | undefined {
  return packagesData.find((pkg) => pkg.slug === slug) as TourPackage | undefined;
}

export function getFeaturedPackages(): TourPackage[] {
  return packagesData.filter((pkg) => pkg.featured) as TourPackage[];
}

export function getArticles(): Article[] {
  return articlesData as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = articlesData as Article[];
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  const articles = articlesData as Article[];
  return articles.filter((article) => article.featured);
}

export function getReviews(): Review[] {
  return reviewsData as Review[];
}

export function getFAQs(): FAQ[] {
  return faqData as FAQ[];
}

export function getFAQsByCategory(category: string): FAQ[] {
  return faqData.filter((faq) => faq.category === category) as FAQ[];
}

export function getVideos(): Video[] {
  return videosData as Video[];
}

export function getNavigation(): NavigationItem[] {
  return (navigationData as NavigationItem[]).sort((a, b) => a.order - b.order);
}

export function getSettings(): SiteSettings {
  return settingsData as SiteSettings;
}

export function getVillageProfile(): VillageProfile {
  return villageData as VillageProfile;
}
