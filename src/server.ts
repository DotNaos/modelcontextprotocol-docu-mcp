import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { z } from "zod";
import { SupportedLanguages, supportedLanguages, URLS } from "./config.js";
import fetchFullDocu, { extractExamples } from "./util/docuFetch.js";

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
        // TODO: ADD MORE TOOLS
        this.server.tool(
            "get_code_examples",
            "Get all code examples for a specified language",
            {
                language: z.enum(supportedLanguages).optional(), // Default to 'typescript'
            },
            async ({ language }: { language?: SupportedLanguages; }) => {
                const docuText = await fetchFullDocu(URLS.FULL_DOCU);

                // Default to 'typescript' if no language is provided
                language = language || 'typescript';
                const examples = extractExamples(docuText, language);

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(examples, null, 2),
                        }
                    ]
                }
            }
        )
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
