// server/api/reviews/[id].ts
export default defineEventHandler(async (event) => {
    console.log("Request received:", event.node.req.url);  // Debugging log

    const config = useRuntimeConfig();
    const apiKey: string = config.apiKey;

    // ✅ Get gameId from route parameters
    const gameId = getRouterParam(event, "id");

    if (!gameId) {
        console.error("Game ID is missing in the request");
        return { error: "Game ID is missing in the request" };
    }

    console.log(`Fetching reviews for game ID: ${gameId}`);

    const uri = `https://api.rawg.io/api/games/${gameId}/reviews?key=${apiKey}`;

    try {
        const response = await $fetch<{ results: any[] }>(uri);
        return response;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return { error: "Failed to fetch reviews" };
    }
});
