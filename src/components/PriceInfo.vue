<template>
  <div>
    <div class="divs-info buy-price">
      <span class="header">Buy Price: </span>
      <span class="divs">
        {{ buyPrice }} BNB / {{ usdBuyPrice }} USD
      </span>
    </div>
    <div class="divs-info sell-price">
      <span class="header">Sell Price: </span>
      <span class="divs">
        {{ sellPrice }} BNB / {{ usdSellPrice }} USD
      </span>
    </div>
  </div>
</template>

<script>
import Misc from './misc'


export default {
  name: 'PriceInfo',

  data: function () {
    return {
      isDestroyed: false
    }
  },

  beforeDestroy () {
    this.isDestroyed = true
  },

  computed: {
    buyPrice: function () {
      const self = this
      let buyPrice = null

      if (self.contract === null) {
        return NaN
      } else if (self.contract.buyPrice === null) {
        return NaN
      }

      buyPrice = self.contract.buyPrice
      buyPrice = buyPrice.toFixed(5)
      return buyPrice
    },
    usdBuyPrice: function () {
      const self = this

      if (self.contract === null) {
        return NaN
      } else if (self.contract.buyPrice === null) {
        return NaN
      } else if (self.contract.bngPrice === null) {
        return NaN
      }

      const bngPrice = self.contract.bngPrice
      const buyPrice = self.contract.buyPrice
      const usdBuyPrice = buyPrice * bngPrice
      const roundedUsdBuyPrice = usdBuyPrice.toFixed(2)
      return roundedUsdBuyPrice
    },
    sellPrice: function () {
      const self = this
      let sellPrice = null

      if (self.contract === null) {
        return NaN
      } else if (self.contract.sellPrice === null) {
        return NaN
      }

      sellPrice = self.contract.sellPrice
      sellPrice = sellPrice.toFixed(5)
      return sellPrice
    },
    usdSellPrice: function () {
      const self = this

      if (self.contract === null) {
        return NaN
      } else if (self.contract.sellPrice === null) {
        return NaN
      } else if (self.contract.bngPrice === null) {
        return NaN
      }

      const bngPrice = self.contract.bngPrice
      const sellPrice = self.contract.sellPrice
      const usdBuyPrice = sellPrice * bngPrice
      const roundedUsdBuyPrice = usdBuyPrice.toFixed(2)
      return roundedUsdBuyPrice
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