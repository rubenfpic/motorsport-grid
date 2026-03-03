import App from '@/App.vue'
import router from '@/router'
import '@picocss/pico/css/pico.min.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
