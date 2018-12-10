import Vue from 'vue'
import App from './components/App.vue'

let vm = new Vue({
  el: '#demo',
  render: h => h(App)
})