import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiKey: string = config.apiKey;

    const uri = `https://api.rawg.io/api/platforms?key=${apiKey}`;

    try {
        const response = await $fetch<{ results: { id: number; name: string }[] }>(uri);
        return response;
    } catch (error) {
        console.error('Error fetching platforms:', error);
        return { error: 'Failed to fetch platforms' };
    }
});
