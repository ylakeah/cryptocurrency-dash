import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueCryptocurrencyIcons from "@phantasweng/vue-cryptocurrency-icons";

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(router).use(VueCryptocurrencyIcons)

app.mount('#app')
