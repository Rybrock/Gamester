<script setup>
import { ref, computed, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "vue-router";

const isOpen = ref(false);
const isDarkMode = ref(false);
const isLoggedIn = ref(false);
const user = ref(null); 

const { $auth } = useNuxtApp();
const router = useRouter();

const userProfileImage = computed(() => user.value?.photoURL || "/placeholder.webp");

onMounted(() => {
  const auth = getAuth();

  isDarkMode.value = localStorage.getItem("theme") === "dark";
  document.documentElement.classList.toggle("dark", isDarkMode.value);

  if (auth.currentUser) {
    user.value = auth.currentUser;
    isLoggedIn.value = true;
  }

  onAuthStateChanged($auth, (firebaseUser) => {
    user.value = firebaseUser;
    isLoggedIn.value = !!firebaseUser;
  });
});

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  document.documentElement.classList.toggle("dark", isDarkMode.value);
};

const logout = async () => {
  try {
    await signOut($auth);
    router.push("/auth/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

<template>
  <div class="flex justify-between p-2">
    <NuxtLink to="/">
      <p>GameFo</p>
    </NuxtLink>
    <div class="flex gap-3">
      <UIcon name="i-heroicons:list-bullet-16-solid"
        class="w-7 h-7 text-slate-900 dark:text-white font-bold cursor-pointer" @click="isOpen = true" />
    </div>

    <USlideover v-model="isOpen">
      <div class="p-3 flex justify-between">
        <UIcon :name="isDarkMode ? 'i-heroicons:moon' : 'i-heroicons:sun'"
          class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" @click="toggleDarkMode" />
        <div>
          <p>Menu</p>
        </div>
        <img v-if="isLoggedIn" :src="userProfileImage" alt="Profile Image"
          class="w-10 h-10 rounded-full object-cover" />
      </div>

      <div class="p-4 flex-1">
        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons:x-mark-16-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10" square padded @click="isOpen = false" />
        <div class="flex flex-col gap-2">
          <NuxtLink to="/" @click="isOpen = false"
            class="flex items-center gap-2 hover:bg-orange-300 hover:text-slate-900 w-4/12 rounded-lg p-1">
            <UIcon name="i-heroicons:home-20-solid" class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" />
            Home
          </NuxtLink>

          <div v-if="isLoggedIn" class="flex flex-col gap-2">
            <NuxtLink to="/user/profile" @click="isOpen = false"
              class="flex items-center gap-2 hover:bg-orange-300 hover:text-slate-900 w-4/12 rounded-lg p-1">
              <UIcon name="i-heroicons:user-16-solid" class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" />
              Profile
            </NuxtLink>
            <NuxtLink to="/search" @click="isOpen = false"
            class="flex items-center gap-2 hover:bg-orange-300 hover:text-slate-900 w-4/12 rounded-lg p-1">
            <UIcon name="i-heroicons:magnifying-glass-16-solid" class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" />
            Search
          </NuxtLink>
          </div>

          <template v-if="!isLoggedIn">
            <NuxtLink to="/auth/register" @click="isOpen = false"
              class="flex items-center gap-2 hover:bg-orange-300 hover:text-slate-900 w-4/12 rounded-lg p-1">
              <UIcon name="i-heroicons:user-plus-16-solid"
                class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" />
              Signup
            </NuxtLink>
            <NuxtLink to="/auth/login" @click="isOpen = false"
              class="flex items-center gap-2 hover:bg-orange-300 hover:text-slate-900 w-8/12 rounded-lg p-1">
              <UIcon name="i-heroicons:arrow-left-end-on-rectangle-20-solid"
                class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" />
              Login
            </NuxtLink>
          </template>
        </div>
      </div>

      <template v-if="isLoggedIn">
        <div @click="isOpen = false" class="flex justify-center">
          <button @click="logout"
            class="flex items-center justify-center gap-2 bg-red-300 hover:bg-red-500 text-white rounded-lg p-2 mb-2">
            <UIcon name="i-heroicons:arrow-left-start-on-rectangle-16-solid"
              class="w-7 h-7 cursor-pointer text-white" />
            Logout
          </button>
        </div>
      </template>
    </USlideover>
  </div>
</template>
