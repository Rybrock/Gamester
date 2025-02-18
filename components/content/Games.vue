<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    selectedGenre: Object,
});

const gameData = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const gamesPerPage = 16;
const isLoading = ref(false);

const fetchGames = async (page = 1, genreId = null) => {
    isLoading.value = true;
    try {
        let url = `/api/games?page=${page}&page_size=${gamesPerPage}`;
        if (genreId) {
            url += `&genres=${genreId}`;
        }
        
        const response = await fetch(url);
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

watch(() => props.selectedGenre, (newGenre) => {
    if (newGenre) {
        fetchGames(1, newGenre.id);
    }
});
</script>

<template>
    <div class="w-full">
        <h3 class="text-4xl font-bold mb-4 text-center">
            {{ selectedGenre.name + ' Games' }}
        </h3>

        <div v-if="isLoading" class="flex justify-center items-center">
            <div class="spinner"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="game in gameData" :key="game.id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105">
                <NuxtLink :to="`/games/${game.id}`" class="block">
                    <img :src="game.background_image || '/placeholder.webp'" alt="Game Image" 
                        class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h4 class="text-lg font-semibold text-center text-gray-900 dark:text-white">
                            {{ game.name }}
                        </h4>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
