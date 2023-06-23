const GRAM_SIZE = 5;

export const nameMatcher = (request: string) => {
    const requestChunks = [...chunkedString(request, GRAM_SIZE)];

    return (searchIn: string): boolean => {
        const searchChunks = chunkedString(searchIn, GRAM_SIZE);

        return requestChunks.some(chunk => searchChunks.has(chunk));
    };
};

function chunkedString(string: string, chunkSize: number): Set<string> {
    const chunks = new Set<string>();

    for (let i = 0; i < string.length; i += chunkSize) {
        chunks.add(string.slice(i, i + chunkSize));
    }

    return chunks;
}
