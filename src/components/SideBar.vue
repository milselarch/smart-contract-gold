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
      <p id="bnb-price">
        <span class='bold'>{{priceMessage}}</span>
      </p>
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
        bngPrice: null,

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
      priceMessage: function () {
        const self = this
        if (self.bngPrice === null) {
          return `BNB: NaN USD`
        }

        const roundedPrice = self.bngPrice.toFixed(2)
        return `BNB: ${roundedPrice} USD`
      },
      balanceMessage: function () {
        const self = this
        if (self.balance === null) {
          return 'loading...'
        }

        const roundedBalance = self.balance.toFixed(2) 
        const delimited = Misc.addCommas(roundedBalance)
        return `${delimited} BNG`
      },
      usdBalanceMessage: function () {
        const self = this
        if (self.balance === null) {
          return 'loading...'
        } else if (self.bngPrice === null) {
          return 'loading...'
        }

        const usdBalance = self.balance * self.contract.bngPrice
        const roundedBalance = usdBalance.toFixed(2)
        const delimited = Misc.addCommas(roundedBalance)
        return `${delimited} USD`
      },
      supplyMessage: function () {
        const self = this
        if (self.tokens === null) {
          return 'loading...'
        } else {
          const roundedTokens = self.tokens.toFixed(2)
          const delimited = Misc.addCommas(roundedTokens)
          return `${delimited} BNG`
        }
      }
    },

    methods: {
    },

    beforeDestroy () {
      this.isDestroyed = true
    },

    props: {
      contract: {
        type: Object,
        default: null
      }
    },

    mounted () {
      const self = this;
      //console.log('MOUNTED');
      // this.fillData()
      
      (async () => {
        while (!self.isDestroyed) {
          if (self.contract !== null) {
            if (self.contract.contractBalance !== null) {
              self.balance = self.contract.contractBalance
            } if (self.contract.contractTokens !== null) {
              self.tokens = self.contract.contractTokens
            } if (self.contract.bngPrice !== null) {
              self.bngPrice = self.contract.bngPrice
            }
          }

          await Misc.sleepAsync(200)
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

    &#bnb-price {
      margin-bottom: 0.5rem;
    }

    & span.bold {
      font-weight: 700;
      font-family: 'Ubuntu Mono';
    }
  }
  
  margin-bottom: 2rem;
  margin-top: 2rem;
}
</style>