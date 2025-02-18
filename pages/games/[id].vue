

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  selectedGenre: Object,
  selectedPlatform: Object
});

const route = useRoute();
const gameId = route.params.id;
const gameData = ref(null);
const isDescriptionExpanded = ref(false);
const isReviewsModalOpen = ref(false);
const reviews = ref([]);
const searchQuery = ref(route.query.search || '');
const selectedPlatform = ref(route.query.platforms || null);
const currentPage = ref(route.query.page || 1);

const shouldShowReadMoreButton = computed(() => {
  return gameData.value && gameData.value.description.length > 300;
});

const fetchGame = async () => {
  const gameId = route.params.id;
  try {
    const response = await fetch(`/api/games/${gameId}`);
    const data = await response.json();
    gameData.value = data;
    fetchReviews();
  } catch (error) {
    console.error('Error fetching game details:', error);
  }
};

const fetchReviews = async () => {
  try {
    const response = await fetch(`/api/reviews/${gameId}`);
    const data = await response.json();
    reviews.value = data.results || [];
    console.log(reviews.value)
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

onMounted(() => {
  fetchGame();
});

const formatRating = (rating) => {
  return (rating * 2).toFixed(1);
};

const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value;
};

const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + '...';
  }
  return description;
};

const openReviewsModal = () => {
  isReviewsModalOpen.value = true;
};
</script>

<template>
  <div v-if="gameData" class="h-screen sm:h-auto max-w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 sm:max-w-3xl lg:max-w-6xl">
    <h1 class="w-full text-center text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white p-2 mb-3">
      {{ gameData.name }}
    </h1>

    <div class="lg:flex lg:gap-x-10 lg:space-y-0 space-y-6">
      <div class="lg:w-1/2">
        <div class="mb-2">
          <img :src="gameData.background_image" alt="Game Image" class="w-full h-64 object-cover rounded-lg" />
        </div>
      </div>

      <div class="lg:w-1/2">
        <div class="mt-4 text-gray-900 dark:text-gray-300">
          <strong>Release Date: </strong>
          <span :class="{'text-white bg-red-400 rounded-lg p-1 text-sm': !gameData.released}">
            {{ gameData.released ? gameData.released : 'N/A' }}
          </span>
        </div>

        <div class="mt-4 text-gray-900 dark:text-gray-300">
          <strong>Rating: </strong>
          <span :class="{'text-white bg-red-400 rounded-lg p-1 text-sm': !gameData.rating}">
            {{ gameData.rating ? formatRating(gameData.rating) : 'Not yet rated' }}
          </span>
        </div>

        <div class="mt-4">
          <strong class="text-gray-900 dark:text-gray-300">Genres: </strong>
          <span v-if="gameData.genres && gameData.genres.length > 0">
            <span v-for="genre in gameData.genres" :key="genre.id" class="bg-green-500 text-white p-1 rounded-lg mr-2 text-xs">
              {{ genre.name }}
            </span>
          </span>
          <span v-else class="text-gray-700 dark:text-gray-400">Not specified</span>
        </div>

        <div v-if="gameData.platforms && gameData.platforms.length > 0" class="mt-4 flex flex-wrap gap-1">
          <strong class="text-gray-900 dark:text-gray-300">Platforms: </strong>
          <span v-for="platform in gameData.platforms" :key="platform.id" class="bg-yellow-500 text-white p-1 rounded-lg mr-2 text-xs">
            {{ platform.platform.name }}
          </span>
        </div>
    <button @click="openReviewsModal" class="text-white bg-blue-500 text-sm rounded-lg p-1 mt-4 hover:bg-blue-300">
      View Reviews
    </button>
    <div class="mt-4">
      <p v-if="!isDescriptionExpanded" class="text-sm text-gray-700 dark:text-gray-300 mb-4" v-html="truncateDescription(gameData.description, 300)">
      </p>
      <p v-if="isDescriptionExpanded" class="text-sm text-gray-700 dark:text-gray-300 mb-4" v-html="gameData.description"></p>

      <div v-if="shouldShowReadMoreButton" class="flex gap-x-2">
        <button @click="toggleDescription" class="text-white text-sm bg-orange-500 rounded-lg p-1 mt-2 hover:bg-orange-300">
          {{ isDescriptionExpanded ? 'Read less' : 'Read more' }}
        </button>
      </div>
      <div class="flex gap-2">
        <NuxtLink :to="{ path: '/search', query: { search: searchQuery, genres: props.selectedGenre?.id, platforms: selectedPlatform?.id, page: currentPage } }" class="bg-gray-800 text-white dark:bg-slate-200 dark:text-slate-900 px-4 py-2 rounded mt-5">
          Back to Search
        </NuxtLink>
        <NuxtLink :to="{ path: '/', query: route.query }" class="bg-gray-800 text-white dark:bg-slate-200 dark:text-slate-900 px-4 py-2 rounded mt-5">
          Back Home
        </NuxtLink>
      </div>
  </div>
      </div>
      

    
     
      
    </div>

    <UModal v-model="isReviewsModalOpen">
      <div class="p-4">
        <h3 class="text-2xl font-bold mb-4">Reviews</h3>
        <div v-if="reviews.length > 0" class="space-y-4">
          <div v-for="(review, index) in reviews" :key="index" class="border-b pb-4">
            <p class="text-sm dark:text-gray-300 mb-2 font-bold text-orange-500" v-html="review.user.username"></p>
            <p class="font-semibold">{{ review.text }}</p>
          </div>
        </div>
        <div v-else>
          <p>No reviews available for this game.</p>
        </div>
        <button @click="isReviewsModalOpen = false" class="mt-4 bg-gray-800 text-white px-4 py-2 rounded">Close</button>
      </div>
    </UModal>
    
  </div>

  <div v-else class="flex justify-center items-center mt-8">
    <div class="spinner"></div>
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
