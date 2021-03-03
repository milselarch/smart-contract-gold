<template>
  <div>
    <div id="top-bar">
      <p><span>Contract Balance:</span></p>

      <p id="contract-balance">
        <span class='bold'>
          {{balanceMessage}} / {{usdBalanceMessage}}
        </span>
      </p>
    </div>

    <Doughnut 
      :data="potato" :options="chartOptions"
      :contract="contract"
    ></Doughnut>

    <div id="top-bar">
      <p><span>Current Token Supply:</span></p>
      <p id="contract-balance">
        <span class='bold'>{{supplyMessage}}</span>
      </p>
    </div>
  </div>
</template>

<script>
  import Doughnut from './Doughnut.vue'
  import Misc from './misc'


  export default {
    name: 'SideBar',
    data () {
      return {
        balance: null,
        tokens: null,
        ethPrice: null,

        chartOptions: {
          hoverBorderWidth: 20,
          display: false,
          legend: {
            display: false,
            labels: {
              display: false
            }
          }
        },
        potato: {
          hoverBackgroundColor: "Green",
          hoverBorderWidth: 10,
          labels: ["Green", "Red"],
          datasets: [
            {
              label: "Data One",
              backgroundColor: ["#309AC6", "#417AEB"],
              data: [1, 10],
              legend: false,
            }
          ]
        }
      }
    },

    computed: {
      balanceMessage: function () {
        const self = this
        if (self.balance === null) {
          return 'loading...'
        }

        const roundedBalance = self.balance.toFixed(2) 
        const delimited = Misc.addCommas(roundedBalance)
        return `${delimited} ETH`
      },
      usdBalanceMessage: function () {
        const self = this
        if (self.balance === null) {
          return 'loading...'
        } else if (self.ethPrice === null) {
          return 'loading...'
        }

        const usdBalance = self.balance * self.contract.ethPrice
        const roundedBalance = usdBalance.toFixed(2)
        const delimited = Misc.addCommas(roundedBalance)
        return `$${delimited} USD`
      },
      supplyMessage: function () {
        const self = this
        if (self.tokens === null) {
          return 'loading...'
        } else {
          const roundedTokens = self.tokens.toFixed(2)
          const delimited = Misc.addCommas(roundedTokens)
          return `${delimited} IND`
        }
      }
    },

    methods: {
    },

    beforeDestroy () {
      this.isDestroyed = true
    },

    props: ['contract'],

    mounted () {
      const self = this
      console.log('MOUNTED');
      // this.fillData()
      
      (async () => {
        while (!self.isDestroyed) {
          if (self.contract !== null) {
            if (self.contract.balance !== null) {
              self.balance = self.contract.balance
            } if (self.contract.tokens !== null) {
              self.tokens = self.contract.tokens
            } if (self.contract.ethPrice !== null) {
              self.ethPrice = self.contract.ethPrice
            }

            // console.log('BALANCE', self.contract, self.balance)
          }

          await Misc.sleepAsync(2500)
        }
      })();
    },

  components: {
      Doughnut
    }
  }
</script>

<style lang="scss" scoped>
div#top-bar {
  width: 30rem;
  margin-left: auto;
  margin-right: auto;

  & p {
    font-family: 'Ubuntu Mono';
    // font-weight: 700;
    font-size: 1.2rem;
    display: flex;
    justify-content: space-around;

    & span.bold {
      font-weight: 700;
      font-family: 'Ubuntu Mono';
    }
  }
  
  margin-bottom: 2rem;
  margin-top: 2rem;
}
</style>