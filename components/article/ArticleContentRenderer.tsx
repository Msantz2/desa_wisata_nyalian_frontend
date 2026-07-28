/**
 * Article HTML Renderer
 * Renders markdown content as semantic HTML with proper block-level element handling
 * 
 * Root Cause Fix: Previous implementation used ReactMarkdown which wraps inline content
 * in <p> tags. When images appeared inline with text, they ended up inside <p> tags,
 * creating invalid nesting: <p><figure>...</figure></p>
 * 
 * Solution: Parse markdown line-by-line, extracting images and rendering them as
 * separate block-level elements. Paragraphs only contain inline text, never block elements.
 */

'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import type { JSX } from 'react';

/**
 * Parse markdown content line-by-line and render as semantic HTML
 * Ensures images are always rendered as separate block-level elements, never inside <p>
 */
function parseMarkdownWithImages(content: string): ReactNode[] {
  const components: ReactNode[] = [];
  const lines = content.split('\n');
  let currentParagraph: string[] = [];
  let componentKey = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for headings (# ## ### etc)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      const headingClasses = level === 1 ? 'text-4xl mt-8 mb-4' :
                             level === 2 ? 'text-3xl mt-8 mb-4' :
                             level === 3 ? 'text-2xl mt-6 mb-3' :
                             'text-xl mt-4 mb-2';
      
      components.push(
        <HeadingTag
          key={componentKey++}
          className={`font-heading font-bold text-text-primary ${headingClasses}`}
        >
          {text}
        </HeadingTag>
      );
      continue;
    }

    // Check for unordered list (- or * at start)
    const ulMatch = trimmed.match(/^[\-\*]\s+(.+)$/);
    if (ulMatch) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      // Collect all list items
      const listItems: string[] = [];
      let i = lines.indexOf(line);
      while (i < lines.length) {
        const listLine = lines[i].trim();
        const itemMatch = listLine.match(/^[\-\*]\s+(.+)$/);
        if (itemMatch) {
          listItems.push(itemMatch[1]);
          i++;
        } else {
          break;
        }
      }

      components.push(
        <ul key={componentKey++} className="list-disc list-inside mb-6 space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-text-secondary ml-4">
              {item}
            </li>
          ))}
        </ul>
      );
      
      // Skip processed lines
      const processed = listItems.length;
      for (let j = 0; j < processed - 1; j++) {
        lines.shift();
      }
      continue;
    }

    // Check for blockquote (> at start)
    if (trimmed.startsWith('>')) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      const quoteText = trimmed.substring(1).trim();
      components.push(
        <blockquote
          key={componentKey++}
          className="border-l-4 border-primary pl-4 italic my-6 text-text-secondary"
        >
          {quoteText}
        </blockquote>
      );
      continue;
    }

    // Check if line contains image markdown ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const hasImage = imageRegex.test(trimmed);

    if (hasImage) {
      // Flush current paragraph
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }

      // Extract and render images as separate block elements
      let match;
      imageRegex.lastIndex = 0;
      while ((match = imageRegex.exec(trimmed)) !== null) {
        const [, alt, src] = match;
        if (src && typeof src === 'string') {
          components.push(
            <figure
              key={componentKey++}
              className="relative w-full h-96 my-8 rounded-lg overflow-hidden"
            >
              <Image
                src={src}
                alt={alt || ''}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
                className="object-cover"
              />
            </figure>
          );
        }
      }
    } else if (trimmed === '') {
      // Empty line = paragraph break
      if (currentParagraph.length > 0) {
        components.push(
          <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    } else {
      // Regular text line - add to current paragraph
      currentParagraph.push(trimmed);
    }
  }

  // Flush remaining paragraph
  if (currentParagraph.length > 0) {
    components.push(
      <p key={componentKey++} className="text-text-secondary leading-relaxed mb-4">
        {currentParagraph.join(' ')}
      </p>
    );
  }

  return components;
}

export function ArticleContentRenderer({ content }: { content: string }): JSX.Element {
  return (
    <div className="space-y-4">
      {parseMarkdownWithImages(content)}
    </div>
  );
}

