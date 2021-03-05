<template>
  <div class="golder">
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
        {{ metamaskMessage }} BNB / {{ metamaskUsdMessage }} USD
      </span>
    </div>
  </div>
</template>

<script>
import Misc from './misc'


export default {
  name: 'DividendInfo',

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
      let normalDivs = 0;

      if (self.contract === null) {
        normalDivs = 0;
      } if (self.contract.normalDividends === null) {
        normalDivs = 0;
      } else {
        normalDivs = self.contract.normalDividends
      }

      if (normalDivs === 0) { return 0 }
      const roundedDivs = normalDivs.toFixed(4)
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

      if (normalDivs === 0) { return 0 }
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
      
      if (referralDivs === 0) { return 0 }
      const roundedDivs = referralDivs.toFixed(4)
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

      if (referralDivs === 0) { return 0 }
      const usdDivs = referralDivs * self.contract.bngPrice
      const roundedUsdDivs = usdDivs.toFixed(2)
      return roundedUsdDivs
    },
    metamaskMessage: function () {
      const self = this
      let balance = 0;

      if (self.contract === null) {
        return 0
      } else if (self.contract.walletBalance === null) {
        return 0
      } else {
        balance = self.contract.walletBalance
      }
      
      if (balance === 0) { return 0 }
      console.log('BALANCE', balance)
      const roundBalance = balance.toFixed(4)
      return roundBalance
    },
    metamaskUsdMessage: function () {
      const self = this
      let balance = 0;

      if (self.contract === null) {
        return 0
      } else if (self.contract.walletBalance === null) {
        return 0
      } else if (self.contract.bngPrice === null) {
        return 0
      } else {
        balance = self.contract.walletBalance
      }

      if (balance === 0) { return 0 }
      const usdBalanace = balance * self.contract.bngPrice
      const roundedUsdBalance = usdBalanace.toFixed(2)
      return roundedUsdBalance
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

p#contract-address {
  margin-bottom: 1rem;
}

.mono {
  font-family: 'Ubuntu Mono';
  font-weight: 700;
}
</style>