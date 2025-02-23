export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey = config.apiKey;

    const { page = 1, genres = null, platforms = null, search = '' }: { page: number, genres: string | null, platforms: string | null, search: string } = getQuery(event);

    let uri = `https://api.rawg.io/api/games?key=${apiKey}&ordering=released&page=${page}`;

    if (search.trim()) {
        uri += `&search=${encodeURIComponent(search)}&search_exact=true`;
    }

    if (genres) {
        uri += `&genres=${genres}`;
    }
    if (platforms) {
        uri += `&platforms=${platforms}`;
    }

    try {
        const response = await $fetch<{ results: any[] }>(uri);
        return response;
    } catch (error) {
        console.error('Error fetching games:', error);
        return { error: 'Failed to fetch games' };
    }
});
