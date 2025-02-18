<script setup>
import { ref, onMounted } from 'vue';

const gameData = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const gamesPerPage = 16; // Number of games per page

// Placeholder image URL
const placeholderImage = '/placeholder.webp'; // Replace with your actual placeholder image URL

// Fetch games with pagination
const fetchGames = async (page = 1) => {
    try {
        const response = await fetch(`/api/games?page=${page}&page_size=${gamesPerPage}`);
        const data = await response.json();

        if (data && data.results) {
            gameData.value = data.results;
            totalPages.value = Math.ceil(data.count / gamesPerPage); // Assuming the API returns a `count` of total results
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    }
};

// On component mount, fetch the first page of games
onMounted(() => {
    fetchGames(currentPage.value);
});

// Go to the next page
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchGames(currentPage.value); // Fetch new page when the current page changes
    }
};

// Go to the previous page
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchGames(currentPage.value); // Fetch new page when the current page changes
    }
};
</script>

<template>
    <div class="w-full">
        <h3 class="text-4xl font-bold mb-4 text-center">Games</h3>

        <p v-if="gameData.length === 0" class="text-center">Loading games...</p>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="game in gameData" :key="game.id"
                class="cursor-pointer hover:text-blue-500 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                {{ game.name }}
                <!-- Fallback to placeholder image if no background_image -->
                <img :src="game.background_image || placeholderImage" alt="Game Image" class="w-full h-48 object-cover rounded-lg">
            </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center mt-4">
            <button 
                @click="prevPage" 
                :disabled="currentPage.value === 1" 
                class="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
            >
                Previous
            </button>
            <span class="mx-4 text-xl">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
                @click="nextPage" 
                :disabled="currentPage.value === totalPages" 
                class="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
            >
                Next
            </button>
        </div>
    </div>
</template>
