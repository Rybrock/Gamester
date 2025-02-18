export default defineEventHandler(async (event) => {
    try {
        const { apiKey } = useRuntimeConfig();

        const uri = `https://api.rawg.io/api/genres?key=${apiKey}`;
        
        const data = await $fetch(uri);

        if (!data) {
            throw new Error("No data received from API");
        }
        return data;
    } catch (error) {
        console.error("Error fetching game data:", error);
        return { error: "Failed to fetch game data" };
    }
});