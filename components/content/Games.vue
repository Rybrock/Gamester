<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const gameData = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const gamesPerPage = 16;
const isLoading = ref(false);

const placeholderImage = '/placeholder.webp';

const fetchGames = async (page = 1) => {
    isLoading.value = true;
    try {
        const response = await fetch(`/api/games?page=${page}&page_size=${gamesPerPage}`);
        const data = await response.json();

        if (data && data.results) {
            gameData.value = data.results;
            totalPages.value = Math.ceil(data.count / gamesPerPage);
        }
    } catch (error) {
        console.error('Error fetching games:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchGames(currentPage.value);
});

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchGames(currentPage.value);
        scrollToTop();
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchGames(currentPage.value);
        scrollToTop();
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
</script>

<template>
    <div class="w-full">
        <h3 class="text-4xl font-bold mb-4 text-center">Games</h3>

        <div v-if="isLoading" class="flex justify-center items-center">
            <div class="spinner"></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="game in gameData" :key="game.id"
                class="cursor-pointer hover:text-blue-500 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                <NuxtLink :to="`/games/${game.id}`" class="block">
                    <h4 class="text-center">{{ game.name }}</h4>
                    <img :src="game.background_image || placeholderImage" alt="Game Image" class="w-full h-48 object-cover rounded-lg">
                </NuxtLink>
            </div>
        </div>

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

<style scoped>
.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
