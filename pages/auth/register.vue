
<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/user";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Import Firestore
import { useRouter } from "vue-router";

const toast = useToast();
const userStore = useUserStore();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");

onMounted(() => {
  const userFromStorage = localStorage.getItem("user");
  if (userFromStorage) {
    userStore.setUser(JSON.parse(userFromStorage));
  }
});

const signup = async () => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const uid = userCredential.user.uid;

    await updateProfile(auth.currentUser, { displayName: username.value });
    await sendEmailVerification(auth.currentUser);

    const user = { username: username.value, email: email.value, uid };

    localStorage.setItem("user", JSON.stringify(user));

    const db = getFirestore();
    const userCollection = collection(db, "users");
    await addDoc(userCollection, {
      uid,
      username: username.value,
      email: email.value,
    });

    userStore.setUser(user);

    toast.success("Welcome to Game Stash!");
    router.push("/");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

const signupWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);

    router.push("/game-collection");
  } catch (error) {
    console.error(error);
    toast.error("Google sign-in failed");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full sm:w-96 p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-stone-900 mb-6">Signup</h1>

      <div class="mb-4">
        <label for="username" class="block text-stone-700 font-medium text-sm mb-2">Username</label>
        <input
          v-model="username"
          type="text"
          id="username"
          placeholder="Enter your username"
          class="w-full border border-stone-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-4">
        <label for="email" class="block text-stone-700 font-medium text-sm mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Enter your email"
          class="w-full border border-stone-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-stone-700 font-medium text-sm mb-2">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          placeholder="Enter your password"
          class="w-full border border-stone-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col items-center">
        <button
          @click.prevent="signup"
          class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          Sign Up
        </button>

        <button
          @click.prevent="signupWithGoogle"
          class="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Up with Google
        </button>
      </div>

      <p class="text-center mt-4">
        Already have an account? <NuxtLink to="/auth/login" class="text-orange-500">Login</NuxtLink> here.
      </p>
    </div>
  </div>
</template>

