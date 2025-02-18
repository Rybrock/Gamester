<script setup>
import { ref } from 'vue';

const selectedGenre = ref(null);

const updateGenre = (genre) => {
    selectedGenre.value = genre;
};
</script>

<template>
    <div class="flex flex-col md:flex-row">
        <div class="md:w-1/4 bg-gray-100 dark:bg-gray-900 p-4">
            <ContentGenres @selectGenre="updateGenre" />
        </div>

        <div class="flex-1 p-6">
            <ContentGames :selectedGenre="selectedGenre" />
        </div>
    </div>
</template>
