import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from "element-plus"
import 'element-plus/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn' 
import { ElConfigProvider } from 'element-plus'
import './assets/CSS/global.css'
import axios from "axios"


const app = createApp(App)

app.config.globalProperties.$axios = axios;


app.component("ElConfigProvider",ElConfigProvider)
app.use(store).use(router)
.use(ElementPlus, {locale})
.mount('#app')