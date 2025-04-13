// Repository details keyed by language
const REPOS = {
    typescript: {
        repo: "https://github.com/modelcontextprotocol/typescript-sdk",
        readme: "https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/refs/heads/main/README.md"
    },
    python: {
        repo: "https://github.com/modelcontextprotocol/python-sdk",
        readme: "https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/refs/heads/main/README.md"
    },
} as const;

// Exported URLs
export const URLS = {
    FULL_DOCU: "https://modelcontextprotocol.io/llms-full.txt",
    repos: REPOS,
};

// Supported languages derived from REPOS keys, asserted as non-empty tuple for Zod
export const supportedLanguages = Object.keys(REPOS) as [keyof typeof REPOS, ...(keyof typeof REPOS)[]];
export type SupportedLanguages = typeof supportedLanguages[number];
