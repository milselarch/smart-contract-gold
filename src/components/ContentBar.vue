<template>

  <div class="holder">
    <template>
      <section>
        <DividendInfo 
          id="divs-holder" :contract="contract"
        >
        </DividendInfo>

        <b-tabs type="is-boxed" :animated="false">
          <b-tab-item label="Buy Tokens">
            <b-field label="">
              <b-input
                type="number"
                placeholder="Ethereum Amount"
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
                placeholder="Ethereum Token Amount"
                step="0.01"
              ></b-input>
            </b-field>
          </b-tab-item>
        </b-tabs>
      </section>

    </template>

    <br/>
    <div class="bottom">
      <p>Contract Address:</p>
      <p class="mono" id="contract-address">
        0X167CB3F2446F829EB327344B66E271D1A7EFEC9A
      </p>

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
  </div>

</template>

<script>
  import Misc from './misc'
  import DividendInfo from './DividendInfo.vue'

  export default {
    name: 'ContentBar',
    data: function () {
      return {
        contractConnected: true,
        isDestroyed: false,
        loader: null
      }
    },

    beforeDestroy () {
      this.isDestroyed = true
    },

    computed: {
      divsMessage: function () {
        const self = this
        let normalDivs = 0;
        
        if (self.contract === null) {
          normalDivs = 0;
        } else if (self.contract.normalDividends === null) {
          normalDivs = 0;
        } else {
          normalDivs = self.contract.normalDividends
        }

        const roundedDivs = normalDivs.toFixed(3)
        return roundedDivs
      },
      divsUsdMessage: function () {
        const self = this
        let normalDivs = 0;

        if (self.contract === null) {
          normalDivs = 0;
        } else if (self.contract.normalDividends === null) {
          normalDivs = 0;
        } else if (self.contract.bngPrice === null) {
          normalDivs = 0;
        } else {
          normalDivs = self.contract.normalDividends
        }

        const usdDivs = normalDivs * self.contract.bngPrice
        const roundedUsdDivs = usdDivs.toFixed(2)
        // console.log('DIVES', normalDivs, usdDivs, roundedUsdDivs)
        return roundedUsdDivs
      },
      refsMessage: function () {
        const self = this
        let referralDivs = 0;

        if (self.contract === null) {
          referralDivs = 0;
        } else if (self.contract.referralDividends === null) {
          referralDivs = 0;
        } else {
          referralDivs = self.contract.referralDividends
        }

        const roundedDivs = referralDivs.toFixed(3)
        return roundedDivs
      },
      refsUsdMessage: function () {
        const self = this
        let referralDivs = 0;

        if (self.contract === null) {
          referralDivs = 0;
        } else if (self.contract.referralDividends === null) {
          referralDivs = 0;
        } else if (self.contract.bngPrice === null) {
          referralDivs = 0;
        } else {
          referralDivs = self.contract.referralDividends
        }

        const usdDivs = referralDivs * self.contract.bngPrice
        const roundedUsdDivs = usdDivs.toFixed(2)
        return roundedUsdDivs
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

    components: {
      DividendInfo
    },

    props: ['contract'],
  }
</script>

<style lang="scss" scoped>
p {
  text-align: left;
  font-size: 1.2rem;
}

* {
  font-size: 1.2rem;
}

p#contract-address {
  margin-bottom: 1rem;
  font-size: 1.2rem;
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

div.holder {
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin-top: auto;
  margin-bottom: auto;

  & div.bottom {
    margin-top: auto;
  }
}

.mono {
  font-family: 'Ubuntu Mono';
  font-weight: 700;
}
</style>