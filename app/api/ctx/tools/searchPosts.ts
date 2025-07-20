import { z } from "zod";
import { searchPosts } from "../common/utils";

export const initSearchPostsTool = (server: any) => {
  server.tool(
    "search_posts",
    "Fuzzy search through all posts by title or slug",
    {
      query: z.string().describe("Search term to find posts by title or slug"),
      limit: z.number().int().min(1).max(20).default(10).describe("Maximum number of results to return"),
      lang: z.enum(["es", "en", "both"]).default("both").describe("Language to search in"),
      minScore: z.number().min(0).max(100).default(30).describe("Minimum fuzzy match score (0-100)"),
    },
    async ({ 
      query, 
      limit, 
      lang,
      minScore 
    }: { 
      query: string; 
      limit: number; 
      lang: "es" | "en" | "both";
      minScore: number;
    }, extra: any) => {
      try {
        // Use the abstracted search function
        const sortedPosts = searchPosts(query, limit, lang, minScore);
        
        if (sortedPosts.length === 0) {
          return {
            content: [{ 
              type: "text" as const, 
              text: `🔍 No posts found matching "${query}"` 
            }],
          };
        }
        
        // Format results
        const results = sortedPosts
          .map((post, index) => 
            `${index + 1}. **${post.title}** (${post.lang})\n   📝 Slug: \`${post.slug}\`\n   📊 Match: ${post.score}%\n   📅 Published: ${post.publishedAt}`
          )
          .join('\n\n');
        
        const response = `🔍 **Search Results for "${query}"**\n\nFound ${sortedPosts.length} matching posts:\n\n${results}`;
        
        return {
          content: [{ type: "text" as const, text: response }],
        };
        
      } catch (error) {
        console.error("Error in search_posts tool:", error);
        return {
          content: [{ 
            type: "text" as const, 
            text: `❌ Error searching posts: ${error instanceof Error ? error.message : "Unknown error"}` 
          }],
        };
      }
    }
  );
}; 