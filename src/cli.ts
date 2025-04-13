#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpDocuServer } from "./server.js"; // Corrected import path

/**
 * Starts the MCP server using stdio transport.
 */
export async function startServer(): Promise<void> {
    const server = new McpDocuServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Logging will now be handled via the server's log/error methods sending messages to the client
}

// If this script is executed directly, start the server.
// This check prevents the server from starting automatically when the module is imported elsewhere.
// Check if running as the main module or via tsx/node directly
// const isMain = import.meta.url === `file://${process.argv[1]}`;
// const isDirectExecution = process.argv[1]?.endsWith('cli.ts') || process.argv[1]?.endsWith('cli.js');

// if (isMain || isDirectExecution) {
//     startServer().catch((error: unknown) => {
//         // Use console.error for fatal startup errors before the transport is connected
//         console.error("Failed to start server:", error instanceof Error ? error.message : String(error));
//         process.exit(1);
//     });
// }


startServer().catch((error: unknown) => {
    // Use console.error for fatal startup errors before the transport is connected
    console.error("Failed to start server:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
