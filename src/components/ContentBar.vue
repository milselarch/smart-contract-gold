<template>
  <div class="holder">
    <section>
      <DividendInfo 
        id="divs-holder" :contract="contract"
      >
      </DividendInfo>

      <div class="div-actions">
        <VueButton class="withdraw is-gold">Withdraw</VueButton>
        <VueButton class="reinvest is-dividend">Reinvest</VueButton>
      </div>
    </section>    

    <PriceInfo id="buy-sell-price" :contract="contract">
    </PriceInfo>

    <BuyAndSell id="buy-and-sell" :contract="contract">
    </BuyAndSell>

    <div class="bottom">
      <p>Contract Address:</p>
      <p class="mono" id="contract-address">
        0X167CB3F2446F829EB327344B66E271D1A7EFEC9A
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
        contractConnected: true,
        isDestroyed: false,
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
      DividendInfo, PriceInfo, BuyAndSell,
      VueButton
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
  margin-bottom: 0.5rem;
}

#buy-and-sell {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
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