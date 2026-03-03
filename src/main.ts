import App from '@/App.vue'
import router from '@/router'
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import '@picocss/pico/css/pico.min.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const pinia = createPinia()
const favoriteStore = useFavoriteStore(pinia)

favoriteStore.hydrateFavoriteTeam()

createApp(App).use(router).use(pinia).mount('#app')
