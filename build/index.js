import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({
    name: "Example Server : PLEASE CHANGE ME",
    version: "1.0.0",
});
server.tool("example_tool", "Example Tool description", {
    param1: z.string().describe("Example parameter 1"),
    param2: z.number().describe("Example parameter 2"),
}, async ({ param1, param2 }) => {
    return {
        content: [
            {
                type: "text",
                text: `Hello from the example tool! You passed param1: ${param1} and param2: ${param2}`,
            }
        ]
    };
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Example MCP Server running on stdio");
}
main().catch((err) => {
    console.error("Fatal error in main():", err);
    process.exit(1);
});
