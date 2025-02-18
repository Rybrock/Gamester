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
const platforms = ref([]);
const selectedPlatform = ref(null);
const isModalOpen = ref(false);

const fetchPlatforms = async () => {
    try {
        const response = await fetch('/api/platforms');
        const data = await response.json();
        platforms.value = data.results || [];
    } catch (error) {
        console.error('Error fetching platforms:', error);
    }
};

const fetchGames = async (page = 1, genreId = null, platformId = null) => {
    isLoading.value = true;
    try {
        let url = `/api/games?page=${page}&page_size=${gamesPerPage}`;
        if (genreId) {
            url += `&genres=${genreId}`;
        }
        if (platformId) {
            url += `&platforms=${platformId}`;
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
    fetchPlatforms();
});

watch(() => props.selectedGenre, (newGenre) => {
    if (newGenre) {
        fetchGames(1, newGenre.id, selectedPlatform.value?.id);
    }
});

const selectPlatformAndClose = (platform) => {
    selectedPlatform.value = platform;
    fetchGames(1, props.selectedGenre?.id, platform.id);
    isModalOpen.value = false;
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchGames(currentPage.value, props.selectedGenre?.id, selectedPlatform.value?.id);
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchGames(currentPage.value, props.selectedGenre?.id, selectedPlatform.value?.id);
    }
};
</script>

<template>
    <div class="w-full">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-4xl font-bold">
                {{ selectedGenre ? selectedGenre.name + ' Games' : 'Games' }}
            </h3>
            
            <div class="hidden md:block">
                <select v-model="selectedPlatform" @change="selectPlatformAndClose(selectedPlatform)"
                    class="px-4 py-2 border rounded-md text-gray-900 dark:text-white">
                    <option :value="null">All Platforms</option>
                    <option v-for="platform in platforms" :key="platform.id" :value="platform">
                        {{ platform.name }}
                    </option>
                </select>
            </div>

            <button @click="isModalOpen = true" class="md:hidden px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
                Filters
            </button>
        </div>

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

        <div v-if="gameData.length > 0" class="flex justify-center mt-4">
            <button 
                @click="prevPage" 
                :disabled="currentPage === 1" 
                class="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
            >
                Previous
            </button>
            <span class="mx-4 text-xl">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages" 
                class="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
            >
                Next
            </button>
        </div>

        <UModal v-model="isModalOpen">
            <div class="p-4">
                <h3 class="text-2xl font-bold mb-4">Select Platform</h3>
                <div class="grid grid-cols-1 gap-2">
                    <button v-for="platform in platforms" :key="platform.id"
                        @click="selectPlatformAndClose(platform)"
                        :class="{'bg-blue-500 text-white': selectedPlatform?.id === platform.id}"
                        class="w-full p-2 border rounded-md text-gray-900 dark:text-white">
                        {{ platform.name }}
                    </button>
                </div>
            </div>
        </UModal>
    </div>
</template>
