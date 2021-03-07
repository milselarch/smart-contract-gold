<template>
  <div>
    <div v-show="contractConnected">
      <div class='holder buy-holder'>
        <input 
          type="number" placeholder="BNB Amount"
          ref="buyInput" min="0" step="0.01"
        >
        <VueButton class="v-button is-primary small">
          Buy Tokens
        </VueButton>
      </div>

      <div class='holder sell-holder'>
        <input
          type="number" placeholder="BNB Token Amount"
          ref="sellInput" min="0" step="0.01"
        >
        <VueButton class="v-button is-danger small">
          Sell Tokens
        </VueButton>
      </div>
    </div>

    <b-message
      type="is-danger" id="connect-error"
      v-if="!contractConnected"
    >
      <div v-show="!wrongChainID">
        <p class="error">
          Metamask account is not connected!
        </p>
        <b-button
          type="is-danger is-light" outlined
          class="reconnect"
          @click="reconnect"
        >
          <span class="retry">Reconnect</span>
        </b-button>
      </div>

      <div v-show="wrongChainID">
        <p class="error">
          Wrong metamask network
        </p>
        <span class="chain"> {{ chain }} </span>
      </div>
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
        wrongChainID: false,
        contractConnected: true,
        loader: null
      }
    },

    beforeDestroy () {
      this.isDestroyed = true
    },

    computed: {
      chain: function () {
        const self = this
        if (self.contract === null) {
          return
        }

        return self.contract.network
      }
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
      const inputs = [
        self.$refs.buyInput, self.$refs.sellInput
      ]

      inputs.forEach(input => {
        // remove - sign from being typed into input
        input.onkeydown = function (e) {
          if (e.key === '-') { return false } 
        };
      });
    
      (async () => {
        while (!self.isDestroyed) {
          await Misc.sleepAsync(200)
          if (self.contract === null) {
            self.contractConnected = true
          }

          self.wrongChainID = self.contract.isChainInvalid()
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
  &::placeholder {
    color: #BBB;
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

    & > a {
      font-weight: 700;
    }
  }

  & .reconnect {
    margin-top: 0.5rem;
  }

  & span.retry {
    font-size: 1.2rem;
  }
}
</style>