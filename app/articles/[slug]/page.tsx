import { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { createArticleSchema, createBreadcrumbSchema } from "@/lib/structuredData";
import StructuredData from "@/components/seo/StructuredData";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Calendar, User, Clock, ArrowLeft } from "lucide-react";
import { getArticles, getArticleBySlug } from "@/lib/articles";
import { getDestinations } from "@/lib/data";
import { getPackages } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ArticleCard from "@/components/article/ArticleCard";
import SocialShare from "@/components/shared/SocialShare";
import RelatedContent from "@/components/article/RelatedContent";
import { formatDate } from "@/utils/formatDate";
import { calculateReadingTime } from "@/utils/calculateReadingTime";
import { getPlaceholderImage } from "@/lib/placeholderImage";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return buildMetadata({
      title: "Article Not Found",
      description: "The article you are looking for could not be found.",
      path: `/articles/${slug}`,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/articles/${slug}`,
    image: article.coverImage,
    type: "article",
    publishedTime: article.publishedAt,
    author: article.author,
    keywords: [article.category, ...article.tags],
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getArticles();
  const relatedArticles = allArticles
    .filter((a) => {
      if (a.id === article.id) return false;
      const categoryMatch = a.category === article.category;
      const tagMatch = a.tags.some((tag) => article.tags.includes(tag));
      return categoryMatch || tagMatch;
    })
    .slice(0, 3);

  const allDestinations = getDestinations();
  const allPackages = getPackages();
  
  const relatedDestinations = article.relatedDestinations
    ? allDestinations.filter((d) => article.relatedDestinations?.includes(d.id))
    : [];

  const relatedPackages = article.relatedPackages
    ? allPackages.filter((p) => article.relatedPackages?.includes(p.id))
    : [];

  const imageUrl = getPlaceholderImage(article.coverImage);
  const readingTime = article.readTime || calculateReadingTime(article.content);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/articles/${article.slug}`;

  const articleSchema = createArticleSchema(article);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Articles", path: "/articles" },
    { name: article.title, path: `/articles/${slug}` },
  ]);

  return (
    <div className="pt-20">
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />
      <div className="relative h-[400px] w-full">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Badge className="bg-accent text-white mb-4">{article.category}</Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            {article.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Articles", href: "/articles" },
            { label: article.title, href: `/articles/${slug}` },
          ]}
        />

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-200 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-text-muted" />
              <span className="text-text-secondary">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-text-muted" />
              <span className="text-text-secondary">
                {formatDate(article.publishedAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-text-muted" />
              <span className="text-text-secondary">{readingTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <Link key={tag} href={`/articles?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>

          <article className="prose prose-lg max-w-none mb-12">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="font-heading text-4xl font-bold text-text-primary mt-8 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-heading text-3xl font-bold text-text-primary mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-heading text-2xl font-bold text-text-primary mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-text-secondary leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-6 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-6 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-text-secondary ml-4">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-text-secondary">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => {
                  if (!src || typeof src !== 'string') return null;
                  return (
                    <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden">
                      <Image
                        src={src}
                        alt={alt || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  );
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </article>

          {(relatedDestinations.length > 0 || relatedPackages.length > 0) && (
            <RelatedContent destinations={relatedDestinations} packages={relatedPackages} />
          )}

          {relatedArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} />
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-8 mb-8">
            <SocialShare
              url={shareUrl}
              title={article.title}
              description={article.excerpt}
            />
          </div>

          <div className="text-center">
            <Link href="/articles">
              <Button variant="outline" size="lg">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
