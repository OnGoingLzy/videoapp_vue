import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/CSS/global.less'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'vant/lib/index.less'
import '@vant/touch-emulator';
import Qs from 'qs';
Vue.use(Qs)
Vue.use(Vant);
import { Lazyload } from 'vant';
Vue.use(Lazyload);
Vue.config.productionTip = false
import axios from "axios";
import store from './store'
Vue.prototype.$http= axios
axios.defaults.withCredentials=true
axios.defaults.baseURL = "http://localhost:9000"
axios.defaults.headers.post["Content-Type"] = "application/json"
//请求头指定成json，默认的那个不好使
import Bus from './bus.js'/// mitt 总线程引入
Vue.prototype.bus = Bus;
//视频播放组件
import VueCoreVideoPlayer from 'vue-core-video-player'
Vue.use(VueCoreVideoPlayer)
//使用公共js函数
import videojs from "@/assets/commonjs/video";
Vue.prototype.videojsx = videojs



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.addEventListener('storage', function (e) {
  sessionStorage.setItem(e.key, e.oldValue)
});



