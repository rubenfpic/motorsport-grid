import App from '@/App.vue'
import router from '@/router'
import '@picocss/pico/css/pico.min.css'
import { createApp } from 'vue'

createApp(App).use(router).mount('#app')
