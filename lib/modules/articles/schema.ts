// Zod validation schemas for Articles module
// Full implementation happens in Phase 4
// This file establishes the architectural location for validation schemas

import { z } from 'zod';

// Schema stubs - to be implemented in Phase 4
// These will define validation rules for draft-save and publish-save operations

export const DraftArticleSchema = z.object({
  // To be implemented in Phase 4
  title: z.string(),
  slug: z.string(),
  category: z.string(),
});

export const PublishArticleSchema = z.object({
  // To be implemented in Phase 4
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  content: z.string(),
  coverImage: z.string(),
});

export type DraftArticle = z.infer<typeof DraftArticleSchema>;
export type PublishArticle = z.infer<typeof PublishArticleSchema>;
