import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
export { startServer } from './cli.js';

declare class MinimalMcpServer {
    private readonly server;
    constructor();
    private registerTools;
    connect(transport: Transport): Promise<void>;
    private log;
    private error;
}

export { MinimalMcpServer };
