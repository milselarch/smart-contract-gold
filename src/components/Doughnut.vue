<template>
  <vc-donut 
    :sections="sections" :size="100" unit="%"
  >
    <p class="mono">{{balanceMessage}}</p>
    <p class="mono small">{{ethBalanceMessage}}</p>
  </vc-donut>
</template>
<script>
  /* eslint-disable no-empty */
  import Misc from './misc'

  export default {
    data () {
      return {
        walletBalance: null,
        ethBalance: null,
        isDestroyed: false,
        sections: [{ value: 25 }, { value: 25 }]
      };
    },

    computed: {
      balanceMessage: function () {
        const self = this
        if (self.walletBalance === null) {
          return 'loading...'
        } else {
          const multiplier = 100
          const roundedBalance = Math.floor(
            multiplier * self.walletBalance
          ) / multiplier
          
          return `${roundedBalance} IND`
        }
      },
      ethBalanceMessage: function () {
        const self = this
        if (self.walletBalance === null) {
          return null
        }

        const multiplier = 100
        const roundedBalance = Math.floor(
          multiplier * self.ethBalance
        ) / multiplier

        return `${roundedBalance} ETH`
      }
    },

    beforeDestroy () {
      this.isDestroyed = true
    },
    
    methods: {
    },

    mounted: function () {
      const self = this;
      let k = 0;

      (async () => {
        while (!self.isDestroyed) {
          console.log('TURN', k)
          k += 1

          if (self.contract === null) {
            console.log('CON ISDES', self.isDestroyed)
            await Misc.sleepAsync(250)
            continue 
          } else if (self.contract.web3 === undefined) {
            console.log('WEB3 ISDES', self.isDestroyed)
            await Misc.sleepAsync(250)
            continue
          }

          await self.contract.loadIfNeeded()          
          self.walletBalance = await self.contract.getWalletBalance()
          self.ethBalance = await self.contract.getEthBalance()
          console.log('WTG BALLNCE', self.ethBalance)

          // console.log('ETH PRICE', ethPrice)
          const buyPrice = await self.contract.getBuyPrice()
          console.log('BUY PRICE', buyPrice)
          await Misc.sleepAsync(2500)
          // console.log('ISDES', self.isDestroyed)
        }
      })()
    },
    props: {
      contract: {
        type: Object,
        default: null
      }
    }
  };
</script>

<style lang="scss" scoped>
p.mono {
  font-family: 'Ubuntu Mono';
  font-weight: 700;

  &.small {
    font-size: 1.3rem;
  }
}

</style>