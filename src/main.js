import Vue from 'vue'
import App from './App.vue'
import Misc from './components/misc.js'

import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { fas } from "@fortawesome/free-solid-svg-icons";
// import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

document.querySelector(
  "meta[name=viewport]"
).setAttribute(
  'content', 'width=device-width, initial-scale=' + (
    1 / window.devicePixelRatio
  ) + ', maximum-scale=1.0, user-scalable=0'
);

// library.add(fab)
library.add(fas)
library.add(faUserSecret)
library.add(faTelegram)
library.add(faDiscord)
library.add(faArrowDown)

if (Misc.getUrlRef() !== null) {
  Misc.setReferral(Misc.getUrlRef())
} 

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

Vue.use(Donut);
Vue.use(Buefy, {
  defaultIconComponent: "font-awesome-icon",
  defaultIconPack: "fas"
});

new Vue({
  render: h => h(App),
}).$mount('#app')
