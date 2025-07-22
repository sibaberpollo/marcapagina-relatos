import { z } from "zod";
import { searchRelatos } from '@/lib/sanity';
import { formatSearchResultsResponse } from "../common/utils";

export const initSearchPostsTool = (server: any) => {
  server.tool(
    "search_posts",
    "Search through all posts with full-text search and advanced filtering options",
    {
      query: z.string().optional().describe("Search term to find posts by title, summary, or content"),
      author: z.string().optional().describe("Filter by author slug"),
      tags: z.array(z.string()).optional().describe("Filter by tags (at least one must match)"),
      site: z.string().optional().describe("Filter by site slug"),
      dateFrom: z.string().optional().describe("Filter by date from (YYYY-MM-DD format)"),
      dateTo: z.string().optional().describe("Filter by date to (YYYY-MM-DD format)"),
      limit: z.number().int().min(1).max(50).default(10).describe("Maximum number of results to return"),
      offset: z.number().int().min(0).default(0).describe("Number of results to skip for pagination"),
      includeContent: z.boolean().default(false).describe("Whether to include full post content or just metadata"),
    },
    async ({ 
      query,
      author,
      tags,
      site,
      dateFrom,
      dateTo,
      limit, 
      offset,
      includeContent 
    }: { 
      query?: string;
      author?: string;
      tags?: string[];
      site?: string;
      dateFrom?: string;
      dateTo?: string;
      limit: number;
      offset: number;
      includeContent: boolean;
    }, extra: any) => {
      try {
        // Log input parameters
        console.log('[search_posts] Tool called with parameters:', {
          query,
          author,
          tags,
          site,
          dateFrom,
          dateTo,
          limit,
          offset,
          includeContent
        });

        // Log before calling searchRelatos
        console.log('[search_posts] Calling searchRelatos function...');
        const searchResults = await searchRelatos({
          query,
          author,
          tags,
          site,
          dateFrom,
          dateTo,
          limit,
          offset,
          includeContent
        });
        
        // Log after calling searchRelatos
        console.log('[search_posts] searchRelatos completed. Results:', {
          totalResults: searchResults.total,
          returnedResults: searchResults.results.length,
          hasMore: searchResults.hasMore
        });
        
        if (searchResults.results.length === 0) {
          const searchTerms = [
            query && `query: "${query}"`,
            author && `author: "${author}"`,
            tags?.length && `tags: ${tags.join(', ')}`,
            site && `site: "${site}"`,
            dateFrom && `from: ${dateFrom}`,
            dateTo && `to: ${dateTo}`
          ].filter(Boolean).join(', ');
          
          const noResultsResponse = `No posts found${searchTerms ? ` for ${searchTerms}` : ''}`;
          console.log('[search_posts] Returning no results response:', noResultsResponse);
          
          return {
            content: [{ 
              type: "text" as const, 
              text: noResultsResponse
            }],
          };
        }

        // Log before calling formatSearchResultsResponse
        console.log('[search_posts] Calling formatSearchResultsResponse function...');
        const response = formatSearchResultsResponse(searchResults, {
          query,
          author,
          tags,
          site,
          dateFrom,
          dateTo,
          offset,
          includeContent
        });
        
        // Log after calling formatSearchResultsResponse
        console.log('[search_posts] formatSearchResultsResponse completed');
        console.log('[search_posts] Final response length:', response.length, 'characters');
        
        return {
          content: [{ type: "text" as const, text: response }],
        };
        
      } catch (error) {
        console.error('[search_posts] Error in search_posts tool:', error);
        return {
          content: [{ 
            type: "text" as const, 
            text: `Error searching posts: ${error instanceof Error ? error.message : "Unknown error"}` 
          }],
        };
      }
    }
  );
}; 