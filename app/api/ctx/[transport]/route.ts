import { createMcpHandler } from 'mcp-handler'
import { initGetPostTool } from '../tools/getPost'
import { initSearchPostsTool } from '../tools/searchPosts'

const handler = createMcpHandler(
  (server) => {
    // Register all tools
    initGetPostTool(server)
    initSearchPostsTool(server)
  },
  {
    // Optional server options
  },
  {
    // TODO add redis caching
    // redisUrl: process.env.REDIS_URL,
    basePath: '/api/ctx', // this needs to match where the [transport] is located.
    maxDuration: 60,
    verboseLogs: true,
  }
)

export { handler as GET, handler as POST }
