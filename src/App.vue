<template>
  <div id="app">
    <NavBar></NavBar>
    {{balance}}
    <img alt="Vue logo" src="./assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import ABI from './components/ABI'
import EthContract from './components/EthContract'
import Misc from './components/misc'

const wallet = require('eth-lightwallet')

export default {
  name: 'App',

  data: function () {
    return {
      balance: 'loading',
      isDestroyed: false,
      contract: null,
    }
  },

  created: function () {
    console.log('WALLET', wallet, ABI)
  },

  mounted: function () {
    const self = this;
    self.contract = new EthContract();

    (async () => {
      self.balance = await self.contract.getBalance()
      Misc.sleepAsync(1000)
    })()
  },

  beforeDestroy () {
    this.isDestroyed = true
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
