<template>
  <div id="app">
    <NavBar></NavBar>
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
const wallet = require('eth-lightwallet')

export default {
  name: 'App',

  created: function () {
    console.log('WALLET', wallet, ABI)
  },
  
  components: {
    NavBar
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "./assets/vars.scss";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

svg.fa-is-medium {
  width: 2rem !important;
  height: 2rem !important;
}
</style>
