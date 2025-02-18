<script setup>
import { ref, computed, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { signOut, onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "vue-router";

// Reactive variables
const isOpen = ref(false);
const isDarkMode = ref(false);
const isLoggedIn = ref(false);
const user = ref(null); // Store user object

const { $auth } = useNuxtApp();
const router = useRouter();

// **Compute user profile image dynamically**
const userProfileImage = computed(() => user.value?.photoURL || "/default-avatar.png");

// **Check user authentication state**
onMounted(() => {
  const auth = getAuth();

  // Set dark mode from localStorage
  isDarkMode.value = localStorage.getItem("theme") === "dark";
  document.documentElement.classList.toggle("dark", isDarkMode.value);

  // **Check if user is already logged in before setting up the listener**
  if (auth.currentUser) {
    user.value = auth.currentUser;
    isLoggedIn.value = true;
  }

  // **Listen for auth state changes**
  onAuthStateChanged($auth, (firebaseUser) => {
    user.value = firebaseUser;
    isLoggedIn.value = !!firebaseUser;
  });
});

// **Toggle Dark Mode**
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  document.documentElement.classList.toggle("dark", isDarkMode.value);
};

// **Logout Function**
const logout = async () => {
  try {
    await signOut($auth);
    console.log("Logged out successfully");
    router.push("/auth/login"); // Use router instead of window.location.href
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

    <!-- Slideover Menu -->
    <USlideover v-model="isOpen">
      <!-- Dark Mode toggle -->
      <div class="p-3 flex justify-between">
        <UIcon :name="isDarkMode ? 'i-heroicons:moon' : 'i-heroicons:sun'"
          class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" @click="toggleDarkMode" />
        <div>
          <p>Menu</p>
        </div>
        <img v-if="isLoggedIn" :src="userProfileImage" alt="Profile Image"
          class="w-10 h-10 rounded-full object-cover" />
      </div>

      <!-- Menu Links -->
      <div class="p-4 flex-1">
        <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons:x-mark-16-solid"
          class="flex sm:hidden absolute end-5 top-5 z-10" square padded @click="isOpen = false" />
        <div class="flex flex-col gap-2">
          <NuxtLink to="/" @click="isOpen = false"
            class="flex items-center gap-2 hover:bg-orange-300 hover:text-slate-900 w-4/12 rounded-lg p-1">
            <UIcon name="i-heroicons:home-20-solid" class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" />
            Home
          </NuxtLink>

          <!-- Profile Image in Slideover -->
          <div v-if="isLoggedIn" class="flex items-center gap-2">
            <NuxtLink to="/user/profile" @click="isOpen = false"
              class="flex items-center gap-2 hover:bg-orange-300 hover:text-slate-900 w-4/12 rounded-lg p-1">
              <UIcon name="i-heroicons:user-16-solid" class="w-7 h-7 cursor-pointer text-slate-900 dark:text-white" />
              Profile
            </NuxtLink>
          </div>

          <!-- Conditionally show these links based on if the user is logged in or not -->
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

      <!-- Show the logout link if the user is logged in -->
      <template v-if="isLoggedIn">
        <div class="flex justify-center">
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
