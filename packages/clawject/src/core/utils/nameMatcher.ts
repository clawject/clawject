//Matching by trigrams
export const nameMatcher = (request: string) => {
    const requestChunks = [...chunkedString(request, 3)];

    return (searchIn: string): boolean => {
        const searchChunks = chunkedString(searchIn, 3);

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
