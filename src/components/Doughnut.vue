<script>
import { Doughnut } from "vue-chartjs";
export default {
  extends: Doughnut,
  props: ["data", "options"],
  options: {
    display: false,
    legend: {
      display: false
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.data, {
      borderWidth: "10px",
      hoverBackgroundColor: "red",
      hoverBorderWidth: "20px",
      cutoutPercentage: 80,
      legend: {
        display: false,
      },
    });
  }
};

</script>