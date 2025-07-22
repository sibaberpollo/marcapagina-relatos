import { z } from "zod";
import { getRelatoBySlug, searchRelatos } from '@/lib/sanity';
import { formatRelatoResponse } from "../common/utils";

export const initGetPostTool = (server: any) => {
  server.tool(
    "get_post",
    "Gets the full content of a post by slug or title from the database",
    {
      identifier: z.string().describe("The slug or title of the post to retrieve"),
      searchType: z.enum(["slug", "title"]).default("slug").describe("Whether to search by slug or title"),
      includeContent: z.boolean().default(true).describe("Whether to include full post content"),
    },
    async ({ 
      identifier, 
      searchType, 
      includeContent 
    }: { 
      identifier: string; 
      searchType: "slug" | "title"; 
      includeContent: boolean;
    }, extra: any) => {
      try {
        // Log input parameters
        console.log('[get_post] Tool called with parameters:', {
          identifier,
          searchType,
          includeContent
        });

        let relato: any = null;

        if (searchType === "slug") {
          // Log before calling getRelatoBySlug
          console.log('[get_post] Calling getRelatoBySlug function with slug:', identifier);
          relato = await getRelatoBySlug(identifier);
          
          // Log after calling getRelatoBySlug
          console.log('[get_post] getRelatoBySlug completed. Found:', relato ? 'Yes' : 'No');
        } else {
          // Log before calling searchRelatos for title search
          console.log('[get_post] Calling searchRelatos function for title search:', identifier);
          const searchResults = await searchRelatos({
            query: identifier,
            limit: 1,
            includeContent
          });
          
          // Log after calling searchRelatos
          console.log('[get_post] searchRelatos completed. Results found:', searchResults.results.length);
          
          if (searchResults.results.length > 0) {
            relato = searchResults.results[0];
          }
        }

        if (!relato) {
          const notFoundResponse = `Post not found with ${searchType}: "${identifier}"`;
          console.log('[get_post] Returning not found response:', notFoundResponse);
          
          return {
            content: [{ 
              type: "text" as const, 
              text: notFoundResponse
            }],
          };
        }

        // Log before calling formatRelatoResponse
        console.log('[get_post] Calling formatRelatoResponse function...');
        const response = formatRelatoResponse(relato, includeContent);
        
        // Log after calling formatRelatoResponse
        console.log('[get_post] formatRelatoResponse completed');
        console.log('[get_post] Final response length:', response.length, 'characters');

        return {
          content: [{ type: "text" as const, text: response }],
        };

      } catch (error) {
        console.error('[get_post] Error in get_post tool:', error);
        return {
          content: [{ 
            type: "text" as const, 
            text: `Error retrieving post: ${error instanceof Error ? error.message : "Unknown error"}` 
          }],
        };
      }
    }
  );
}; 