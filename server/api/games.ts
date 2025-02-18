export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey = config.apiKey;

    // Get query parameters with types
    const { page = 1, genres = null, platforms = null, search = '' }: { page: number, genres: string | null, platforms: string | null, search: string } = getQuery(event);

    // Base URI for the API request
    let uri = `https://api.rawg.io/api/games?key=${apiKey}&ordering=released&page=${page}`;

    // Add the search query to the URI if it's provided
    if (search.trim()) {
        uri += `&search=${encodeURIComponent(search)}&search_exact=true`;
    }

    // Add filters (genres and platforms) to the URI
    if (genres) {
        uri += `&genres=${genres}`;
    }
    if (platforms) {
        uri += `&platforms=${platforms}`;
    }

    try {
        // Fetch data from the RAWG API
        const response = await $fetch<{ results: any[] }>(uri);
        return response;
    } catch (error) {
        console.error('Error fetching games:', error);
        return { error: 'Failed to fetch games' };
    }
});
