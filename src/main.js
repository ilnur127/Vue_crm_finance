import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import tooltipDirective from './directives/tooltip.directive'
import messagePlugin from './utils/message.plugin'
import Loader from './components/app/Loader.vue'
import Pagination from './components/app/Pagination.vue'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import ru from './locales/ru.json'
import en from './locales/en.json'

firebase.initializeApp({
    apiKey: "AIzaSyC2sADhQVVFSGXmznIkLyIfQH4wglnyFLw",
    authDomain: "vue-checkfinance.firebaseapp.com",
    projectId: "vue-checkfinance",
    storageBucket: "vue-checkfinance.appspot.com",
    messagingSenderId: "558392030188",
    appId: "1:558392030188:web:5ad36a1bb356e38f4dc6c9",
    measurementId: "G-2HW9KLZX6L"
});

let app;
const locales = {
    'ru-Ru': ru,
    'en-Us': en
}

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App).use(store).use(router).use(messagePlugin).component('Loader', Loader).component('Pagination', Pagination).directive('tooltip',tooltipDirective);
        app.config.globalProperties.$filters = {
            localizeFilter(key) {
                const locale = store.getters.info.locale || 'ru-Ru';
                return locales[locale][key] || `[localize error]: key ${key} not found`
            },
            dateFilter(value, format = 'date') {
                const options = {};
                const locale = store.getters.info.locale || 'ru-Ru';

                if (format.includes('date')) {
                    options.day = '2-digit';
                    options.month = 'long';
                    options.year = 'numeric';
                }

                if (format.includes('time')){
                    options.hour = '2-digit';
                    options.minute = '2-digit';
                    options.second = '2-digit';
                }

                return new Intl.DateTimeFormat(locale,options).format(new Date(value))
            }
        }
        app.mount('#app');
    }
});