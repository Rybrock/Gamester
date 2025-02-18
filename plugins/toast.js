import { defineNuxtPlugin } from "#app";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    const options = {
        position: "top-right",
        timeout: 3000,
        closeButton: "button",
    };

    nuxtApp.vueApp.use(Toast, options);
});