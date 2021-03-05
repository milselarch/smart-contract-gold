<template>
  <vc-donut 
    :sections="sections" :size="100" unit="%"
  >
    <p class="mono">{{balanceMessage}}</p>
    <p 
      class="mono small"
      v-show="
        (ethBalanceMessage !== undefined) &&
        (usdBalanceMessage !== undefined)
      "
    >
      {{ethBalanceMessage}} / {{usdBalanceMessage}}
    </p>
  </vc-donut>
</template>

<script>
  /* eslint-disable no-empty */
  import Misc from './misc'

  export default {
    data () {
      return {
        tokenBalance: null,
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
        } else if (self.contract.getBngBalance() === null) {
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

        const ethBalance = self.contract.getBngBalance()
        const dividends = self.contract.normalDividends
        const referrals = self.contract.referralDividends
        const total = ethBalance + dividends + referrals
        console.log('TOTAL', ethBalance, dividends, referrals)
        
        const percentDivs = 100 * dividends / total
        const percentRefs = 100 * referrals / total
        const percentToken = 100 - percentDivs - percentRefs
        console.log('PERCNETS', total, percentRefs, percentDivs, percentToken)

        return [
          { label: 'tokens', value: percentToken, color: '#fbad2e' },
          { label: 'dividends', value: percentDivs, color: '#c98c3e' },
          { label: 'referrals', value: percentRefs, color: '#966b4e' }
        ]
   
      },
      balanceMessage: function () {
        const self = this
        if (self.contract === null) {
          return 'loading...'
        } if (self.contract.tokenBalance === null) {
          return 'loading...'
        } else {
          const multiplier = 100
          const roundedBalance = Math.floor(
            multiplier * self.tokenBalance
          ) / multiplier
          
          return `${roundedBalance} BNG`
        }
      },
      ethBalanceMessage: function () {
        const self = this
        if (self.ethBalance === null) {
          return
        }

        const roundedBalance = self.ethBalance.toFixed(2)
        const delimited = Misc.addCommas(roundedBalance)
        return `${delimited} ETH`
      },
      usdBalanceMessage: function () {
        const self = this
        if (self.contract.tokenBalance === null) {
          return
        } else if (self.contract.bngPrice === null) {
          return
        }

        const usdBalance = self.contract.getUsdBalance()
        const roundedBalance = usdBalance.toFixed(2)
        const delimited = Misc.addCommas(roundedBalance)
        return `${delimited} USD`
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
          
          try {
            await self.contract.update()
            await self.contract.loadTokenBalance()

            self.tokenBalance = await self.contract.getTokenBalance()
            self.ethBalance = await self.contract.getBngBalance()
          } catch (e) {
            console.error(e)
          }

          console.log('WTG BALLNCE', self.ethBalance)

          try {
            const buyPrice = await self.contract.getBuyPrice()
            console.log('BUY PRICE', buyPrice)
          } catch (e) {
            console.error(e)
          }
          
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
    // font-weight: 500;
  }
}

</style>