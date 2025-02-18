<template>
  <div v-if="gameData" class="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6">
    <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{{ gameData.name }}</h1>
    <img :src="gameData.background_image" alt="Game Image" class="w-full h-64 object-cover rounded-lg mb-4" />
    
    <p class="text-sm text-gray-700 dark:text-gray-300" v-html="gameData.description"></p>
    
    <div class="mt-4 text-gray-900 dark:text-gray-300">
      <strong>Release Date: </strong>
      <span :class="{'text-red-500': !gameData.released}">
        {{ gameData.released ? gameData.released : 'N/A' }}
      </span>
    </div>
    
    <div class="mt-4 text-gray-900 dark:text-gray-300">
      <strong>Rating: </strong>
      <span :class="{'text-red-500': !gameData.rating}">
        {{ gameData.rating ? formatRating(gameData.rating) : 'Not yet rated' }}
      </span>
    </div>
    
    <div class="mt-4">
      <strong class="text-gray-900 dark:text-gray-300">Genres: </strong>
      <span v-if="gameData.genres && gameData.genres.length > 0">
        <span v-for="genre in gameData.genres" :key="genre.id" class="bg-blue-500 text-white p-1 rounded-lg mr-2 text-xs">
          {{ genre.name }}
        </span>
      </span>
      <span v-else class="text-gray-700 dark:text-gray-400">Not specified</span>
    </div>
    
    <div v-if="gameData.platforms && gameData.platforms.length > 0" class="mt-4">
      <strong class="text-gray-900 dark:text-gray-300">Platforms: </strong>
      <span v-for="platform in gameData.platforms" :key="platform.id" class="bg-yellow-500 text-white p-1 rounded-lg mr-2 text-xs">
        {{ platform.platform.name }}
      </span>
    </div>
  </div>
  
  <div v-else class="flex justify-center items-center mt-8">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const gameId = route.params.id;
const gameData = ref(null);

const fetchGame = async () => {
  try {
    const response = await fetch(`/api/games/${gameId}`);
    const data = await response.json();
    gameData.value = data;
  } catch (error) {
    console.error('Error fetching game details:', error);
  }
};

onMounted(() => {
  fetchGame();
});

const formatRating = (rating) => {
  return (rating * 2).toFixed(1);
};
</script>

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
