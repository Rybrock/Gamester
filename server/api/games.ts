export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey = config.apiKey;

    const { page = 1 } = getQuery(event);

    const uri = `https://api.rawg.io/api/games?key=${apiKey}&ordering=released&page=${page}`;

    try {
        const response = await $fetch(uri);

        return response;
    } catch (error) {
        console.error('Error fetching recent games:', error);
        return { error: 'Failed to fetch recent games' };
    }
});
