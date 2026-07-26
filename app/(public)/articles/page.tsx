import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ArticlesClient from "./ArticlesClient";
import { getArticles } from "@/lib/articles";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Articles & Stories",
    description: "Explore stories, tips, and insights about Nyalian Village and Balinese culture. Discover travel guides, cultural traditions, and local experiences.",
    path: "/articles",
    keywords: ["Bali travel guide", "Nyalian stories", "Balinese culture", "travel tips", "local experiences", "cultural traditions"],
  });
}

export default function ArticlesPage() {
  const articles = getArticles();
  return <ArticlesClient articles={articles} />;
}
