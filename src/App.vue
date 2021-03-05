<template>
  <div id="app">
    <NavBar id="navbar"></NavBar>
    <div id="content">
      <SideBar 
        id="side-bar" :contract=contract
      ></SideBar>
      <ContentBar
        id="content-bar" :contract=contract
      ></ContentBar>
      <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import ContentBar from './components/ContentBar.vue'

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
    // const self = this
    console.log('WALLET', wallet, ABI)
    // console.log('ADDRESS', wallet.keystore.getAddresses())
  },

  mounted: function () {
    const self = this;
    self.contract = new EthContract();

    (async () => {
      let loader
      if (self.contract.needsLoading()) {
        // cover website with loading icon
        loader = this.$buefy.loading.open()
      } if (self.contract.networkChanged) {
        self.$buefy.toast.open({
          indefinite: false,
          message: `Metamask wallet changed`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      }

      const web3 = await self.contract.loadWallet()
      console.log('WEB3-STATUS', web3)

      if (web3) { 
        // close loading icon
        loader.close()
      } else if ((web3 === false) || (web3 === undefined)) {
        console.log('FAIL')
        // show error message if metamask connection fails
        self.$buefy.toast.open({
          indefinite: true,
          message: `Metamask connection failed.`,
          position: 'is-bottom',
          type: 'is-danger'
        })
      }

      console.log('WALLER-KIAD', self.contract.getCurrentAddress())
      self.balance = await self.contract.getContractBalance()

      while (!self.isDestroyed) {
        await Misc.sleepAsync(1000)
        if (!web3) { continue }
      }
    })()
  },

  beforeDestroy () {
    this.isDestroyed = true
  },
  
  components: {
    NavBar, SideBar, ContentBar
  }
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";
// Import Bulma and Buefy styles
@import "./assets/vars.scss";
@import "~bulma";
@import "~buefy/src/scss/buefy";

// Defaults to weight 400 with all styles included.
@import url('https://fonts.googleapis.com/css?family=Open-Sans');
@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono&display=swap');

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;

  & > #content {
    display: grid;
    grid-template-columns: 30rem 35rem;
    grid-template-rows: auto;
    width: fit-content;

    margin-left: auto;
    margin-right: auto;

    & > #content-bar {
      margin-left: 5rem;
    }
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
