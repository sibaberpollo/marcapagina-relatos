import { z } from "zod";
import path from "path";
import { getPostById, formatPostResponse } from "../common/utils";

export const initGetPostTool = (server: any) => {
  server.tool(
    "get_post",
    "Gets the full content of a post by slug or title",
    {
      identifier: z.string().describe("The slug or title of the post to retrieve"),
      searchType: z.enum(["slug", "title"]).default("slug").describe("Whether to search by slug or title"),
      lang: z.enum(["es", "en"]).default("es").describe("Language preference (defaults to Spanish with fallback)"),
    },
    async ({ 
      identifier, 
      searchType, 
      lang 
    }: { 
      identifier: string; 
      searchType: "slug" | "title"; 
      lang: "es" | "en" 
    }, extra: any) => {
      try {
        const postsDirectory = path.join(process.cwd(), "data", "posts", lang);
        const fallbackDirectory = path.join(process.cwd(), "data", "posts", "es");

              // Search in requested language first
      let post = getPostById(postsDirectory, identifier, searchType);

      // If not found and not searching in Spanish, try Spanish as fallback
      if (!post && lang !== "es") {
        post = getPostById(fallbackDirectory, identifier, searchType);
        }

        if (!post) {
          return {
            content: [{ 
              type: "text" as const, 
              text: `❌ Post not found with ${searchType}: "${identifier}"` 
            }],
          };
        }

        // Format the response with the full post content
        const response = formatPostResponse(post);

        return {
          content: [{ type: "text" as const, text: response }],
        };

      } catch (error) {
        console.error("Error in get_post tool:", error);
        return {
          content: [{ 
            type: "text" as const, 
            text: `❌ Error retrieving post: ${error instanceof Error ? error.message : "Unknown error"}` 
          }],
        };
      }
    }
  );
}; 