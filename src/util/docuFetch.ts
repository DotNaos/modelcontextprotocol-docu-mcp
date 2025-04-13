import { SupportedLanguages, URLS } from "../config.js";

/**
 * Fetches the documentation from a given URL
 * @param url The URL to fetch the documentation from, has to be a raw URL
 * @returns The documentation text
 */
export default async function fetchFullDocu( // Use async/await for clarity
    url: string
): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Provide more context in the error message
            throw new Error(`Error fetching documentation from ${url}: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        // Log the error and re-throw or handle appropriately
        console.error(`Failed to fetch documentation: ${error}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}


/**
 * Extracts documentation sections containing code examples for a specific language.
 * A section starts with a markdown header and ends before the next markdown header.
 * Only sections containing at least one code block of the specified language are included.
 * @param docuText The full documentation text.
 * @param language The language identifier used in the code block fences (e.g., 'typescript').
 * @returns An array of strings, each representing a documentation section with relevant code examples.
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
    // 'm' flag for multiline matching (^ matches start of line)
    // '\\b' ensures it matches the whole word (e.g., 'ts' doesn't match 'typescript')
    const targetCodeBlockRegex = new RegExp(`^\\\`\\\`\\\`${language}\\b`, 'm');

    // Iterate through sections defined by headers
    for (let i = 0; i < headerIndices.length - 1; i++) {
        const sectionStart = headerIndices[i];
        const sectionEnd = headerIndices[i + 1]; // End index is exclusive for slice

        // Extract the lines for the current section
        const sectionLines = lines.slice(sectionStart, sectionEnd);
        const sectionText = sectionLines.join('\n');

        // Check if this section contains at least one code block of the target language
        if (targetCodeBlockRegex.test(sectionText)) {
            examples.push(sectionText);
        }
    }

    return examples;
}

/**
 * Fetches the README content for a specific SDK language.
 * @param language The language of the SDK ('typescript' or 'python').
 * @returns The README content as a string.
 * @throws If fetching fails.
 */
export async function fetchReadme(language: SupportedLanguages): Promise<string> {
    // Directly access the README URL using the language as the key
    const url = URLS.repos[language].readme;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching README from ${url}: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Failed to fetch README for ${language}: ${error}`);
        throw error; // Re-throw for the caller (tool handler) to manage
    }
}
