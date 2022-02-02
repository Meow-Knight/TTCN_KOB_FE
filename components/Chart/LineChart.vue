

<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['data'],
  data() {
    return {
      options: {
        responsive: true,
        fill: false,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Monthly Income',
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    }
  },
  mounted() {
    this.renderChart(this.data, this.options)
  },
}
</script>

<style>
</style>