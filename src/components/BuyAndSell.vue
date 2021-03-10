<template>
  <div>
    <b-modal v-model="showModal">
      <div class="referral-modal">
        <p>Use the website creator's referral link?</p>
        <p class="mono">
          (0x795bB409CC2eCDF9a1160530e3fF505461cCd553)
        </p>
        <div class='choices'>
          <VueButton
            @click="buyTokens(remember, true)"
            class="is-danger no"
          >
            Nah
          </VueButton>
          <VueButton 
            @click="buyTokens(remember, false)"
            class="is-primary-dark yes"
          >
            Sure!
          </VueButton>
        </div>
        <b-checkbox
          v-model='remember' class="remember" type="is-info"
        >
          Remember my choice
        </b-checkbox>
      </div>
    </b-modal>

    <p class="filler">
      {{ [contractConnected] }}
    </p>

    <div v-show="contractConnected">
      <div class='holder buy-holder'>
        <input 
          type="number" placeholder="BNB Amount"
          ref="buyInput" min="0" step="0.01"
          v-model="buyAmount"
        >
        <VueButton 
          class="v-button is-primary small" @click="buy()"
          v-bind:class="{
            disabled: !enoughBalance || !connected,
          }"
        >
          Buy Tokens
        </VueButton>
      </div>

      <p class="conversion buy">
        <span v-bind:class="{
          subtle: buyAmount === '',
          invalid: !enoughBalance
        }">
          <!-- You'll recieve about {{ tokensToBuy }} BNG -->
          {{ Number(buyAmount) }} BNB ⟶ {{ tokensToBuy }} BNG
        </span>
      </p>

      <div class='holder sell-holder'>
        <input
          type="number" placeholder="BNG Token Amount"
          ref="sellInput" min="0" step="0.01"
          v-model="sellAmount"
        >
        <VueButton
          class="v-button is-danger small" @click="sell()"
          v-bind:class="{
            disabled: !enoughTokens || !connected
          }"
        >
          Sell Tokens
        </VueButton>
      </div>

      <p class="conversion sell">
        <span v-bind:class="{
          subtle: sellAmount === '',
          invalid: !enoughTokens
        }">
          <!-- You'll recieve about {{ bnbToRecieve }} BNB -->
          {{ Number(sellAmount) }} BNG ⟶ {{ bnbToRecieve }} BNB
        </span>
      </p>
    </div>

    <b-message
      type="is-danger" id="connect-error"
      v-show="!contractConnected"
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
        sellAmount: '',
        buyAmount: '',
        showModal: false,
        remember: true,
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
      },

      connected: function () {
        const self = this
        if (self.contract === undefined) {
          return false
        } if (self.contract === null) {
          return false
        } if (self.contract.tokenBalance === null) {
          return false
        }
  
        return true
      },

      enoughBalance: function () {
        const self = this
        if (self.contract === null) {
          return true
        } else if (self.contract.walletBalance === null) {
          return true
        }

        const walletBalance = self.contract.walletBalance
        const buyAmount = Number(self.buyAmount)
        if (buyAmount > walletBalance) {
          return false
        }

        return true
      },

      enoughTokens: function () {
        const self = this
        if (self.contract === null) {
          return true
        } else if (self.contract.tokenBalance === null) {
          return true
        }

        const tokens = self.contract.tokenBalance
        const sellAmount = Number(self.sellAmount)
        console.log('TOKENS=S', tokens, sellAmount)
        if (sellAmount > tokens) {
          return false
        }

        return true
      },

      tokensToBuy: function () {
        const self = this
        if (self.contract === null) {
          return 'NaN'
        } else if (self.contract.buyPrice === null) {
          return 'NaN'
        }

        const bnbAmount = Number(self.buyAmount)
        // console.log('BNG PRICE', self.contract.buyPrice)
        const tokens = bnbAmount / self.contract.buyPrice
        const roundedTokens = tokens.toFixed(3)
        return roundedTokens
      },

      bnbToRecieve: function () {
        const self = this
        if (self.contract === null) {
          return 'NaN'
        } else if (self.contract.sellPrice === null) {
          return 'NaN'
        }

        const tokenAmount = Number(self.sellAmount)
        // console.log('BNG PRICE', self.contract.buyPrice)
        const bnbAmount = tokenAmount * self.contract.sellPrice
        const roundedBnb = bnbAmount.toFixed(3)
        return roundedBnb
      }
    },

    methods: {
      async buy () {
        const self = this
        
        if (self.buyAmount === '') {
          return
        } else if (self.contract === null) {
          return
        }

        if (Misc.getCookie('ref') === null) {
          console.log('BUY SET')
          self.showModal = true
        } else {
          self.buyTokens(false)
        }
      },

      async sell () {
        const self = this
        
        if (self.sellAmount === '') {
          return
        } else if (self.contract === null) {
          return
        }

        let sellAmount = '0'
        if (self.sellAmount.trim() !== '') {
          Misc.assert(Misc.isNumber(self.sellAmount))
          sellAmount = self.sellAmount
        }

        try {
          await self.contract.sellTokens(sellAmount)
          self.sellAmount = ''

          self.$buefy.notification.open({
            duration: 5000,
            message: `Sold ${sellAmount} BNG tokens`,
            position: 'is-bottom',
            type: 'is-success',
            hasIcon: false
          })
        } catch (error) {
          if (error.code === -32603) {
            self.$buefy.notification.open({
              duration: 5000,
              message: "Can't sell more tokens than you own!",
              position: 'is-bottom',
              type: 'is-danger',
              hasIcon: false
            })
          } else {
            self.$buefy.notification.open({
              duration: 5000,
              message: error.message,
              position: 'is-bottom',
              type: 'is-danger',
              hasIcon: false
            })
          }
        }
      },

      async buyTokens (setReferral=false, blank=false) {
        const self = this
        self.showModal = false
        Misc.assert(typeof setReferral === 'boolean')
        if (self.contract === null) {
          return
        }

        if (setReferral) {
          if (blank) {
            Misc.setReferral(self.contract.blankAddress)
          } else {
            Misc.setReferral(self.contract.referralAddress)
          }
        }

        let referralAddress = Misc.getCookie('ref')
        if (referralAddress === null) {
          if (blank) {
            referralAddress = self.contract.blankAddress
          } else {
            referralAddress = self.contract.referralAddress
          }
        }

        let buyAmount = '0'
        if (self.buyAmount.trim() !== '') {
          Misc.assert(Misc.isNumber(self.buyAmount))
          buyAmount = self.buyAmount
        }

        try {
          await self.contract.buyTokens(buyAmount, referralAddress)
          self.buyAmount = ''

          self.$buefy.notification.open({
            duration: 5000,
            message: `Bought ${buyAmount} BNG tokens`,
            position: 'is-bottom',
            type: 'is-success',
            hasIcon: false
          })          
        
        } catch (error) {
          if (error.code === -32603) {
            self.$buefy.notification.open({
              duration: 5000,
              message: 'Not enough funds for purchase!',
              position: 'is-bottom',
              type: 'is-danger',
              hasIcon: false
            })
          } else {
            self.$buefy.notification.open({
              duration: 5000,
              message: error.message,
              position: 'is-bottom',
              type: 'is-danger',
              hasIcon: false
            })
          }
        }
      },

      async reconnect () {
        const self = this

        if (self.loader !== null) {
          self.loader.close()
        }

        self.loader = self.$buefy.loading.open()
        const web3 = await self.contract.loadWallet()

        if ((web3 === false) || (web3 === undefined)) {
          // show error message if metamask connection fails
          self.$buefy.notification.open({
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
          if ((e.key === '-') || (e.key === 'e')) { return false }
        };
      });
    
      (async () => {
        while (!self.isDestroyed) {
          await Misc.sleepAsync(200)
          if (self.contract === null) {
            console.log('FALSE CONTRACT')
            self.contractConnected = false
          }

          self.wrongChainID = self.contract.isChainInvalid()
          if (self.contract.loginAttempted) {
            self.contractConnected = self.contract.isConnected()
          }
        }
      })()
    },

    props: {
      contract: {
        type: Object,
        default: null
      }
    },
    components: {
      VueButton
    },
  }
