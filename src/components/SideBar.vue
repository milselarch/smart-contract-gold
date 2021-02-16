<template>
  <div>
    <Doughnut 
      :data="potato" :options="chartOptions"
      :contract="contract"
    ></Doughnut>
  </div>
</template>

<script>
import Doughnut from './Doughnut.vue'

export default {
  name: 'SideBar',
  data () {
    return {
      balance: null,
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

  methods: {
  },

  props: ['contract'],

  mounted () {
    console.log('MOUNTED')
    // this.fillData()
  },
  components: {
    Doughnut
  }
}
</script>

<style lang="scss" scoped>
</style>