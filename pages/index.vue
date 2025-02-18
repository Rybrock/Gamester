<script setup>

</script>

<template>
    <div class="flex">
        <!-- Sidebar on the left -->
        <div class="hidden md:block">
            <ContentGenres />
        </div>

        <!-- Main content (games) -->
        <div class="flex-1 p-6">
            <ContentGames />
        </div>
    </div>
</template>