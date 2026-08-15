import { fetchPublishedBlogs } from "./cms";
import type { BlogDoc } from "./cms-types";
import type { Post } from "./blog-data";

/**
 * Adapters that let published Firebase blogs reuse the existing static
 * `Post` shape (and therefore the existing blog card / detail markup).
 * No new Firebase fetching logic — `fetchPublishedBlogs()` is reused.
 */
export function blogDocToPost(doc: BlogDoc): Post {
  const paragraphs = (doc.content ?? "")
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt ?? "",
    date: doc.publishedDate ?? doc.createdAt ?? "",
    category: doc.category ?? "",
    author: doc.author ?? "",
    image: doc.image ?? "",
    imageAlt: doc.imageAlt ?? doc.title ?? "",
    body: paragraphs.length ? [{ paragraphs }] : [],
  };
}

/** Published Firebase posts, mapped to `Post`. Returns [] on any failure. */
export async function fetchPublishedFirebasePosts(): Promise<Post[]> {
  try {
    const docs = await fetchPublishedBlogs();
    return docs.filter((d) => d.isPublished && d.slug).map(blogDocToPost);
  } catch {
    return [];
  }
}

/** Static posts first, then Firebase posts, de-duplicated by slug. */
export function mergePostsBySlug(staticPosts: Post[], firebasePosts: Post[]): Post[] {
  const seen = new Set(staticPosts.map((p) => p.slug));
  return [...staticPosts, ...firebasePosts.filter((p) => !seen.has(p.slug))];
}
