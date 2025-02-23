export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey: string = config.apiKey;
  
    const searchQuery = event.context.query.search || '';
    console.log(`Search query: "${searchQuery}"`);
    let uri = `https://api.rawg.io/api/games?key=${apiKey}&page_size=12`;
  
    if (searchQuery.trim()) {
        uri += `&search=${encodeURIComponent(searchQuery)}`;
    }
  
    console.log(`Request URL: ${uri}`);
  
    try {
        const response = await $fetch<{ results: any[] }>(uri);
        return response; 
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching games from RAWG API:', error.message);
            return { error: 'Failed to fetch games', details: error.message };
        } else {
            console.error('Unknown error:', error);
            return { error: 'Failed to fetch games', details: 'Unknown error occurred' };
        }
    }
});
