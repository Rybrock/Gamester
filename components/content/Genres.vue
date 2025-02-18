<script setup>
import { ref, onMounted, defineEmits } from 'vue';

const genreData = ref([]);
const isModalOpen = ref(false);
const emit = defineEmits(['selectGenre']);

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

const selectGenre = (genre) => {
    emit('selectGenre', genre);
    isModalOpen.value = false;
};
</script>

<template>
    <div class="p-2">
        <h3 class="hidden md:block text-2xl font-bold mb-4 text-center">Genres</h3>

        <p v-if="genreData.length === 0" class="text-center">Loading genres...</p>

        <div class="hidden md:grid grid-cols-1 gap-2">
            <div v-for="genre in genreData" :key="genre.id"
                @click="selectGenre(genre)"
                class="cursor-pointer hover:text-blue-500 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg">
                <p>{{ genre.name }}</p>
            </div>
        </div>

        <div class="md:hidden flex justify-center mt-4">
            <button @click="isModalOpen = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
                Genres
            </button>
        </div>

        <UModal v-model="isModalOpen">
            <div class="p-4">
                <h3 class="text-2xl font-bold mb-4">Genres</h3>
                <div class="grid grid-cols-1 gap-2">
                    <div v-for="genre in genreData" :key="genre.id"
                        @click="selectGenre(genre)"
                        class="cursor-pointer hover:text-blue-500 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg">
                        <p>{{ genre.name }}</p>
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <button @click="isModalOpen = false" class="px-4 py-2 bg-gray-500 text-white rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        </UModal>
    </div>
</template>
