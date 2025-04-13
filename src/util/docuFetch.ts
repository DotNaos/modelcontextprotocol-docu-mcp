import { SupportedLanguages, URLS } from "../config.js";

/**
 * Fetches the full documentation text from the configured URL.
 */
export default async function fetchFullDocu(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching documentation from ${url}: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Failed to fetch documentation: ${error}`);
        throw error;
    }
}

/**
 * Extracts documentation sections containing code examples for a specific language.
 * A section starts with a markdown header and ends before the next markdown header.
 * Only sections containing at least one code block of the specified language are included.
 */
export function extractExamples(docuText: string, language: SupportedLanguages): string[] {
    const lines = docuText.split('\n');
    const examples: string[] = [];
    const headerIndices: number[] = [];

    // Find indices of all markdown headers
    lines.forEach((line, index) => {
        if (line.match(/^#+\s/)) {
            headerIndices.push(index);
        }
    });

    // Add the end of the document as a final boundary
    headerIndices.push(lines.length);

    // Regex to find a code block starting with the specific language
    const targetCodeBlockRegex = new RegExp(`^\\\`\\\`\\\`${language}\\b`, 'm');

    // Iterate through sections defined by headers
    for (let i = 0; i < headerIndices.length - 1; i++) {
        const sectionStart = headerIndices[i];
        const sectionEnd = headerIndices[i + 1];
        const sectionLines = lines.slice(sectionStart, sectionEnd);
        const sectionText = sectionLines.join('\n');

        // Check if this section contains a relevant code block
        if (targetCodeBlockRegex.test(sectionText)) {
            examples.push(sectionText);
        }
    }

    return examples;
}

/**
 * Fetches the README content for a specific SDK language.
 */
export async function fetchReadme(language: SupportedLanguages): Promise<string> {
    const url = URLS.repos[language].readme;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching README from ${url}: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Failed to fetch README for ${language}: ${error}`);
        throw error;
    }
}
