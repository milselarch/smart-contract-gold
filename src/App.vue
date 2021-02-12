<template>
  <div id="app">
    <NavBar id="navbar"></NavBar>
    <div id="content">
      <SideBar id="side-bar"></SideBar>
      <p> {{balance}} </p>
      <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'

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
    NavBar, SideBar
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "./assets/vars.scss";

// Defaults to weight 400 with all styles included.
@import url('https://fonts.googleapis.com/css?family=Open-Sans');

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  & > #content {
    display: grid;
    grid-template-columns: 30rem 1fr;
    grid-template-rows: auto;
    grid-template-areas: 
      "header header header header"
      "main main . sidebar"
      "footer footer footer footer";

    margin-left: 5rem;
    margin-right: 5rem;
  }
}

* {
  font-family: "Open Sans";
}

svg.fa-is-medium {
  width: 2rem !important;
  height: 2rem !important;
}
</style>
