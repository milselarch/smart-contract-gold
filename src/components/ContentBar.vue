<template>

  <div class="holder">
    <template>
      <section>
        <div class="divs-info referral-divs">
          <span class="header">Referrals: </span>
          <span class="divs">
            {{ refsMessage }} BNB / {{ refsUsdMessage }} USD
          </span>
        </div>

        <div class="divs-info normal-divs">
          <span class="header">Dividends: </span>
          <span class="divs">
            {{ divsMessage }} BNB / {{ divsUsdMessage }} USD
          </span>
        </div>

        <div class="divs-info metamask">
          <span class="header">Metamask: </span>
          <span class="divs">
            {{ divsMessage }} BNB / {{ divsUsdMessage }} USD
          </span>
        </div>

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

      <!--
      <b-field grouped group-multiline>
        <p class="control">
          <b-button label="Buy Tokens" />
        </p>
        <p class="control">
          <b-button label="Sell Tokens" />
        </p>
      </b-field>
      -->

    </template>

    <br/>
    <div class="bottom">
      <p>Contract Address:</p>
      <p class="mono">
        0X167CB3F2446F829EB327344B66E271D1A7EFEC9A
      </p>
    </div>
  </div>

</template>

<script>
  import Misc from './misc'

  export default {
    name: 'ContentBar',
    data: function () {
      return {
        isDestroyed: false
      }
    },
    beforeDestroy () {
      this.isDestroyed = true
    },
    computed: {
      divsMessage: function () {
        const self = this
        if (self.contract === null) {
          return 'loading...'
        } if (self.contract.normalDividends === null) {
          return 'loading...'
        }

        const normalDivs = self.contract.normalDividends
        const roundedDivs = normalDivs.toFixed(4)
        return roundedDivs
      },
      divsUsdMessage: function () {
        const self = this
        if (self.contract === null) {
          return 'loading...'
        } if (self.contract.normalDividends === null) {
          return 'loading...'
        } if (self.contract.bngPrice === null) {
          return 'loading...'
        }

        const normalDivs = self.contract.normalDividends
        const usdDivs = normalDivs * self.contract.bngPrice
        const roundedUsdDivs = usdDivs.toFixed(2)
        // console.log('DIVES', normalDivs, usdDivs, roundedUsdDivs)
        return roundedUsdDivs
      },
      refsMessage: function () {
        const self = this
        if (self.contract === null) {
          return 'loading...'
        } if (self.contract.referralDividends === null) {
          return 'loading...'
        }

        const referralDivs = self.contract.referralDividends
        const roundedDivs = referralDivs.toFixed(4)
        return roundedDivs
      },
      refsUsdMessage: function () {
        const self = this
        if (self.contract === null) {
          return 'loading...'
        } if (self.contract.referralDividends === null) {
          return 'loading...'
        } if (self.contract.bngPrice === null) {
          return 'loading...'
        }

        const referralDivs = self.contract.referralDividends
        const usdDivs = referralDivs * self.contract.bngPrice
        const roundedUsdDivs = usdDivs.toFixed(2)
        return roundedUsdDivs
      }
    },

    mounted: function () {
      const self = this;
      
      (async () => {
        while (!self.isDestroyed) {
          await Misc.sleepAsync(1000)
        }
      })()
    },

    props: ['contract'],
  }
</script>

<style lang="scss" scoped>
p {
  text-align: left;
  font-size: 1;
}

* {
  font-size: 1.2rem;
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

.divs-info {
  display: flex;

  &.metamask {
    margin-bottom: 2rem;
  }
  &.referral-divs {
    margin-top: 1rem;
  }

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