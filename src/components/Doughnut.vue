<template>
  <vc-donut 
    :sections="sections" :size="100" unit="%"
  >
    <p class="mono">{{balanceMessage}}</p>
    <p class="mono small">
      {{ethBalanceMessage}} | {{usdBalanceMessage}}
    </p>
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
        isDestroyed: false
      };
    },

    computed: {
      sections: function () {
        const self = this
        let enoughData = true
        
        if (self.contract === null) {
          enoughData = false
        } else if (self.contract.getEthBalance() === null) {
          enoughData = false
        } else if (self.contract.referralDividends === null) {
          enoughData = false
        } else if (self.contract.normalDividends === null) {
          enoughData = false
        }

        if (!enoughData) {
          return [
            { label: 'tokens', value: 0, color: '#417AEB' },
            { label: 'dividends', value: 0, color: '#417AEB' },
            { label: 'referrals', value: 0, color: '#95A0EF' },
          ]
        }

        const ethBalance = self.contract.getEthBalance()
        const dividends = self.contract.normalDividends
        const referrals = self.contract.referralDividends
        const total = ethBalance + dividends + referrals
        console.log('TOTAL', ethBalance, dividends, referrals)
        
        const percentDivs = 100 * dividends / total
        const percentRefs = 100 * referrals / total
        const percentToken = 100 - percentDivs - percentRefs
        console.log('PERCNETS', total, percentRefs, percentDivs, percentToken)

        return [
          { label: 'tokens', value: percentToken, color: '#417AEB' },
          { label: 'dividends', value: percentDivs, color: '#95B3EF' },
          { label: 'referrals', value: percentRefs, color: '#95A0EF' }
        ]
   
      },
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
      },
      usdBalanceMessage: function () {
        const self = this
        if (self.walletBalance === null) {
          return null
        } else if (self.contract.ethPrice === null) {
          return null
        }

        const multiplier = 100
        const usdBalance = self.contract.getUsdBalance()
        const roundedBalance = Math.floor(
          multiplier * usdBalance
        ) / multiplier

        return `$${roundedBalance} USD`
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

          await self.contract.update()
          await self.contract.loadWalletBalance()
           
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