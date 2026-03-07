import App from '@/App.vue'
import router from '@/router'
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import '@/web-components/fav-star.js'
import '@/web-components/status-badge.js'
import '@/web-components/info-toast.js'
import '@picocss/pico/css/pico.min.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const pinia = createPinia()
const favoriteStore = useFavoriteStore(pinia)

favoriteStore.hydrateFavoriteTeam()

createApp(App).use(router).use(pinia).mount('#app')
