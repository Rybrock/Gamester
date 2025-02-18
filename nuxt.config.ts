// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  components: true,
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'GameFo',
      meta: [
        { name: 'description', content: 'Your one stop shop for eveything Gaming!'}
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'}
      ]
    }
  },
  plugins: ['~/plugins/pinia.js', '~/plugins/toast.js'],
  nitro: {
    firebase: {
      gen: 2,
      nodeVersion: "22" 
    }
  },
  runtimeConfig: {
    apiKey: process.env.RAWG_API_KEY
  },
  modules: ['@nuxt/ui']
})
