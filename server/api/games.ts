export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey = config.apiKey;

    const { page = 1, genres = null } = getQuery(event);

    let uri = `https://api.rawg.io/api/games?key=${apiKey}&ordering=released&page=${page}`;

    if (genres) {
        uri += `&genres=${genres}`;
    }

    try {
        const response = await $fetch(uri);
        return response;
    } catch (error) {
        console.error('Error fetching games:', error);
        return { error: 'Failed to fetch games' };
    }
});
