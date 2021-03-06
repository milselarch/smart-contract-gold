<template>
  <div class="holder">
    <section>
      <DividendInfo 
        id="divs-holder" :contract="contract"
      >
      </DividendInfo>

      <div class="div-actions">
        <VueButton 
          class="withdraw is-gold small"
          v-bind:class="{disabled: !connected}"
          @click="withdraw()"
        >
          Withdraw
        </VueButton>
        <VueButton
          class="reinvest is-dividend small"
          v-bind:class="{disabled: !connected}"
          @click="reinvest()"
        >
          Reinvest
        </VueButton>
      </div>
    </section>    

    <PriceInfo id="buy-sell-price" :contract="contract">
    </PriceInfo>

    <BuyAndSell id="buy-and-sell" :contract="contract">
    </BuyAndSell>

    <div class="bottom">
      <p>Contract Address:</p>
      <p class="mono" id="contract-address">
        0X66CB2D528A3380BD919245D8812B45B03D421CE5
      </p>
      <p v-show="hasUserAddress">
        Your Referral Link:
      </p>
      <p 
        class="mono" id="contract-address"
        v-show="hasUserAddress"
      >
        <a href="javascript:void(0)" @click="copyReferral">
          {{ userReferralLink }}
        </a>
      </p>
    </div>
  </div>

</template>

<script>
  import Misc from './misc'
  import DividendInfo from './DividendInfo.vue'
  import PriceInfo from './PriceInfo.vue'
  import BuyAndSell from './BuyAndSell.vue'
  import VueButton from './VueButton.vue'

  export default {
    name: 'ContentBar',
    data: function () {
      return {
        isDestroyed: false,
      }
    },

    beforeDestroy () {
      this.isDestroyed = true
    },

    computed: {
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

      hasUserAddress: function () {
        const self = this
        if (self.contract === null) {
          return false
        }

        const address = self.contract.getCurrentAddress()
        return address !== null
      },

      userReferralLink: function () {
        const self = this
        let address

        if (self.contract === null) {
          address = null
        } else {
          address = self.contract.getCurrentAddress()
        }

        let href = window.location.href
        href = href.replace('#', '')
        const baseurl = href.split('?')[0]

        if (address === null) {
          return
        } else {
          return `${baseurl}?ref=${address}`
        }
      }
    },

    methods: {
      copyReferral () {
        const self = this
        const link = self.userReferralLink
        Misc.copyToClipboard(link)

        self.$buefy.notification.open({
          duration: 1000,
          message: 'Referral link copied!',
          position: 'is-bottom',
          type: 'is-info'
        })
      },
      async withdraw () {
        const self = this
        if (!self.connected) {
          return
        }
        try {
          await self.contract.withdraw()
          self.$buefy.notification.open({
            duration: 5000,
            message: `BNB dividends witthdrawn`,
            position: 'is-bottom',
            type: 'is-success',
            hasIcon: false
          })
        } catch (error) {
          self.$buefy.notification.open({
            duration: 5000,
            message: error.message,
            position: 'is-bottom',
            type: 'is-danger',
            hasIcon: false
          })
        }
      },
      async reinvest () {
        const self = this
        if (!self.connected) {
          return
        }
        try {
          await self.contract.reinvest()
          self.$buefy.notification.open({
            duration: 5000,
            message: `Reinvested BNB dividends`,
            position: 'is-bottom',
            type: 'is-success',
            hasIcon: false
          })
        } catch (error) {
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

    mounted: function () {
      const self = this;
      
      (async () => {
        while (!self.isDestroyed) {
          await Misc.sleepAsync(200)
        }
      })()
    },

    components: {
      DividendInfo, PriceInfo, BuyAndSell,
      VueButton
    },

    props: {
      contract: {
        type: Object,
        default: null
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

p {
  text-align: left;
  font-size: 1.2rem;
}

* {
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
    & * {
      font-size: 1.1rem;
    }
    & p#contract-address {
      font-size: 1rem;
      word-break: break-all;
    }
    & a {
      font-family: 'Ubuntu Mono';
      color: $primary-color-semidark;
      font-weight: 700;
      font-size: 1rem;

      &:active {
        color: $primary-color-dark;
      }
    }
  }

  & div.div-actions {
    display: flex;
    margin-right: auto;
    margin-top: 0.8rem;

    & .reinvest {
      margin-left: 0.8rem;
    }
  }
}

#buy-sell-price {
  margin-top: 2rem;
  // margin-bottom: 0.5rem;
}

#buy-and-sell {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.divs-info {
  display: flex;

  & > .header {
    width: 7rem;
    text-align: left;
  }
  & > .divs {
    font-family: 'Ubuntu Mono';
    font-weight: 700;
  }
}

.mono {
  font-family: 'Ubuntu Mono';
  font-weight: 700;
}
</style>