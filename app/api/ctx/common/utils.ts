import fs from "fs";
import path from "path";
import { Post } from "./types";

/**
 * Gets a specific post by identifier (slug or title)
 */
export const getPostById = (
  dir: string,
  identifier: string,
  searchType: "slug" | "title"
): Post | null => {
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter(file => file.endsWith('.json'));
  
  for (const file of files) {
    try {
      const filePath = path.join(dir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const post: Post = JSON.parse(fileContents);

      if (searchType === "slug") {
        if (post.slug === identifier) {
          return post;
        }
      } else if (searchType === "title") {
        // Case-insensitive title matching
        if (post.title.toLowerCase() === identifier.toLowerCase() ||
            post.title.toLowerCase().includes(identifier.toLowerCase())) {
          return post;
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }
  return null;
};

/**
 * Simple fuzzy search function that calculates similarity based on:
 * - Exact matches get highest score
 * - Contains matches get medium score
 * - Character overlap gets lower score
 */
export const fuzzyMatch = (searchTerm: string, target: string): number => {
  const search = searchTerm.toLowerCase();
  const text = target.toLowerCase();
  
  // Exact match
  if (text === search) return 100;
  
  // Contains match
  if (text.includes(search)) return 80;
  
  // Character overlap scoring
  let score = 0;
  const searchChars = search.split('');
  const textChars = text.split('');
  
  for (const char of searchChars) {
    if (textChars.includes(char)) {
      score += 1;
    }
  }
  
  // Return percentage based on search term length
  return Math.round((score / searchChars.length) * 60);
};

/**
 * Get all posts from a directory
 */
export const getAllPostsFromDirectory = (dir: string): Post[] => {
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir).filter(file => file.endsWith('.json'));
  const posts: Post[] = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(dir, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const post: Post = JSON.parse(fileContents);
      posts.push(post);
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }
  
  return posts;
};

/**
 * Search posts with fuzzy matching and return sorted results
 */
export const searchPosts = (
  query: string,
  limit: number = 10,
  lang: "es" | "en" | "both" = "both",
  minScore: number = 30
): Array<Post & { score: number; lang: string }> => {
  const allPosts: Array<Post & { score: number; lang: string }> = [];
  
  // Search in Spanish posts
  if (lang === "es" || lang === "both") {
    const esDirectory = path.join(process.cwd(), "data", "posts", "es");
    const esPosts = getAllPostsFromDirectory(esDirectory);
    
    for (const post of esPosts) {
      const titleScore = fuzzyMatch(query, post.title);
      const slugScore = fuzzyMatch(query, post.slug);
      const maxScore = Math.max(titleScore, slugScore);
      
      if (maxScore >= minScore) {
        allPosts.push({ ...post, score: maxScore, lang: "es" });
      }
    }
  }
  
  // Search in English posts
  if (lang === "en" || lang === "both") {
    const enDirectory = path.join(process.cwd(), "data", "posts", "en");
    const enPosts = getAllPostsFromDirectory(enDirectory);
    
    for (const post of enPosts) {
      const titleScore = fuzzyMatch(query, post.title);
      const slugScore = fuzzyMatch(query, post.slug);
      const maxScore = Math.max(titleScore, slugScore);
      
      if (maxScore >= minScore) {
        allPosts.push({ ...post, score: maxScore, lang: "en" });
      }
    }
  }
  
  // Sort by score (highest first) and limit results
  return allPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Formats a post object into a readable string response
 */
export const formatPostResponse = (post: Post): string => {
  return `📄 **${post.title}**

**Slug:** ${post.slug}
**Author:** ${post.author.name}
**Published:** ${post.publishedAt}
**Reading Time:** ${post.readingTime}
**Tags:** ${post.tags.join(", ")}

**Description:**
${post.description}

**Content:**
${post.content}

**Image:** ${post.image}
${post.bgColor ? `**Background Color:** ${post.bgColor}` : ""}`;
};


