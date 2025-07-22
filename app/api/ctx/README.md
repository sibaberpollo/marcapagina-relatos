# MCP Tools Structure

This directory contains the MCP (Model Context Protocol) handler and tools for the application.'

More details: https://github.com/vercel/mcp-adapter?tab=readme-ov-file#integrating-into-your-client

## Usage

* Having support for remote server:

```json
{
  "mcpServers": {
    "marcapagina": {
      "url": "http://localhost:3000/api/ctx/mcp"
    }
  }
}
```

* No support to remote servers:

```json
{
  "mcpServers": {
    "marcapagina": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:3000/api/ctx/mcp"
      ]
    }
  }
}
```

Claude Desktop: https://gist.github.com/p1nox/6effb821014dcd819f3ab8b516c3166f

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