</script>

<style lang="scss" scoped>
input {
  border: 0.2rem solid #AAA;
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

p.filler {
  display: none
}

div.referral-modal {
  padding: 2rem;
  background-color: white;
  width: fit-content;
  margin: auto;
  border-radius: 0.5rem;

  & > p {
    font-size: 1.2rem;
  }

  & > p.mono {
    font-family: 'Ubuntu Mono';
    font-size: 1.2rem;
    font-weight: 700;
  }

  & .remember {
    margin-top: 1rem;
  }

  & > div.choices {
    height: fit-content;
    display: flex;
    margin-top: 0.5rem;
    align-items: bottom;
    justify-content: center;

    & > .yes {
      margin-left: 1rem;
    }
  }
}

div.holder {
  display: flex;

  &.buy-holder {
    & input:focus {
      border: 0.2rem solid lighten(#417aeb, 20%);
    }
  }
  &.sell-holder {
    margin-top: 0.5rem;
    & input:focus {
      border: 0.2rem solid lighten(#e84444, 20%);
    }
  }

  & p.conversion {
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    font-size: 1.1rem;
    // font-family: 'Ubuntu Mono';
    // font-weight: 700;
    text-align: left;

    &.buy {
      margin-bottom: 0.5rem;
    }

    & > span {
      &.subtle {
        color: #AAA;
      } &:not(.subtle) {
        color: #2a2a2a;
        &.invalid {
          color: #e84444;
        }
      }
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