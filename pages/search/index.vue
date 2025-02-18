<script setup>
import { ref, onMounted, watch } from 'vue';

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

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
const searchQuery = ref('');

const restoreSearchState = () => {
  const savedState = sessionStorage.getItem('gameSearchState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    gameData.value = parsedState.gameData || [];
    currentPage.value = parsedState.currentPage || 1;
    totalPages.value = parsedState.totalPages || 1;
    searchQuery.value = parsedState.searchQuery || '';
    selectedPlatform.value = parsedState.selectedPlatform || null;
  }
};

const saveSearchState = () => {
  sessionStorage.setItem(
    'gameSearchState',
    JSON.stringify({
      gameData: gameData.value.map(game => ({ id: game.id, name: game.name, background_image: game.background_image })),
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      searchQuery: searchQuery.value,
      selectedPlatform: selectedPlatform.value,
    })
  );
};

const fetchPlatforms = async () => {
  try {
    const response = await fetch('/api/platforms');
    const data = await response.json();
    platforms.value = data.results || [];
  } catch (error) {
    console.error('Error fetching platforms:', error);
  }
};

const fetchGames = async (page = 1, genreId = null, platformId = null, query = '') => {
  isLoading.value = true;
  try {
    let url = `/api/games?page=${page}&page_size=${gamesPerPage}`;

    if (genreId) url += `&genres=${genreId}`;
    if (platformId) url += `&platforms=${platformId}`;
    if (query && query.trim()) {
      url += `&search=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results) {
      gameData.value = data.results;
      totalPages.value = Math.ceil(data.count / gamesPerPage);
      saveSearchState();
    }
  } catch (error) {
    console.error('Error fetching games:', error);
  } finally {
    isLoading.value = false;
  }
};

const debouncedSearchGames = debounce(() => {
  fetchGames(1, props.selectedGenre?.id, selectedPlatform.value?.id, searchQuery.value);
}, 500);

watch(() => props.selectedGenre, (newGenre) => {
  if (newGenre) {
    fetchGames(1, newGenre.id, selectedPlatform.value?.id, searchQuery.value);
  }
});

const selectPlatformAndClose = (platform) => {
  selectedPlatform.value = platform;
  fetchGames(1, props.selectedGenre?.id, platform.id, searchQuery.value);
  isModalOpen.value = false;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchGames(currentPage.value, props.selectedGenre?.id, selectedPlatform.value?.id, searchQuery.value);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchGames(currentPage.value, props.selectedGenre?.id, selectedPlatform.value?.id, searchQuery.value);
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedPlatform.value = null;
  currentPage.value = 1;
  fetchGames(currentPage.value);
};

onMounted(() => {
  restoreSearchState();
  fetchGames(currentPage.value, props.selectedGenre?.id, selectedPlatform?.id, searchQuery.value);
  fetchPlatforms();
});
</script>

<template>
    <div class="w-full p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-4xl font-bold">
          {{ selectedGenre ? selectedGenre.name + ' Games' : 'Search' }}
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
  
        <div class="flex gap-x-2">
          <button v-if="searchQuery || selectedPlatform" @click="clearFilters" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-xs">
            Clear Filters
          </button>
          <button @click="isModalOpen = true" class="md:hidden px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg text-xs">
            Filters
          </button>
        </div>
      </div>
  
      <div class="flex mb-4">
        <input v-model="searchQuery" @input="debouncedSearchGames" placeholder="Search for games..." class="mb-4 p-2 border rounded" />
      </div>
  
      <h3 v-if="gameData.length > 0" class="text-4xl font-bold text-center mb-6">
        {{ selectedPlatform ? 'Latest ' + selectedPlatform.name + ' Games' : 'Latest Games' }}
      </h3>
  
      <div v-if="isLoading" class="flex justify-center items-center">
        <div class="spinner"></div>
      </div>
  
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="game in gameData" :key="game.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105">
          <NuxtLink :to="`/games/${game.id}`" class="block">
            <img :src="game.background_image || '/placeholder.webp'" alt="Game Image" class="w-full h-48 object-cover">
            <div class="p-4">
              <h4 class="text-lg font-semibold text-center text-gray-900 dark:text-white">
                {{ game.name }}
              </h4>
            </div>
          </NuxtLink>
        </div>
      </div>
  
      <div v-if="gameData.length > 0" class="flex justify-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50">
          Previous
        </button>
        <span class="mx-4 text-sm font-medium text-gray-700 dark:text-gray-300">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50">
          Next
        </button>
      </div>
  
      <UModal v-model="isModalOpen">
        <div class="p-4">
          <h3 class="text-2xl font-bold mb-4">Select Platform</h3>
          <div class="grid grid-cols-1 gap-2">
            <button v-for="platform in platforms" :key="platform.id" @click="selectPlatformAndClose(platform)"
                    :class="{'bg-blue-500 text-white': selectedPlatform?.id === platform.id}"
                    class="w-full p-2 border rounded-md text-gray-900 dark:text-white">
              {{ platform.name }}
            </button>
          </div>
        </div>
      </UModal>
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
