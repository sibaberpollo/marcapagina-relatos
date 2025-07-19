# MCP Tools Structure

This directory contains the MCP (Model Context Protocol) handler and tools for the application.'

## Usage

`mcp.json`:

```
{
  "mcpServers": {
    "marcapagina": {
      "url": "http://localhost:3000/api/ctx/mcp"
    }
  }
}
```

Details: https://github.com/vercel/mcp-adapter?tab=readme-ov-file#integrating-into-your-client

## Directory Structure

```
ctx/
├── [transport]/
│   └── route.ts          # Main MCP handler route
├── common/
│   ├── types.ts         # Shared TypeScript interfaces
│   └── utils.ts         # Common utility functions
├── tools/
│   ├── getPost.ts       # Get post content tool
│   └── searchPosts.ts   # Fuzzy search posts tool
└── README.md            # This file
```

## Adding New Tools

To add a new tool:

1. **Create a new tool file** in the `tools/` directory (e.g., `myNewTool.ts`)
2. **Define your tool** following this pattern:

```typescript
import { z } from "zod";

export const initMyNewTool = (server: any) => {
  server.tool(
    "my_new_tool",
    "Description of what the tool does",
    {
      // Define parameters using Zod schema
      param1: z.string().describe("Description of parameter"),
      param2: z.number().optional(),
    },
    async ({ param1, param2 }: { param1: string; param2?: number }, extra: any) => {
      // Tool implementation
      return {
        content: [{ type: "text" as const, text: "Tool response" }],
      };
    }
  );
};
```

3. **Import and register the tool** in `[transport]/route.ts`:

```typescript
// Add import
import { initMyNewTool } from "../tools/myNewTool";

// Add registration in the server function (alongside existing tools)
initGetPostTool(server);
initSearchPostsTool(server);
initMyNewTool(server);
```

4. **The tool will be registered** when the server starts.

## Common Utilities

The `common/` directory contains shared functionality:

- `types.ts`: TypeScript interfaces used across tools
- `utils.ts`: Utility functions like `getPostById`, `formatPostResponse`, `searchPosts`, `fuzzyMatch`, `getAllPostsFromDirectory`

## Available Tools

### `get_post`
- **Description**: Gets the full content of a post by slug or title
- **Parameters**:
  - `identifier` (string): The slug or title of the post to retrieve
  - `searchType` (enum): "slug" or "title" (default: "slug")
  - `lang` (enum): "es" or "en" (default: "es")

### `search_posts`
- **Description**: Fuzzy search through all posts by title or slug
- **Parameters**:
  - `query` (string): Search term to find posts by title or slug
  - `limit` (number): Maximum number of results to return (1-20, default: 10)
  - `lang` (enum): "es", "en", or "both" (default: "both")
  - `minScore` (number): Minimum fuzzy match score 0-100 (default: 30)

## Handler Configuration

The main handler is configured in `[transport]/route.ts` with:
- Redis support for caching
- Base path `/api/ctx`
- Maximum duration of 60 seconds
- Verbose logging enabled
