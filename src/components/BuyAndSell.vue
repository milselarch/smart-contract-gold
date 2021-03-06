<template>
  <div>
    <div class='holder buy-holder'>
      <input type="number">
      <VueButton class="v-button is-primary small">
        Buy Tokens
      </VueButton>
    </div>

    <div class='holder sell-holder'>
      <input type="number">
      <VueButton class="v-button is-danger small">
        Sell Tokens
      </VueButton>
    </div>

    <!--
    <b-tabs
      type="is-boxed" :animated="false"
      v-if="contractConnected"
      class="buy-sell"
    >
      <b-tab-item label="Buy Tokens">
        <b-field label="">
          <b-input
            type="number"
            placeholder="BNB Amount"
            maxlength="30"
            step="0.000001"
          ></b-input>
        </b-field>
      </b-tab-item>
      
      <b-tab-item label="Sell Tokens">
        <b-field label="">
          <b-input 
            type="number"
            maxlength="30"
            placeholder="BNG token Amount"
            step="0.01"
          ></b-input>
        </b-field>
      </b-tab-item>
    </b-tabs>
    -->

    <b-message
      type="is-danger" id="connect-error"
      v-if="!contractConnected"
    >
      <p class="error">
        Metamask account is not connected!
      </p>
      <b-button
        type="is-danger is-light" outlined
        @click="reconnect"
      >
        <span class="retry">Reconnect</span>
      </b-button>
    </b-message>
  </div>
</template>

<script>
  import VueButton from './VueButton.vue'
  import Misc from './misc'

  export default {
    name: 'BuyAndSell',

    data: function () {
      return {
        isDestroyed: false,
        contractConnected: true,
        loader: null
      }
    },

    beforeDestroy () {
      this.isDestroyed = true
    },

    methods: {
      async reconnect () {
        const self = this

        if (self.loader !== null) {
          self.loader.close()
        }

        self.loader = self.$buefy.loading.open()
        const web3 = await self.contract.loadWallet()

        if ((web3 === false) || (web3 === undefined)) {
          // show error message if metamask connection fails
          self.$buefy.toast.open({
            duration: 2000,
            message: `Metamask connection failed.`,
            position: 'is-bottom',
            type: 'is-danger'
          })
        }

        self.loader.close()
      }
    },

    mounted: function () {
      const self = this;
    
      (async () => {
        while (!self.isDestroyed) {
          await Misc.sleepAsync(200)
          if (self.contract === null) {
            self.contractConnected = true
          }

          self.contractConnected = self.contract.isConnected()
        }
      })()
    },

    props: ['contract'],
    components: {
      VueButton
    },
  }
</script>

<style lang="scss" scoped>
input {
  border: 0.2rem solid #ddd;
  font-size: 1.2rem;
  font-family: 'Ubuntu Mono';
  font-weight: 700;
  border-radius: 0px;
  padding: 0.5rem;
  color: #4a4a4a;

  &:focus {
    outline: none;
  }
}

div.holder {
  display: flex;

  &.buy-holder {
    margin-bottom: 0.5rem;
    & input:focus {
      border: 0.2rem solid lighten(#417aeb, 20%);
    }
  }
  &.sell-holder {
    & input:focus {
      border: 0.2rem solid lighten(#e84444, 20%);
    }
  }

  & input {
    width: 18rem;
  }

  & .v-button {
    width: 8rem;
    margin-left: 0.7rem;
  }
}

#connect-error {
  text-align: left;

  & p.error {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;

    & > a {
      font-weight: 700;
    }
  }

  & span.retry {
    font-size: 1.2rem;
  }
}
</style>