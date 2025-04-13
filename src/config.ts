// Constants

// The URLs for the SDK Repos
const REPOS = {
    TYPESCRIPT_SDK_REPO: {
        repo: "https://github.com/modelcontextprotocol/typescript-sdk",
        readme: "https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/refs/heads/main/README.md"
    },
    PYTHON_SDK_REPO: {
        repo: "https://github.com/modelcontextprotocol/python-sdk",
        readme: "https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/refs/heads/main/README.md"
    },
}

// All urls
export const URLS = {
    FULL_DOCU: "https://modelcontextprotocol.io/llms-full.txt",
    repos: REPOS,
};

// List and Type of all supported languages
export const supportedLanguages = ["typescript", "python"] as const;
export type SupportedLanguages = typeof supportedLanguages[number];
