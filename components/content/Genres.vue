<script setup>
import { ref, onMounted } from 'vue';

const genreData = ref([]);

onMounted(async () => {
    try {
        const response = await fetch('/api/genres');
        const data = await response.json();

        if (data && data.results) {
            genreData.value = data.results;
        }
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
});
</script>

<template>
    <div class="p-2">
        <h3 class="text-4xl font-bold mb-4 text-center">Genres</h3>

        <p v-if="genreData.length === 0" class="text-center">Loading genres...</p>

        <div v-else class="grid grid-cols-1 gap-2 w-full">
            <div v-for="genre in genreData" :key="genre.id"
                class="cursor-pointer hover:text-blue-500 bg-gray-100 dark:text-gray-700 p-2 rounded-lg">
                <p>{{ genre.name }}</p>
            </div>
        </div>
    </div>
</template>