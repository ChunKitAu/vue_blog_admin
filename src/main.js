import Vue from 'vue';
import App from './App';
import store from "./store";
import router from './router';


import waterfall from 'vue-waterfall2'
Vue.use(waterfall);

//iview
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);


//markdown 编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)


//echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;


Vue.config.productionTip = false

/* eslint-disable no-new */
const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vue;
