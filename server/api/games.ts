export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey = config.apiKey;

    // Get the current page and page_size from the query parameters
    const { page = 1, page_size = 16 } = getQuery(event);

    // Add ordering to fetch the most recently released games
    const uri = `https://api.rawg.io/api/games?key=${apiKey}&ordering=released&page=${page}&page_size=${page_size}`;

    try {
        const response = await $fetch(uri);

        return response;
    } catch (error) {
        console.error('Error fetching recent games:', error);
        return { error: 'Failed to fetch recent games' };
    }
});
