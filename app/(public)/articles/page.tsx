import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import ArticlesClient from "./ArticlesClient";
import { getArticles } from "@/lib/articles";
import type { Article } from "@/types/article";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Articles & Stories",
    description: "Explore stories, tips, and insights about Nyalian Village and Balinese culture. Discover travel guides, cultural traditions, and local experiences.",
    path: "/articles",
    keywords: ["Bali travel guide", "Nyalian stories", "Balinese culture", "travel tips", "local experiences", "cultural traditions"],
  });
}

export default function ArticlesPage() {
  const allArticles = getArticles();
  
  // Per 15-article-publishing.md Section 6:
  // Draft articles are never included in any public data-fetching path
  const publishedArticles = allArticles.filter(
    (article: Article) => article.status === 'published'
  );
  
  return <ArticlesClient articles={publishedArticles} />;
}
