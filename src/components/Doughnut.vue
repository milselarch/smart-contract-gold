<template>
  <vc-donut 
    :sections="sections" :size="100" unit="%"
  >
    <p class="mono">{{balanceMessage}}</p>
  </vc-donut>
</template>
<script>
  /* eslint-disable no-empty */
  import Misc from './misc'

  export default {
    data () {
      return {
        walletBalance: null,
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
          const roundedBalance = Math.floor(
            100 * self.walletBalance
          ) / 100
          
          return `${roundedBalance} IND`
        }
      }
    },

    mounted: function () {
      const self = this;
      let k = 0;

      (async () => {
        while (!self.isDestroyed) {
          console.log('TURN', k)
          k += 1

          if (self.contract === null) {
            await Misc.sleepAsync(250)
            continue 
          } else if (self.contract.web3 === undefined) {
            await Misc.sleepAsync(250)
            continue
          }
          
          self.walletBalance = await self.contract.getWalletBalance()
          // console.log('UPDATE WALLET VALANCE')
          const ethPrice = await self.contract.fetchEthPrice()
          console.log('ETH PRICE', ethPrice)
          await Misc.sleepAsync(2500)
        }
      })()
    },
    props: ['contract'],
  };
</script>

<style lang="scss" scoped>
p.mono {
  font-family: 'Ubuntu Mono';
  font-weight: 700;
}
</style>