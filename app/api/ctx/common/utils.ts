import fs from "fs";
import path from "path";
import { Post } from "./types";

/**
 * Formats a relato object into a comprehensive readable string response
 */
export const formatRelatoResponse = (relato: any, includeContent: boolean = true): string => {
  let response = `**${relato.title}**\n\n`;
  response += `**Slug:** ${relato.slug.current || relato.slug}\n`;
  
  if (relato.author?.name) {
    response += `**Author:** ${relato.author.name}\n`;
  }
  
  if (relato.publishedAt || relato.date) {
    response += `**Published:** ${relato.publishedAt || relato.date}\n`;
  }
  
  if (relato.readingTime) {
    response += `**Reading Time:** ${relato.readingTime.text}\n`;
  }
  
  if (relato.tags?.length) {
    response += `**Tags:** ${relato.tags.join(", ")}\n`;
  }
  
  if (relato.category) {
    response += `**Category:** ${relato.category}\n`;
  }
  
  if (relato.site?.title) {
    response += `**Site:** ${relato.site.title}\n`;
  }
  
  if (relato.series) {
    response += `**Series:** ${relato.series}`;
    if (relato.seriesOrder) {
      response += ` (Part ${relato.seriesOrder})`;
    }
    response += `\n`;
  }
  
  if (relato.summary) {
    response += `\n**Summary:**\n${relato.summary}\n`;
  }
  
  if (includeContent && relato.body) {
    response += `\n**Content:**\n`;
    // For portable text content, we'll show a simplified version
    if (Array.isArray(relato.body)) {
      // Extract text from portable text blocks
      const textContent = relato.body
        .filter(block => block._type === 'block')
        .map(block => {
          if (block.children) {
            return block.children.map(child => child.text).join('');
          }
          return '';
        })
        .join('\n\n');
      response += textContent;
    } else if (typeof relato.body === 'string') {
      response += relato.body;
    }
  }
  
  if (relato.image) {
    response += `\n\n**Image:** ${relato.image}`;
  }
  
  if (relato.bgColor) {
    response += `\n**Background Color:** ${relato.bgColor}`;
  }

  return response;
};

/**
 * Formats search results into a comprehensive readable response with metadata and pagination
 */
export const formatSearchResultsResponse = (
  searchResults: { results: any[]; total: number; hasMore: boolean },
  searchParams: {
    query?: string;
    author?: string;
    tags?: string[];
    site?: string;
    dateFrom?: string;
    dateTo?: string;
    offset?: number;
    includeContent?: boolean;
  }
): string => {
  const { results, total, hasMore } = searchResults;
  const { query, author, tags, site, dateFrom, dateTo, offset = 0, includeContent = false } = searchParams;

  // Format individual results
  const formattedResults = results
    .map((post, index) => {
      let result = `${offset + index + 1}. **${post.title}**\n   Slug: \`${post.slug}\``;
      
      if (post.author?.name) {
        result += `\n   Author: ${post.author.name}`;
      }
      
      if (post.tags?.length) {
        result += `\n   Tags: ${post.tags.join(', ')}`;
      }
      
      if (post.site?.title) {
        result += `\n   Site: ${post.site.title}`;
      }
      
      if (post.publishedAt || post.date) {
        result += `\n   Published: ${post.publishedAt || post.date}`;
      }
      
      if (post.summary) {
        result += `\n   Summary: ${post.summary}`;
      }
      
      if (includeContent && post.readingTime) {
        result += `\n   Reading time: ${post.readingTime.text}`;
      }
      
      return result;
    })
    .join('\n\n');

  // Build search info string
  const searchInfo = [
    query && `query: "${query}"`,
    author && `author: "${author}"`,
    tags?.length && `tags: ${tags.join(', ')}`,
    site && `site: "${site}"`,
    dateFrom && `from: ${dateFrom}`,
    dateTo && `to: ${dateTo}`
  ].filter(Boolean).join(', ');

  // Build complete response
  let response = `**Search Results${searchInfo ? ` for ${searchInfo}` : ''}**\n\n`;
  response += `Found ${total} total posts (showing ${results.length})`;
  
  if (hasMore) {
    response += ` - more results available`;
  }
  
  response += `\n\n${formattedResults}`;

  return response;
};
