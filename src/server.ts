import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { z } from "zod";
import { SupportedLanguages, supportedLanguages, URLS } from "./config.js";
import fetchFullDocu, { extractExamples, fetchReadme } from "./util/docuFetch.js";

export class McpDocuServer {
    private readonly server: McpServer;

    constructor() {
        this.server = new McpServer(
            {
                name: "ModelContextProtocol Docu Server",
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
            "get_code_examples",
            "Get all code examples for a specified language from the main documentation.",
            {
                language: z.enum(supportedLanguages),
            },
            async ({ language }: { language: SupportedLanguages; }) => {
                // Use try-catch for error handling during fetch and processing
                try {
                    const docuText = await fetchFullDocu(URLS.FULL_DOCU);
                    const examples = extractExamples(docuText, language);

                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(examples, null, 2),
                            }
                        ]
                    };
                } catch (error) {
                    // Log the error on the server side
                    this.error("Error in get_code_examples:", error);
                    // Throw an error that the MCP client can understand
                    // Adjust error message and code as needed based on MCP spec/SDK features
                    throw new Error(`Failed to get code examples: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        );

        // Register the new get_readme tool
        this.server.tool(
            "get_readme",
            "Get the README content for the specified SDK language.",
            {
                // Define the 'language' parameter using zod schema
                language: z.enum(supportedLanguages), // Make language required for this tool
            },
            // Async handler function for the tool
            async ({ language }: { language: SupportedLanguages; }) => {
                // Use try-catch for robust error handling
                try {
                    // Fetch the README content using the utility function
                    const readmeContent = await fetchReadme(language);
                    // Return the content in the expected MCP format
                    return {
                        content: [
                            {
                                type: "text",
                                text: readmeContent,
                            }
                        ]
                    };
                } catch (error) {
                    // Log the error on the server side
                    this.error(`Error in get_readme for ${language}:`, error);
                    // Propagate a user-friendly error back to the MCP client
                    throw new Error(`Failed to fetch README for ${language}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
        );

        // TODO: ADD MORE TOOLS (Removed the original TODO comment from here as we added a tool)
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
