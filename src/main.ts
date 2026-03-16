import App from '@/App.vue'
import router from '@/router'
import { useFavoriteStore } from '@/stores/useFavoriteStore'
import '@picocss/pico/css/pico.min.css'
import '@picocss/pico/css/pico.colors.min.css'
import '@/styles/app.css'
import '@/styles/components.css'
import '@/styles/layout.css'
import '@/styles/pico-overrides.css'
import '@/styles/themes.css'
import '@/web-components/vanilla/fav-star.js'
import '@/web-components/lit/info-toast.js'
import '@/web-components/lit/content-tabs.js'
import '@/web-components/vue-ce/status-badge.js'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { useCompetitionStore } from './stores/useCompetitionStore'

const pinia = createPinia()
const competitionStore = useCompetitionStore(pinia)
const favoriteStore = useFavoriteStore(pinia)

competitionStore.hydrateCompetition()
favoriteStore.hydrateFavoriteTeam()

createApp(App).use(router).use(pinia).mount('#app')
