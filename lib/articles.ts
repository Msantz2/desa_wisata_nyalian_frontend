import articlesData from "@/content/articles.json";
import type { Article } from "@/types/article";

export function getArticles(): Article[] {
  return articlesData as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = articlesData as Article[];
  return articles.find((article) => article.slug === slug);
}

export function getArticleById(id: string): Article | undefined {
  const articles = articlesData as Article[];
  return articles.find((article) => article.id === id);
}
