import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { z } from "zod";
import { SupportedLanguages, supportedLanguages, URLS } from "./config.js";
import fetchFullDocu, { extractExamples, fetchReadme } from "./util/docuFetch.js";

interface GetCodeExamplesParams {
    language?: SupportedLanguages;
}

interface GetReadmeParams {
    language: SupportedLanguages;
}

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
                    logging: {},
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
                language: z.enum(supportedLanguages).optional(),
            },
            async ({ language }: GetCodeExamplesParams) => {
                try {
                    const docuText = await fetchFullDocu(URLS.FULL_DOCU);
                    const targetLanguage = language || 'typescript';
                    const examples = extractExamples(docuText, targetLanguage);

                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(examples, null, 2),
                            }
                        ]
                    };
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    this.error("Error in get_code_examples:", errorMessage);
                    throw new Error(`Failed to get code examples: ${errorMessage}`);
                }
            }
        );

        this.server.tool(
            "get_readme",
            "Get the README content for the specified SDK language.",
            {
                language: z.enum(supportedLanguages),
            },
            async ({ language }: GetReadmeParams) => {
                try {
                    const readmeContent = await fetchReadme(language);
                    return {
                        content: [
                            {
                                type: "text",
                                text: readmeContent,
                            }
                        ]
                    };
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    this.error(`Error in get_readme for ${language}:`, errorMessage);
                    throw new Error(`Failed to fetch README for ${language}: ${errorMessage}`);
                }
            }
        );
    }

    /**
     * Connects the server to a transport layer.
     */
    async connect(transport: Transport): Promise<void> {
        try {
            await this.server.connect(transport);
            this.log("MCP Docu Server connected and ready.");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.error("Failed to connect server:", errorMessage);
            throw new Error(`Server connection failed: ${errorMessage}`);
        }
    }

    /**
     * Sends an informational log message to the client.
     */
    private log(...data: unknown[]): void {
        this.server.server.sendLoggingMessage({
            level: "info",
            data: data.map(item => typeof item === 'string' ? item : JSON.stringify(item)),
        });
    }

    /**
     * Sends an error log message to the client.
     */
    private error(...data: unknown[]): void {
        this.server.server.sendLoggingMessage({
            level: "error",
            data: data.map(item => typeof item === 'string' ? item : JSON.stringify(item)),
        });
    }
}
