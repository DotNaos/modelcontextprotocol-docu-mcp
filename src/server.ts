import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { z } from "zod";

/**
 * A minimal example MCP Server.
 */
export class MinimalMcpServer {
    private readonly server: McpServer;

    constructor() {
        this.server = new McpServer(
            {
                // TODO: Replace with your server's actual name
                name: "Minimal MCP Server",
                // TODO: Replace with your server's actual version
                version: "0.1.0",
            },
            {
                capabilities: {
                    // Enable logging capability
                    logging: {},
                    // Enable tools capability
                    tools: {},
                },
            },
        );

        this.registerTools();
    }

    /**
     * Registers the tools provided by this server.
     */
    private registerTools(): void {
        this.server.tool(
            "hello_world", // Tool name
            "A simple tool that returns a greeting.", // Tool description
            { // Input schema using Zod
                name: z.string().describe("The name to include in the greeting."),
            },
            async ({ name }) => { // Tool implementation
                try {
                    // Log the execution of the tool
                    this.log(`Executing hello_world tool with name: ${name}`);

                    const greeting: string = `Hello, ${name}! Welcome to the minimal MCP server.`;

                    // Return the result
                    return {
                        content: [{ type: "text", text: greeting }],
                    };
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : String(error);
                    // Log the error
                    this.error(`Error in hello_world tool: ${message}`);
                    // Return an error response
                    return {
                        isError: true,
                        content: [{ type: "text", text: `Error executing tool: ${message}` }],
                    };
                }
            },
        );
    }

    /**
     * Connects the server to a transport layer.
     * @param transport - The transport to connect to.
     */
    async connect(transport: Transport): Promise<void> {
        await this.server.connect(transport);
        this.log("Minimal MCP Server connected via stdio and ready.");
    }

    /**
     * Sends an informational log message to the client.
     * @param data - The data to log.
     */
    private log(...data: unknown[]): void {
        this.server.server.sendLoggingMessage({
            level: "info",
            data: data.map(item => typeof item === 'string' ? item : JSON.stringify(item)),
        });
    }

    /**
     * Sends an error log message to the client.
     * @param data - The data to log.
     */
    private error(...data: unknown[]): void {
        this.server.server.sendLoggingMessage({
            level: "error",
            data: data.map(item => typeof item === 'string' ? item : JSON.stringify(item)),
        });
    }
}
