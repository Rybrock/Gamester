<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

onMounted(() => {
  if (!userStore.user) {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        userStore.setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }
});
</script>

<template>
  <div>
    <NavigationNavbar />
  </div>
  <div>
    <slot></slot>
  </div>
</template>
