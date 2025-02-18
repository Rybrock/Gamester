export default defineEventHandler(async(event) => {
    const gameId = event.context.params.id;
    const config = useRuntimeConfig();
    const apiKey = config.apiKey;

    const uri = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

    try {
        const response = await $fetch(uri);
        return response;
    } catch (error) {
        console.error('Error fetching game data:', error);
        return { error: 'Failed to fetch game data' };
    }
});