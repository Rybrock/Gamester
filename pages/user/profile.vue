<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../stores/user';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

const toast = useToast();
const router = useRouter();
const { $auth } = useNuxtApp();
const userStore = useUserStore();

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

// Reactive state
const newUsername = ref('');
const profileImage = ref(null);
const profileImageUrl = ref('/default-avatar.png');

// Computed property for user
const user = computed(() => userStore.user);

// Update `newUsername` when the user changes
onMounted(() => {
  if (user.value) {
    newUsername.value = user.value.username || '';
    profileImageUrl.value = user.value.photoURL || '/default-avatar.png';
  }
});

// Update Username
const updateUsername = async () => {
  if (!user.value || !auth.currentUser) {
    toast.error('User not found. Please log in again.');
    return;
  }

  if (!newUsername.value.trim()) {
    toast.error('Username cannot be empty.');
    return;
  }

  try {
    // Update Firebase Auth & Firestore
    await updateProfile(auth.currentUser, { displayName: newUsername.value });
    const userRef = doc(db, 'users', user.value.uid);
    await updateDoc(userRef, { username: newUsername.value });

    // Update Store & LocalStorage
    userStore.setUser({ ...user.value, username: newUsername.value });
    localStorage.setItem('user', JSON.stringify(userStore.user));

    toast.success('Username updated successfully!');
  } catch (error) {
    console.error(error);
    toast.error('Failed to update username.');
  }
};

// Handle File Selection
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) profileImage.value = file;
};

// Upload Profile Image
const uploadImage = async () => {
  if (!profileImage.value || !user.value || !auth.currentUser) {
    toast.error('Please select an image first.');
    return;
  }

  try {
    const fileRef = storageRef(storage, `profile_images/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(fileRef, profileImage.value);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast.error('Failed to upload image.');
      },
      async () => {
        // Get image URL and update profile
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        profileImageUrl.value = downloadURL;

        await updateProfile(auth.currentUser, { photoURL: downloadURL });

        // Update Firestore & Store
        const userRef = doc(db, 'users', user.value.uid);
        await updateDoc(userRef, { photoURL: downloadURL });

        userStore.setUser({ ...user.value, photoURL: downloadURL });
        localStorage.setItem('user', JSON.stringify(userStore.user));

        toast.success('Profile image uploaded successfully!');
      }
    );
  } catch (error) {
    console.error(error);
    toast.error('An error occurred while uploading the image.');
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="w-full sm:w-96 p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-stone-900 mb-6">
        Profile for {{ user?.username || 'User' }}
      </h1>

      <!-- Profile Image Section -->
      <div class="flex flex-col items-center mb-4">
        <img
          :src="profileImageUrl"
          alt="Profile"
          class="w-24 h-24 rounded-full object-cover mb-2 border border-gray-300 shadow-md"
        />
        <input type="file" @change="handleFileChange" class="mb-2">
        <button
          @click="uploadImage"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Upload Profile Image
        </button>
      </div>

      <!-- Username Input -->
      <div class="mb-4">
        <label for="username" class="block text-stone-700 font-medium text-sm mb-2">Username</label>
        <input
          v-model="newUsername"
          type="text"
          id="username"
          placeholder="Enter your new username"
          class="w-full border border-stone-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Update Username Button -->
      <div class="flex justify-center">
        <button
          @click="updateUsername"
          class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          Update Username
        </button>
      </div>

      <p class="text-center mt-4">
        <NuxtLink to="/" class="text-orange-500">Go back to home</NuxtLink>
      </p>
    </div>
  </div>
</template>
