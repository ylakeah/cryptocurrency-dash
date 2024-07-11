import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCryptocurrencyIcons from "@phantasweng/vue-cryptocurrency-icons";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(router).use(VueCryptocurrencyIcons).use(pinia)

app.mount('#app')
