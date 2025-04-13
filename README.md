# Example MCP-Server

## Usage

In your mcp.json file in vscode, under `.vscode/mcp.json`, you need the following configuration:

### MacOS / Linux

**[View mcp.json Configuration](.vscode/mcp.json)**

### Windows

Same as Macos / Linux but change the following lines:

| Unix | Windows |
|------|---------|
| `"command": "npx"` | `"command": "cmd"` |
| `"args": ["-y", "..." ]` | `"args" : ["/c", "npx", "-y", "..." ]` |
