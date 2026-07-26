"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface DetailHeroProps {
  backgroundImage: string;
  title: string;
  category: string;
  children?: ReactNode;
  featured?: boolean;
  metadata?: ReactNode;
}

/**
 * Shared hero component for detail pages (destinations, packages, articles)
 * Provides consistent styling, contrast, and gradient overlay across the site.
 * 
 * Root cause fix: Eliminates duplication of hero title styling that was
 * previously implemented separately in DestinationDetailContent.tsx,
 * app/packages/[slug]/page.tsx, and app/articles/[slug]/page.tsx
 */
export default function DetailHero({
  backgroundImage,
  title,
  category,
  children,
  featured,
  metadata,
}: DetailHeroProps) {
  return (
    <div className="relative h-[400px] w-full md:h-[500px] lg:h-[600px]">
      <Image
        src={backgroundImage}
        alt={title}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      
      {/* Gradient overlay for text contrast - ensures WCAG AA compliant text rendering */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      
      {/* Content container */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12 w-full">
        <div className="flex flex-col h-full justify-end">
          {/* Category badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-primary text-white">
              {category}
            </Badge>
            {featured && (
              <Badge className="bg-accent text-white">Featured</Badge>
            )}
          </div>

           {/* Title with bright green text */}
           <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg" style={{ color: '#22c55e' }}>
             {title}
           </h1>

          {/* Metadata section (e.g., rating, duration, price) */}
          {metadata && (
            <div className="text-white text-sm md:text-base">
              {metadata}
            </div>
          )}

          {/* Additional children content */}
          {children}
        </div>
      </div>
    </div>
  );
}
